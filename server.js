require('dotenv').config();
const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: '*', // Permitir cualquier origen durante el desarrollo
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Content-Length', 'X-Requested-With'],
  credentials: true,
  preflightContinue: false,
  optionsSuccessStatus: 204
}));
app.use(express.json());

// Logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.originalUrl}`);
  next();
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Algo salió mal!' });
});

// Database connection
const dbConfig = {
  host: process.env.DB_HOST || 'localhost', 
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'mudb',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  connectTimeout: 10000 // Añadir tiempo de espera de conexión
};

const pool = mysql.createPool(dbConfig);

// JWT Secret (in production, use environment variable)
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Authentication middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) return res.sendStatus(401);

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// Helper function to execute SQL queries
const query = async (sql, params = []) => {
  try {
    console.log('Ejecutando consulta SQL:', sql);
    console.log('Parámetros:', params);
    
    const [rows, fields] = await pool.execute(sql, params);
    console.log('Resultado de la consulta:', { rows, fields: fields?.map(f => f.name) });
    
    // Para consultas SELECT, devolver las filas
    if (sql.trim().toUpperCase().startsWith('SELECT')) {
      return rows || [];
    }
    
    // Para INSERT, UPDATE, DELETE, devolver el resultado completo
    return { rows, fields };
    
  } catch (error) {
    console.error('Error en la consulta SQL:', error);
    console.error('Consulta SQL:', sql);
    console.error('Parámetros:', params);
    if (error.sqlMessage) {
      console.error('Mensaje de error SQL:', error.sqlMessage);
    }
    throw error;
  }
};

// Verificar conexión a la base de datos
async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log('Conexión a la base de datos exitosa');
    connection.release();
    
    // Verificar si la tabla users existe
    try {
      const [tables] = await pool.query('SHOW TABLES LIKE "users"');
      if (tables.length === 0) {
        console.error('ERROR: La tabla "users" no existe en la base de datos.');
        console.log('Por favor, ejecuta el archivo schema.sql para crear las tablas necesarias.');
      } else {
        console.log('Tabla "users" encontrada en la base de datos');
      }
    } catch (tableError) {
      console.error('Error al verificar las tablas:', tableError);
    }
    
  } catch (error) {
    console.error('Error al conectar a la base de datos:', error);
    console.error('Asegúrate de que:');
    console.error('1. MySQL esté en ejecución');
    console.error('2. Las credenciales en .env sean correctas');
    console.error('3. La base de datos "mudb" exista');
    process.exit(1);
  }
}

// Probar la conexión al iniciar el servidor
testConnection();

// Routes
// User registration
// Ruta de registro con mejor manejo de errores
app.post('/api/register', [
  body('username').trim().isLength({ min: 3 }).withMessage('El nombre de usuario debe tener al menos 3 caracteres'),
  body('email').trim().isEmail().withMessage('Ingresa un correo electrónico válido'),
  body('password').isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres')
], async (req, res) => {
  console.log('Solicitud de registro recibida:', req.body);
  
  try {
    // Validar campos
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('Errores de validación:', errors.array());
      return res.status(400).json({ 
        success: false,
        message: 'Error de validación',
        errors: errors.array() 
      });
    }

    const { username, email, password } = req.body;
    
    console.log('Verificando si el usuario ya existe...');
    // Verificar si el usuario ya existe
    let existingUser;
    try {
      existingUser = await query('SELECT user_id FROM users WHERE email = ? OR username = ?', [email, username]);
      console.log('Resultado de búsqueda de usuario existente:', existingUser);
    } catch (dbError) {
      console.error('Error al buscar usuario existente:', dbError);
      return res.status(500).json({
        success: false,
        message: 'Error al verificar usuario existente',
        error: process.env.NODE_ENV === 'development' ? dbError.message : undefined
      });
    }
    
    if (existingUser && existingUser.length > 0) {
      console.log('Usuario ya existe:', existingUser);
      return res.status(400).json({
        success: false,
        message: 'El correo electrónico o nombre de usuario ya está en uso'
      });
    }

    console.log('Creando hash de contraseña...');
    // Crear el usuario
    let hashedPassword;
    try {
      hashedPassword = await bcrypt.hash(password, 10);
    } catch (hashError) {
      console.error('Error al hashear la contraseña:', hashError);
      return res.status(500).json({
        success: false,
        message: 'Error al procesar la contraseña',
        error: process.env.NODE_ENV === 'development' ? hashError.message : undefined
      });
    }
    
    console.log('Insertando nuevo usuario...');
    try {
      const result = await query(
        'INSERT INTO users (username, email, password_hash, is_verified, is_active) VALUES (?, ?, ?, TRUE, TRUE)',
        [username, email, hashedPassword]
      );
      
      // Obtener el ID del usuario insertado
      const [userResult] = await query('SELECT LAST_INSERT_ID() as insertId');
      const insertId = userResult[0]?.insertId;
      
      if (!insertId) {
        throw new Error('No se pudo obtener el ID del usuario insertado');
      }
      
      console.log('Usuario insertado con ID:', insertId);
      
      // Generar token JWT
      console.log('Generando token JWT...');
      const token = jwt.sign(
        { id: insertId, username, isAdmin: false },
        JWT_SECRET,
        { expiresIn: '24h' }
      );
      
      console.log('Usuario registrado exitosamente con ID:', insertId);
      return res.status(201).json({ 
        success: true,
        message: 'Usuario registrado exitosamente',
        token,
        user: {
          id: insertId,
          username,
          email,
          isAdmin: false
        }
      });
      
    } catch (error) {
      console.error('Error al insertar usuario:', error);
      return res.status(500).json({
        success: false,
        message: 'Error al crear el usuario en la base de datos',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined,
        sqlError: error.sqlMessage ? error.sqlMessage : undefined
      });
    }
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error al registrar el usuario',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
      sqlError: error.sqlMessage ? error.sqlMessage : undefined
    });
  }
});

// User login
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const [users] = await pool.execute('SELECT * FROM users WHERE email = ?', [email]);
    
    if (users.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const user = users[0];
    const validPassword = await bcrypt.compare(password, user.password_hash);
    
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const token = jwt.sign(
      { id: user.user_id, username: user.username, isAdmin: user.is_admin },
      JWT_SECRET,
      { expiresIn: '24h' }
    );
    
    res.json({ token, username: user.username, isAdmin: user.is_admin });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Error during login' });
  }
});

// Get all artists
app.get('/api/artists', async (req, res) => {
  try {
    const artists = await query('SELECT * FROM artists ORDER BY name');
    res.json(artists);
  } catch (error) {
    console.error('Error fetching artists:', error);
    res.status(500).json({ error: 'Error fetching artists' });
  }
});

// Get artist by ID
app.get('/api/artists/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const [artist] = await query('SELECT * FROM artists WHERE artist_id = ?', [id]);
    
    if (!artist) {
      return res.status(404).json({ error: 'Artist not found' });
    }
    
    // Get artist's albums
    const albums = await query('SELECT * FROM albums WHERE artist_id = ?', [id]);
    res.json({ ...artist, albums });
  } catch (error) {
    console.error('Error fetching artist:', error);
    res.status(500).json({ error: 'Error fetching artist' });
  }
});

// Create new artist (protected route)
app.post('/api/artists', authenticateToken, async (req, res) => {
  try {
    const { name, country, formed_year, biography } = req.body;
    
    const result = await query(
      'INSERT INTO artists (name, country, formed_year, biography) VALUES (?, ?, ?, ?)',
      [name, country, formed_year, biography]
    );
    
    res.status(201).json({ id: result.insertId, message: 'Artist created successfully' });
  } catch (error) {
    console.error('Error creating artist:', error);
    res.status(500).json({ error: 'Error creating artist' });
  }
});

// Get all albums
app.get('/api/albums', async (req, res) => {
  try {
    const albums = await query(`
      SELECT a.*, ar.name as artist_name 
      FROM albums a
      JOIN artists ar ON a.artist_id = ar.artist_id
      ORDER BY a.release_date DESC
    `);
    // Asegurarse de que siempre devolvemos un array
    res.json(Array.isArray(albums) ? albums : []);
  } catch (error) {
    console.error('Error fetching albums:', error);
    res.status(500).json({ error: 'Error fetching albums', details: error.message });
  }
});

// Get album by ID
app.get('/api/albums/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const albums = await query(
      `SELECT a.*, ar.name as artist_name 
       FROM albums a
       JOIN artists ar ON a.artist_id = ar.artist_id 
       WHERE a.album_id = ?`, 
      [id]
    );
    
    if (!albums || albums.length === 0) {
      return res.status(404).json({ error: 'Album not found' });
    }
    
    res.json(albums[0]);
  } catch (error) {
    console.error('Error fetching album:', error);
    res.status(500).json({ error: 'Error fetching album', details: error.message });
  }
});

// Get songs from an album
app.get('/api/albums/:id/songs', async (req, res) => {
  try {
    const { id } = req.params;
    const songs = await query(
      'SELECT * FROM songs WHERE album_id = ? ORDER BY track_number',
      [id]
    );
    res.json(Array.isArray(songs) ? songs : []);
  } catch (error) {
    console.error('Error fetching album songs:', error);
    res.status(500).json({ error: 'Error fetching songs', details: error.message });
  }
});

// Get albums from an artist
app.get('/api/artists/:id/albums', async (req, res) => {
  try {
    const { id } = req.params;
    const albums = await query(
      'SELECT * FROM albums WHERE artist_id = ? ORDER BY release_date DESC',
      [id]
    );
    res.json(Array.isArray(albums) ? albums : []);
  } catch (error) {
    console.error('Error fetching artist albums:', error);
    res.status(500).json({ error: 'Error fetching albums', details: error.message });
  }
});

// Search endpoint
app.get('/api/search', async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) {
      return res.status(400).json({ error: 'Search query is required' });
    }
    
    const searchTerm = `%${q}%`;
    
    const [artists] = await pool.execute(
      'SELECT * FROM artists WHERE name LIKE ?', 
      [searchTerm]
    );
    
    const [albums] = await pool.execute(
      `SELECT a.*, ar.name as artist_name 
       FROM albums a
       JOIN artists ar ON a.artist_id = ar.artist_id
       WHERE a.title LIKE ? OR ar.name LIKE ?`,
      [searchTerm, searchTerm]
    );
    
    const [songs] = await pool.execute(
      `SELECT s.*, a.title as album_title, ar.name as artist_name 
       FROM songs s
       JOIN albums a ON s.album_id = a.album_id
       JOIN artists ar ON a.artist_id = ar.artist_id
       WHERE s.title LIKE ? OR ar.name LIKE ?`,
      [searchTerm, searchTerm]
    );
    
    res.json({ artists, albums, songs });
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ error: 'Error performing search' });
  }
});

// Get statistics
app.get('/api/statistics', async (req, res) => {
  try {
    // Obtener conteos usando la función query helper
    const artistsResult = await query('SELECT COUNT(*) as totalArtists FROM artists');
    const albumsResult = await query('SELECT COUNT(*) as totalAlbums FROM albums');
    const songsResult = await query('SELECT COUNT(*) as totalSongs FROM songs');
    const usersResult = await query('SELECT COUNT(*) as totalUsers FROM users');
    const playlistsResult = await query('SELECT COUNT(*) as totalPlaylists FROM playlists');

    const totalArtists = artistsResult[0]?.totalArtists || 0;
    const totalAlbums = albumsResult[0]?.totalAlbums || 0;
    const totalSongs = songsResult[0]?.totalSongs || 0;
    const totalUsers = usersResult[0]?.totalUsers || 0;
    const totalPlaylists = playlistsResult[0]?.totalPlaylists || 0;

    // Obtener artistas populares (top 4 con más canciones)
    const popularArtists = await query(`
      SELECT a.artist_id, a.name, a.profile_image, 
             COUNT(s.song_id) as song_count
      FROM artists a
      LEFT JOIN songs s ON a.artist_id = s.artist_id
      GROUP BY a.artist_id, a.name, a.profile_image
      ORDER BY song_count DESC
      LIMIT 4
    `);

    // Obtener álbumes recientes (últimos 4)
    const recentAlbums = await query(`
      SELECT a.*, ar.name as artist_name 
      FROM albums a
      JOIN artists ar ON a.artist_id = ar.artist_id
      ORDER BY a.release_date DESC
      LIMIT 4
    `);

    res.json({
      totalArtists: Number(totalArtists),
      totalAlbums: Number(totalAlbums),
      totalSongs: Number(totalSongs),
      totalUsers: Number(totalUsers),
      totalPlaylists: Number(totalPlaylists),
      popularArtists: popularArtists || [],
      recentAlbums: recentAlbums || []
    });
  } catch (error) {
    console.error('Error fetching statistics:', error);
    res.status(500).json({ 
      error: 'Error fetching statistics',
      details: error.message
    });
  }
});

// Import analytics routes
const analyticsRoutes = require('./routes/analytics');

// Use analytics routes
app.use('/api/analytics', analyticsRoutes);

// ============================================
// RUTAS PARA LIKES Y PLAYLISTS
// ============================================

// Get user's liked songs
app.get('/api/users/:userId/likes', authenticateToken, async (req, res) => {
  try {
    const { userId } = req.params;
    const likes = await query(
      `SELECT ul.*, s.title, s.duration, a.title as album_title, ar.name as artist_name
       FROM user_likes ul
       JOIN songs s ON ul.song_id = s.song_id
       JOIN albums a ON s.album_id = a.album_id
       JOIN artists ar ON a.artist_id = ar.artist_id
       WHERE ul.user_id = ?
       ORDER BY ul.created_at DESC`,
      [userId]
    );
    res.json(Array.isArray(likes) ? likes : []);
  } catch (error) {
    console.error('Error fetching likes:', error);
    res.status(500).json({ error: 'Error fetching likes' });
  }
});

// Add like to a song
app.post('/api/songs/:songId/like', authenticateToken, async (req, res) => {
  try {
    const { songId } = req.params;
    const userId = req.user.id;
    
    // Check if already liked
    const existing = await query(
      'SELECT * FROM user_likes WHERE user_id = ? AND song_id = ?',
      [userId, songId]
    );
    
    if (existing && existing.length > 0) {
      return res.status(400).json({ error: 'Song already liked' });
    }
    
    await query(
      'INSERT INTO user_likes (user_id, song_id) VALUES (?, ?)',
      [userId, songId]
    );
    
    res.json({ success: true, message: 'Song liked successfully' });
  } catch (error) {
    console.error('Error liking song:', error);
    res.status(500).json({ error: 'Error liking song' });
  }
});

// Remove like from a song
app.delete('/api/songs/:songId/like', authenticateToken, async (req, res) => {
  try {
    const { songId } = req.params;
    const userId = req.user.id;
    
    await query(
      'DELETE FROM user_likes WHERE user_id = ? AND song_id = ?',
      [userId, songId]
    );
    
    res.json({ success: true, message: 'Like removed successfully' });
  } catch (error) {
    console.error('Error removing like:', error);
    res.status(500).json({ error: 'Error removing like' });
  }
});

// Get all playlists
app.get('/api/playlists', async (req, res) => {
  try {
    const playlists = await query(
      `SELECT p.*, u.username 
       FROM playlists p
       JOIN users u ON p.user_id = u.user_id
       WHERE p.is_public = TRUE
       ORDER BY p.created_at DESC`
    );
    res.json(Array.isArray(playlists) ? playlists : []);
  } catch (error) {
    console.error('Error fetching playlists:', error);
    res.status(500).json({ error: 'Error fetching playlists' });
  }
});

// Get user's playlists
app.get('/api/users/:userId/playlists', authenticateToken, async (req, res) => {
  try {
    const { userId } = req.params;
    const playlists = await query(
      `SELECT p.*, COUNT(ps.song_id) as song_count
       FROM playlists p
       LEFT JOIN playlist_songs ps ON p.playlist_id = ps.playlist_id
       WHERE p.user_id = ?
       GROUP BY p.playlist_id
       ORDER BY p.created_at DESC`,
      [userId]
    );
    res.json(Array.isArray(playlists) ? playlists : []);
  } catch (error) {
    console.error('Error fetching user playlists:', error);
    res.status(500).json({ error: 'Error fetching playlists' });
  }
});

// Create playlist
app.post('/api/playlists', authenticateToken, async (req, res) => {
  try {
    const { name, description, is_public } = req.body;
    const userId = req.user.id;
    
    const result = await query(
      'INSERT INTO playlists (user_id, name, description, is_public) VALUES (?, ?, ?, ?)',
      [userId, name, description || null, is_public !== false]
    );
    
    // Get the inserted playlist ID
    const playlistId = result.insertId || result.rows?.insertId;
    
    res.json({ 
      success: true, 
      message: 'Playlist created successfully',
      playlist_id: playlistId
    });
  } catch (error) {
    console.error('Error creating playlist:', error);
    res.status(500).json({ error: 'Error creating playlist', details: error.message });
  }
});

// Get playlist by ID with songs
app.get('/api/playlists/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const playlists = await query(
      `SELECT p.*, u.username 
       FROM playlists p
       JOIN users u ON p.user_id = u.user_id
       WHERE p.playlist_id = ?`,
      [id]
    );
    
    if (!playlists || playlists.length === 0) {
      return res.status(404).json({ error: 'Playlist not found' });
    }
    
    const songs = await query(
      `SELECT ps.*, s.title, s.duration, a.title as album_title, ar.name as artist_name
       FROM playlist_songs ps
       JOIN songs s ON ps.song_id = s.song_id
       JOIN albums a ON s.album_id = a.album_id
       JOIN artists ar ON a.artist_id = ar.artist_id
       WHERE ps.playlist_id = ?
       ORDER BY ps.position`,
      [id]
    );
    
    res.json({ 
      ...playlists[0], 
      songs: Array.isArray(songs) ? songs : [] 
    });
  } catch (error) {
    console.error('Error fetching playlist:', error);
    res.status(500).json({ error: 'Error fetching playlist' });
  }
});

// Add song to playlist
app.post('/api/playlists/:id/songs', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { song_id } = req.body;
    
    // Get the next position
    const positionResult = await query(
      'SELECT COALESCE(MAX(position), 0) + 1 as next_position FROM playlist_songs WHERE playlist_id = ?',
      [id]
    );
    
    const nextPosition = positionResult[0]?.next_position || 1;
    
    await query(
      'INSERT INTO playlist_songs (playlist_id, song_id, position) VALUES (?, ?, ?)',
      [id, song_id, nextPosition]
    );
    
    res.json({ success: true, message: 'Song added to playlist' });
  } catch (error) {
    console.error('Error adding song to playlist:', error);
    res.status(500).json({ error: 'Error adding song to playlist', details: error.message });
  }
});

// Remove song from playlist
app.delete('/api/playlists/:playlistId/songs/:songId', authenticateToken, async (req, res) => {
  try {
    const { playlistId, songId } = req.params;
    
    await query(
      'DELETE FROM playlist_songs WHERE playlist_id = ? AND song_id = ?',
      [playlistId, songId]
    );
    
    res.json({ success: true, message: 'Song removed from playlist' });
  } catch (error) {
    console.error('Error removing song from playlist:', error);
    res.status(500).json({ error: 'Error removing song from playlist' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
});

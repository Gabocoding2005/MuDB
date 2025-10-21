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
app.use(cors());
app.use(express.json());

// Database connection
const dbConfig = {
  host: process.env.DB_HOST || 'localhost', 
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'music_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
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
  const [rows] = await pool.execute(sql, params);
  return rows;
};

// Routes
// User registration
app.post('/api/register', [
  body('username').isLength({ min: 3 }),
  body('email').isEmail(),
  body('password').isLength({ min: 6 })
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { username, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    
    await query(
      'INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)',
      [username, email, hashedPassword]
    );
    
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Error registering user' });
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
      ORDER BY a.release_year DESC
    `);
    res.json(albums);
  } catch (error) {
    console.error('Error fetching albums:', error);
    res.status(500).json({ error: 'Error fetching albums' });
  }
});

// Get album by ID with songs
app.get('/api/albums/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const [album] = await query(
      `SELECT a.*, ar.name as artist_name 
       FROM albums a
       JOIN artists ar ON a.artist_id = ar.artist_id 
       WHERE a.album_id = ?`, 
      [id]
    );
    
    if (!album) {
      return res.status(404).json({ error: 'Album not found' });
    }
    
    const songs = await query(
      'SELECT * FROM songs WHERE album_id = ? ORDER BY track_number',
      [id]
    );
    
    res.json({ ...album, songs });
  } catch (error) {
    console.error('Error fetching album:', error);
    res.status(500).json({ error: 'Error fetching album' });
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
    const [
      [{ totalArtists }],
      [{ totalAlbums }],
      [{ totalSongs }],
      [{ totalUsers }],
      [{ totalPlaylists }],
      [popularArtists],
      [recentAlbums]
    ] = await Promise.all([
      pool.query('SELECT COUNT(*) as totalArtists FROM artists'),
      pool.query('SELECT COUNT(*) as totalAlbums FROM albums'),
      pool.query('SELECT COUNT(*) as totalSongs FROM songs'),
      pool.query('SELECT COUNT(*) as totalUsers FROM users'),
      pool.query('SELECT COUNT(*) as totalPlaylists FROM playlists'),
      pool.query(`
        SELECT a.artist_id, a.name, COUNT(s.song_id) as song_count
        FROM artists a
        LEFT JOIN albums al ON a.artist_id = al.artist_id
        LEFT JOIN songs s ON al.album_id = s.album_id
        GROUP BY a.artist_id
        ORDER BY song_count DESC
        LIMIT 5
      `),
      pool.query(`
        SELECT a.*, ar.name as artist_name 
        FROM albums a
        JOIN artists ar ON a.artist_id = ar.artist_id
        ORDER BY a.release_year DESC
        LIMIT 5
      `)
    ]);
    
    res.json({
      totalArtists,
      totalAlbums,
      totalSongs,
      totalUsers,
      totalPlaylists,
      popularArtists,
      recentAlbums
    });
  } catch (error) {
    console.error('Error fetching statistics:', error);
    res.status(500).json({ error: 'Error fetching statistics' });
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

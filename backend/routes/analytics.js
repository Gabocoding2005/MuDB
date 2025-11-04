const express = require('express');
const router = express.Router();
const mysql = require('mysql2/promise');

// Configuración de la base de datos
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'mudb',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// ============================================
// 1. POPULARIDAD DE GÉNEROS A LO LARGO DEL TIEMPO
// ============================================
router.get('/genre-popularity-timeline', async (req, res) => {
  try {
    const [results] = await pool.query('SELECT * FROM vw_genre_popularity_timeline ORDER BY year, genre_name');
    res.json({ 
      success: true,
      data: results,
      count: results.length
    });
  } catch (error) {
    console.error('Error fetching genre popularity timeline:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error al obtener la popularidad de géneros',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// ============================================
// 2. POPULARIDAD DE ARTISTAS POR PAÍS
// ============================================
router.get('/artist-popularity-by-country', async (req, res) => {
  try {
    const [results] = await pool.query('SELECT * FROM vw_artist_popularity_by_country ORDER BY year, artist_count DESC');
    res.json({ 
      success: true,
      data: results,
      count: results.length
    });
  } catch (error) {
    console.error('Error fetching artist popularity by country:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error al obtener popularidad de artistas por país',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// ============================================
// 3. RED DE COLABORACIÓN ENTRE ARTISTAS
// ============================================
router.get('/artist-collaboration-network', async (req, res) => {
  try {
    const [results] = await pool.query('SELECT * FROM vw_artist_collaboration_network ORDER BY shared_genres DESC LIMIT 100');
    res.json({ 
      success: true,
      data: results,
      count: results.length
    });
  } catch (error) {
    console.error('Error fetching artist collaboration network:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error al obtener red de colaboración',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// ============================================
// 3B. RED DE GÉNEROS MUSICALES (DIAGRAMA DE RED)
// ============================================
router.get('/genre-network', async (req, res) => {
  try {
    // Obtener todos los géneros con su cantidad de canciones
    const [genres] = await pool.query(`
      SELECT 
        g.genre_id,
        g.name as genre_name,
        COUNT(DISTINCT sg.song_id) as artist_count
      FROM genres g
      LEFT JOIN song_genres sg ON g.genre_id = sg.genre_id
      GROUP BY g.genre_id, g.name
      HAVING artist_count > 0
      ORDER BY artist_count DESC
    `);

    // Obtener las relaciones entre géneros (canciones que comparten géneros)
    const [connections] = await pool.query(`
      SELECT 
        sg1.genre_id as source_genre_id,
        sg2.genre_id as target_genre_id,
        COUNT(DISTINCT sg1.song_id) as connection_strength
      FROM song_genres sg1
      JOIN song_genres sg2 ON sg1.song_id = sg2.song_id AND sg1.genre_id < sg2.genre_id
      GROUP BY sg1.genre_id, sg2.genre_id
      HAVING connection_strength > 0
      ORDER BY connection_strength DESC
    `);

    res.json({ 
      success: true,
      data: {
        nodes: genres,
        links: connections
      }
    });
  } catch (error) {
    console.error('Error fetching genre network:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error al obtener red de géneros',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// ============================================
// 4. DESGLOSE PORCENTUAL DE PARTICIPACIÓN EN ÁLBUMES
// ============================================
router.get('/album-participation-breakdown', async (req, res) => {
  try {
    const [results] = await pool.query('SELECT * FROM vw_album_participation_breakdown ORDER BY total_songs DESC');
    res.json({ 
      success: true,
      data: results,
      count: results.length
    });
  } catch (error) {
    console.error('Error fetching album participation breakdown:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error al obtener desglose de participación en álbumes',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// ============================================
// 5. CORRELACIONES ENTRE GÉNEROS POR ÉPOCA
// ============================================
router.get('/genre-correlations-by-era', async (req, res) => {
  try {
    const { era } = req.query;
    let query = 'SELECT * FROM vw_genre_correlations_by_era';
    const params = [];
    
    if (era) {
      query += ' WHERE era = ?';
      params.push(era);
    }
    
    query += ' ORDER BY era, songs_with_both_genres DESC';
    
    const [results] = await pool.query(query, params);
    res.json({ 
      success: true,
      data: results,
      count: results.length
    });
  } catch (error) {
    console.error('Error fetching genre correlations:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error al obtener correlaciones entre géneros',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// ============================================
// 6. PREDICCIÓN DE ÉXITO MUSICAL
// ============================================
router.get('/music-success-prediction', async (req, res) => {
  try {
    const { limit = 50 } = req.query;
    const [results] = await pool.query(
      'SELECT * FROM vw_music_success_prediction ORDER BY success_score DESC LIMIT ?',
      [parseInt(limit)]
    );
    res.json({ 
      success: true,
      data: results,
      count: results.length
    });
  } catch (error) {
    console.error('Error fetching music success prediction:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error al obtener predicción de éxito musical',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// ============================================
// 7. ANÁLISIS DE CENTRALIDAD DE ARTISTAS
// ============================================
router.get('/artist-centrality-analysis', async (req, res) => {
  try {
    const [results] = await pool.query('SELECT * FROM vw_artist_centrality_analysis ORDER BY centrality_score DESC');
    res.json({ 
      success: true,
      data: results,
      count: results.length
    });
  } catch (error) {
    console.error('Error fetching artist centrality analysis:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error al obtener análisis de centralidad de artistas',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// ============================================
// 8. MAPA DE CALOR - GÉNEROS POR REGIÓN Y ÉPOCA
// ============================================
router.get('/genre-heatmap-by-region-era', async (req, res) => {
  try {
    const { region, era } = req.query;
    let query = 'SELECT * FROM vw_genre_heatmap_by_region_era WHERE 1=1';
    const params = [];
    
    if (region) {
      query += ' AND region = ?';
      params.push(region);
    }
    
    if (era) {
      query += ' AND era = ?';
      params.push(era);
    }
    
    query += ' ORDER BY era, region, song_count DESC';
    
    const [results] = await pool.query(query, params);
    res.json({ 
      success: true,
      data: results,
      count: results.length
    });
  } catch (error) {
    console.error('Error fetching genre heatmap:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error al obtener mapa de calor de géneros',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// ============================================
// 9. RESUMEN DEL DASHBOARD
// ============================================
router.get('/dashboard-summary', async (req, res) => {
  try {
    const [results] = await pool.query('SELECT * FROM vw_dashboard_summary');
    res.json({ 
      success: true,
      data: results[0] || {}
    });
  } catch (error) {
    console.error('Error fetching dashboard summary:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error al obtener resumen del dashboard',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// ============================================
// 10. TENDENCIAS DE POPULARIDAD POR DÉCADA
// ============================================
router.get('/popularity-trends-by-decade', async (req, res) => {
  try {
    const [results] = await pool.query('SELECT * FROM vw_popularity_trends_by_decade ORDER BY decade');
    res.json({ 
      success: true,
      data: results,
      count: results.length
    });
  } catch (error) {
    console.error('Error fetching popularity trends:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error al obtener tendencias de popularidad',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// ============================================
// ENDPOINT ADICIONAL: Lista de países disponibles
// ============================================
router.get('/countries', async (req, res) => {
  try {
    const [results] = await pool.query(
      'SELECT DISTINCT country, COUNT(artist_id) as artist_count FROM artists WHERE country IS NOT NULL GROUP BY country ORDER BY artist_count DESC'
    );
    res.json({ 
      success: true,
      data: results
    });
  } catch (error) {
    console.error('Error fetching countries:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error al obtener lista de países',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// ============================================
// ENDPOINT ADICIONAL: Lista de épocas disponibles
// ============================================
router.get('/eras', async (req, res) => {
  try {
    const eras = ['1960s', '1970s', '1980s', '1990s', '2000s'];
    res.json({ 
      success: true,
      data: eras
    });
  } catch (error) {
    console.error('Error fetching eras:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error al obtener lista de épocas',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// ============================================
// 11. TOP CANCIONES MÁS LIKEADAS
// ============================================
router.get('/top-liked-songs', async (req, res) => {
  try {
    const { limit = 20 } = req.query;
    const [results] = await pool.query(
      'SELECT * FROM vw_top_liked_songs LIMIT ?',
      [parseInt(limit)]
    );
    res.json({ 
      success: true,
      data: results,
      count: results.length
    });
  } catch (error) {
    console.error('Error fetching top liked songs:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error al obtener canciones más likeadas',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// ============================================
// 12. CANCIONES CON MENOR PROBABILIDAD DE ÉXITO
// ============================================
router.get('/low-success-songs', async (req, res) => {
  try {
    const { limit = 20 } = req.query;
    const [results] = await pool.query(
      'SELECT * FROM vw_low_success_songs LIMIT ?',
      [parseInt(limit)]
    );
    res.json({ 
      success: true,
      data: results,
      count: results.length
    });
  } catch (error) {
    console.error('Error fetching low success songs:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error al obtener canciones con bajo éxito',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// ============================================
// 13. BUSCAR CANCIÓN ESPECÍFICA PARA PREDICCIÓN
// ============================================
router.get('/song-success-prediction/:songId', async (req, res) => {
  try {
    const { songId } = req.params;
    const [results] = await pool.query(
      'SELECT * FROM vw_music_success_prediction WHERE song_id = ?',
      [parseInt(songId)]
    );
    res.json({ 
      success: true,
      data: results[0] || null
    });
  } catch (error) {
    console.error('Error fetching song success prediction:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error al obtener predicción de éxito de la canción',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// ============================================
// 14. BUSCAR CANCIONES POR NOMBRE (PARA AUTOCOMPLETE)
// ============================================
router.get('/search-songs', async (req, res) => {
  try {
    const { q } = req.query;
    if (!q || q.length < 2) {
      return res.json({ success: true, data: [] });
    }
    
    const [results] = await pool.query(
      `SELECT s.song_id, s.title, ar.name as artist_name, al.title as album_title 
       FROM songs s 
       JOIN artists ar ON s.artist_id = ar.artist_id 
       JOIN albums al ON s.album_id = al.album_id 
       WHERE s.title LIKE ? OR ar.name LIKE ? 
       ORDER BY s.title 
       LIMIT 20`,
      [`%${q}%`, `%${q}%`]
    );
    res.json({ 
      success: true,
      data: results
    });
  } catch (error) {
    console.error('Error searching songs:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error al buscar canciones',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// ============================================
// 15. TIMELINE DE LANZAMIENTOS
// ============================================
router.get('/releases-timeline', async (req, res) => {
  try {
    const [results] = await pool.query('SELECT * FROM vw_releases_timeline ORDER BY year');
    res.json({ 
      success: true,
      data: results,
      count: results.length
    });
  } catch (error) {
    console.error('Error fetching releases timeline:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error al obtener timeline de lanzamientos',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// ============================================
// 16. ÁLBUMES MEJOR CALIFICADOS
// ============================================
router.get('/top-rated-albums', async (req, res) => {
  try {
    const { limit = 20 } = req.query;
    const [results] = await pool.query(
      'SELECT * FROM vw_top_rated_albums LIMIT ?',
      [parseInt(limit)]
    );
    res.json({ 
      success: true,
      data: results,
      count: results.length
    });
  } catch (error) {
    console.error('Error fetching top rated albums:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error al obtener álbumes mejor calificados',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// ============================================
// 17. MATRIZ DE CORRELACIÓN DE GÉNEROS
// ============================================
router.get('/genre-correlation-matrix', async (req, res) => {
  try {
    const [results] = await pool.query('SELECT * FROM vw_genre_correlation_matrix ORDER BY co_occurrence_count DESC LIMIT 50');
    res.json({ 
      success: true,
      data: results,
      count: results.length
    });
  } catch (error) {
    console.error('Error fetching genre correlation matrix:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error al obtener matriz de correlación de géneros',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// ============================================
// 18. EVOLUCIÓN DE GÉNEROS POR DÉCADA
// ============================================
router.get('/genre-evolution-by-decade', async (req, res) => {
  try {
    const { genre } = req.query;
    let query = 'SELECT * FROM vw_genre_evolution_by_decade';
    const params = [];
    
    if (genre) {
      query += ' WHERE genre_name = ?';
      params.push(genre);
    }
    
    query += ' ORDER BY decade, song_count DESC';
    
    const [results] = await pool.query(query, params);
    res.json({ 
      success: true,
      data: results,
      count: results.length
    });
  } catch (error) {
    console.error('Error fetching genre evolution:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error al obtener evolución de géneros',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// ============================================
// 19. LISTA DE GÉNEROS DISPONIBLES
// ============================================
router.get('/genres', async (req, res) => {
  try {
    const [results] = await pool.query(
      'SELECT genre_id, name FROM genres ORDER BY name'
    );
    res.json({ 
      success: true,
      data: results
    });
  } catch (error) {
    console.error('Error fetching genres:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error al obtener lista de géneros',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

module.exports = router;

-- ============================================
-- NUEVAS VISTAS PARA ANÁLISIS ADICIONALES
-- ============================================

USE mudb;

-- ============================================
-- 1. TOP CANCIONES MÁS LIKEADAS
-- ============================================
CREATE OR REPLACE VIEW vw_top_liked_songs AS
SELECT 
    s.song_id,
    s.title AS song_title,
    ar.name AS artist_name,
    al.title AS album_title,
    al.cover_image,
    YEAR(al.release_date) AS release_year,
    s.duration,
    COUNT(DISTINCT ul.user_id) AS total_likes,
    COUNT(DISTINCT ps.playlist_id) AS playlist_count,
    GROUP_CONCAT(DISTINCT g.name ORDER BY g.name SEPARATOR ', ') AS genres
FROM 
    songs s
JOIN albums al ON s.album_id = al.album_id
JOIN artists ar ON s.artist_id = ar.artist_id
LEFT JOIN user_likes ul ON s.song_id = ul.song_id
LEFT JOIN playlist_songs ps ON s.song_id = ps.song_id
LEFT JOIN song_genres sg ON s.song_id = sg.song_id
LEFT JOIN genres g ON sg.genre_id = g.genre_id
GROUP BY 
    s.song_id, s.title, ar.name, al.title, al.cover_image, al.release_date, s.duration
ORDER BY 
    total_likes DESC, playlist_count DESC;

-- ============================================
-- 2. CANCIONES CON MENOR PROBABILIDAD DE ÉXITO
-- ============================================
CREATE OR REPLACE VIEW vw_low_success_songs AS
SELECT 
    s.song_id,
    s.title AS song_title,
    ar.name AS artist_name,
    al.title AS album_title,
    YEAR(al.release_date) AS release_year,
    s.duration,
    COUNT(DISTINCT ul.user_id) AS total_likes,
    COUNT(DISTINCT ps.playlist_id) AS playlist_appearances,
    ROUND(
        (COUNT(DISTINCT ul.user_id) * 0.4) + 
        (COUNT(DISTINCT ps.playlist_id) * 0.3) + 
        ((SELECT COUNT(*) FROM user_likes ul2 JOIN songs s2 ON ul2.song_id = s2.song_id WHERE s2.artist_id = ar.artist_id) * 0.2 / 100) +
        ((SELECT COUNT(DISTINCT al2.album_id) FROM albums al2 WHERE al2.artist_id = ar.artist_id) * 0.1)
    , 2) AS success_score,
    CASE 
        WHEN COUNT(DISTINCT ul.user_id) = 0 THEN 'No Engagement'
        WHEN COUNT(DISTINCT ul.user_id) < 2 THEN 'Very Low'
        ELSE 'Low'
    END AS success_category
FROM 
    songs s
JOIN albums al ON s.album_id = al.album_id
JOIN artists ar ON s.artist_id = ar.artist_id
LEFT JOIN user_likes ul ON s.song_id = ul.song_id
LEFT JOIN playlist_songs ps ON s.song_id = ps.song_id
GROUP BY 
    s.song_id, s.title, ar.name, al.title, al.release_date, s.duration, ar.artist_id
HAVING 
    total_likes <= 2
ORDER BY 
    success_score ASC, total_likes ASC;

-- ============================================
-- 3. TIMELINE DE LANZAMIENTOS POR DÉCADA
-- ============================================
CREATE OR REPLACE VIEW vw_releases_timeline AS
SELECT 
    CASE 
        WHEN YEAR(al.release_date) BETWEEN 1960 AND 1969 THEN '1960s'
        WHEN YEAR(al.release_date) BETWEEN 1970 AND 1979 THEN '1970s'
        WHEN YEAR(al.release_date) BETWEEN 1980 AND 1989 THEN '1980s'
        WHEN YEAR(al.release_date) BETWEEN 1990 AND 1999 THEN '1990s'
        WHEN YEAR(al.release_date) BETWEEN 2000 AND 2009 THEN '2000s'
        WHEN YEAR(al.release_date) >= 2010 THEN '2010s+'
        ELSE 'Unknown'
    END AS decade,
    YEAR(al.release_date) AS year,
    COUNT(DISTINCT al.album_id) AS album_count,
    COUNT(DISTINCT ar.artist_id) AS artist_count,
    COUNT(DISTINCT s.song_id) AS song_count,
    GROUP_CONCAT(DISTINCT g.name ORDER BY g.name SEPARATOR ', ') AS top_genres
FROM 
    albums al
JOIN artists ar ON al.artist_id = ar.artist_id
LEFT JOIN songs s ON al.album_id = s.album_id
LEFT JOIN song_genres sg ON s.song_id = sg.song_id
LEFT JOIN genres g ON sg.genre_id = g.genre_id
WHERE 
    al.release_date IS NOT NULL
GROUP BY 
    decade, YEAR(al.release_date)
ORDER BY 
    year;

-- ============================================
-- 4. ÁLBUMES MEJOR CALIFICADOS
-- ============================================
CREATE OR REPLACE VIEW vw_top_rated_albums AS
SELECT 
    al.album_id,
    al.title AS album_title,
    ar.name AS artist_name,
    ar.country,
    al.cover_image,
    YEAR(al.release_date) AS release_year,
    COUNT(DISTINCT r.review_id) AS review_count,
    ROUND(AVG(r.rating), 2) AS avg_rating,
    COUNT(DISTINCT s.song_id) AS song_count,
    COUNT(DISTINCT ul.user_id) AS total_likes,
    GROUP_CONCAT(DISTINCT g.name ORDER BY g.name SEPARATOR ', ') AS genres
FROM 
    albums al
JOIN artists ar ON al.artist_id = ar.artist_id
LEFT JOIN reviews r ON al.album_id = r.album_id
LEFT JOIN songs s ON al.album_id = s.album_id
LEFT JOIN user_likes ul ON s.song_id = ul.song_id
LEFT JOIN song_genres sg ON s.song_id = sg.song_id
LEFT JOIN genres g ON sg.genre_id = g.genre_id
GROUP BY 
    al.album_id, al.title, ar.name, ar.country, al.cover_image, al.release_date
HAVING 
    review_count > 0
ORDER BY 
    avg_rating DESC, review_count DESC;

-- ============================================
-- 5. MATRIZ DE CORRELACIÓN DE GÉNEROS
-- ============================================
CREATE OR REPLACE VIEW vw_genre_correlation_matrix AS
SELECT 
    g1.genre_id AS genre1_id,
    g1.name AS genre1_name,
    g2.genre_id AS genre2_id,
    g2.name AS genre2_name,
    COUNT(DISTINCT s.song_id) AS co_occurrence_count,
    COUNT(DISTINCT al.album_id) AS albums_with_both,
    COUNT(DISTINCT ar.artist_id) AS artists_with_both,
    ROUND(
        (COUNT(DISTINCT s.song_id) * 100.0) / 
        (SELECT COUNT(DISTINCT s2.song_id) FROM songs s2 
         JOIN song_genres sg2 ON s2.song_id = sg2.song_id 
         WHERE sg2.genre_id = g1.genre_id)
    , 2) AS correlation_percentage
FROM 
    genres g1
JOIN song_genres sg1 ON g1.genre_id = sg1.genre_id
JOIN songs s ON sg1.song_id = s.song_id
JOIN song_genres sg2 ON s.song_id = sg2.song_id
JOIN genres g2 ON sg2.genre_id = g2.genre_id
JOIN albums al ON s.album_id = al.album_id
JOIN artists ar ON al.artist_id = ar.artist_id
WHERE 
    g1.genre_id < g2.genre_id
GROUP BY 
    g1.genre_id, g1.name, g2.genre_id, g2.name
HAVING 
    co_occurrence_count > 0
ORDER BY 
    co_occurrence_count DESC;

-- ============================================
-- 6. EVOLUCIÓN DE GÉNEROS POR DÉCADA
-- ============================================
CREATE OR REPLACE VIEW vw_genre_evolution_by_decade AS
SELECT 
    g.genre_id,
    g.name AS genre_name,
    CASE 
        WHEN YEAR(al.release_date) BETWEEN 1960 AND 1969 THEN '1960s'
        WHEN YEAR(al.release_date) BETWEEN 1970 AND 1979 THEN '1970s'
        WHEN YEAR(al.release_date) BETWEEN 1980 AND 1989 THEN '1980s'
        WHEN YEAR(al.release_date) BETWEEN 1990 AND 1999 THEN '1990s'
        WHEN YEAR(al.release_date) BETWEEN 2000 AND 2009 THEN '2000s'
        WHEN YEAR(al.release_date) >= 2010 THEN '2010s+'
        ELSE 'Unknown'
    END AS decade,
    COUNT(DISTINCT s.song_id) AS song_count,
    COUNT(DISTINCT al.album_id) AS album_count,
    COUNT(DISTINCT ar.artist_id) AS artist_count,
    COUNT(DISTINCT ul.user_id) AS total_likes,
    ROUND(AVG(s.duration), 2) AS avg_duration
FROM 
    genres g
JOIN song_genres sg ON g.genre_id = sg.genre_id
JOIN songs s ON sg.song_id = s.song_id
JOIN albums al ON s.album_id = al.album_id
JOIN artists ar ON al.artist_id = ar.artist_id
LEFT JOIN user_likes ul ON s.song_id = ul.song_id
WHERE 
    al.release_date IS NOT NULL
GROUP BY 
    g.genre_id, g.name, decade
ORDER BY 
    decade, song_count DESC;

-- ============================================
-- Mensaje de confirmación
-- ============================================
SELECT 'Nuevas vistas analíticas creadas exitosamente!' AS status;

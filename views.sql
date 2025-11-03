-- ============================================
-- VISTAS PARA ANÁLISIS Y VISUALIZACIONES
-- Music Database Analytics Views
-- ============================================

USE mudb;

-- ============================================
-- 1. POPULARIDAD DE GÉNEROS A LO LARGO DEL TIEMPO
-- ============================================
CREATE OR REPLACE VIEW vw_genre_popularity_timeline AS
SELECT 
    g.genre_id,
    g.name AS genre_name,
    YEAR(al.release_date) AS year,
    COUNT(DISTINCT s.song_id) AS song_count,
    COUNT(DISTINCT al.album_id) AS album_count,
    COUNT(DISTINCT ar.artist_id) AS artist_count,
    COUNT(DISTINCT ul.user_id) AS total_likes
FROM 
    genres g
LEFT JOIN 
    song_genres sg ON g.genre_id = sg.genre_id
LEFT JOIN 
    songs s ON sg.song_id = s.song_id
LEFT JOIN 
    albums al ON s.album_id = al.album_id
LEFT JOIN 
    artists ar ON al.artist_id = ar.artist_id
LEFT JOIN 
    user_likes ul ON s.song_id = ul.song_id
WHERE 
    al.release_date IS NOT NULL
GROUP BY 
    g.genre_id, g.name, YEAR(al.release_date)
ORDER BY 
    year, genre_name;

-- ============================================
-- 2. POPULARIDAD DE ARTISTAS POR PAÍS A LO LARGO DEL TIEMPO
-- ============================================
CREATE OR REPLACE VIEW vw_artist_popularity_by_country AS
SELECT 
    ar.country,
    YEAR(al.release_date) AS year,
    COUNT(DISTINCT ar.artist_id) AS artist_count,
    COUNT(DISTINCT al.album_id) AS album_count,
    COUNT(DISTINCT s.song_id) AS song_count,
    COUNT(DISTINCT ul.user_id) AS total_likes,
    AVG(s.duration) AS avg_song_duration
FROM 
    artists ar
LEFT JOIN 
    albums al ON ar.artist_id = al.artist_id
LEFT JOIN 
    songs s ON al.album_id = s.album_id
LEFT JOIN 
    user_likes ul ON s.song_id = ul.song_id
WHERE 
    ar.country IS NOT NULL AND al.release_date IS NOT NULL
GROUP BY 
    ar.country, YEAR(al.release_date)
ORDER BY 
    year, artist_count DESC;

-- ============================================
-- 3. RED DE COLABORACIÓN - ARTISTAS QUE COMPARTEN GÉNEROS
-- ============================================
CREATE OR REPLACE VIEW vw_artist_collaboration_network AS
SELECT 
    a1.artist_id AS artist1_id,
    a1.name AS artist1_name,
    a1.country AS artist1_country,
    a2.artist_id AS artist2_id,
    a2.name AS artist2_name,
    a2.country AS artist2_country,
    COUNT(DISTINCT g.genre_id) AS shared_genres,
    GROUP_CONCAT(DISTINCT g.name ORDER BY g.name SEPARATOR ', ') AS genre_names,
    ABS(a1.formation_year - a2.formation_year) AS year_difference
FROM 
    artists a1
JOIN 
    albums al1 ON a1.artist_id = al1.artist_id
JOIN 
    songs s1 ON al1.album_id = s1.album_id
JOIN 
    song_genres sg1 ON s1.song_id = sg1.song_id
JOIN 
    genres g ON sg1.genre_id = g.genre_id
JOIN 
    song_genres sg2 ON g.genre_id = sg2.genre_id
JOIN 
    songs s2 ON sg2.song_id = s2.song_id
JOIN 
    albums al2 ON s2.album_id = al2.album_id
JOIN 
    artists a2 ON al2.artist_id = a2.artist_id
WHERE 
    a1.artist_id < a2.artist_id
GROUP BY 
    a1.artist_id, a1.name, a1.country, a2.artist_id, a2.name, a2.country, a1.formation_year, a2.formation_year
HAVING 
    shared_genres >= 1
ORDER BY 
    shared_genres DESC, year_difference ASC;

-- ============================================
-- 4. DESGLOSE PORCENTUAL DE PARTICIPACIÓN EN ÁLBUMES
-- ============================================
CREATE OR REPLACE VIEW vw_album_participation_breakdown AS
SELECT 
    al.album_id,
    al.title AS album_title,
    ar.name AS artist_name,
    COUNT(s.song_id) AS total_songs,
    SUM(s.duration) AS total_duration_seconds,
    ROUND(SUM(s.duration) / 60, 2) AS total_duration_minutes,
    ROUND(AVG(s.duration), 2) AS avg_song_duration,
    ROUND((COUNT(s.song_id) * 100.0) / (SELECT COUNT(*) FROM songs WHERE album_id = al.album_id), 2) AS participation_percentage
FROM 
    albums al
JOIN 
    artists ar ON al.artist_id = ar.artist_id
LEFT JOIN 
    songs s ON al.album_id = s.album_id
GROUP BY 
    al.album_id, al.title, ar.name
ORDER BY 
    total_songs DESC;

-- ============================================
-- 5. CORRELACIONES ENTRE GÉNEROS POR INFLUENCIA Y ÉPOCA
-- ============================================
CREATE OR REPLACE VIEW vw_genre_correlations_by_era AS
SELECT 
    g1.genre_id AS genre1_id,
    g1.name AS genre1_name,
    g2.genre_id AS genre2_id,
    g2.name AS genre2_name,
    CASE 
        WHEN YEAR(al.release_date) BETWEEN 1960 AND 1969 THEN '1960s'
        WHEN YEAR(al.release_date) BETWEEN 1970 AND 1979 THEN '1970s'
        WHEN YEAR(al.release_date) BETWEEN 1980 AND 1989 THEN '1980s'
        WHEN YEAR(al.release_date) BETWEEN 1990 AND 1999 THEN '1990s'
        WHEN YEAR(al.release_date) BETWEEN 2000 AND 2009 THEN '2000s'
        ELSE 'Other'
    END AS era,
    COUNT(DISTINCT s.song_id) AS songs_with_both_genres,
    COUNT(DISTINCT ar.artist_id) AS artists_with_both_genres,
    ROUND(AVG(ul.like_count), 2) AS avg_likes_per_song
FROM 
    genres g1
JOIN 
    song_genres sg1 ON g1.genre_id = sg1.genre_id
JOIN 
    songs s ON sg1.song_id = s.song_id
JOIN 
    song_genres sg2 ON s.song_id = sg2.song_id
JOIN 
    genres g2 ON sg2.genre_id = g2.genre_id
JOIN 
    albums al ON s.album_id = al.album_id
JOIN 
    artists ar ON al.artist_id = ar.artist_id
LEFT JOIN 
    (SELECT song_id, COUNT(*) AS like_count FROM user_likes GROUP BY song_id) ul ON s.song_id = ul.song_id
WHERE 
    g1.genre_id < g2.genre_id
    AND al.release_date IS NOT NULL
GROUP BY 
    g1.genre_id, g1.name, g2.genre_id, g2.name, era
HAVING 
    songs_with_both_genres > 0
ORDER BY 
    era, songs_with_both_genres DESC;

-- ============================================
-- 6. PREDICCIÓN DE ÉXITO MUSICAL (BASADO EN HISTÓRICO)
-- ============================================
CREATE OR REPLACE VIEW vw_music_success_prediction AS
SELECT 
    s.song_id,
    s.title AS song_title,
    ar.name AS artist_name,
    al.title AS album_title,
    YEAR(al.release_date) AS release_year,
    s.duration,
    COUNT(DISTINCT ul.user_id) AS total_likes,
    COUNT(DISTINCT ps.playlist_id) AS playlist_appearances,
    -- Métricas de éxito del artista
    (SELECT COUNT(*) FROM user_likes ul2 
     JOIN songs s2 ON ul2.song_id = s2.song_id 
     WHERE s2.artist_id = ar.artist_id) AS artist_total_likes,
    (SELECT COUNT(DISTINCT al2.album_id) FROM albums al2 WHERE al2.artist_id = ar.artist_id) AS artist_album_count,
    -- Métricas de género
    (SELECT COUNT(*) FROM song_genres sg WHERE sg.song_id = s.song_id) AS genre_count,
    -- Score de éxito (fórmula ponderada)
    ROUND(
        (COUNT(DISTINCT ul.user_id) * 0.4) + 
        (COUNT(DISTINCT ps.playlist_id) * 0.3) + 
        ((SELECT COUNT(*) FROM user_likes ul2 JOIN songs s2 ON ul2.song_id = s2.song_id WHERE s2.artist_id = ar.artist_id) * 0.2 / 100) +
        ((SELECT COUNT(DISTINCT al2.album_id) FROM albums al2 WHERE al2.artist_id = ar.artist_id) * 0.1)
    , 2) AS success_score,
    -- Categoría de éxito
    CASE 
        WHEN COUNT(DISTINCT ul.user_id) >= 5 THEN 'High Success'
        WHEN COUNT(DISTINCT ul.user_id) >= 3 THEN 'Medium Success'
        WHEN COUNT(DISTINCT ul.user_id) >= 1 THEN 'Low Success'
        ELSE 'No Success'
    END AS success_category
FROM 
    songs s
JOIN 
    albums al ON s.album_id = al.album_id
JOIN 
    artists ar ON s.artist_id = ar.artist_id
LEFT JOIN 
    user_likes ul ON s.song_id = ul.song_id
LEFT JOIN 
    playlist_songs ps ON s.song_id = ps.song_id
GROUP BY 
    s.song_id, s.title, ar.name, al.title, al.release_date, s.duration, ar.artist_id
ORDER BY 
    success_score DESC;

-- ============================================
-- 7. ANÁLISIS DE CENTRALIDAD - ARTISTAS CLAVE EN LA INDUSTRIA
-- ============================================
CREATE OR REPLACE VIEW vw_artist_centrality_analysis AS
SELECT 
    ar.artist_id,
    ar.name AS artist_name,
    ar.country,
    ar.formation_year,
    -- Métricas de producción
    COUNT(DISTINCT al.album_id) AS album_count,
    COUNT(DISTINCT s.song_id) AS song_count,
    -- Métricas de popularidad
    COUNT(DISTINCT ul.user_id) AS unique_fans,
    COUNT(DISTINCT ps.playlist_id) AS playlist_appearances,
    -- Métricas de influencia
    COUNT(DISTINCT sg.genre_id) AS genre_diversity,
    (SELECT COUNT(DISTINCT a2.artist_id) 
     FROM artists a2
     JOIN albums al2 ON a2.artist_id = al2.artist_id
     JOIN songs s2 ON al2.album_id = s2.album_id
     JOIN song_genres sg2 ON s2.song_id = sg2.song_id
     WHERE sg2.genre_id IN (
         SELECT sg3.genre_id FROM song_genres sg3
         JOIN songs s3 ON sg3.song_id = s3.song_id
         WHERE s3.artist_id = ar.artist_id
     ) AND a2.artist_id != ar.artist_id
    ) AS connected_artists,
    -- Score de centralidad (fórmula ponderada)
    ROUND(
        (COUNT(DISTINCT al.album_id) * 0.2) + 
        (COUNT(DISTINCT s.song_id) * 0.15) + 
        (COUNT(DISTINCT ul.user_id) * 0.25) + 
        (COUNT(DISTINCT ps.playlist_id) * 0.2) +
        (COUNT(DISTINCT sg.genre_id) * 0.1) +
        ((SELECT COUNT(DISTINCT a2.artist_id) 
          FROM artists a2
          JOIN albums al2 ON a2.artist_id = al2.artist_id
          JOIN songs s2 ON al2.album_id = s2.album_id
          JOIN song_genres sg2 ON s2.song_id = sg2.song_id
          WHERE sg2.genre_id IN (
              SELECT sg3.genre_id FROM song_genres sg3
              JOIN songs s3 ON sg3.song_id = s3.song_id
              WHERE s3.artist_id = ar.artist_id
          ) AND a2.artist_id != ar.artist_id
         ) * 0.1)
    , 2) AS centrality_score,
    -- Categoría de influencia
    CASE 
        WHEN COUNT(DISTINCT al.album_id) >= 3 AND COUNT(DISTINCT ul.user_id) >= 5 THEN 'Key Influencer'
        WHEN COUNT(DISTINCT al.album_id) >= 2 AND COUNT(DISTINCT ul.user_id) >= 3 THEN 'Notable Artist'
        WHEN COUNT(DISTINCT al.album_id) >= 1 THEN 'Emerging Artist'
        ELSE 'New Artist'
    END AS influence_category
FROM 
    artists ar
LEFT JOIN 
    albums al ON ar.artist_id = al.artist_id
LEFT JOIN 
    songs s ON al.album_id = s.album_id
LEFT JOIN 
    user_likes ul ON s.song_id = ul.song_id
LEFT JOIN 
    playlist_songs ps ON s.song_id = ps.song_id
LEFT JOIN 
    song_genres sg ON s.song_id = sg.song_id
GROUP BY 
    ar.artist_id, ar.name, ar.country, ar.formation_year
ORDER BY 
    centrality_score DESC;

-- ============================================
-- 8. MAPA DE CALOR - GÉNEROS POR REGIÓN Y ÉPOCA
-- ============================================
CREATE OR REPLACE VIEW vw_genre_heatmap_by_region_era AS
SELECT 
    ar.country AS region,
    g.name AS genre_name,
    CASE 
        WHEN YEAR(al.release_date) BETWEEN 1960 AND 1969 THEN '1960s'
        WHEN YEAR(al.release_date) BETWEEN 1970 AND 1979 THEN '1970s'
        WHEN YEAR(al.release_date) BETWEEN 1980 AND 1989 THEN '1980s'
        WHEN YEAR(al.release_date) BETWEEN 1990 AND 1999 THEN '1990s'
        WHEN YEAR(al.release_date) BETWEEN 2000 AND 2009 THEN '2000s'
        ELSE 'Other'
    END AS era,
    COUNT(DISTINCT s.song_id) AS song_count,
    COUNT(DISTINCT ar.artist_id) AS artist_count,
    ROUND(AVG(s.duration), 2) AS avg_duration,
    COUNT(DISTINCT ul.user_id) AS total_likes
FROM 
    artists ar
JOIN 
    albums al ON ar.artist_id = al.artist_id
JOIN 
    songs s ON al.album_id = s.album_id
JOIN 
    song_genres sg ON s.song_id = sg.song_id
JOIN 
    genres g ON sg.genre_id = g.genre_id
LEFT JOIN 
    user_likes ul ON s.song_id = ul.song_id
WHERE 
    ar.country IS NOT NULL AND al.release_date IS NOT NULL
GROUP BY 
    ar.country, g.name, era
ORDER BY 
    era, region, song_count DESC;

-- ============================================
-- 9. VISTA RESUMEN - ESTADÍSTICAS GENERALES
-- ============================================
CREATE OR REPLACE VIEW vw_dashboard_summary AS
SELECT 
    (SELECT COUNT(*) FROM artists) AS total_artists,
    (SELECT COUNT(*) FROM albums) AS total_albums,
    (SELECT COUNT(*) FROM songs) AS total_songs,
    (SELECT COUNT(*) FROM genres) AS total_genres,
    (SELECT COUNT(*) FROM users WHERE is_active = TRUE) AS active_users,
    (SELECT COUNT(*) FROM playlists) AS total_playlists,
    (SELECT COUNT(*) FROM user_likes) AS total_likes,
    (SELECT COUNT(DISTINCT country) FROM artists WHERE country IS NOT NULL) AS countries_represented,
    (SELECT ROUND(AVG(duration), 2) FROM songs) AS avg_song_duration,
    (SELECT MAX(release_date) FROM albums) AS latest_release,
    (SELECT MIN(release_date) FROM albums) AS earliest_release;

-- ============================================
-- 10. TENDENCIAS DE POPULARIDAD POR DÉCADA
-- ============================================
CREATE OR REPLACE VIEW vw_popularity_trends_by_decade AS
SELECT 
    CASE 
        WHEN YEAR(al.release_date) BETWEEN 1960 AND 1969 THEN '1960s'
        WHEN YEAR(al.release_date) BETWEEN 1970 AND 1979 THEN '1970s'
        WHEN YEAR(al.release_date) BETWEEN 1980 AND 1989 THEN '1980s'
        WHEN YEAR(al.release_date) BETWEEN 1990 AND 1999 THEN '1990s'
        WHEN YEAR(al.release_date) BETWEEN 2000 AND 2009 THEN '2000s'
        ELSE 'Other'
    END AS decade,
    COUNT(DISTINCT ar.artist_id) AS artist_count,
    COUNT(DISTINCT al.album_id) AS album_count,
    COUNT(DISTINCT s.song_id) AS song_count,
    COUNT(DISTINCT ul.user_id) AS total_likes,
    ROUND(AVG(s.duration), 2) AS avg_song_duration,
    COUNT(DISTINCT g.genre_id) AS genre_diversity
FROM 
    albums al
JOIN 
    artists ar ON al.artist_id = ar.artist_id
LEFT JOIN 
    songs s ON al.album_id = s.album_id
LEFT JOIN 
    user_likes ul ON s.song_id = ul.song_id
LEFT JOIN 
    song_genres sg ON s.song_id = sg.song_id
LEFT JOIN 
    genres g ON sg.genre_id = g.genre_id
WHERE 
    al.release_date IS NOT NULL
GROUP BY 
    decade
ORDER BY 
    decade;

-- ============================================
-- Mensaje de confirmación
-- ============================================
SELECT 'Todas las vistas han sido creadas exitosamente!' AS status;

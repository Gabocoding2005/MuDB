-- ============================================
-- GENERAR LIKES, FOLLOWS Y REVIEWS ALEATORIOS
-- Para los 4 usuarios existentes
-- ============================================

USE mudb;

-- Desactivar safe mode temporalmente
SET SQL_SAFE_UPDATES = 0;

-- Limpiar datos existentes (opcional)
DELETE FROM user_likes;
DELETE FROM artist_follows;
DELETE FROM reviews;

-- ============================================
-- 1. GENERAR LIKES ALEATORIOS PARA CANCIONES
-- Cada usuario dará like a entre 30-80 canciones aleatorias
-- ============================================

DELIMITER //

DROP PROCEDURE IF EXISTS GenerateRandomLikes//

CREATE PROCEDURE GenerateRandomLikes()
BEGIN
    DECLARE user_counter INT DEFAULT 1;
    DECLARE likes_count INT;
    DECLARE like_counter INT;
    DECLARE random_song_id INT;
    DECLARE max_song_id INT;
    
    -- Obtener el máximo song_id
    SELECT MAX(song_id) INTO max_song_id FROM songs;
    
    -- Para cada usuario (1-4)
    WHILE user_counter <= 4 DO
        -- Número aleatorio de likes entre 30 y 80
        SET likes_count = 30 + FLOOR(RAND() * 51);
        SET like_counter = 0;
        
        WHILE like_counter < likes_count DO
            -- Seleccionar una canción aleatoria
            SET random_song_id = 1 + FLOOR(RAND() * max_song_id);
            
            -- Insertar like (ignorar si ya existe)
            INSERT IGNORE INTO user_likes (user_id, song_id)
            VALUES (user_counter, random_song_id);
            
            SET like_counter = like_counter + 1;
        END WHILE;
        
        SET user_counter = user_counter + 1;
    END WHILE;
END //

DELIMITER ;

-- Ejecutar procedimiento de likes
CALL GenerateRandomLikes();

-- ============================================
-- 2. GENERAR FOLLOWS ALEATORIOS PARA ARTISTAS
-- Cada usuario seguirá entre 10-25 artistas
-- ============================================

DELIMITER //

DROP PROCEDURE IF EXISTS GenerateRandomFollows//

CREATE PROCEDURE GenerateRandomFollows()
BEGIN
    DECLARE user_counter INT DEFAULT 1;
    DECLARE follows_count INT;
    DECLARE follow_counter INT;
    DECLARE random_artist_id INT;
    DECLARE max_artist_id INT;
    
    -- Obtener el máximo artist_id
    SELECT MAX(artist_id) INTO max_artist_id FROM artists;
    
    -- Para cada usuario (1-4)
    WHILE user_counter <= 4 DO
        -- Número aleatorio de follows entre 10 y 25
        SET follows_count = 10 + FLOOR(RAND() * 16);
        SET follow_counter = 0;
        
        WHILE follow_counter < follows_count DO
            -- Seleccionar un artista aleatorio
            SET random_artist_id = 1 + FLOOR(RAND() * max_artist_id);
            
            -- Insertar follow (ignorar si ya existe)
            INSERT IGNORE INTO artist_follows (user_id, artist_id)
            VALUES (user_counter, random_artist_id);
            
            SET follow_counter = follow_counter + 1;
        END WHILE;
        
        SET user_counter = user_counter + 1;
    END WHILE;
END //

DELIMITER ;

-- Ejecutar procedimiento de follows
CALL GenerateRandomFollows();

-- ============================================
-- 3. GENERAR REVIEWS ALEATORIAS PARA ÁLBUMES
-- Cada usuario hará entre 5-15 reviews
-- ============================================

DELIMITER //

DROP PROCEDURE IF EXISTS GenerateRandomReviews//

CREATE PROCEDURE GenerateRandomReviews()
BEGIN
    DECLARE user_counter INT DEFAULT 1;
    DECLARE reviews_count INT;
    DECLARE review_counter INT;
    DECLARE random_album_id INT;
    DECLARE random_rating DECIMAL(2,1);
    DECLARE max_album_id INT;
    DECLARE random_review_text VARCHAR(255);
    DECLARE review_texts TEXT DEFAULT 'Amazing album!,Great music,Love it,Masterpiece,Classic,Not bad,Pretty good,Excellent,Outstanding,Incredible,Fantastic,Brilliant,Superb,Wonderful,Awesome';
    
    -- Obtener el máximo album_id
    SELECT MAX(album_id) INTO max_album_id FROM albums;
    
    -- Para cada usuario (1-4)
    WHILE user_counter <= 4 DO
        -- Número aleatorio de reviews entre 5 y 15
        SET reviews_count = 5 + FLOOR(RAND() * 11);
        SET review_counter = 0;
        
        WHILE review_counter < reviews_count DO
            -- Seleccionar un álbum aleatorio
            SET random_album_id = 1 + FLOOR(RAND() * max_album_id);
            
            -- Rating aleatorio entre 3.0 y 5.0 (más positivo)
            SET random_rating = 3.0 + (RAND() * 2.0);
            SET random_rating = ROUND(random_rating, 1);
            
            -- Seleccionar texto aleatorio
            SET random_review_text = SUBSTRING_INDEX(
                SUBSTRING_INDEX(review_texts, ',', 1 + FLOOR(RAND() * 15)), 
                ',', 
                -1
            );
            
            -- Insertar review (ignorar si ya existe)
            INSERT IGNORE INTO reviews (user_id, album_id, rating, review_text)
            VALUES (user_counter, random_album_id, random_rating, random_review_text);
            
            SET review_counter = review_counter + 1;
        END WHILE;
        
        SET user_counter = user_counter + 1;
    END WHILE;
END //

DELIMITER ;

-- Ejecutar procedimiento de reviews
CALL GenerateRandomReviews();

-- ============================================
-- LIMPIAR PROCEDIMIENTOS
-- ============================================

DROP PROCEDURE IF EXISTS GenerateRandomLikes;
DROP PROCEDURE IF EXISTS GenerateRandomFollows;
DROP PROCEDURE IF EXISTS GenerateRandomReviews;

-- Reactivar safe mode
SET SQL_SAFE_UPDATES = 1;

-- ============================================
-- VERIFICAR RESULTADOS
-- ============================================

SELECT '=== RESUMEN DE DATOS GENERADOS ===' as '';

SELECT 
    u.username,
    COUNT(DISTINCT ul.song_id) as likes_count,
    COUNT(DISTINCT af.artist_id) as follows_count,
    COUNT(DISTINCT r.album_id) as reviews_count
FROM users u
LEFT JOIN user_likes ul ON u.user_id = ul.user_id
LEFT JOIN artist_follows af ON u.user_id = af.user_id
LEFT JOIN reviews r ON u.user_id = r.user_id
WHERE u.user_id <= 4
GROUP BY u.user_id, u.username
ORDER BY u.user_id;

SELECT '' as '';
SELECT CONCAT('Total de likes: ', COUNT(*)) as resultado FROM user_likes;
SELECT CONCAT('Total de follows: ', COUNT(*)) as resultado FROM artist_follows;
SELECT CONCAT('Total de reviews: ', COUNT(*)) as resultado FROM reviews;

SELECT '' as '';
SELECT '¡Datos aleatorios generados exitosamente!' as status;

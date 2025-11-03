-- ============================================
-- GENERAR 500 CANCIONES TOTAL (10 POR ÁLBUM)
-- Este script genera automáticamente canciones
-- ============================================

USE mudb;

-- Primero, eliminar canciones existentes excepto la primera de cada álbum
DELETE FROM songs WHERE track_number > 1;

-- Procedimiento para generar canciones
DELIMITER //

CREATE PROCEDURE IF NOT EXISTS GenerateSongs()
BEGIN
    DECLARE album_counter INT DEFAULT 1;
    DECLARE track_counter INT DEFAULT 2;
    DECLARE artist_id_var INT;
    DECLARE song_title VARCHAR(255);
    DECLARE duration_var INT;
    
    -- Nombres genéricos para canciones
    DECLARE song_names TEXT DEFAULT 'Morning Light,Night Dreams,Electric Soul,Rhythm Dance,Silent Echo,Golden Hour,Midnight Run,Crystal Clear,Burning Sky,Ocean Wave';
    
    WHILE album_counter <= 50 DO
        -- Obtener el artist_id del álbum
        SELECT artist_id INTO artist_id_var FROM albums WHERE album_id = album_counter LIMIT 1;
        
        SET track_counter = 2;
        WHILE track_counter <= 10 DO
            -- Generar título de canción
            SET song_title = CONCAT(
                SUBSTRING_INDEX(SUBSTRING_INDEX(song_names, ',', track_counter - 1), ',', -1),
                ' ',
                track_counter
            );
            
            -- Duración aleatoria entre 180 y 420 segundos (3-7 minutos)
            SET duration_var = 180 + FLOOR(RAND() * 240);
            
            -- Insertar canción
            INSERT INTO songs (album_id, artist_id, title, duration, track_number)
            VALUES (album_counter, artist_id_var, song_title, duration_var, track_counter);
            
            SET track_counter = track_counter + 1;
        END WHILE;
        
        SET album_counter = album_counter + 1;
    END WHILE;
END //

DELIMITER ;

-- Ejecutar el procedimiento
CALL GenerateSongs();

-- Asignar géneros a las nuevas canciones
-- Copiar los géneros de la primera canción de cada álbum
INSERT INTO song_genres (song_id, genre_id)
SELECT s.song_id, sg.genre_id
FROM songs s
JOIN albums a ON s.album_id = a.album_id
JOIN song_genres sg ON sg.song_id = (
    SELECT MIN(song_id) FROM songs WHERE album_id = a.album_id
)
WHERE s.track_number > 1
AND NOT EXISTS (
    SELECT 1 FROM song_genres sg2 WHERE sg2.song_id = s.song_id AND sg2.genre_id = sg.genre_id
);

-- Limpiar
DROP PROCEDURE IF EXISTS GenerateSongs;

-- Verificar resultados
SELECT COUNT(*) as total_songs FROM songs;
SELECT album_id, COUNT(*) as songs_per_album FROM songs GROUP BY album_id ORDER BY album_id LIMIT 10;
SELECT 'Total de canciones generadas correctamente' as status;

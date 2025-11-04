-- ============================================
-- AGREGAR MÁS CANCIONES PARA ÁLBUMES 41-50
-- ============================================

USE mudb;

-- Álbumes 41-50
INSERT INTO songs (album_id, artist_id, title, duration, track_number) VALUES
-- Álbum 41
(41, 41, 'Latin Fire', 234, 1), (41, 41, 'Salsa Rhythm', 267, 2), (41, 41, 'Merengue Beat', 245, 3), (41, 41, 'Bachata Love', 289, 4), (41, 41, 'Cumbia Dance', 278, 5), (41, 41, 'Reggaeton Flow', 256, 6), (41, 41, 'Mambo King', 298, 7), (41, 41, 'Cha Cha Cha', 234, 8), (41, 41, 'Tango Passion', 312, 9), (41, 41, 'Samba Carnival', 289, 10),

-- Álbum 42
(42, 42, 'World Beat', 289, 1), (42, 42, 'African Drums', 312, 2), (42, 42, 'Celtic Dance', 267, 3), (42, 42, 'Asian Fusion', 298, 4), (42, 42, 'Middle Eastern', 334, 5), (42, 42, 'Caribbean Breeze', 256, 6), (42, 42, 'Balkan Brass', 278, 7), (42, 42, 'Nordic Folk', 289, 8), (42, 42, 'Indian Raga', 367, 9), (42, 42, 'Global Village', 312, 10),

-- Álbum 43
(43, 43, 'Experimental Sound', 398, 1), (43, 43, 'Avant Garde', 445, 2), (43, 43, 'Abstract Music', 367, 3), (43, 43, 'Noise Art', 289, 4), (43, 43, 'Minimalist', 512, 5), (43, 43, 'Concrete Music', 334, 6), (43, 43, 'Electroacoustic', 398, 7), (43, 43, 'Sound Collage', 312, 8), (43, 43, 'Field Recording', 445, 9), (43, 43, 'Sonic Experiment', 367, 10),

-- Álbum 44
(44, 44, 'Acoustic Session', 234, 1), (44, 44, 'Unplugged', 267, 2), (44, 44, 'Singer Songwriter', 289, 3), (44, 44, 'Folk Ballad', 312, 4), (44, 44, 'Coffee House', 245, 5), (44, 44, 'Intimate Performance', 278, 6), (44, 44, 'Stripped Down', 234, 7), (44, 44, 'Raw Emotion', 298, 8), (44, 44, 'Storytelling', 334, 9), (44, 44, 'Heartfelt', 289, 10),

-- Álbum 45
(45, 45, 'Orchestral Suite', 445, 1), (45, 45, 'String Quartet', 398, 2), (45, 45, 'Piano Concerto', 512, 3), (45, 45, 'Violin Solo', 367, 4), (45, 45, 'Cello Sonata', 334, 5), (45, 45, 'Brass Ensemble', 298, 6), (45, 45, 'Woodwind Quintet', 312, 7), (45, 45, 'Chamber Music', 367, 8), (45, 45, 'Symphonic Poem', 445, 9), (45, 45, 'Grand Finale', 398, 10),

-- Álbum 46
(46, 46, 'Meditation Music', 512, 1), (46, 46, 'Zen Garden', 445, 2), (46, 46, 'Peaceful Mind', 398, 3), (46, 46, 'Relaxation', 367, 4), (46, 46, 'Tranquility', 445, 5), (46, 46, 'Serenity', 398, 6), (46, 46, 'Calm Waters', 512, 7), (46, 46, 'Inner Peace', 445, 8), (46, 46, 'Mindfulness', 398, 9), (46, 46, 'Spiritual Journey', 512, 10),

-- Álbum 47
(47, 47, 'Cinematic Score', 398, 1), (47, 47, 'Epic Theme', 445, 2), (47, 47, 'Action Sequence', 312, 3), (47, 47, 'Love Theme', 367, 4), (47, 47, 'Suspense', 289, 5), (47, 47, 'Victory March', 334, 6), (47, 47, 'Tragic Moment', 398, 7), (47, 47, 'Chase Scene', 267, 8), (47, 47, 'End Credits', 445, 9), (47, 47, 'Main Title', 398, 10),

-- Álbum 48
(48, 48, 'Retro Wave', 289, 1), (48, 48, '80s Nostalgia', 312, 2), (48, 48, 'Synthpop', 267, 3), (48, 48, 'New Wave', 298, 4), (48, 48, 'Disco Revival', 334, 5), (48, 48, 'Funk Fusion', 289, 6), (48, 48, 'Boogie Nights', 312, 7), (48, 48, 'Electro Funk', 278, 8), (48, 48, 'Vintage Sound', 298, 9), (48, 48, 'Throwback', 289, 10),

-- Álbum 49
(49, 49, 'Future Bass', 298, 1), (49, 49, 'Trap Nation', 289, 2), (49, 49, 'EDM Anthem', 334, 3), (49, 49, 'Festival Banger', 312, 4), (49, 49, 'Drop The Bass', 289, 5), (49, 49, 'Rave Party', 367, 6), (49, 49, 'Club Hit', 298, 7), (49, 49, 'Mainstage', 334, 8), (49, 49, 'Progressive House', 398, 9), (49, 49, 'Big Room', 312, 10),

-- Álbum 50
(50, 50, 'Greatest Hits Vol 1', 267, 1), (50, 50, 'Best Of Collection', 289, 2), (50, 50, 'Chart Topper', 234, 3), (50, 50, 'Radio Single', 198, 4), (50, 50, 'Fan Favorite', 312, 5), (50, 50, 'Award Winner', 289, 6), (50, 50, 'Platinum Record', 267, 7), (50, 50, 'Gold Standard', 298, 8), (50, 50, 'Timeless Classic', 334, 9), (50, 50, 'Encore Performance', 312, 10);

-- Asignar géneros a las nuevas canciones
-- Asignar géneros basados en el álbum
INSERT INTO song_genres (song_id, genre_id)
SELECT s.song_id, sg.genre_id
FROM songs s
JOIN albums a ON s.album_id = a.album_id
JOIN song_genres sg ON sg.song_id IN (
    SELECT song_id FROM songs WHERE album_id = a.album_id LIMIT 1
)
WHERE s.song_id > 50
ON DUPLICATE KEY UPDATE song_id = s.song_id;

-- Verificar el total de canciones
SELECT COUNT(*) as total_songs FROM songs;
SELECT album_id, COUNT(*) as songs_per_album FROM songs GROUP BY album_id ORDER BY album_id;

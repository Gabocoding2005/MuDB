-- ============================================
-- SEED DATA PARA MUSIC DATABASE
-- 50 ejemplos de datos completos
-- ============================================

-- ============================================
-- 1. USUARIOS (3 usuarios + admin)
-- ============================================
INSERT INTO users (username, email, password_hash, is_verified, is_active) VALUES 
('admin', 'admin@example.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', TRUE, TRUE),
('maria_garcia', 'maria.garcia@example.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', TRUE, TRUE),
('carlos_lopez', 'carlos.lopez@example.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', TRUE, TRUE),
('laura_martin', 'laura.martin@example.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', TRUE, TRUE);

-- ============================================
-- 2. GÉNEROS (20 géneros)
-- ============================================
INSERT INTO genres (name, description) VALUES 
('Rock', 'Género musical caracterizado por el uso de guitarras eléctricas'),
('Pop', 'Música popular contemporánea'),
('Heavy Metal', 'Rock pesado con guitarras distorsionadas'),
('Punk', 'Rock rápido y directo con actitud rebelde'),
('Jazz', 'Música improvisada con raíces afroamericanas'),
('Blues', 'Música con raíces en el sur de Estados Unidos'),
('Progressive Rock', 'Rock con estructuras complejas y experimentales'),
('Hard Rock', 'Rock con sonido más pesado y agresivo'),
('Grunge', 'Rock alternativo de Seattle de los 90'),
('Alternative Rock', 'Rock fuera de la corriente principal'),
('Classic Rock', 'Rock de las décadas de 60s-80s'),
('Psychedelic Rock', 'Rock experimental con influencias psicodélicas'),
('Glam Rock', 'Rock teatral y visual'),
('Folk Rock', 'Fusión de folk y rock'),
('Indie Rock', 'Rock independiente'),
('Post-Punk', 'Evolución experimental del punk'),
('New Wave', 'Pop/rock de finales de los 70s y 80s'),
('Britpop', 'Pop/rock británico de los 90s'),
('Funk Rock', 'Fusión de funk y rock'),
('Art Rock', 'Rock con enfoque artístico y experimental');

-- ============================================
-- 3. ARTISTAS (50 artistas)
-- ============================================
INSERT INTO artists (name, country, formation_year, bio) VALUES 
('The Beatles', 'United Kingdom', 1960, 'Banda de rock inglesa formada en Liverpool. Considerada la banda más influyente de todos los tiempos.'),
('Pink Floyd', 'United Kingdom', 1965, 'Banda británica de rock progresivo y psicodélico conocida por sus álbumes conceptuales.'),
('Queen', 'United Kingdom', 1970, 'Banda británica de rock formada en Londres. Famosa por su diversidad musical y presentaciones en vivo.'),
('Led Zeppelin', 'United Kingdom', 1968, 'Banda británica de rock considerada una de las más grandes e influyentes de la historia.'),
('The Rolling Stones', 'United Kingdom', 1962, 'Banda británica de rock originaria de Londres, activa desde 1962.'),
('Metallica', 'United States', 1981, 'Banda estadounidense de heavy metal originaria de Los Ángeles.'),
('Nirvana', 'United States', 1987, 'Banda estadounidense de grunge, considerada una de las más importantes de los 90.'),
('AC/DC', 'Australia', 1973, 'Banda de hard rock australiana formada en 1973 en Sídney.'),
('Radiohead', 'United Kingdom', 1985, 'Banda británica de rock alternativo formada en Oxfordshire.'),
('The Doors', 'United States', 1965, 'Banda estadounidense de rock formada en Los Ángeles.'),
('Guns N Roses', 'United States', 1985, 'Banda estadounidense de hard rock formada en Hollywood.'),
('Red Hot Chili Peppers', 'United States', 1983, 'Banda estadounidense de rock alternativo y funk rock.'),
('The Who', 'United Kingdom', 1964, 'Banda británica de rock considerada un ícono de la música del siglo XX.'),
('Black Sabbath', 'United Kingdom', 1968, 'Banda británica pionera del heavy metal.'),
('Deep Purple', 'United Kingdom', 1968, 'Banda británica de hard rock formada en Hertford.'),
('The Clash', 'United Kingdom', 1976, 'Banda británica de punk formada en Londres.'),
('The Police', 'United Kingdom', 1977, 'Banda británica de rock formada en Londres.'),
('Fleetwood Mac', 'United Kingdom', 1967, 'Banda británico-estadounidense de rock.'),
('The Cure', 'United Kingdom', 1976, 'Banda británica de rock formada en Crawley.'),
('Iron Maiden', 'United Kingdom', 1975, 'Banda británica de heavy metal fundada por Steve Harris.'),
('U2', 'Ireland', 1976, 'Banda irlandesa de rock formada en Dublín.'),
('R.E.M.', 'United States', 1980, 'Banda estadounidense de rock alternativo de Athens, Georgia.'),
('Pearl Jam', 'United States', 1990, 'Banda estadounidense de grunge de Seattle.'),
('Soundgarden', 'United States', 1984, 'Banda estadounidense de grunge pionera de Seattle.'),
('Alice in Chains', 'United States', 1987, 'Banda estadounidense de grunge de Seattle.'),
('Foo Fighters', 'United States', 1994, 'Banda estadounidense de rock alternativo fundada por Dave Grohl.'),
('The Smiths', 'United Kingdom', 1982, 'Banda británica de rock alternativo de Manchester.'),
('Joy Division', 'United Kingdom', 1976, 'Banda británica de post-punk de Manchester.'),
('New Order', 'United Kingdom', 1980, 'Banda británica de new wave formada tras Joy Division.'),
('Depeche Mode', 'United Kingdom', 1980, 'Banda británica de new wave y synth-pop.'),
('The Velvet Underground', 'United States', 1964, 'Banda estadounidense de rock experimental de Nueva York.'),
('David Bowie', 'United Kingdom', 1962, 'Artista británico innovador y camaleónico.'),
('Jimi Hendrix', 'United States', 1966, 'Guitarrista estadounidense revolucionario.'),
('Janis Joplin', 'United States', 1966, 'Cantante estadounidense de blues rock.'),
('The Ramones', 'United States', 1974, 'Banda estadounidense pionera del punk rock.'),
('Sex Pistols', 'United Kingdom', 1975, 'Banda británica icónica del punk rock.'),
('Talking Heads', 'United States', 1975, 'Banda estadounidense de new wave y art rock.'),
('Blondie', 'United States', 1974, 'Banda estadounidense de new wave y punk.'),
('The Pretenders', 'United Kingdom', 1978, 'Banda británica de rock formada por Chrissie Hynde.'),
('Siouxsie and the Banshees', 'United Kingdom', 1976, 'Banda británica de post-punk y gothic rock.'),
('Pixies', 'United States', 1986, 'Banda estadounidense de rock alternativo de Boston.'),
('Sonic Youth', 'United States', 1981, 'Banda estadounidense de rock experimental de Nueva York.'),
('My Bloody Valentine', 'Ireland', 1983, 'Banda irlandesa pionera del shoegaze.'),
('The Stone Roses', 'United Kingdom', 1983, 'Banda británica de rock alternativo de Manchester.'),
('Oasis', 'United Kingdom', 1991, 'Banda británica de britpop de Manchester.'),
('Blur', 'United Kingdom', 1988, 'Banda británica de britpop de Londres.'),
('Pulp', 'United Kingdom', 1978, 'Banda británica de britpop de Sheffield.'),
('Suede', 'United Kingdom', 1989, 'Banda británica de britpop de Londres.'),
('Muse', 'United Kingdom', 1994, 'Banda británica de rock alternativo de Devon.'),
('Arctic Monkeys', 'United Kingdom', 2002, 'Banda británica de indie rock de Sheffield.');

-- ============================================
-- 4. ÁLBUMES (50 álbumes)
-- ============================================
INSERT INTO albums (title, artist_id, release_date, description) VALUES 
('Abbey Road', 1, '1969-09-26', 'Undécimo álbum de estudio de The Beatles.'),
('The Dark Side of the Moon', 2, '1973-03-01', 'Álbum conceptual sobre la condición humana.'),
('A Night at the Opera', 3, '1975-11-21', 'Incluye "Bohemian Rhapsody".'),
('Led Zeppelin IV', 4, '1971-11-08', 'Cuarto álbum con "Stairway to Heaven".'),
('Sticky Fingers', 5, '1971-04-23', 'Noveno álbum de The Rolling Stones.'),
('Master of Puppets', 6, '1986-03-03', 'Tercer álbum de Metallica, clásico del thrash metal.'),
('Nevermind', 7, '1991-09-24', 'Segundo álbum que popularizó el grunge.'),
('Back in Black', 8, '1980-07-25', 'Uno de los álbumes más vendidos de la historia.'),
('OK Computer', 9, '1997-05-21', 'Tercer álbum aclamado por la crítica.'),
('The Doors', 10, '1967-01-04', 'Álbum debut con "Light My Fire".'),
('Appetite for Destruction', 11, '1987-07-21', 'Álbum debut de Guns N Roses.'),
('Californication', 12, '1999-06-08', 'Séptimo álbum de RHCP.'),
('Who\'s Next', 13, '1971-08-14', 'Quinto álbum con "Baba O\'Riley".'),
('Paranoid', 14, '1970-09-18', 'Segundo álbum de Black Sabbath.'),
('Machine Head', 15, '1972-03-25', 'Incluye "Smoke on the Water".'),
('London Calling', 16, '1979-12-14', 'Tercer álbum de The Clash.'),
('Synchronicity', 17, '1983-06-01', 'Quinto y último álbum de The Police.'),
('Rumours', 18, '1977-02-04', 'Undécimo álbum de Fleetwood Mac.'),
('Disintegration', 19, '1989-05-02', 'Octavo álbum de The Cure.'),
('The Number of the Beast', 20, '1982-03-22', 'Tercer álbum de Iron Maiden.'),
('The Joshua Tree', 21, '1987-03-09', 'Quinto álbum de U2.'),
('Automatic for the People', 22, '1992-10-05', 'Octavo álbum de R.E.M.'),
('Ten', 23, '1991-08-27', 'Álbum debut de Pearl Jam.'),
('Superunknown', 24, '1994-03-08', 'Cuarto álbum de Soundgarden.'),
('Dirt', 25, '1992-09-29', 'Segundo álbum de Alice in Chains.'),
('The Colour and the Shape', 26, '1997-05-20', 'Segundo álbum de Foo Fighters.'),
('The Queen Is Dead', 27, '1986-06-16', 'Tercer álbum de The Smiths.'),
('Unknown Pleasures', 28, '1979-06-15', 'Álbum debut de Joy Division.'),
('Power, Corruption & Lies', 29, '1983-05-02', 'Segundo álbum de New Order.'),
('Violator', 30, '1990-03-19', 'Séptimo álbum de Depeche Mode.'),
('The Velvet Underground & Nico', 31, '1967-03-12', 'Álbum debut con portada de Andy Warhol.'),
('The Rise and Fall of Ziggy Stardust', 32, '1972-06-16', 'Quinto álbum de David Bowie.'),
('Are You Experienced', 33, '1967-05-12', 'Álbum debut de Jimi Hendrix.'),
('Pearl', 34, '1971-01-11', 'Segundo álbum de Janis Joplin.'),
('Ramones', 35, '1976-04-23', 'Álbum debut de The Ramones.'),
('Never Mind the Bollocks', 36, '1977-10-28', 'Único álbum de estudio de Sex Pistols.'),
('Remain in Light', 37, '1980-10-08', 'Cuarto álbum de Talking Heads.'),
('Parallel Lines', 38, '1978-09-23', 'Tercer álbum de Blondie.'),
('Pretenders', 39, '1980-01-07', 'Álbum debut de The Pretenders.'),
('Juju', 40, '1981-06-19', 'Cuarto álbum de Siouxsie and the Banshees.'),
('Doolittle', 41, '1989-04-17', 'Segundo álbum de Pixies.'),
('Daydream Nation', 42, '1988-10-18', 'Quinto álbum de Sonic Youth.'),
('Loveless', 43, '1991-11-04', 'Segundo álbum de My Bloody Valentine.'),
('The Stone Roses', 44, '1989-04-02', 'Álbum debut de The Stone Roses.'),
('(What\'s the Story) Morning Glory?', 45, '1995-10-02', 'Segundo álbum de Oasis.'),
('Parklife', 46, '1994-04-25', 'Tercer álbum de Blur.'),
('Different Class', 47, '1995-10-30', 'Quinto álbum de Pulp.'),
('Suede', 48, '1993-03-29', 'Álbum debut de Suede.'),
('Absolution', 49, '2003-09-29', 'Tercer álbum de Muse.'),
('Whatever People Say I Am, That\'s What I\'m Not', 50, '2006-01-23', 'Álbum debut de Arctic Monkeys.');

-- ============================================
-- 5. CANCIONES (50 canciones)
-- ============================================
INSERT INTO songs (title, album_id, artist_id, duration, track_number) VALUES 
('Come Together', 1, 1, 260, 1),
('Something', 1, 1, 183, 2),
('Here Comes the Sun', 1, 1, 185, 7),
('Speak to Me', 2, 2, 90, 1),
('Breathe', 2, 2, 163, 2),
('Time', 2, 2, 413, 4),
('Money', 2, 2, 382, 6),
('Bohemian Rhapsody', 3, 3, 354, 11),
('You\'re My Best Friend', 3, 3, 172, 4),
('Love of My Life', 3, 3, 220, 9),
('Stairway to Heaven', 4, 4, 482, 4),
('Black Dog', 4, 4, 296, 1),
('Brown Sugar', 5, 5, 229, 1),
('Wild Horses', 5, 5, 339, 2),
('Master of Puppets', 6, 6, 515, 1),
('Battery', 6, 6, 312, 2),
('Smells Like Teen Spirit', 7, 7, 301, 1),
('Come as You Are', 7, 7, 219, 2),
('Back in Black', 8, 8, 255, 1),
('You Shook Me All Night Long', 8, 8, 210, 2),
('Paranoid Android', 9, 9, 383, 2),
('Karma Police', 9, 9, 261, 6),
('Light My Fire', 10, 10, 427, 2),
('Break On Through', 10, 10, 146, 1),
('Sweet Child O\' Mine', 11, 11, 356, 3),
('Welcome to the Jungle', 11, 11, 274, 1),
('Californication', 12, 12, 329, 6),
('Scar Tissue', 12, 12, 215, 1),
('Baba O\'Riley', 13, 13, 300, 1),
('Won\'t Get Fooled Again', 13, 13, 513, 9),
('Paranoid', 14, 14, 170, 1),
('Iron Man', 14, 14, 356, 2),
('Smoke on the Water', 15, 15, 340, 1),
('Highway Star', 15, 15, 366, 2),
('London Calling', 16, 16, 199, 1),
('Train in Vain', 16, 16, 182, 19),
('Every Breath You Take', 17, 17, 253, 7),
('Wrapped Around Your Finger', 17, 17, 313, 3),
('Dreams', 18, 18, 257, 2),
('Go Your Own Way', 18, 18, 218, 5),
('Lovesong', 19, 19, 210, 2),
('Pictures of You', 19, 19, 285, 3),
('The Number of the Beast', 20, 20, 290, 2),
('Run to the Hills', 20, 20, 228, 3),
('With or Without You', 21, 21, 296, 3),
('Where the Streets Have No Name', 21, 21, 337, 1),
('Everybody Hurts', 22, 22, 317, 7),
('Man on the Moon', 22, 22, 310, 11),
('Alive', 23, 23, 341, 5),
('Jeremy', 23, 23, 316, 6);

-- ============================================
-- 6. RELACIÓN CANCIONES-GÉNEROS
-- ============================================
INSERT INTO song_genres (song_id, genre_id) VALUES 
-- The Beatles - Rock, Pop
(1, 1), (1, 2), (2, 1), (2, 2), (3, 1), (3, 2),
-- Pink Floyd - Progressive Rock, Psychedelic Rock
(4, 7), (4, 12), (5, 7), (5, 12), (6, 7), (6, 12), (7, 7), (7, 12),
-- Queen - Rock, Glam Rock
(8, 1), (8, 13), (9, 1), (9, 2), (10, 1), (10, 2),
-- Led Zeppelin - Hard Rock, Classic Rock
(11, 8), (11, 11), (12, 8), (12, 11),
-- Rolling Stones - Rock, Blues
(13, 1), (13, 6), (14, 1), (14, 6),
-- Metallica - Heavy Metal
(15, 3), (16, 3),
-- Nirvana - Grunge, Alternative Rock
(17, 9), (17, 10), (18, 9), (18, 10),
-- AC/DC - Hard Rock
(19, 8), (20, 8),
-- Radiohead - Alternative Rock
(21, 10), (22, 10),
-- The Doors - Psychedelic Rock
(23, 12), (24, 12),
-- Guns N Roses - Hard Rock
(25, 8), (26, 8),
-- RHCP - Funk Rock, Alternative Rock
(27, 19), (27, 10), (28, 19), (28, 10),
-- The Who - Rock, Hard Rock
(29, 1), (29, 8), (30, 1), (30, 8),
-- Black Sabbath - Heavy Metal
(31, 3), (32, 3),
-- Deep Purple - Hard Rock
(33, 8), (34, 8),
-- The Clash - Punk
(35, 4), (36, 4),
-- The Police - New Wave
(37, 17), (38, 17),
-- Fleetwood Mac - Rock, Pop
(39, 1), (39, 2), (40, 1), (40, 2),
-- The Cure - Alternative Rock, Post-Punk
(41, 10), (41, 16), (42, 10), (42, 16),
-- Iron Maiden - Heavy Metal
(43, 3), (44, 3),
-- U2 - Rock, Alternative Rock
(45, 1), (45, 10), (46, 1), (46, 10),
-- R.E.M. - Alternative Rock
(47, 10), (48, 10),
-- Pearl Jam - Grunge
(49, 9), (50, 9);

-- ============================================
-- 7. PLAYLISTS
-- ============================================
INSERT INTO playlists (name, description, user_id, is_public) VALUES 
('Rock Clásico', 'Lo mejor del rock de los 60s y 70s', 1, TRUE),
('Grunge Esencial', 'Las mejores canciones del grunge de Seattle', 2, TRUE),
('Metal Pesado', 'Para cuando necesito energía', 3, TRUE),
('Favoritos de Maria', 'Mis canciones favoritas de todos los tiempos', 2, TRUE),
('Workout Mix', 'Música para entrenar', 3, TRUE),
('Relax y Chill', 'Música relajante', 4, TRUE),
('Road Trip', 'Para viajes largos en carretera', 1, TRUE),
('90s Nostalgia', 'Lo mejor de los 90s', 2, FALSE),
('British Invasion', 'Bandas británicas legendarias', 3, TRUE),
('Acoustic Sessions', 'Versiones acústicas y baladas', 4, TRUE);

-- ============================================
-- 8. CANCIONES EN PLAYLISTS
-- ============================================
INSERT INTO playlist_songs (playlist_id, song_id, position) VALUES 
-- Rock Clásico
(1, 1, 1), (1, 11, 2), (1, 13, 3), (1, 23, 4), (1, 29, 5),
-- Grunge Esencial
(2, 17, 1), (2, 18, 2), (2, 49, 3), (2, 50, 4),
-- Metal Pesado
(3, 15, 1), (3, 16, 2), (3, 31, 3), (3, 32, 4), (3, 43, 5), (3, 44, 6),
-- Favoritos de Maria
(4, 8, 1), (4, 10, 2), (4, 39, 3), (4, 40, 4), (4, 45, 5),
-- Workout Mix
(5, 19, 1), (5, 20, 2), (5, 25, 3), (5, 26, 4), (5, 35, 5),
-- Relax y Chill
(6, 3, 1), (6, 10, 2), (6, 14, 3), (6, 39, 4), (6, 47, 5),
-- Road Trip
(7, 12, 1), (7, 25, 2), (7, 33, 3), (7, 40, 4), (7, 46, 5),
-- 90s Nostalgia
(8, 17, 1), (8, 21, 2), (8, 27, 3), (8, 47, 4), (8, 49, 5),
-- British Invasion
(9, 1, 1), (9, 8, 2), (9, 11, 3), (9, 35, 4), (9, 45, 5),
-- Acoustic Sessions
(10, 3, 1), (10, 10, 2), (10, 14, 3), (10, 22, 4), (10, 39, 5);

-- ============================================
-- 9. LIKES DE USUARIOS
-- ============================================
INSERT INTO user_likes (user_id, song_id) VALUES 
-- Admin likes
(1, 1), (1, 8), (1, 11), (1, 17), (1, 23), (1, 29), (1, 35), (1, 45),
-- Maria likes
(2, 3), (2, 8), (2, 10), (2, 17), (2, 18), (2, 39), (2, 40), (2, 45), (2, 47), (2, 49),
-- Carlos likes
(3, 15), (3, 16), (3, 19), (3, 20), (3, 25), (3, 26), (3, 31), (3, 32), (3, 43), (3, 44),
-- Laura likes
(4, 3), (4, 10), (4, 14), (4, 22), (4, 39), (4, 41), (4, 42), (4, 47);

-- ============================================
-- 10. SEGUIMIENTOS ENTRE USUARIOS
-- ============================================
INSERT INTO user_follows (follower_id, followed_id) VALUES 
(1, 2), (1, 3), (1, 4),
(2, 1), (2, 3),
(3, 1), (3, 2), (3, 4),
(4, 1), (4, 2), (4, 3);

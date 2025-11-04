-- ============================================
-- ACTUALIZAR IMÁGENES DE PORTADAS DE ÁLBUMES
-- Usando URLs de imágenes gratuitas
-- ============================================

USE mudb;

-- Actualizar portadas de álbumes famosos (1-20)
UPDATE albums SET cover_image = 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=500' WHERE album_id = 1;  -- Abbey Road
UPDATE albums SET cover_image = 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=500' WHERE album_id = 2;  -- Dark Side of the Moon
UPDATE albums SET cover_image = 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=500' WHERE album_id = 3;  -- Queen
UPDATE albums SET cover_image = 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=500' WHERE album_id = 4;  -- Led Zeppelin
UPDATE albums SET cover_image = 'https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?w=500' WHERE album_id = 5;  -- Jimi Hendrix
UPDATE albums SET cover_image = 'https://images.unsplash.com/photo-1487180144351-b8472da7d491?w=500' WHERE album_id = 6;  -- Nirvana
UPDATE albums SET cover_image = 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=500' WHERE album_id = 7;  -- Metallica
UPDATE albums SET cover_image = 'https://images.unsplash.com/photo-1506157786151-b8491531f063?w=500' WHERE album_id = 8;  -- Bob Dylan
UPDATE albums SET cover_image = 'https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?w=500' WHERE album_id = 9;  -- Marvin Gaye
UPDATE albums SET cover_image = 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=500' WHERE album_id = 10; -- Aretha Franklin

UPDATE albums SET cover_image = 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=500' WHERE album_id = 11; -- Michael Jackson
UPDATE albums SET cover_image = 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=500' WHERE album_id = 12; -- Cee Lo Green
UPDATE albums SET cover_image = 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=500' WHERE album_id = 13; -- Beyoncé
UPDATE albums SET cover_image = 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=500' WHERE album_id = 14; -- Eminem
UPDATE albums SET cover_image = 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=500' WHERE album_id = 15; -- Coldplay
UPDATE albums SET cover_image = 'https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?w=500' WHERE album_id = 16; -- Oasis
UPDATE albums SET cover_image = 'https://images.unsplash.com/photo-1487180144351-b8472da7d491?w=500' WHERE album_id = 17; -- Radiohead
UPDATE albums SET cover_image = 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=500' WHERE album_id = 18; -- The White Stripes
UPDATE albums SET cover_image = 'https://images.unsplash.com/photo-1506157786151-b8491531f063?w=500' WHERE album_id = 19; -- Foo Fighters
UPDATE albums SET cover_image = 'https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?w=500' WHERE album_id = 20; -- Green Day

-- Álbumes 21-30 (Rock, Pop, Electronic)
UPDATE albums SET cover_image = 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=500' WHERE album_id = 21;
UPDATE albums SET cover_image = 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=500' WHERE album_id = 22;
UPDATE albums SET cover_image = 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=500' WHERE album_id = 23;
UPDATE albums SET cover_image = 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=500' WHERE album_id = 24;
UPDATE albums SET cover_image = 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=500' WHERE album_id = 25;
UPDATE albums SET cover_image = 'https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?w=500' WHERE album_id = 26;
UPDATE albums SET cover_image = 'https://images.unsplash.com/photo-1487180144351-b8472da7d491?w=500' WHERE album_id = 27;
UPDATE albums SET cover_image = 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=500' WHERE album_id = 28;
UPDATE albums SET cover_image = 'https://images.unsplash.com/photo-1506157786151-b8491531f063?w=500' WHERE album_id = 29;
UPDATE albums SET cover_image = 'https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?w=500' WHERE album_id = 30;

-- Álbumes 31-40 (Jazz, Classical, Blues)
UPDATE albums SET cover_image = 'https://images.unsplash.com/photo-1507838153414-b4b713384a76?w=500' WHERE album_id = 31;
UPDATE albums SET cover_image = 'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=500' WHERE album_id = 32;
UPDATE albums SET cover_image = 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=500' WHERE album_id = 33;
UPDATE albums SET cover_image = 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=500' WHERE album_id = 34;
UPDATE albums SET cover_image = 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=500' WHERE album_id = 35;
UPDATE albums SET cover_image = 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=500' WHERE album_id = 36;
UPDATE albums SET cover_image = 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=500' WHERE album_id = 37;
UPDATE albums SET cover_image = 'https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?w=500' WHERE album_id = 38;
UPDATE albums SET cover_image = 'https://images.unsplash.com/photo-1487180144351-b8472da7d491?w=500' WHERE album_id = 39;
UPDATE albums SET cover_image = 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=500' WHERE album_id = 40;

-- Álbumes 41-50 (World, Latin, Electronic)
UPDATE albums SET cover_image = 'https://images.unsplash.com/photo-1506157786151-b8491531f063?w=500' WHERE album_id = 41;
UPDATE albums SET cover_image = 'https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?w=500' WHERE album_id = 42;
UPDATE albums SET cover_image = 'https://images.unsplash.com/photo-1507838153414-b4b713384a76?w=500' WHERE album_id = 43;
UPDATE albums SET cover_image = 'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=500' WHERE album_id = 44;
UPDATE albums SET cover_image = 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=500' WHERE album_id = 45;
UPDATE albums SET cover_image = 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=500' WHERE album_id = 46;
UPDATE albums SET cover_image = 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=500' WHERE album_id = 47;
UPDATE albums SET cover_image = 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=500' WHERE album_id = 48;
UPDATE albums SET cover_image = 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=500' WHERE album_id = 49;
UPDATE albums SET cover_image = 'https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?w=500' WHERE album_id = 50;

-- También actualizar imágenes de perfil de artistas
UPDATE artists SET profile_image = 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300' WHERE artist_id BETWEEN 1 AND 10;
UPDATE artists SET profile_image = 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=300' WHERE artist_id BETWEEN 11 AND 20;
UPDATE artists SET profile_image = 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=300' WHERE artist_id BETWEEN 21 AND 30;
UPDATE artists SET profile_image = 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300' WHERE artist_id BETWEEN 31 AND 40;
UPDATE artists SET profile_image = 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=300' WHERE artist_id BETWEEN 41 AND 50;

-- Verificar que se actualizaron
SELECT album_id, title, cover_image FROM albums LIMIT 10;
SELECT artist_id, name, profile_image FROM artists LIMIT 10;

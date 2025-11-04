# 🎵 Music Database - Sistema Completo de Gestión Musical

Sistema integral de base de datos musical con visualizaciones avanzadas, análisis predictivo y gestión de playlists.

## 📋 Características Principales

### 🎸 Base de Datos
- **50 artistas** de diferentes géneros y países
- **50 álbumes** con portadas e información detallada
- **~500 canciones** (10 por álbum) con duración y metadata
- **20 géneros** musicales
- **4 usuarios** de prueba (admin + 3 usuarios regulares)
- **10 playlists** pre-configuradas
- **Imágenes de alta calidad** para álbumes y artistas (Unsplash)

### 🎯 Funcionalidades del Usuario
- ✅ **Registro e inicio de sesión** con autenticación JWT
- ❤️ **Sistema de likes** para canciones favoritas
- 📝 **Crear y gestionar playlists** personalizadas
- ➕ **Agregar canciones a playlists** de forma dinámica
- 👤 **Ver perfiles de artistas** con biografías y discografía
- 💿 **Explorar álbumes** con listado completo de canciones
- 🔍 **Búsqueda avanzada** de artistas, álbumes y canciones
- 🎠 **Carrusel de álbumes destacados** con navegación automática
- 🔥 **Trending Now** - Canciones y géneros más populares
- 🎵 **Reproductor de música** integrado
- 📊 **Estadísticas en tiempo real** de la plataforma

### 📊 Visualizaciones Avanzadas
- 📈 **Popularidad de géneros/artistas/países** a lo largo del tiempo
- 🌐 **Mapas interactivos** con distribución geográfica de artistas
- 🔗 **Red de géneros musicales** con diagrama interactivo D3.js
- 📊 **Desglose porcentual** de participación en proyectos
- 🥧 **Gráfico de pastel por década** con selector interactivo
- 🏆 **Predicción de éxito musical** basada en datos históricos
- ⭐ **Top rankings** de canciones y álbumes con slicers dinámicos
- 📉 **Tendencias por década** en la industria musical

## 🚀 Instalación y Configuración

### 1. Configurar la Base de Datos

```bash
# Iniciar MySQL
mysql -u root -p

# Crear la base de datos
CREATE DATABASE mudb;
USE mudb;

# Ejecutar el esquema
source database/schema.sql

# Ejecutar las vistas
source database/views.sql

# Cargar datos de prueba
source database/seed.sql

# Agregar canciones adicionales (opcional - 500 canciones)
source database/add_more_songs.sql

# Actualizar imágenes de álbumes y artistas
source database/update_album_images.sql
```

### 2. Configurar el Backend

```bash
cd backend

# Instalar dependencias
npm install

# Configurar variables de entorno
# Editar el archivo .env con tus credenciales:
PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=tu_contraseña
DB_NAME=mudb
JWT_SECRET=tu_clave_secreta

# Iniciar el servidor
node server.js
```

El servidor estará disponible en `http://localhost:3000`

### 3. Configurar el Frontend

```bash
cd frontend

# Opción 1: Usar Python (simple)
python -m http.server 8000

# Opción 2: Usar Node.js
npx http-server -p 8000
```

El frontend estará disponible en `http://localhost:8000`

## 📊 Endpoints de la API

### 🔐 Autenticación
- `POST /api/register` - Registrar nuevo usuario
- `POST /api/login` - Iniciar sesión

### 🎤 Artistas
- `GET /api/artists` - Listar todos los artistas
- `GET /api/artists/:id` - Obtener artista por ID
- `GET /api/artists/:id/albums` - Obtener álbumes de un artista

### 💿 Álbumes
- `GET /api/albums` - Listar todos los álbumes
- `GET /api/albums/:id` - Obtener álbum por ID
- `GET /api/albums/:id/songs` - Obtener canciones de un álbum

### 🎵 Canciones
- `GET /api/songs` - Listar todas las canciones
- `POST /api/songs/:songId/like` - Dar like a una canción (requiere auth)
- `DELETE /api/songs/:songId/like` - Quitar like de una canción (requiere auth)

### 📝 Playlists
- `GET /api/playlists` - Listar playlists públicas
- `GET /api/playlists/:id` - Obtener playlist por ID con canciones
- `POST /api/playlists` - Crear nueva playlist (requiere auth)
- `GET /api/users/:userId/playlists` - Obtener playlists de un usuario (requiere auth)
- `POST /api/playlists/:id/songs` - Agregar canción a playlist (requiere auth)
- `DELETE /api/playlists/:playlistId/songs/:songId` - Quitar canción de playlist (requiere auth)

### ❤️ Likes
- `GET /api/users/:userId/likes` - Obtener canciones con like de un usuario (requiere auth)

### 📈 Analytics
- `GET /api/analytics/dashboard-summary` - Resumen general del dashboard
- `GET /api/analytics/genre-popularity-timeline` - Popularidad de géneros en el tiempo
- `GET /api/analytics/artist-popularity-by-country` - Artistas por país
- `GET /api/analytics/artist-collaboration-network` - Red de colaboración entre artistas
- `GET /api/analytics/genre-network` - **NUEVO** Red de géneros musicales (nodos y conexiones)
- `GET /api/analytics/album-participation-breakdown` - Participación en álbumes
- `GET /api/analytics/genre-correlations-by-era` - Correlaciones de géneros por época
- `GET /api/analytics/music-success-prediction` - Predicción de éxito musical
- `GET /api/analytics/low-success-songs?limit=15` - Canciones con menor éxito
- `GET /api/analytics/top-liked-songs?limit=10` - Top canciones más likeadas
- `GET /api/analytics/top-rated-albums?limit=15` - Álbumes mejor calificados
- `GET /api/analytics/artist-centrality-analysis` - Análisis de centralidad de artistas
- `GET /api/analytics/genre-heatmap-by-region-era` - Mapa de calor por región y época
- `GET /api/analytics/popularity-trends-by-decade` - Tendencias de popularidad por década
- `GET /api/analytics/releases-timeline` - Timeline de lanzamientos por década
- `GET /api/analytics/genre-evolution-by-decade?genre=Rock` - Evolución de géneros específicos
- `GET /api/analytics/search-songs?q=query` - Búsqueda de canciones para predicción

### 📊 Estadísticas
- `GET /api/statistics` - Estadísticas generales del sistema

## 👥 Usuarios de Prueba

| Usuario | Email | Contraseña |
|---------|-------|------------|
| admin | admin@example.com | password |
| maria_garcia | maria.garcia@example.com | password |
| carlos_lopez | carlos.lopez@example.com | password |
| laura_martin | laura.martin@example.com | password |

**Nota**: Todas las contraseñas están hasheadas con bcrypt. La contraseña real es "password" (hash: `$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi`)

## 📈 Vistas SQL Disponibles y Cómo Funcionan

### 🔍 Explicación Técnica de las Vistas

Las vistas SQL son consultas pre-definidas que simplifican el acceso a datos complejos. Aquí está cómo cada vista genera sus datos:

#### 1. **vw_dashboard_summary** - Resumen Estadístico General
```sql
-- Cuenta totales de artistas, álbumes, canciones, usuarios, playlists y likes
SELECT 
    COUNT(DISTINCT artist_id) as total_artists,
    COUNT(DISTINCT album_id) as total_albums,
    COUNT(DISTINCT song_id) as total_songs,
    COUNT(DISTINCT user_id) as total_users,
    COUNT(DISTINCT playlist_id) as total_playlists,
    COUNT(DISTINCT like_id) as total_likes
FROM [tablas correspondientes]
```
**Uso**: Dashboard principal con estadísticas en tiempo real

#### 2. **vw_genre_popularity_timeline** - Evolución de Géneros
```sql
-- Agrupa canciones por género y año de lanzamiento
SELECT 
    g.name as genre_name,
    YEAR(al.release_date) as year,
    COUNT(DISTINCT s.song_id) as song_count
FROM songs s
JOIN albums al ON s.album_id = al.album_id
JOIN song_genres sg ON s.song_id = sg.song_id
JOIN genres g ON sg.genre_id = g.genre_id
GROUP BY g.name, YEAR(al.release_date)
```
**Uso**: Gráfico de líneas mostrando popularidad de géneros a través del tiempo

#### 3. **vw_artist_popularity_by_country** - Distribución Geográfica
```sql
-- Cuenta artistas por país con sus canciones totales
SELECT 
    ar.country,
    COUNT(DISTINCT ar.artist_id) as artist_count,
    COUNT(DISTINCT s.song_id) as total_songs
FROM artists ar
LEFT JOIN albums al ON ar.artist_id = al.artist_id
LEFT JOIN songs s ON al.album_id = s.album_id
GROUP BY ar.country
```
**Uso**: Mapa interactivo con círculos proporcionales al número de artistas

#### 4. **vw_artist_collaboration_network** - Red de Colaboración
```sql
-- Encuentra artistas que comparten géneros (colaboraciones indirectas)
SELECT 
    a1.artist_id as artist1_id,
    a1.name as artist1_name,
    a2.artist_id as artist2_id,
    a2.name as artist2_name,
    COUNT(DISTINCT sg1.genre_id) as shared_genres
FROM artists a1
JOIN albums al1 ON a1.artist_id = al1.artist_id
JOIN songs s1 ON al1.album_id = s1.album_id
JOIN song_genres sg1 ON s1.song_id = sg1.song_id
JOIN song_genres sg2 ON sg1.genre_id = sg2.genre_id
JOIN songs s2 ON sg2.song_id = s2.song_id
JOIN albums al2 ON s2.album_id = al2.album_id
JOIN artists a2 ON al2.artist_id = a2.artist_id
WHERE a1.artist_id < a2.artist_id
GROUP BY a1.artist_id, a2.artist_id
```
**Uso**: Diagrama de red con D3.js (nodos = géneros, conexiones = canciones compartidas)

#### 5. **vw_music_success_prediction** - Predicción de Éxito
```sql
-- Calcula un score de éxito basado en likes, playlists y popularidad
SELECT 
    s.song_id,
    s.title as song_title,
    ar.name as artist_name,
    COUNT(DISTINCT l.like_id) as like_count,
    COUNT(DISTINCT ps.playlist_id) as playlist_count,
    (COUNT(DISTINCT l.like_id) * 2 + COUNT(DISTINCT ps.playlist_id) * 3) as success_score
FROM songs s
JOIN albums al ON s.album_id = al.album_id
JOIN artists ar ON al.artist_id = ar.artist_id
LEFT JOIN likes l ON s.song_id = l.song_id
LEFT JOIN playlist_songs ps ON s.song_id = ps.song_id
GROUP BY s.song_id
ORDER BY success_score DESC
```
**Uso**: Gráfico de barras con predicción de éxito (likes × 2 + playlists × 3)

#### 6. **vw_genre_correlations_by_era** - Correlaciones de Géneros
```sql
-- Encuentra géneros que aparecen juntos en las mismas canciones
SELECT 
    g1.name as genre1_name,
    g2.name as genre2_name,
    COUNT(DISTINCT sg1.song_id) as co_occurrence_count
FROM song_genres sg1
JOIN song_genres sg2 ON sg1.song_id = sg2.song_id AND sg1.genre_id < sg2.genre_id
JOIN genres g1 ON sg1.genre_id = g1.genre_id
JOIN genres g2 ON sg2.genre_id = g2.genre_id
GROUP BY g1.genre_id, g2.genre_id
ORDER BY co_occurrence_count DESC
```
**Uso**: Matriz de correlación mostrando qué géneros se combinan frecuentemente

#### 7. **vw_popularity_trends_by_decade** - Tendencias por Década
```sql
-- Agrupa lanzamientos por década
SELECT 
    FLOOR(YEAR(al.release_date) / 10) * 10 as decade,
    COUNT(DISTINCT al.album_id) as album_count,
    COUNT(DISTINCT s.song_id) as song_count
FROM albums al
LEFT JOIN songs s ON al.album_id = s.album_id
GROUP BY decade
ORDER BY decade
```
**Uso**: Timeline histórico mostrando evolución de la industria musical

#### 8. **vw_artist_centrality_analysis** - Análisis de Influencia
```sql
-- Calcula la "centralidad" de artistas basada en conexiones
SELECT 
    ar.artist_id,
    ar.name as artist_name,
    COUNT(DISTINCT al.album_id) as album_count,
    COUNT(DISTINCT s.song_id) as song_count,
    COUNT(DISTINCT sg.genre_id) as genre_diversity
FROM artists ar
LEFT JOIN albums al ON ar.artist_id = al.artist_id
LEFT JOIN songs s ON al.album_id = s.album_id
LEFT JOIN song_genres sg ON s.song_id = sg.song_id
GROUP BY ar.artist_id
ORDER BY genre_diversity DESC, song_count DESC
```
**Uso**: Identificar artistas más influyentes por diversidad de géneros

#### 9. **vw_genre_heatmap_by_region_era** - Mapa de Calor Geográfico
```sql
-- Combina país, género y época para análisis geográfico-temporal
SELECT 
    ar.country,
    g.name as genre_name,
    FLOOR(YEAR(al.release_date) / 10) * 10 as decade,
    COUNT(DISTINCT s.song_id) as song_count
FROM artists ar
JOIN albums al ON ar.artist_id = al.artist_id
JOIN songs s ON al.album_id = s.album_id
JOIN song_genres sg ON s.song_id = sg.song_id
JOIN genres g ON sg.genre_id = g.genre_id
GROUP BY ar.country, g.genre_id, decade
```
**Uso**: Visualización de calor mostrando qué géneros dominan por región y época

#### 10. **vw_album_participation_breakdown** - Análisis de Álbumes
```sql
-- Desglose detallado de participación en álbumes
SELECT 
    al.album_id,
    al.title as album_title,
    ar.name as artist_name,
    COUNT(DISTINCT s.song_id) as total_songs,
    AVG(s.duration) as avg_song_duration
FROM albums al
JOIN artists ar ON al.artist_id = ar.artist_id
LEFT JOIN songs s ON al.album_id = s.album_id
GROUP BY al.album_id
```
**Uso**: Análisis de estructura y composición de álbumes

### 🎯 Endpoints de Analytics Adicionales

Además de las vistas SQL, el sistema incluye endpoints personalizados:

#### **GET /api/analytics/genre-network**
```javascript
// Genera datos para el diagrama de red de géneros
{
  "nodes": [
    { "genre_id": 1, "genre_name": "Rock", "artist_count": 40 }
  ],
  "links": [
    { "source_genre_id": 1, "target_genre_id": 2, "connection_strength": 10 }
  ]
}
```
**Visualización**: Diagrama de red interactivo con D3.js
- **Nodos**: Géneros (tamaño = cantidad de canciones)
- **Conexiones**: Canciones que comparten ambos géneros (grosor = cantidad)
- **Interactividad**: Arrastrar, zoom, tooltips

#### **GET /api/analytics/low-success-songs**
```javascript
// Canciones con menor engagement (necesitan promoción)
SELECT * FROM songs 
WHERE success_score < threshold
ORDER BY success_score ASC
```

#### **GET /api/analytics/top-liked-songs?limit=10**
```javascript
// Top canciones con más likes
SELECT s.*, COUNT(l.like_id) as like_count
FROM songs s
LEFT JOIN likes l ON s.song_id = l.song_id
GROUP BY s.song_id
ORDER BY like_count DESC
LIMIT ?
```

#### **GET /api/analytics/top-rated-albums?limit=15**
```javascript
// Álbumes mejor calificados por engagement
SELECT al.*, 
       COUNT(DISTINCT l.like_id) as total_likes,
       COUNT(DISTINCT ps.playlist_id) as playlist_appearances
FROM albums al
JOIN songs s ON al.album_id = s.album_id
LEFT JOIN likes l ON s.song_id = l.song_id
LEFT JOIN playlist_songs ps ON s.song_id = ps.song_id
GROUP BY al.album_id
ORDER BY (total_likes + playlist_appearances) DESC
```

### 📊 Tecnologías de Visualización

1. **Chart.js**: Gráficos de barras, líneas, y radar
2. **Leaflet.js**: Mapas interactivos con marcadores
3. **D3.js**: Diagrama de red de géneros con física de fuerzas
4. **Bootstrap**: Layout responsive y componentes UI

### 🔄 Flujo de Datos

```
[MySQL Database] 
    ↓ (SQL Views)
[Backend API (Express.js)]
    ↓ (REST Endpoints)
[Frontend (JavaScript)]
    ↓ (Chart.js / D3.js / Leaflet)
[Visualizaciones Interactivas]
```

## 🔧 Tecnologías Utilizadas

### Backend
- Node.js
- Express.js
- MySQL2
- bcryptjs (encriptación de contraseñas)
- jsonwebtoken (autenticación JWT)
- express-validator (validación de datos)
- cors (manejo de CORS)
- dotenv (variables de entorno)

### Frontend
- HTML5
- CSS3 (Bootstrap 5)
- JavaScript (Vanilla)
- Chart.js (gráficos de barras, líneas, radar)
- D3.js v7 (diagrama de red interactivo)
- Leaflet.js (mapas geográficos)
- Bootstrap Icons

### Base de Datos
- MySQL 8.0+

## 📁 Estructura del Proyecto

```
music-database/
├── backend/
│   ├── routes/
│   │   └── analytics.js
│   ├── .env
│   ├── server.js
│   ├── package.json
│   └── package-lock.json
├── frontend/
│   ├── index.html
│   ├── analytics.html
│   └── analytics.js
├── database/
│   ├── schema.sql
│   ├── views.sql
│   └── seed.sql
└── README.md
```

## 🎯 Casos de Uso

### 1. Análisis de Tendencias
Visualiza cómo han evolucionado los géneros musicales a lo largo de las décadas.

### 2. Descubrimiento de Conexiones
Identifica artistas que comparten géneros y estilos similares.

### 3. Predicción de Éxito
Utiliza datos históricos para predecir qué canciones tienen mayor potencial de éxito.

### 4. Análisis Geográfico
Explora la distribución de artistas y géneros por país y región.

### 5. Identificación de Influencers
Encuentra los artistas más influyentes en la industria musical.

## 📖 Guía de Uso

### Para Usuarios Finales

#### 1️⃣ **Registro e Inicio de Sesión**
1. Abre `http://localhost:8000/index.html`
2. Haz clic en "Register" en la esquina superior derecha
3. Completa el formulario de registro
4. Inicia sesión con tus credenciales

#### 2️⃣ **Explorar Música**
- **Página Principal**: 
  - 🎠 Carrusel automático con álbumes destacados
  - 🔥 Trending Now: Top 5 canciones más populares
  - ⭐ Top 6 géneros musicales
  - 📊 Estadísticas en tiempo real
- **Ver Artistas**: Navega a la sección "Artists" para ver todos los artistas
- **Ver Álbumes**: Navega a "Albums" para explorar la discografía completa
- **Ver Detalles**: Haz clic en "View Profile" o "View Album" para ver información detallada
- **Buscar**: Usa la barra de búsqueda para encontrar artistas, álbumes o canciones

#### 3️⃣ **Gestionar Playlists**
1. Ve a la sección "Playlists"
2. Haz clic en "Create Playlist"
3. Ingresa nombre y descripción
4. Marca si quieres que sea pública o privada
5. Navega a un álbum y haz clic en el botón "+" junto a una canción
6. Selecciona la playlist donde quieres agregarla
7. Haz clic en "View Playlist" para ver todas las canciones

#### 4️⃣ **Dar Like a Canciones**
1. Ve a cualquier álbum
2. Haz clic en el botón ❤️ junto a una canción
3. La canción se agregará a tus favoritos

#### 5️⃣ **Explorar Analytics**
1. Ve a la sección "Analytics" en el menú
2. Explora las diferentes visualizaciones:
   - **Dashboard de Resumen**: Estadísticas generales (artistas, álbumes, canciones, likes)
   - **Popularidad de Géneros**: Gráfico de barras con los géneros más populares
   - **Artistas por País**: Mapa interactivo con distribución geográfica
   - **Red de Géneros Musicales**: Diagrama de red interactivo (arrastra nodos, haz zoom)
   - **Predicción de Éxito**: Canciones con mayor potencial basado en likes y playlists
   - **Canciones con Menor Éxito**: Identificar canciones que necesitan promoción
   - **Timeline de Lanzamientos**: Evolución histórica por década
   - **Top Canciones Más Likeadas**: Ranking de favoritos (selector de top 10/20/30)
   - **Álbumes Mejor Calificados**: Top álbumes por rating (selector de top 10/15/20)
   - **Distribución de Géneros por Década**: Gráfico de pastel interactivo con selector de década (1960s-2020s)

#### 6️⃣ **Reproducir Música**
1. Navega a cualquier álbum
2. Haz clic en el botón ▶️ junto a una canción
3. El reproductor se activará en la parte inferior
4. Controla la reproducción con play/pause y barra de progreso

### Para Desarrolladores

#### Agregar Nuevos Artistas
```javascript
POST /api/artists
{
  "name": "Nombre del Artista",
  "country": "País",
  "formation_year": 2000,
  "bio": "Biografía del artista"
}
```

#### Agregar Nuevos Álbumes
```javascript
POST /api/albums
{
  "title": "Título del Álbum",
  "artist_id": 1,
  "release_date": "2024-01-01",
  "description": "Descripción del álbum"
}
```

#### Crear Playlist
```javascript
POST /api/playlists
Headers: { Authorization: "Bearer <token>" }
{
  "name": "Mi Playlist",
  "description": "Descripción",
  "is_public": true
}
```

#### Agregar Canción a Playlist
```javascript
POST /api/playlists/:id/songs
Headers: { Authorization: "Bearer <token>" }
{
  "song_id": 1
}
```

## 🐛 Solución de Problemas

### Error de conexión a la base de datos
```bash
# Verificar que MySQL esté corriendo
sudo service mysql status

# Verificar credenciales en .env
cat backend/.env
```

### Error CORS en el frontend
```javascript
// Verificar que el backend tenga CORS habilitado
// En server.js debe estar:
app.use(cors({ origin: '*' }));
```

### Las vistas no se cargan
```sql
-- Verificar que las vistas existan
SHOW FULL TABLES IN mudb WHERE TABLE_TYPE LIKE 'VIEW';

-- Recrear vistas si es necesario
source database/views.sql
```

## 📝 Notas Adicionales

- Los datos de seed incluyen artistas reales con información histórica precisa
- Las visualizaciones se actualizan en tiempo real según los datos de la base de datos
- El sistema está diseñado para ser escalable y fácil de extender
- Se recomienda usar MySQL 8.0 o superior para mejor rendimiento

## 🤝 Contribuciones

Este es un proyecto educativo. Siéntete libre de:
- Agregar más artistas y canciones
- Crear nuevas visualizaciones
- Mejorar los algoritmos de predicción
- Optimizar las consultas SQL

## 🎨 Características Destacadas

### 🏠 Página Principal Mejorada
- ✨ **Carrusel de Álbumes Destacados**: Navegación automática con los 5 álbumes más recientes
- 🔥 **Trending Now**: Top 5 canciones más populares con likes en tiempo real
- ⭐ **Top Géneros**: Los 6 géneros musicales más populares con badges coloridos
- 📊 **Estadísticas en Vivo**: Contadores de artistas, álbumes, canciones, usuarios y playlists
- 🎤 **Artistas Populares**: Top 4 artistas con más canciones
- 💿 **Álbumes Recientes**: Últimos 4 álbumes agregados
- 🔍 **Búsqueda Inteligente**: Busca en artistas, álbumes y canciones simultáneamente

### 📊 Visualizaciones Analytics Avanzadas
- 📈 **Gráficos Interactivos**: Visualizaciones dinámicas con Chart.js
- 🌍 **Distribución Geográfica**: Mapas de calor por región y país
- 🔗 **Red de Colaboración**: Conexiones entre artistas por géneros compartidos
- 🏆 **Predicción de Éxito**: Algoritmo que predice el éxito basado en likes, playlists y popularidad
- 📉 **Tendencias Temporales**: Evolución de géneros a lo largo del tiempo

### 🎵 Gestión Musical Completa
- 📝 **Playlists Personalizadas**: Crea, edita y comparte playlists públicas o privadas
- ❤️ **Sistema de Likes**: Dale like a tus canciones favoritas
- ➕ **Agregar a Playlist**: Un clic para agregar canciones a cualquier playlist
- 🎧 **Reproductor Integrado**: Control de reproducción con play/pause y barra de progreso
- 🖼️ **Imágenes de Alta Calidad**: Portadas de álbumes y fotos de artistas desde Unsplash

## 🛠️ Tecnologías Utilizadas

### Backend
- **Node.js** v18+
- **Express.js** - Framework web
- **MySQL2** - Driver de base de datos
- **bcryptjs** - Encriptación de contraseñas
- **jsonwebtoken** - Autenticación JWT
- **express-validator** - Validación de datos
- **cors** - Manejo de CORS
- **dotenv** - Variables de entorno

### Frontend
- **HTML5** - Estructura
- **CSS3** - Estilos (Bootstrap 5)
- **JavaScript** (Vanilla) - Lógica del cliente
- **Chart.js** - Visualizaciones de datos
- **Bootstrap 5** - Framework CSS
- **Bootstrap Icons** - Iconografía

### Base de Datos
- **MySQL 8.0+** - Sistema de gestión de base de datos
- **10 Vistas SQL** - Para análisis avanzados
- **Índices optimizados** - Para mejor rendimiento

## 🚀 Características Técnicas

### Seguridad
- ✅ Contraseñas hasheadas con bcrypt (10 rounds)
- ✅ Autenticación JWT con tokens de 24 horas
- ✅ Validación de datos en backend con express-validator
- ✅ Protección contra SQL injection con consultas parametrizadas
- ✅ CORS configurado para desarrollo

### Rendimiento
- ✅ Pool de conexiones a base de datos (10 conexiones)
- ✅ Índices en columnas frecuentemente consultadas
- ✅ Consultas optimizadas con JOINs eficientes
- ✅ Vistas materializadas para análisis complejos

### Escalabilidad
- ✅ Arquitectura modular y separada (frontend/backend)
- ✅ API RESTful bien estructurada
- ✅ Fácil de extender con nuevas funcionalidades
- ✅ Preparado para agregar más tablas y relaciones

## 📈 Roadmap Futuro

### ✅ Completado
- [x] Sistema de autenticación JWT
- [x] Gestión de playlists
- [x] Sistema de likes
- [x] Carrusel de álbumes destacados
- [x] Sección Trending Now
- [x] Imágenes de alta calidad para álbumes y artistas
- [x] ~500 canciones en la base de datos
- [x] Reproductor de música básico
- [x] Búsqueda avanzada
- [x] Analytics con visualizaciones interactivas

### 🚧 En Progreso
- [ ] Mejorar el reproductor de audio con más controles
- [ ] Agregar sistema de comentarios y reseñas
- [ ] Implementar filtros avanzados en búsqueda

### 🔮 Futuro
- [ ] Sistema de recomendaciones basado en ML
- [ ] Notificaciones en tiempo real
- [ ] Soporte para subir archivos de audio
- [ ] Sistema de seguimiento de artistas
- [ ] Modo oscuro
- [ ] Aplicación móvil con React Native
- [ ] Caché con Redis
- [ ] Integración con Spotify API
- [ ] Sistema de radio personalizada
- [ ] Letras de canciones integradas

## 👨‍💻 Contribuciones

Este es un proyecto educativo. Siéntete libre de:
- ⭐ Dar una estrella al repositorio
- 🐛 Reportar bugs
- 💡 Sugerir nuevas funcionalidades
- 🔧 Hacer pull requests
- 📖 Mejorar la documentación

## 📊 Estadísticas del Proyecto

```
📁 Estructura del Proyecto
├── 🗄️  Base de Datos
│   ├── 50 Artistas
│   ├── 50 Álbumes con portadas
│   ├── ~500 Canciones
│   ├── 20 Géneros musicales
│   ├── 10 Vistas SQL avanzadas
│   └── 4 Usuarios de prueba
│
├── 🔧 Backend (Node.js + Express)
│   ├── 30+ Endpoints API
│   ├── Autenticación JWT
│   ├── Validación de datos
│   └── Pool de conexiones MySQL
│
├── 🎨 Frontend (HTML + CSS + JS)
│   ├── Carrusel de álbumes
│   ├── Trending section
│   ├── Sistema de búsqueda
│   ├── Gestión de playlists
│   ├── Reproductor de música
│   └── Página de Analytics
│
└── 📊 Analytics
    ├── 4 Visualizaciones principales
    ├── Gráficos interactivos
    ├── Predicción de éxito
    └── Red de colaboración
```

## 📄 Licencia

Este proyecto es de código abierto y está disponible bajo la licencia MIT.

## 📞 Soporte

Para problemas o preguntas:
1. Revisa la sección de **Solución de Problemas**
2. Verifica los **logs del servidor backend**
3. Inspecciona la **consola del navegador** para errores del frontend
4. Revisa la **documentación de la API**

## 🙏 Agradecimientos

- **The Beatles, Pink Floyd, Queen** y todos los artistas incluidos en los datos de ejemplo
- **Bootstrap** por el framework CSS
- **Chart.js** por las visualizaciones
- **Unsplash** por las imágenes de alta calidad
- **MySQL** por el sistema de base de datos
- **Node.js** y **Express.js** por el backend robusto

---

<div align="center">

### 🎵 **¡Disfruta explorando la música!** 🎵

</div>

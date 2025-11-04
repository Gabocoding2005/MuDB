const API_BASE_URL = 'http://localhost:3000/api';
let genreChart, successChart, map;

// Coordenadas aproximadas de países
const countryCoordinates = {
    'United States': [37.0902, -95.7129],
    'United Kingdom': [55.3781, -3.4360],
    'Canada': [56.1304, -106.3468],
    'Australia': [-25.2744, 133.7751],
    'Germany': [51.1657, 10.4515],
    'France': [46.2276, 2.2137],
    'Spain': [40.4637, -3.7492],
    'Italy': [41.8719, 12.5674],
    'Japan': [36.2048, 138.2529],
    'South Korea': [35.9078, 127.7669],
    'Brazil': [-14.2350, -51.9253],
    'Mexico': [23.6345, -102.5528],
    'Argentina': [-38.4161, -63.6167],
    'Sweden': [60.1282, 18.6435],
    'Norway': [60.4720, 8.4689],
    'Netherlands': [52.1326, 5.2913],
    'Belgium': [50.5039, 4.4699],
    'Switzerland': [46.8182, 8.2275],
    'Austria': [47.5162, 14.5501],
    'Denmark': [56.2639, 9.5018],
    'Finland': [61.9241, 25.7482],
    'Poland': [51.9194, 19.1451],
    'Russia': [61.5240, 105.3188],
    'China': [35.8617, 104.1954],
    'India': [20.5937, 78.9629],
    'Jamaica': [18.1096, -77.2975],
    'Ireland': [53.4129, -8.2439],
    'Portugal': [39.3999, -8.2245],
    'Greece': [39.0742, 21.8243],
    'Turkey': [38.9637, 35.2433],
    'South Africa': [-30.5595, 22.9375],
    'New Zealand': [-40.9006, 174.8860],
    'Iceland': [64.9631, -19.0208],
    'Colombia': [4.5709, -74.2973],
    'Chile': [-35.6751, -71.5430],
    'Peru': [-9.1900, -75.0152],
    'Venezuela': [6.4238, -66.5897],
    'Cuba': [21.5218, -77.7812],
    'Puerto Rico': [18.2208, -66.5901]
};

async function loadDashboardSummary() {
    try {
        const response = await fetch(`${API_BASE_URL}/analytics/dashboard-summary`);
        const result = await response.json();
        if (result.success) {
            document.getElementById('totalArtists').textContent = result.data.total_artists || 0;
            document.getElementById('totalAlbums').textContent = result.data.total_albums || 0;
            document.getElementById('totalSongs').textContent = result.data.total_songs || 0;
            document.getElementById('totalLikes').textContent = result.data.total_likes || 0;
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

async function loadGenrePopularity() {
    try {
        const response = await fetch(`${API_BASE_URL}/analytics/genre-popularity-timeline`);
        const result = await response.json();
        if (result.success && result.data.length > 0) {
            const genres = [...new Set(result.data.map(d => d.genre_name))];
            const years = [...new Set(result.data.map(d => d.year))].sort();
            const datasets = genres.slice(0, 5).map((genre, index) => {
                const genreData = result.data.filter(d => d.genre_name === genre);
                const data = years.map(year => {
                    const item = genreData.find(d => d.year === year);
                    return item ? item.song_count : 0;
                });
                const colors = ['rgb(255, 99, 132)', 'rgb(54, 162, 235)', 'rgb(255, 206, 86)', 'rgb(75, 192, 192)', 'rgb(153, 102, 255)'];
                return {
                    label: genre,
                    data: data,
                    borderColor: colors[index],
                    backgroundColor: colors[index] + '33',
                    tension: 0.4
                };
            });
            const ctx = document.getElementById('genreChart').getContext('2d');
            if (genreChart) genreChart.destroy();
            genreChart = new Chart(ctx, {
                type: 'line',
                data: { labels: years, datasets: datasets },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { position: 'top' } },
                    scales: { y: { beginAtZero: true } }
                }
            });
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

async function loadCountryMap() {
    try {
        const response = await fetch(`${API_BASE_URL}/analytics/artist-popularity-by-country`);
        const result = await response.json();
        
        if (result.success && result.data.length > 0) {
            // Inicializar el mapa
            if (map) {
                map.remove();
            }
            
            map = L.map('map').setView([20, 0], 2);
            
            // Agregar capa de mapa
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '© OpenStreetMap contributors',
                maxZoom: 18
            }).addTo(map);
            
            // Procesar datos por país
            const countryData = {};
            result.data.forEach(item => {
                if (!countryData[item.country]) {
                    countryData[item.country] = { artists: 0 };
                }
                countryData[item.country].artists += item.artist_count;
            });
            
            // Encontrar el máximo para escalar los círculos
            const maxArtists = Math.max(...Object.values(countryData).map(d => d.artists));
            
            // Agregar círculos al mapa
            Object.entries(countryData).forEach(([country, data]) => {
                const coords = countryCoordinates[country];
                if (coords) {
                    // Calcular el radio proporcional (mínimo 5, máximo 40)
                    const radius = Math.max(5, (data.artists / maxArtists) * 40) * 10000;
                    
                    const circle = L.circle(coords, {
                        color: '#667eea',
                        fillColor: '#667eea',
                        fillOpacity: 0.5,
                        radius: radius
                    }).addTo(map);
                    
                    // Agregar popup con información
                    circle.bindPopup(`
                        <div style="text-align: center;">
                            <strong>${country}</strong><br>
                            <span style="font-size: 1.5em; color: #667eea;">${data.artists}</span><br>
                            <small>artistas</small>
                        </div>
                    `);
                    
                    // Mostrar popup al pasar el mouse
                    circle.on('mouseover', function() {
                        this.openPopup();
                    });
                }
            });
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

async function loadArtistNetwork() {
    try {
        console.log('Loading genre network...');
        
        // Verificar que D3 esté disponible
        if (typeof d3 === 'undefined') {
            console.error('D3.js no está cargado');
            document.getElementById('networkGraph').innerHTML = '<div class="alert alert-danger">Error: D3.js no se cargó correctamente. Por favor recarga la página.</div>';
            return;
        }
        
        const response = await fetch(`${API_BASE_URL}/analytics/genre-network`);
        const result = await response.json();
        
        console.log('Genre network data:', result);
        
        if (result.success && result.data) {
            if (result.data.nodes && result.data.nodes.length > 0) {
                createGenreNetworkDiagram(result.data);
            } else {
                document.getElementById('networkGraph').innerHTML = '<div class="alert alert-info">No hay datos de géneros disponibles.</div>';
            }
        } else {
            document.getElementById('networkGraph').innerHTML = '<div class="alert alert-warning">No se pudieron cargar los datos de la red de géneros.</div>';
        }
    } catch (error) {
        console.error('Error loading genre network:', error);
        document.getElementById('networkGraph').innerHTML = '<div class="alert alert-danger">Error al cargar la red de géneros: ' + error.message + '</div>';
    }
}

function createGenreNetworkDiagram(data) {
    try {
        console.log('Creating network diagram with data:', data);
        
        // Limpiar el contenedor
        const container = document.getElementById('networkGraph');
        container.innerHTML = '';
        
        const width = container.clientWidth;
        const height = 600;
        
        console.log('Container dimensions:', width, height);
    
    // Crear SVG
    const svg = d3.select('#networkGraph')
        .append('svg')
        .attr('width', width)
        .attr('height', height);
    
    // Crear grupo para zoom
    const g = svg.append('g');
    
    // Configurar zoom
    const zoom = d3.zoom()
        .scaleExtent([0.3, 3])
        .on('zoom', (event) => {
            g.attr('transform', event.transform);
        });
    
    svg.call(zoom);
    
    // Preparar datos para D3
    const nodes = data.nodes.map(d => ({
        id: d.genre_id,
        name: d.genre_name,
        value: d.artist_count
    }));
    
    const links = data.links.map(d => ({
        source: d.source_genre_id,
        target: d.target_genre_id,
        value: d.connection_strength
    }));
    
    // Escala de colores
    const colorScale = d3.scaleOrdinal(d3.schemeCategory10);
    
    // Escala de tamaño de nodos (basado en cantidad de artistas)
    const radiusScale = d3.scaleSqrt()
        .domain([0, d3.max(nodes, d => d.value)])
        .range([8, 30]);
    
    // Escala de grosor de líneas (basado en fuerza de conexión)
    const linkWidthScale = d3.scaleLinear()
        .domain([0, d3.max(links, d => d.value)])
        .range([1, 5]);
    
    // Crear simulación de fuerzas
    const simulation = d3.forceSimulation(nodes)
        .force('link', d3.forceLink(links).id(d => d.id).distance(100))
        .force('charge', d3.forceManyBody().strength(-300))
        .force('center', d3.forceCenter(width / 2, height / 2))
        .force('collision', d3.forceCollide().radius(d => radiusScale(d.value) + 5));
    
    // Crear las líneas (conexiones)
    const link = g.append('g')
        .selectAll('line')
        .data(links)
        .enter().append('line')
        .attr('class', 'link')
        .attr('stroke-width', d => linkWidthScale(d.value))
        .attr('stroke', '#999')
        .attr('stroke-opacity', 0.6);
    
    // Crear los nodos
    const node = g.append('g')
        .selectAll('g')
        .data(nodes)
        .enter().append('g')
        .attr('class', 'node')
        .call(d3.drag()
            .on('start', dragstarted)
            .on('drag', dragged)
            .on('end', dragended));
    
    // Círculos de los nodos
    node.append('circle')
        .attr('r', d => radiusScale(d.value))
        .attr('fill', (d, i) => colorScale(i))
        .attr('stroke', '#fff')
        .attr('stroke-width', 2);
    
    // Etiquetas de los nodos
    node.append('text')
        .text(d => d.name)
        .attr('x', 0)
        .attr('y', d => radiusScale(d.value) + 15)
        .attr('text-anchor', 'middle')
        .attr('font-size', '11px')
        .attr('font-weight', '600')
        .attr('fill', '#333');
    
    // Tooltip
    node.append('title')
        .text(d => `${d.name}\nCanciones: ${d.value}`);
    
    link.append('title')
        .text(d => `Canciones compartidas: ${d.value}`);
    
    // Actualizar posiciones en cada tick de la simulación
    simulation.on('tick', () => {
        link
            .attr('x1', d => d.source.x)
            .attr('y1', d => d.source.y)
            .attr('x2', d => d.target.x)
            .attr('y2', d => d.target.y);
        
        node.attr('transform', d => `translate(${d.x},${d.y})`);
    });
    
    // Funciones de drag
    function dragstarted(event, d) {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
    }
    
    function dragged(event, d) {
        d.fx = event.x;
        d.fy = event.y;
    }
    
    function dragended(event, d) {
        if (!event.active) simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
    }
    } catch (error) {
        console.error('Error creating network diagram:', error);
        document.getElementById('networkGraph').innerHTML = '<div class="alert alert-danger">Error al crear el diagrama: ' + error.message + '</div>';
    }
}

async function loadSuccessPrediction() {
    try {
        const response = await fetch(`${API_BASE_URL}/analytics/music-success-prediction?limit=20`);
        const result = await response.json();
        if (result.success && result.data.length > 0) {
            const labels = result.data.slice(0, 10).map(d => d.song_title);
            const scores = result.data.slice(0, 10).map(d => d.success_score);
            const ctx = document.getElementById('successChart').getContext('2d');
            if (successChart) successChart.destroy();
            successChart = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: labels,
                    datasets: [{
                        label: 'Score',
                        data: scores,
                        backgroundColor: 'rgba(75, 192, 192, 0.5)',
                        borderColor: 'rgb(75, 192, 192)',
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    indexAxis: 'y',
                    plugins: { legend: { display: false } },
                    scales: { x: { beginAtZero: true } }
                }
            });
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

// Nuevas funciones con manejo de errores
async function loadLowSuccessSongs() {
    try {
        const response = await fetch(`${API_BASE_URL}/analytics/low-success-songs?limit=15`);
        const result = await response.json();
        if (result.success && result.data.length > 0) {
            const labels = result.data.map(d => d.song_title);
            const scores = result.data.map(d => d.success_score);
            const ctx = document.getElementById('lowSuccessChart');
            if (!ctx) return;
            const chart = new Chart(ctx.getContext('2d'), {
                type: 'bar',
                data: {
                    labels: labels,
                    datasets: [{
                        label: 'Score de Éxito',
                        data: scores,
                        backgroundColor: 'rgba(255, 99, 132, 0.5)',
                        borderColor: 'rgb(255, 99, 132)',
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    indexAxis: 'y',
                    plugins: { legend: { display: false } },
                    scales: { x: { beginAtZero: true } }
                }
            });
        }
    } catch (error) {
        console.error('Error loading low success songs:', error);
    }
}

async function loadReleasesTimeline() {
    try {
        const response = await fetch(`${API_BASE_URL}/analytics/releases-timeline`);
        const result = await response.json();
        if (result.success && result.data.length > 0) {
            const years = result.data.map(d => d.year);
            const albums = result.data.map(d => d.album_count);
            const songs = result.data.map(d => d.song_count);
            const ctx = document.getElementById('timelineChart');
            if (!ctx) return;
            new Chart(ctx.getContext('2d'), {
                type: 'line',
                data: {
                    labels: years,
                    datasets: [
                        {
                            label: 'Álbumes',
                            data: albums,
                            borderColor: 'rgb(54, 162, 235)',
                            backgroundColor: 'rgba(54, 162, 235, 0.1)',
                            tension: 0.4,
                            fill: true
                        },
                        {
                            label: 'Canciones',
                            data: songs,
                            borderColor: 'rgb(255, 99, 132)',
                            backgroundColor: 'rgba(255, 99, 132, 0.1)',
                            tension: 0.4,
                            fill: true
                        }
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { position: 'top' } },
                    scales: { y: { beginAtZero: true } }
                }
            });
        }
    } catch (error) {
        console.error('Error loading timeline:', error);
    }
}

async function loadTopLikedSongs(limit = 10) {
    try {
        const response = await fetch(`${API_BASE_URL}/analytics/top-liked-songs?limit=${limit}`);
        const result = await response.json();
        if (result.success && result.data.length > 0) {
            const labels = result.data.map(d => `${d.song_title} - ${d.artist_name}`);
            const likes = result.data.map(d => d.total_likes);
            const ctx = document.getElementById('topLikedChart');
            if (!ctx) return;
            new Chart(ctx.getContext('2d'), {
                type: 'bar',
                data: {
                    labels: labels,
                    datasets: [{
                        label: 'Likes',
                        data: likes,
                        backgroundColor: 'rgba(255, 99, 132, 0.6)',
                        borderColor: 'rgb(255, 99, 132)',
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    indexAxis: 'y',
                    plugins: { legend: { display: false } },
                    scales: { x: { beginAtZero: true } }
                }
            });
        }
    } catch (error) {
        console.error('Error loading top liked songs:', error);
    }
}

async function loadTopRatedAlbums(limit = 15) {
    try {
        const response = await fetch(`${API_BASE_URL}/analytics/top-rated-albums?limit=${limit}`);
        const result = await response.json();
        if (result.success && result.data.length > 0) {
            const labels = result.data.map(d => `${d.album_title} - ${d.artist_name}`);
            const ratings = result.data.map(d => d.avg_rating);
            const ctx = document.getElementById('topRatedChart');
            if (!ctx) return;
            new Chart(ctx.getContext('2d'), {
                type: 'bar',
                data: {
                    labels: labels,
                    datasets: [{
                        label: 'Rating Promedio',
                        data: ratings,
                        backgroundColor: 'rgba(255, 206, 86, 0.6)',
                        borderColor: 'rgb(255, 206, 86)',
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    indexAxis: 'y',
                    plugins: { legend: { display: false } },
                    scales: { x: { beginAtZero: true, max: 5 } }
                }
            });
        }
    } catch (error) {
        console.error('Error loading top rated albums:', error);
    }
}

let evolutionChart;
let genreEvolutionData = [];

async function loadGenreEvolution() {
    try {
        console.log('Loading genre evolution data...');
        const response = await fetch(`${API_BASE_URL}/analytics/genre-evolution-by-decade`);
        const result = await response.json();
        
        console.log('Genre evolution result:', result);
        
        if (result.success && result.data.length > 0) {
            genreEvolutionData = result.data;
            
            // Obtener décadas únicas y ordenarlas
            const decades = [...new Set(result.data.map(d => d.decade))].sort((a, b) => a - b);
            console.log('Decades found:', decades);
            
            // Poblar el selector de décadas
            const decadeFilter = document.getElementById('decadeFilter');
            if (decadeFilter) {
                // Limpiar opciones anteriores
                decadeFilter.innerHTML = '';
                
                // Agregar opciones de décadas
                decades.forEach(decade => {
                    const option = document.createElement('option');
                    option.value = decade;
                    option.textContent = `${decade}s`;
                    decadeFilter.appendChild(option);
                });
                
                // Seleccionar la década más reciente por defecto
                if (decades.length > 0) {
                    const latestDecade = decades[decades.length - 1];
                    decadeFilter.value = latestDecade;
                    console.log('Setting default decade to:', latestDecade);
                    updatePieChart(latestDecade);
                }
            }
        }
    } catch (error) {
        console.error('Error loading genre evolution:', error);
    }
}

function updatePieChart(selectedDecade) {
    console.log('updatePieChart called with decade:', selectedDecade);
    console.log('Total data available:', genreEvolutionData.length);
    
    // Convertir selectedDecade a número si viene como string
    const decadeNumber = typeof selectedDecade === 'string' ? parseInt(selectedDecade) : selectedDecade;
    
    // Filtrar datos por década seleccionada (comparar como números)
    const decadeData = genreEvolutionData.filter(d => {
        const dataDecade = typeof d.decade === 'string' ? parseInt(d.decade) : d.decade;
        return dataDecade === decadeNumber;
    });
    
    console.log('Filtered data for decade', decadeNumber, ':', decadeData);
    
    if (decadeData.length === 0) {
        console.log('No hay datos para la década:', decadeNumber);
        return;
    }
    
    // Preparar datos para el gráfico de pastel
    const labels = decadeData.map(d => d.genre_name);
    const data = decadeData.map(d => d.song_count);
    
    // Colores para el gráfico de pastel
    const backgroundColors = [
        'rgba(255, 99, 132, 0.8)',
        'rgba(54, 162, 235, 0.8)',
        'rgba(255, 206, 86, 0.8)',
        'rgba(75, 192, 192, 0.8)',
        'rgba(153, 102, 255, 0.8)',
        'rgba(255, 159, 64, 0.8)',
        'rgba(201, 203, 207, 0.8)',
        'rgba(83, 102, 255, 0.8)',
        'rgba(255, 99, 255, 0.8)',
        'rgba(99, 255, 132, 0.8)',
        'rgba(255, 180, 86, 0.8)',
        'rgba(180, 99, 255, 0.8)'
    ];
    
    const borderColors = [
        'rgb(255, 99, 132)',
        'rgb(54, 162, 235)',
        'rgb(255, 206, 86)',
        'rgb(75, 192, 192)',
        'rgb(153, 102, 255)',
        'rgb(255, 159, 64)',
        'rgb(201, 203, 207)',
        'rgb(83, 102, 255)',
        'rgb(255, 99, 255)',
        'rgb(99, 255, 132)',
        'rgb(255, 180, 86)',
        'rgb(180, 99, 255)'
    ];
    
    const ctx = document.getElementById('evolutionChart');
    if (!ctx) return;
    
    // Destruir gráfico anterior si existe
    if (evolutionChart) {
        evolutionChart.destroy();
    }
    
    // Crear nuevo gráfico de pastel
    evolutionChart = new Chart(ctx.getContext('2d'), {
        type: 'pie',
        data: {
            labels: labels,
            datasets: [{
                label: 'Canciones',
                data: data,
                backgroundColor: backgroundColors.slice(0, labels.length),
                borderColor: borderColors.slice(0, labels.length),
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'right',
                    labels: {
                        padding: 15,
                        font: { size: 12 }
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const label = context.label || '';
                            const value = context.parsed || 0;
                            const total = context.dataset.data.reduce((a, b) => a + b, 0);
                            const percentage = ((value / total) * 100).toFixed(1);
                            return `${label}: ${value} canciones (${percentage}%)`;
                        }
                    }
                },
                title: {
                    display: true,
                    text: `Distribución de Géneros en los ${decadeNumber}s`,
                    font: { size: 16 }
                }
            }
        }
    });
}

// Búsqueda de canciones
let searchTimeout;
const songSearchInput = document.getElementById('songSearch');
if (songSearchInput) {
    songSearchInput.addEventListener('input', function(e) {
        clearTimeout(searchTimeout);
        const query = e.target.value;
        if (query.length < 2) {
            document.getElementById('searchResults').innerHTML = '';
            return;
        }
        searchTimeout = setTimeout(async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/analytics/search-songs?q=${encodeURIComponent(query)}`);
                const result = await response.json();
                const resultsDiv = document.getElementById('searchResults');
                resultsDiv.innerHTML = '';
                if (result.success && result.data.length > 0) {
                    result.data.forEach(song => {
                        const item = document.createElement('a');
                        item.href = '#';
                        item.className = 'list-group-item list-group-item-action';
                        item.textContent = `${song.title} - ${song.artist_name}`;
                        item.onclick = (e) => {
                            e.preventDefault();
                            loadSongPrediction(song.song_id);
                            document.getElementById('songSearch').value = song.title;
                            resultsDiv.innerHTML = '';
                        };
                        resultsDiv.appendChild(item);
                    });
                }
            } catch (error) {
                console.error('Error:', error);
            }
        }, 300);
    });
}

async function loadSongPrediction(songId) {
    try {
        const response = await fetch(`${API_BASE_URL}/analytics/song-success-prediction/${songId}`);
        const result = await response.json();
        if (result.success && result.data) {
            const data = result.data;
            document.getElementById('predictionSongTitle').textContent = data.song_title;
            document.getElementById('predictionArtist').textContent = data.artist_name;
            document.getElementById('predictionScore').textContent = data.success_score;
            document.getElementById('predictionLikes').textContent = data.total_likes;
            document.getElementById('predictionPlaylists').textContent = data.playlist_appearances;
            document.getElementById('songPredictionResult').style.display = 'block';
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

// Event listeners para slicers
const topLikedLimit = document.getElementById('topLikedLimit');
if (topLikedLimit) {
    topLikedLimit.addEventListener('change', function(e) {
        loadTopLikedSongs(parseInt(e.target.value));
    });
}

const topRatedLimit = document.getElementById('topRatedLimit');
if (topRatedLimit) {
    topRatedLimit.addEventListener('change', function(e) {
        loadTopRatedAlbums(parseInt(e.target.value));
    });
}

// Event listener global para el selector de década usando delegación de eventos
document.addEventListener('change', function(e) {
    if (e.target && e.target.id === 'decadeFilter') {
        const selectedDecade = parseInt(e.target.value);
        console.log('Decade selector changed to:', selectedDecade);
        updatePieChart(selectedDecade);
    }
});

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadDashboardSummary();
    loadGenrePopularity();
    loadCountryMap();
    loadArtistNetwork();
    loadSuccessPrediction();
    
    // Cargar nuevas visualizaciones solo si los elementos existen
    setTimeout(() => {
        loadLowSuccessSongs();
        loadReleasesTimeline();
        loadTopLikedSongs();
        loadTopRatedAlbums();
        loadGenreEvolution();
    }, 1000);
});

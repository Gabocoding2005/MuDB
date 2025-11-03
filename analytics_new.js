const API_BASE_URL = 'http://localhost:3000/api';
let genreChart, successChart, map, lowSuccessChart, timelineChart, topLikedChart, topRatedChart, correlationChart, evolutionChart;

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
            if (map) {
                map.remove();
            }
            
            map = L.map('map').setView([20, 0], 2);
            
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '© OpenStreetMap contributors',
                maxZoom: 18
            }).addTo(map);
            
            const countryData = {};
            result.data.forEach(item => {
                if (!countryData[item.country]) {
                    countryData[item.country] = { artists: 0 };
                }
                countryData[item.country].artists += item.artist_count;
            });
            
            const maxArtists = Math.max(...Object.values(countryData).map(d => d.artists));
            
            Object.entries(countryData).forEach(([country, data]) => {
                const coords = countryCoordinates[country];
                if (coords) {
                    const radius = Math.max(5, (data.artists / maxArtists) * 40) * 10000;
                    
                    const circle = L.circle(coords, {
                        color: '#667eea',
                        fillColor: '#667eea',
                        fillOpacity: 0.5,
                        radius: radius
                    }).addTo(map);
                    
                    circle.bindPopup(`
                        <div style="text-align: center;">
                            <strong>${country}</strong><br>
                            <span style="font-size: 1.5em; color: #667eea;">${data.artists}</span><br>
                            <small>artistas</small>
                        </div>
                    `);
                    
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
        const response = await fetch(`${API_BASE_URL}/analytics/artist-collaboration-network`);
        const result = await response.json();
        if (result.success && result.data.length > 0) {
            const tbody = document.getElementById('networkBody');
            tbody.innerHTML = '';
            result.data.slice(0, 50).forEach(item => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${item.artist1_name} <small>(${item.artist1_country})</small></td>
                    <td>${item.artist2_name} <small>(${item.artist2_country})</small></td>
                    <td><span class="badge bg-primary">${item.shared_genres}</span> ${item.genre_names}</td>
                `;
                tbody.appendChild(row);
            });
        }
    } catch (error) {
        console.error('Error:', error);
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

// Búsqueda de canciones con debounce
let searchTimeout;
document.getElementById('songSearch').addEventListener('input', function(e) {
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

async function loadLowSuccessSongs() {
    try {
        const response = await fetch(`${API_BASE_URL}/analytics/low-success-songs?limit=15`);
        const result = await response.json();
        if (result.success && result.data.length > 0) {
            const labels = result.data.map(d => d.song_title);
            const scores = result.data.map(d => d.success_score);
            const ctx = document.getElementById('lowSuccessChart').getContext('2d');
            if (lowSuccessChart) lowSuccessChart.destroy();
            lowSuccessChart = new Chart(ctx, {
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
        console.error('Error:', error);
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
            
            const ctx = document.getElementById('timelineChart').getContext('2d');
            if (timelineChart) timelineChart.destroy();
            timelineChart = new Chart(ctx, {
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
        console.error('Error:', error);
    }
}

async function loadTopLikedSongs(limit = 10) {
    try {
        const response = await fetch(`${API_BASE_URL}/analytics/top-liked-songs?limit=${limit}`);
        const result = await response.json();
        if (result.success && result.data.length > 0) {
            const labels = result.data.map(d => `${d.song_title} - ${d.artist_name}`);
            const likes = result.data.map(d => d.total_likes);
            
            const ctx = document.getElementById('topLikedChart').getContext('2d');
            if (topLikedChart) topLikedChart.destroy();
            topLikedChart = new Chart(ctx, {
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
        console.error('Error:', error);
    }
}

async function loadTopRatedAlbums(limit = 15) {
    try {
        const response = await fetch(`${API_BASE_URL}/analytics/top-rated-albums?limit=${limit}`);
        const result = await response.json();
        if (result.success && result.data.length > 0) {
            const labels = result.data.map(d => `${d.album_title} - ${d.artist_name}`);
            const ratings = result.data.map(d => d.avg_rating);
            
            const ctx = document.getElementById('topRatedChart').getContext('2d');
            if (topRatedChart) topRatedChart.destroy();
            topRatedChart = new Chart(ctx, {
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
        console.error('Error:', error);
    }
}

async function loadGenreCorrelation() {
    try {
        const response = await fetch(`${API_BASE_URL}/analytics/genre-correlation-matrix`);
        const result = await response.json();
        if (result.success && result.data.length > 0) {
            const labels = result.data.slice(0, 15).map(d => `${d.genre1_name} + ${d.genre2_name}`);
            const counts = result.data.slice(0, 15).map(d => d.co_occurrence_count);
            
            const ctx = document.getElementById('correlationChart').getContext('2d');
            if (correlationChart) correlationChart.destroy();
            correlationChart = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: labels,
                    datasets: [{
                        label: 'Co-ocurrencias',
                        data: counts,
                        backgroundColor: 'rgba(153, 102, 255, 0.6)',
                        borderColor: 'rgb(153, 102, 255)',
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

async function loadGenreEvolution(genreFilter = '') {
    try {
        let url = `${API_BASE_URL}/analytics/genre-evolution-by-decade`;
        if (genreFilter) {
            url += `?genre=${encodeURIComponent(genreFilter)}`;
        }
        
        const response = await fetch(url);
        const result = await response.json();
        if (result.success && result.data.length > 0) {
            const decades = [...new Set(result.data.map(d => d.decade))];
            const genres = [...new Set(result.data.map(d => d.genre_name))];
            
            const datasets = genres.slice(0, 8).map((genre, index) => {
                const genreData = result.data.filter(d => d.genre_name === genre);
                const data = decades.map(decade => {
                    const item = genreData.find(d => d.decade === decade);
                    return item ? item.song_count : 0;
                });
                
                const colors = [
                    'rgb(255, 99, 132)', 'rgb(54, 162, 235)', 'rgb(255, 206, 86)', 
                    'rgb(75, 192, 192)', 'rgb(153, 102, 255)', 'rgb(255, 159, 64)',
                    'rgb(201, 203, 207)', 'rgb(83, 102, 255)'
                ];
                
                return {
                    label: genre,
                    data: data,
                    backgroundColor: colors[index] + '99',
                    borderColor: colors[index],
                    borderWidth: 1
                };
            });
            
            const ctx = document.getElementById('evolutionChart').getContext('2d');
            if (evolutionChart) evolutionChart.destroy();
            evolutionChart = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: decades,
                    datasets: datasets
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { 
                        legend: { position: 'top' },
                        title: { display: false }
                    },
                    scales: { 
                        x: { stacked: true },
                        y: { stacked: true, beginAtZero: true }
                    }
                }
            });
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

async function loadGenres() {
    try {
        const response = await fetch(`${API_BASE_URL}/analytics/genres`);
        const result = await response.json();
        if (result.success) {
            const select = document.getElementById('genreFilter');
            result.data.forEach(genre => {
                const option = document.createElement('option');
                option.value = genre.name;
                option.textContent = genre.name;
                select.appendChild(option);
            });
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

// Event listeners para slicers
document.getElementById('topLikedLimit').addEventListener('change', function(e) {
    loadTopLikedSongs(parseInt(e.target.value));
});

document.getElementById('topRatedLimit').addEventListener('change', function(e) {
    loadTopRatedAlbums(parseInt(e.target.value));
});

document.getElementById('genreFilter').addEventListener('change', function(e) {
    loadGenreEvolution(e.target.value);
});

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadDashboardSummary();
    loadGenrePopularity();
    loadCountryMap();
    loadArtistNetwork();
    loadSuccessPrediction();
    loadLowSuccessSongs();
    loadReleasesTimeline();
    loadTopLikedSongs();
    loadTopRatedAlbums();
    loadGenreCorrelation();
    loadGenreEvolution();
    loadGenres();
});

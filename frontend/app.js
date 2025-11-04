// API Configuration (solo si no está definida)
if (typeof API_BASE_URL === 'undefined') {
    var API_BASE_URL = 'http://localhost:3000/api';
}

// Global state
if (typeof currentUser === 'undefined') {
    var currentUser = null;
}
let currentView = 'home';

// Initialize app - Solo si no se ha inicializado antes
if (!window.appInitialized) {
    window.appInitialized = true;
    document.addEventListener('DOMContentLoaded', () => {
        checkAuthState();
        loadHome();
        setupEventListeners();
    });
}

// Check authentication state
function checkAuthState() {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('currentUser');
    
    if (token && userData) {
        currentUser = JSON.parse(userData);
        document.getElementById('authButtons').classList.add('d-none');
        document.getElementById('userMenu').classList.remove('d-none');
        document.getElementById('usernameDisplay').textContent = currentUser.username;
    } else {
        document.getElementById('authButtons').classList.remove('d-none');
        document.getElementById('userMenu').classList.add('d-none');
    }
}

// Setup event listeners
function setupEventListeners() {
    // Navigation
    document.querySelectorAll('[data-section]').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const section = e.target.dataset.section;
            loadSection(section);
        });
    });
    
    // Logout
    document.getElementById('logoutButton')?.addEventListener('click', () => {
        localStorage.removeItem('token');
        localStorage.removeItem('currentUser');
        currentUser = null;
        checkAuthState();
        loadHome();
        showAlert('Logged out successfully', 'success');
    });
}

// Load section
function loadSection(section) {
    currentView = section;
    
    // Update active nav link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    document.querySelector(`[data-section="${section}"]`)?.classList.add('active');
    
    // Load content
    switch(section) {
        case 'home':
            loadHome();
            break;
        case 'artists':
            loadArtistsPage();
            break;
        case 'albums':
            loadAlbumsPage();
            break;
        case 'playlists':
            loadPlaylistsPage();
            break;
        default:
            loadHome();
    }
}

// Load home page
async function loadHome() {
    const content = document.getElementById('mainContent');
    content.innerHTML = `
        <div class="container mt-4">
            <h2>Welcome to Music Database</h2>
            <div class="row mt-4" id="statsContainer"></div>
            <div class="row mt-4">
                <div class="col-12">
                    <h4>Recent Albums</h4>
                    <div class="row" id="recentAlbumsContainer"></div>
                </div>
            </div>
        </div>
    `;
    
    await loadStatistics();
    await loadRecentAlbums();
}

// Load statistics
async function loadStatistics() {
    try {
        const response = await fetch(`${API_BASE_URL}/statistics`);
        const stats = await response.json();
        
        const container = document.getElementById('statsContainer');
        container.innerHTML = `
            <div class="col-md-3">
                <div class="stats-card" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
                    <i class="bi bi-people-fill"></i>
                    <h3>${stats.totalArtists || 0}</h3>
                    <p>Artists</p>
                </div>
            </div>
            <div class="col-md-3">
                <div class="stats-card" style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);">
                    <i class="bi bi-disc-fill"></i>
                    <h3>${stats.totalAlbums || 0}</h3>
                    <p>Albums</p>
                </div>
            </div>
            <div class="col-md-3">
                <div class="stats-card" style="background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);">
                    <i class="bi bi-music-note-list"></i>
                    <h3>${stats.totalSongs || 0}</h3>
                    <p>Songs</p>
                </div>
            </div>
            <div class="col-md-3">
                <div class="stats-card" style="background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);">
                    <i class="bi bi-collection-play-fill"></i>
                    <h3>${stats.totalPlaylists || 0}</h3>
                    <p>Playlists</p>
                </div>
            </div>
        `;
    } catch (error) {
        console.error('Error loading statistics:', error);
    }
}

// Load recent albums
async function loadRecentAlbums() {
    try {
        const response = await fetch(`${API_BASE_URL}/albums`);
        const albums = await response.json();
        
        const container = document.getElementById('recentAlbumsContainer');
        container.innerHTML = albums.slice(0, 4).map(album => `
            <div class="col-md-3 col-6 mb-4">
                <div class="card h-100">
                    <img src="${album.cover_image || 'https://via.placeholder.com/300'}" class="card-img-top album-cover" alt="${album.title}">
                    <div class="card-body">
                        <h5 class="card-title">${album.title}</h5>
                        <p class="card-text text-muted">${album.artist_name || 'Unknown'}</p>
                        <button class="btn btn-outline-primary btn-sm" onclick="viewAlbum(${album.album_id})">
                            <i class="bi bi-eye"></i> View
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
    } catch (error) {
        console.error('Error loading recent albums:', error);
    }
}

// Load artists page
async function loadArtistsPage() {
    const content = document.getElementById('mainContent');
    content.innerHTML = `
        <div class="container mt-4">
            <div class="d-flex justify-content-between align-items-center mb-4">
                <h2>Artists</h2>
            </div>
            <div class="row" id="artistsContainer">
                <div class="col-12 text-center">
                    <div class="spinner-border" role="status">
                        <span class="visually-hidden">Loading...</span>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    await loadArtists();
}

// Load all artists
async function loadArtists() {
    try {
        const response = await fetch(`${API_BASE_URL}/artists`);
        const artists = await response.json();
        
        const container = document.getElementById('artistsContainer');
        container.innerHTML = artists.map(artist => `
            <div class="col-md-3 col-6 mb-4">
                <div class="card h-100 text-center">
                    <div class="card-body">
                        <img src="${artist.profile_image || 'https://via.placeholder.com/120'}" class="artist-avatar mb-3" alt="${artist.name}">
                        <h5 class="card-title">${artist.name}</h5>
                        <p class="card-text text-muted">${artist.country || 'Unknown'}</p>
                        <button class="btn btn-outline-primary btn-sm" onclick="viewArtist(${artist.artist_id})">
                            <i class="bi bi-eye"></i> View Profile
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
    } catch (error) {
        console.error('Error loading artists:', error);
        showAlert('Error loading artists', 'danger');
    }
}

// View artist details
window.viewArtist = async function(artistId) {
    try {
        const response = await fetch(`${API_BASE_URL}/artists/${artistId}`);
        const artist = await response.json();
        
        const content = document.getElementById('mainContent');
        content.innerHTML = `
            <div class="container mt-4">
                <button class="btn btn-outline-secondary mb-3" onclick="loadSection('artists')">
                    <i class="bi bi-arrow-left"></i> Back to Artists
                </button>
                <div class="row">
                    <div class="col-md-4 text-center">
                        <img src="${artist.profile_image || 'https://via.placeholder.com/300'}" class="img-fluid rounded-circle mb-3" alt="${artist.name}">
                        <h2>${artist.name}</h2>
                        <p class="text-muted">${artist.country || 'Unknown'} • ${artist.formation_year || 'N/A'}</p>
                    </div>
                    <div class="col-md-8">
                        <h4>Biography</h4>
                        <p>${artist.bio || 'No biography available.'}</p>
                        
                        <h4 class="mt-4">Albums</h4>
                        <div class="row" id="artistAlbumsContainer">
                            <div class="col-12 text-center">
                                <div class="spinner-border spinner-border-sm" role="status"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // Load artist's albums
        const albumsResponse = await fetch(`${API_BASE_URL}/artists/${artistId}/albums`);
        const albums = await albumsResponse.json();
        
        const albumsContainer = document.getElementById('artistAlbumsContainer');
        if (albums.length > 0) {
            albumsContainer.innerHTML = albums.map(album => `
                <div class="col-md-4 mb-3">
                    <div class="card">
                        <img src="${album.cover_image || 'https://via.placeholder.com/200'}" class="card-img-top" alt="${album.title}">
                        <div class="card-body">
                            <h6 class="card-title">${album.title}</h6>
                            <p class="card-text text-muted">${album.release_date ? new Date(album.release_date).getFullYear() : 'N/A'}</p>
                            <button class="btn btn-sm btn-outline-primary" onclick="viewAlbum(${album.album_id})">View Album</button>
                        </div>
                    </div>
                </div>
            `).join('');
        } else {
            albumsContainer.innerHTML = '<div class="col-12"><p class="text-muted">No albums found.</p></div>';
        }
        
    } catch (error) {
        console.error('Error loading artist details:', error);
        showAlert('Error loading artist details', 'danger');
    }
};

// Load albums page
async function loadAlbumsPage() {
    const content = document.getElementById('mainContent');
    content.innerHTML = `
        <div class="container mt-4">
            <div class="d-flex justify-content-between align-items-center mb-4">
                <h2>Albums</h2>
            </div>
            <div class="row" id="allAlbumsContainer">
                <div class="col-12 text-center">
                    <div class="spinner-border" role="status">
                        <span class="visually-hidden">Loading...</span>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    await loadAllAlbums();
}

// Load all albums
async function loadAllAlbums() {
    try {
        const response = await fetch(`${API_BASE_URL}/albums`);
        const albums = await response.json();
        
        const container = document.getElementById('allAlbumsContainer');
        container.innerHTML = albums.map(album => `
            <div class="col-md-3 col-6 mb-4">
                <div class="card h-100">
                    <img src="${album.cover_image || 'https://via.placeholder.com/300'}" class="card-img-top album-cover" alt="${album.title}">
                    <div class="card-body">
                        <h5 class="card-title">${album.title}</h5>
                        <p class="card-text text-muted">${album.artist_name || 'Unknown'}</p>
                        <button class="btn btn-outline-primary btn-sm" onclick="viewAlbum(${album.album_id})">
                            <i class="bi bi-eye"></i> View Album
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
    } catch (error) {
        console.error('Error loading albums:', error);
        showAlert('Error loading albums', 'danger');
    }
}

// View album details
window.viewAlbum = async function(albumId) {
    try {
        const response = await fetch(`${API_BASE_URL}/albums/${albumId}`);
        const album = await response.json();
        
        const content = document.getElementById('mainContent');
        content.innerHTML = `
            <div class="container mt-4">
                <button class="btn btn-outline-secondary mb-3" onclick="loadSection('albums')">
                    <i class="bi bi-arrow-left"></i> Back to Albums
                </button>
                <div class="row">
                    <div class="col-md-4">
                        <img src="${album.cover_image || 'https://via.placeholder.com/400'}" class="img-fluid rounded mb-3" alt="${album.title}">
                    </div>
                    <div class="col-md-8">
                        <h2>${album.title}</h2>
                        <p class="text-muted">By ${album.artist_name || 'Unknown'}</p>
                        <p><strong>Release Date:</strong> ${album.release_date ? new Date(album.release_date).toLocaleDateString() : 'Unknown'}</p>
                        <p>${album.description || 'No description available.'}</p>
                        
                        <h4 class="mt-4">Tracks</h4>
                        <div class="list-group" id="albumTracksContainer">
                            <div class="text-center">
                                <div class="spinner-border spinner-border-sm" role="status"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // Load album tracks
        const songsResponse = await fetch(`${API_BASE_URL}/albums/${albumId}/songs`);
        const songs = await songsResponse.json();
        
        const tracksContainer = document.getElementById('albumTracksContainer');
        if (songs.length > 0) {
            tracksContainer.innerHTML = songs.map((song, index) => `
                <div class="list-group-item d-flex justify-content-between align-items-center">
                    <div>
                        <strong>${song.track_number || index + 1}.</strong> ${song.title}
                    </div>
                    <div>
                        <span class="badge bg-secondary">${formatDuration(song.duration)}</span>
                        <button class="btn btn-sm btn-primary ms-2" onclick="playSong(${song.song_id}, '${song.title}', '${album.artist_name}', '${album.cover_image}')">
                            <i class="bi bi-play-fill"></i>
                        </button>
                    </div>
                </div>
            `).join('');
        } else {
            tracksContainer.innerHTML = '<div class="list-group-item text-muted">No tracks found.</div>';
        }
        
    } catch (error) {
        console.error('Error loading album details:', error);
        showAlert('Error loading album details', 'danger');
    }
};

// Load playlists page
async function loadPlaylistsPage() {
    const content = document.getElementById('mainContent');
    content.innerHTML = `
        <div class="container mt-4">
            <div class="d-flex justify-content-between align-items-center mb-4">
                <h2>Playlists</h2>
                ${currentUser ? '<button class="btn btn-primary" onclick="showCreatePlaylistModal()"><i class="bi bi-plus-circle"></i> Create Playlist</button>' : ''}
            </div>
            <div class="row" id="playlistsContainer">
                <div class="col-12 text-center">
                    <div class="spinner-border" role="status">
                        <span class="visually-hidden">Loading...</span>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    await loadPlaylists();
}

// Load playlists
async function loadPlaylists() {
    try {
        const response = await fetch(`${API_BASE_URL}/playlists`);
        const playlists = await response.json();
        
        const container = document.getElementById('playlistsContainer');
        if (playlists.length > 0) {
            container.innerHTML = playlists.map(playlist => `
                <div class="col-md-4 mb-4">
                    <div class="card h-100">
                        <div class="card-body">
                            <h5 class="card-title">${playlist.name}</h5>
                            <p class="card-text text-muted">${playlist.description || 'No description'}</p>
                            <p class="card-text"><small class="text-muted">By ${playlist.username || 'Unknown'}</small></p>
                            <button class="btn btn-outline-primary btn-sm" onclick="viewPlaylist(${playlist.playlist_id})">
                                <i class="bi bi-eye"></i> View Playlist
                            </button>
                        </div>
                    </div>
                </div>
            `).join('');
        } else {
            container.innerHTML = '<div class="col-12 text-center"><p class="text-muted">No playlists found. Create one to get started!</p></div>';
        }
    } catch (error) {
        console.error('Error loading playlists:', error);
        showAlert('Error loading playlists', 'danger');
    }
}

// Show create playlist modal
window.showCreatePlaylistModal = function() {
    const modalHtml = `
        <div class="modal fade" id="createPlaylistModal" tabindex="-1">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Create New Playlist</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <form id="createPlaylistForm">
                            <div class="mb-3">
                                <label for="playlistName" class="form-label">Playlist Name</label>
                                <input type="text" class="form-control" id="playlistName" required>
                            </div>
                            <div class="mb-3">
                                <label for="playlistDescription" class="form-label">Description</label>
                                <textarea class="form-control" id="playlistDescription" rows="3"></textarea>
                            </div>
                            <div class="mb-3 form-check">
                                <input type="checkbox" class="form-check-input" id="playlistPublic" checked>
                                <label class="form-check-label" for="playlistPublic">Make playlist public</label>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                        <button type="button" class="btn btn-primary" onclick="createPlaylist()">Create</button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHtml);
    const modal = new bootstrap.Modal(document.getElementById('createPlaylistModal'));
    modal.show();
    
    document.getElementById('createPlaylistModal').addEventListener('hidden.bs.modal', function () {
        this.remove();
    });
};

// Create playlist
window.createPlaylist = async function() {
    const name = document.getElementById('playlistName').value;
    const description = document.getElementById('playlistDescription').value;
    const isPublic = document.getElementById('playlistPublic').checked;
    
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_BASE_URL}/playlists`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ name, description, is_public: isPublic })
        });
        
        if (response.ok) {
            const modal = bootstrap.Modal.getInstance(document.getElementById('createPlaylistModal'));
            modal.hide();
            showAlert('Playlist created successfully!', 'success');
            loadPlaylists();
        } else {
            throw new Error('Failed to create playlist');
        }
    } catch (error) {
        console.error('Error creating playlist:', error);
        showAlert('Error creating playlist', 'danger');
    }
};

// Format duration
function formatDuration(seconds) {
    if (!seconds) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

// Show alert
function showAlert(message, type = 'info') {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} alert-dismissible fade show position-fixed top-0 end-0 m-3`;
    alertDiv.style.zIndex = '9999';
    alertDiv.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    document.body.appendChild(alertDiv);
    
    setTimeout(() => {
        alertDiv.remove();
    }, 5000);
}

// Play song (placeholder)
window.playSong = function(songId, title, artist, coverUrl) {
    showAlert(`Now playing: ${title} by ${artist}`, 'info');
};

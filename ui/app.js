// Norwegian Police MDT - Modern Interface
class NorwegianMDT {
    constructor() {
        this.currentPage = 'dashboard';
        this.isVisible = false;
        this.playerData = {};
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupNUICallbacks();
        this.loadDashboard();
    }

    setupEventListeners() {
        // Navigation
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const page = item.dataset.page;
                this.navigateToPage(page);
            });
        });

        // Search functionality
        document.getElementById('global-search').addEventListener('input', (e) => {
            this.handleGlobalSearch(e.target.value);
        });

        // Duty toggle
        document.getElementById('duty-toggle').addEventListener('click', () => {
            this.toggleDuty();
        });

        // New incident button
        document.getElementById('new-incident').addEventListener('click', () => {
            this.openNewIncidentModal();
        });

        // Escape key to close MDT
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isVisible) {
                this.closeMDT();
            }
        });

        // Page-specific search handlers
        this.setupPageSearchHandlers();
    }

    setupPageSearchHandlers() {
        // Profile search
        const profileSearch = document.getElementById('profile-search');
        if (profileSearch) {
            profileSearch.addEventListener('input', (e) => {
                this.searchProfiles(e.target.value);
            });
        }

        // Incident search
        const incidentSearch = document.getElementById('incident-search');
        if (incidentSearch) {
            incidentSearch.addEventListener('input', (e) => {
                this.searchIncidents(e.target.value);
            });
        }

        // Vehicle search
        const vehicleSearch = document.getElementById('vehicle-search');
        if (vehicleSearch) {
            vehicleSearch.addEventListener('input', (e) => {
                this.searchVehicles(e.target.value);
            });
        }

        // Weapon search
        const weaponSearch = document.getElementById('weapon-search');
        if (weaponSearch) {
            weaponSearch.addEventListener('input', (e) => {
                this.searchWeapons(e.target.value);
            });
        }
    }

    setupNUICallbacks() {
        // Listen for NUI messages from FiveM
        window.addEventListener('message', (event) => {
            const data = event.data;
            
            switch (data.type) {
                case 'show':
                    this.handleShow(data);
                    break;
                case 'data':
                    this.handleData(data);
                    break;
                case 'bulletin':
                    this.handleBulletin(data);
                    break;
                case 'profileData':
                    this.handleProfileData(data);
                    break;
                case 'incidents':
                    this.handleIncidents(data);
                    break;
                case 'reports':
                    this.handleReports(data);
                    break;
                case 'bolos':
                    this.handleBolos(data);
                    break;
                case 'calls':
                    this.handleCalls(data);
                    break;
                case 'warrants':
                    this.handleWarrants(data);
                    break;
                default:
                    console.log('Unknown message type:', data.type);
            }
        });
    }

    handleShow(data) {
        if (data.enable) {
            this.showMDT(data);
        } else {
            this.hideMDT();
        }
    }

    showMDT(data) {
        this.isVisible = true;
        this.playerData = data;
        document.body.style.display = 'block';
        
        // Update user info
        this.updateUserInfo(data);
        
        // Load initial data
        this.loadDashboard();
        
        // Add fade-in animation
        document.querySelector('.mdt-container').classList.add('fade-in');
    }

    hideMDT() {
        this.isVisible = false;
        document.body.style.display = 'none';
    }

    updateUserInfo(data) {
        const userName = document.getElementById('user-name');
        const userRank = document.getElementById('user-rank');
        
        if (data.name) {
            userName.textContent = data.name;
        }
        
        if (data.job && data.job.grade) {
            userRank.textContent = this.translateRank(data.job.grade.name);
        }
    }

    translateRank(rank) {
        const rankTranslations = {
            'recruit': 'Politiaspirant',
            'officer': 'Politibetjent',
            'senior': 'Politioverbetjent',
            'sergeant': 'Politiførstebetjent',
            'lieutenant': 'Politioverbetjent',
            'captain': 'Politiinspektør',
            'chief': 'Politimester'
        };
        
        return rankTranslations[rank] || rank;
    }

    navigateToPage(page) {
        // Update navigation
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
        });
        document.querySelector(`[data-page="${page}"]`).classList.add('active');

        // Hide all pages
        document.querySelectorAll('.page-content').forEach(pageEl => {
            pageEl.classList.add('hidden');
        });

        // Show selected page
        const targetPage = document.getElementById(`${page}-page`);
        if (targetPage) {
            targetPage.classList.remove('hidden');
            targetPage.classList.add('slide-up');
        }

        // Update header
        this.updatePageHeader(page);
        
        // Load page data
        this.loadPageData(page);
        
        this.currentPage = page;
    }

    updatePageHeader(page) {
        const pageTitle = document.getElementById('page-title');
        const breadcrumb = document.getElementById('breadcrumb');
        
        const pageTitles = {
            'dashboard': 'Dashbord',
            'profiles': 'Profiler',
            'incidents': 'Hendelser',
            'reports': 'Rapporter',
            'bolos': 'Etterlyste',
            'vehicles': 'Kjøretøy',
            'weapons': 'Våpen',
            'dispatch': 'Operasjonssentral',
            'logs': 'Logger'
        };
        
        pageTitle.textContent = pageTitles[page] || page;
        breadcrumb.textContent = `Hjem / ${pageTitles[page] || page}`;
    }

    loadPageData(page) {
        switch (page) {
            case 'dashboard':
                this.loadDashboard();
                break;
            case 'profiles':
                this.loadProfiles();
                break;
            case 'incidents':
                this.loadIncidents();
                break;
            case 'reports':
                this.loadReports();
                break;
            case 'bolos':
                this.loadBolos();
                break;
            case 'vehicles':
                this.loadVehicles();
                break;
            case 'weapons':
                this.loadWeapons();
                break;
            case 'dispatch':
                this.loadDispatch();
                break;
            case 'logs':
                this.loadLogs();
                break;
        }
    }

    loadDashboard() {
        // Request dashboard data from server
        this.postNUI('getAllDashboardData', {});
        
        // Update stats (these would normally come from server)
        this.updateDashboardStats();
    }

    updateDashboardStats() {
        // These would normally be updated with real data from the server
        const stats = {
            activeUnits: Math.floor(Math.random() * 20) + 5,
            openIncidents: Math.floor(Math.random() * 15) + 3,
            pendingReports: Math.floor(Math.random() * 25) + 10,
            activeBolos: Math.floor(Math.random() * 8) + 1
        };

        document.getElementById('active-units').textContent = stats.activeUnits;
        document.getElementById('open-incidents').textContent = stats.openIncidents;
        document.getElementById('pending-reports').textContent = stats.pendingReports;
        document.getElementById('active-bolos').textContent = stats.activeBolos;
    }

    handleBulletin(data) {
        const container = document.getElementById('bulletins-container');
        if (!container) return;

        if (!data.data || data.data.length === 0) {
            container.innerHTML = '<p class="text-center text-muted">Ingen bulletiner tilgjengelig</p>';
            return;
        }

        const bulletinsHTML = data.data.map(bulletin => `
            <div class="card mb-3">
                <div class="card-body">
                    <h5 class="card-title">${bulletin.title}</h5>
                    <p class="card-text">${bulletin.desc}</p>
                    <small class="text-muted">Av: ${bulletin.author} - ${this.formatTime(bulletin.time)}</small>
                </div>
            </div>
        `).join('');

        container.innerHTML = bulletinsHTML;
    }

    handleProfileData(data) {
        // Handle profile search results
        const resultsContainer = document.getElementById('profile-results');
        if (!resultsContainer) return;

        if (!data.data || data.data.length === 0) {
            resultsContainer.innerHTML = '<p class="text-center text-muted">Ingen profiler funnet</p>';
            return;
        }

        // Display profile results
        this.displayProfileResults(data.data, resultsContainer);
    }

    displayProfileResults(profiles, container) {
        const profilesHTML = profiles.map(profile => `
            <div class="card mb-3 cursor-pointer" onclick="mdt.openProfile('${profile.citizenid}')">
                <div class="card-body">
                    <div class="flex items-center gap-4">
                        <img src="${profile.pfp || 'img/profile_pic.png'}" alt="Profilbilde" class="w-16 h-16 rounded-full">
                        <div>
                            <h5 class="card-title">${profile.firstname} ${profile.lastname}</h5>
                            <p class="text-muted">ID: ${profile.citizenid}</p>
                            <p class="text-muted">Fødselsdato: ${profile.birthdate}</p>
                        </div>
                    </div>
                </div>
            </div>
        `).join('');

        container.innerHTML = profilesHTML;
    }

    searchProfiles(query) {
        if (query.length < 2) return;
        
        this.postNUI('searchProfiles', { name: query });
    }

    searchIncidents(query) {
        if (query.length < 2) return;
        
        this.postNUI('searchIncidents', { incident: query });
    }

    searchVehicles(query) {
        if (query.length < 2) return;
        
        this.postNUI('searchVehicles', { name: query });
    }

    searchWeapons(query) {
        if (query.length < 2) return;
        
        this.postNUI('searchWeapons', { name: query });
    }

    handleGlobalSearch(query) {
        if (query.length < 2) return;
        
        // Implement global search across all data types
        console.log('Global search:', query);
    }

    toggleDuty() {
        this.postNUI('toggleDuty', {});
        
        // Update UI
        const dutyButton = document.getElementById('duty-toggle');
        const dutyStatus = document.getElementById('duty-status');
        
        if (dutyStatus.textContent === 'På vakt') {
            dutyStatus.textContent = 'Av vakt';
            dutyButton.classList.remove('btn-secondary');
            dutyButton.classList.add('btn-error');
        } else {
            dutyStatus.textContent = 'På vakt';
            dutyButton.classList.remove('btn-error');
            dutyButton.classList.add('btn-secondary');
        }
        
        this.showNotification('Vaktstatus oppdatert', 'success');
    }

    openNewIncidentModal() {
        // Create and show new incident modal
        const modal = this.createModal('Ny hendelse', this.getNewIncidentForm());
        document.getElementById('modal-container').appendChild(modal);
    }

    createModal(title, content) {
        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.innerHTML = `
            <div class="modal">
                <div class="modal-header">
                    <h3 class="modal-title">${title}</h3>
                </div>
                <div class="modal-body">
                    ${content}
                </div>
                <div class="modal-footer">
                    <button class="btn btn-secondary" onclick="this.closest('.modal-overlay').remove()">Avbryt</button>
                    <button class="btn btn-primary" onclick="mdt.submitModal()">Lagre</button>
                </div>
            </div>
        `;
        
        // Close on overlay click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
        
        return modal;
    }

    getNewIncidentForm() {
        return `
            <div class="form-group">
                <label class="form-label">Tittel</label>
                <input type="text" class="form-input" id="incident-title" placeholder="Kort beskrivelse av hendelsen">
            </div>
            <div class="form-group">
                <label class="form-label">Type</label>
                <select class="form-input" id="incident-type">
                    <option value="traffic">Trafikk</option>
                    <option value="theft">Tyveri</option>
                    <option value="assault">Vold</option>
                    <option value="drugs">Narkotika</option>
                    <option value="other">Annet</option>
                </select>
            </div>
            <div class="form-group">
                <label class="form-label">Beskrivelse</label>
                <textarea class="form-input form-textarea" id="incident-description" placeholder="Detaljert beskrivelse av hendelsen"></textarea>
            </div>
            <div class="form-group">
                <label class="form-label">Lokasjon</label>
                <input type="text" class="form-input" id="incident-location" placeholder="Adresse eller beskrivelse av stedet">
            </div>
        `;
    }

    submitModal() {
        // Handle modal submission based on current modal type
        const modal = document.querySelector('.modal-overlay');
        if (!modal) return;
        
        // Get form data and submit
        const formData = this.getModalFormData(modal);
        
        // Submit to server
        this.postNUI('newIncident', formData);
        
        // Close modal
        modal.remove();
        
        this.showNotification('Hendelse opprettet', 'success');
    }

    getModalFormData(modal) {
        const inputs = modal.querySelectorAll('input, select, textarea');
        const data = {};
        
        inputs.forEach(input => {
            if (input.id) {
                data[input.id] = input.value;
            }
        });
        
        return data;
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="flex items-center gap-3">
                <i class="fas fa-${this.getNotificationIcon(type)}"></i>
                <span>${message}</span>
            </div>
        `;
        
        document.getElementById('notification-container').appendChild(notification);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            notification.remove();
        }, 5000);
    }

    getNotificationIcon(type) {
        const icons = {
            'success': 'check-circle',
            'warning': 'exclamation-triangle',
            'error': 'times-circle',
            'info': 'info-circle'
        };
        
        return icons[type] || 'info-circle';
    }

    formatTime(timestamp) {
        const date = new Date(parseInt(timestamp));
        return date.toLocaleString('no-NO');
    }

    closeMDT() {
        this.postNUI('escape', {});
    }

    postNUI(action, data) {
        fetch(`https://${GetParentResourceName()}/${action}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        }).catch(err => {
            console.error('NUI Callback Error:', err);
        });
    }

    // Placeholder methods for other page loads
    loadProfiles() {
        console.log('Loading profiles...');
    }

    loadIncidents() {
        console.log('Loading incidents...');
        this.postNUI('getAllIncidents', {});
    }

    loadReports() {
        console.log('Loading reports...');
        this.postNUI('getAllReports', {});
    }

    loadBolos() {
        console.log('Loading BOLOs...');
        this.postNUI('getAllBolos', {});
    }

    loadVehicles() {
        console.log('Loading vehicles...');
    }

    loadWeapons() {
        console.log('Loading weapons...');
    }

    loadDispatch() {
        console.log('Loading dispatch...');
    }

    loadLogs() {
        console.log('Loading logs...');
        this.postNUI('getAllLogs', {});
    }

    // Handle other data types
    handleIncidents(data) {
        console.log('Incidents data received:', data);
    }

    handleReports(data) {
        console.log('Reports data received:', data);
    }

    handleBolos(data) {
        console.log('BOLOs data received:', data);
    }

    handleCalls(data) {
        console.log('Calls data received:', data);
    }

    handleWarrants(data) {
        console.log('Warrants data received:', data);
    }

    openProfile(citizenid) {
        this.postNUI('getProfileData', { id: citizenid });
    }
}

// Initialize MDT when page loads
let mdt;
document.addEventListener('DOMContentLoaded', () => {
    mdt = new NorwegianMDT();
});

// Helper function for NUI callbacks
function GetParentResourceName() {
    return window.location.hostname === 'localhost' ? 'ps-mdt' : window.location.hostname;
}
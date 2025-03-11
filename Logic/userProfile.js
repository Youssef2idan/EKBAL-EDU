// DOM Elements
const profileAvatar = document.getElementById('profileAvatar');
const editAvatarBtn = document.querySelector('.edit-avatar-btn');
const themeToggle = document.getElementById('theme-toggle');
const logoutBtn = document.getElementById('logoutBtn');
const settingItems = document.querySelectorAll('.setting-item');

// User Data (This would typically come from a backend)
let userData = {
    name: 'Youssef Zidan',
    class: '2-C',
    studentId: '468928304',
    avatar: '/Data/images/Profile/default-avatar.png',
    stats: {
        attendance: '85%',
        average: '92%',
        assignments: '15'
    }
};

// Initialize Profile
function initializeProfile() {
    // Load user data
    loadUserData();
    
    // Initialize theme
    initializeTheme();
    
    // Add event listeners
    setupEventListeners();
    
    // Add page transition handlers
    setupPageTransitions();
}

// Load User Data
function loadUserData() {
    // In a real app, this would fetch from an API
    document.querySelector('.profile-name').textContent = userData.name;
    document.querySelector('.profile-info').textContent = 
        `Class ${userData.class} • Student ID: ${userData.studentId}`;
    
    // Load stats
    document.querySelectorAll('.stat-value').forEach(stat => {
        const statType = stat.nextElementSibling.textContent.toLowerCase();
        stat.textContent = userData.stats[statType.toLowerCase()] || '0';
    });
}

// Theme Management
function initializeTheme() {
    const isDarkMode = localStorage.getItem('darkMode') === 'true';
    document.body.classList.toggle('dark', isDarkMode);
    updateThemeToggle(isDarkMode);
}

function updateThemeToggle(isDarkMode) {
    const toggleTrack = themeToggle.querySelector('.toggle-track');
    toggleTrack.style.transform = isDarkMode ? 'translateX(24px)' : 'translateX(2px)';
}

// Event Listeners Setup
function setupEventListeners() {
    // Avatar Edit
    editAvatarBtn.addEventListener('click', handleAvatarEdit);
    
    // Theme Toggle
    themeToggle.addEventListener('click', handleThemeToggle);
    
    // Logout
    logoutBtn.addEventListener('click', handleLogout);
    
    // Setting Items Ripple Effect
    settingItems.forEach(item => {
        item.addEventListener('click', createRippleEffect);
    });
}

// Avatar Edit Handler
function handleAvatarEdit() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    
    input.onchange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                profileAvatar.src = e.target.result;
                // In a real app, you'd upload this to a server
                userData.avatar = e.target.result;
                saveUserData();
            };
            reader.readAsDataURL(file);
        }
    };
    
    input.click();
}

// Theme Toggle Handler
function handleThemeToggle() {
    const isDarkMode = document.body.classList.toggle('dark');
    localStorage.setItem('darkMode', isDarkMode);
    updateThemeToggle(isDarkMode);
}

// Logout Handler
function handleLogout() {
    // Add confirmation dialog
    if (confirm('Are you sure you want to logout?')) {
        // Clear user session
        localStorage.removeItem('userSession');
        // Redirect to login page
        window.location.href = 'login.html';
    }
}

// Ripple Effect for Setting Items
function createRippleEffect(event) {
    const button = event.currentTarget;
    const ripple = document.createElement('span');
    const rect = button.getBoundingClientRect();
    
    ripple.className = 'ripple';
    ripple.style.left = `${event.clientX - rect.left}px`;
    ripple.style.top = `${event.clientY - rect.top}px`;
    
    button.appendChild(ripple);
    
    setTimeout(() => ripple.remove(), 600);
}

// Page Transitions
function setupPageTransitions() {
    const transitionOverlay = document.querySelector('.page-transition-overlay');
    const mainContent = document.querySelector('.main-content');
    
    window.handlePageTransition = (event, targetPage) => {
        event.preventDefault();
        
        // Start fade out animation
        mainContent.classList.add('fade-out');
        transitionOverlay.classList.add('active');
        
        setTimeout(() => {
            window.location.href = targetPage;
        }, 300);
    };
}

// Save User Data
function saveUserData() {
    // In a real app, this would save to a backend
    localStorage.setItem('userData', JSON.stringify(userData));
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initializeProfile);

// Handle page visibility changes
document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
        loadUserData(); // Refresh data when page becomes visible
    }
});

// Theme Management
function initializeTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark');
    } else {
        document.body.classList.remove('dark');
    }
    
    // Update switch state
    const themeSwitch = document.getElementById('theme-switch');
    if (themeSwitch) {
        themeSwitch.checked = savedTheme === 'dark';
    }
}

function toggleTheme() {
    const body = document.body;
    const isDark = body.classList.contains('dark');
    
    if (isDark) {
        body.classList.remove('dark');
        localStorage.setItem('theme', 'light');
    } else {
        body.classList.add('dark');
        localStorage.setItem('theme', 'dark');
    }
    
    // Update switch state
    const themeSwitch = document.getElementById('theme-switch');
    if (themeSwitch) {
        themeSwitch.checked = !isDark;
    }
}

// Initialize theme when DOM loads
document.addEventListener('DOMContentLoaded', () => {
    initializeTheme();
    
    // Setup theme toggle listeners
    const themeToggle = document.getElementById('theme-toggle');
    const themeSwitch = document.getElementById('theme-switch');
    
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            toggleTheme();
        });
    }
    
    if (themeSwitch) {
        themeSwitch.addEventListener('change', () => {
            toggleTheme();
        });
    }
}); 
// DOM Elements
const profileAvatar = document.getElementById('profileAvatar');
const editAvatarBtn = document.querySelector('.edit-avatar-btn');
const themeToggle = document.getElementById('theme-toggle');
const logoutBtn = document.getElementById('logoutBtn');
const settingItems = document.querySelectorAll('.setting-item');

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
    
    // Add profile editing functionality
    setupProfileEditing();
}

// Load User Data
function loadUserData() {
    const storedData = localStorage.getItem('userData');
    
    if (!storedData) {
        window.location.href = 'onboarding.html';
        return;
    }

    const userData = JSON.parse(storedData);
    
    // Update profile elements
    document.querySelector('.profile-name').textContent = userData.name;
    document.querySelector('.profile-info').textContent = 
        `Class ${userData.class.toUpperCase()} • Student ID: ${userData.code}`;
    
    // Update avatar emoji
    const profileAvatar = document.getElementById('profileAvatar');
    profileAvatar.textContent = userData.emoji || '😊'; // Set emoji or default
    
    // Load stats
    document.querySelectorAll('.stat-value').forEach(stat => {
        const statType = stat.nextElementSibling.textContent.toLowerCase();
        stat.textContent = userData.stats[statType.toLowerCase()] || '0';
    });
}

// Setup Event Listeners
function setupEventListeners() {
    // Theme toggle
    const themeToggle = document.getElementById('theme-toggle');
    const themeSwitch = document.getElementById('theme-switch');
    
    if (themeToggle && themeSwitch) {
        // Set initial state
        themeSwitch.checked = document.body.classList.contains('dark');
        
        themeToggle.addEventListener('click', () => {
            themeSwitch.checked = !themeSwitch.checked;
            toggleTheme();
        });
        
        themeSwitch.addEventListener('change', toggleTheme);
    }

    // Profile editing
    const editProfileBtn = document.querySelector('[data-action="edit-profile"]');
    if (editProfileBtn) {
        editProfileBtn.addEventListener('click', () => {
            console.log('Edit button clicked');
            openEditModal();
        });
    }

    // Close modal
    const closeModalBtn = document.querySelector('.close-modal');
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', closeEditModal);
    }

    // Logout handler
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            localStorage.removeItem('userData');
            window.location.href = 'onboarding.html';
        });
    }

    // Avatar selection in modal
    document.querySelectorAll('.avatar-option').forEach(option => {
        option.addEventListener('click', () => {
            document.querySelectorAll('.avatar-option').forEach(opt => 
                opt.classList.remove('selected'));
            option.classList.add('selected');
        });
    });

    // Form submission
    const editProfileForm = document.getElementById('editProfileForm');
    if (editProfileForm) {
        editProfileForm.addEventListener('submit', (e) => {
            e.preventDefault();
            saveProfileChanges();
        });
    }

    // Grade selection
    document.querySelectorAll('#gradeOptions .option-button').forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            document.querySelectorAll('#gradeOptions .option-button')
                .forEach(btn => btn.classList.remove('selected'));
            button.classList.add('selected');
        });
    });

    // Class selection
    document.querySelectorAll('#classOptions .option-button').forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            document.querySelectorAll('#classOptions .option-button')
                .forEach(btn => btn.classList.remove('selected'));
            button.classList.add('selected');
        });
    });
}

// Initialize theme
function initializeTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark');
    }
}

// Toggle theme
function toggleTheme() {
    const body = document.body;
    const currentTheme = body.classList.contains('dark') ? 'light' : 'dark';
    
    // Toggle the class
    body.classList.toggle('dark');
    
    // Save the theme preference to localStorage
    localStorage.setItem('theme', currentTheme);
}

// Page Transitions
function setupPageTransitions() {
    const transitionOverlay = document.querySelector('.page-transition-overlay');
    const mainContent = document.querySelector('.main-content');
    
    window.handlePageTransition = (event, targetPage) => {
        event.preventDefault();
        mainContent.classList.add('fade-out');
        transitionOverlay.classList.add('active');
        
        setTimeout(() => {
            window.location.href = targetPage;
        }, 300);
    };
}

// Open edit modal
function openEditModal() {
    const modal = document.getElementById('editProfileModal');
    if (!modal) {
        console.error('Modal element not found');
        return;
    }
    
    const userData = JSON.parse(localStorage.getItem('userData'));
    if (!userData) {
        console.error('No user data found');
        return;
    }
    
    // Populate form with current data
    document.getElementById('editName').value = userData.name || '';
    
    // Set selected grade
    const gradeButtons = document.querySelectorAll('#gradeOptions .option-button');
    gradeButtons.forEach(button => {
        if (button.dataset.value === userData.grade) {
            button.classList.add('selected');
        }
    });
    
    // Set selected class
    const classButtons = document.querySelectorAll('#classOptions .option-button');
    classButtons.forEach(button => {
        if (button.dataset.value === userData.class) {
            button.classList.add('selected');
        }
    });
    
    // Show current avatar selection
    document.querySelectorAll('.avatar-option').forEach(option => {
        option.classList.remove('selected');
        if (option.dataset.emoji === userData.emoji) {
            option.classList.add('selected');
        }
    });
    
    modal.classList.add('active');
    document.body.classList.add('modal-open');
}

// Close edit modal
function closeEditModal() {
    const modal = document.getElementById('editProfileModal');
    if (modal) {
        modal.style.display = 'none';
        document.body.classList.remove('modal-open');
    }
}

// Add save profile changes function
function saveProfileChanges() {
    const userData = JSON.parse(localStorage.getItem('userData'));
    const newName = document.getElementById('editName').value;
    const newGrade = document.querySelector('#gradeOptions .option-button.selected')?.dataset.value;
    const newClass = document.querySelector('#classOptions .option-button.selected')?.dataset.value;
    const newEmoji = document.querySelector('.avatar-option.selected')?.dataset.emoji;

    const updatedData = {
        ...userData,
        name: newName,
        grade: newGrade,
        class: newClass,
        emoji: newEmoji || userData.emoji
    };

    localStorage.setItem('userData', JSON.stringify(updatedData));
    loadUserData(); // Refresh the display
    closeEditModal();
}

// Setup profile editing
function setupProfileEditing() {
    // Avatar selection
    document.querySelectorAll('.avatar-option').forEach(option => {
        option.addEventListener('click', () => {
            document.querySelectorAll('.avatar-option').forEach(opt => 
                opt.classList.remove('selected'));
            option.classList.add('selected');
        });
    });
    
    // Form submission
    document.getElementById('editProfileForm').addEventListener('submit', (e) => {
        e.preventDefault();
        
        const selectedAvatar = document.querySelector('.avatar-option.selected');
        const userData = JSON.parse(localStorage.getItem('userData'));
        
        const updatedData = {
            ...userData,
            name: document.getElementById('editName').value,
            grade: document.querySelector('#gradeOptions .option-button.selected')?.dataset.value,
            class: document.querySelector('#classOptions .option-button.selected')?.dataset.value,
            emoji: selectedAvatar.dataset.emoji
        };
        
        localStorage.setItem('userData', JSON.stringify(updatedData));
        loadUserData(); // Refresh profile display
        closeEditModal();
    });
}

// Add this function to show errors
function showError(message) {
    const errorContainer = document.getElementById('errorContainer');
    errorContainer.innerHTML = `<div class="error-message">${message}</div>`;
}

// Call setup when DOM loads
document.addEventListener('DOMContentLoaded', () => {
    initializeProfile();
});

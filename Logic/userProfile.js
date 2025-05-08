// DOM Elements
const profileAvatar = document.getElementById('profileAvatar');
const editAvatarBtn = document.querySelector('.edit-avatar-btn');
const themeToggle = document.getElementById('theme-toggle');
const settingItems = document.querySelectorAll('.setting-item');
const logoutBtn = document.getElementById('logoutBtn');

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

    // Set name
    document.querySelector('.profile-name').textContent = userData.name;

    // Set profile info and emoji for control member
    if (userData.isControl) {
        document.querySelector('.profile-info').textContent = `Control Member • Code: ${userData.code}`;
        profileAvatar.textContent = userData.emoji || '😈';
    } else {
        document.querySelector('.profile-info').textContent = `Class ${userData.class?.toUpperCase() || ''} • Student ID: ${userData.code}`;
        profileAvatar.textContent = userData.emoji || '😊';
    }

    // Set stats
    document.querySelectorAll('.stat-value').forEach(stat => {
        const statType = stat.nextElementSibling.textContent.toLowerCase();
        stat.textContent = userData.stats?.[statType] || '0';
    });
}

// Setup Event Listeners
function setupEventListeners() {
    // Theme toggle
    const themeToggle = document.getElementById('theme-toggle');
    const themeSwitch = document.getElementById('theme-switch');
    
    if (themeToggle && themeSwitch) {
        // Set initial state based on localStorage
        const isDark = localStorage.getItem('theme') === 'dark';
        document.body.classList.toggle('dark', isDark);
        themeSwitch.checked = isDark;
        
        themeToggle.addEventListener('click', () => {
            const isDark = !document.body.classList.contains('dark');
            document.body.classList.toggle('dark');
            localStorage.setItem('theme', isDark ? 'dark' : 'light');
            themeSwitch.checked = isDark;
        });

        // Additional switch handler
        themeSwitch.addEventListener('change', () => {
            const isDark = themeSwitch.checked;
            document.body.classList.toggle('dark', isDark);
            localStorage.setItem('theme', isDark ? 'dark' : 'light');
        });
    }

    // Logout handler
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            localStorage.removeItem('userData');
            window.location.href = 'onboarding.html';
        });
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
    const userData = JSON.parse(localStorage.getItem('userData'));
    
    // Populate current data
    document.getElementById('editName').value = userData.name || '';
    
    // Select current avatar
    document.querySelectorAll('.avatar-option').forEach(option => {
        if(option.dataset.emoji === userData.emoji) {
            option.classList.add('selected');
        }
    });
    
    // Select current grade
    document.querySelectorAll('#gradeOptions .option-button').forEach(button => {
        if(button.dataset.value === userData.grade) {
            button.classList.add('selected');
        }
    });
    
    // Select current class
    document.querySelectorAll('#classOptions .option-button').forEach(button => {
        if(button.dataset.value === userData.class?.slice(-1)) {
            button.classList.add('selected');
        }
    });
    
    modal.style.display = 'flex';
}

// Close edit modal
function closeEditModal() {
    const modal = document.getElementById('editProfileModal');
    modal.style.display = 'none';
}

// Add click handlers for option buttons
function setupOptionButtons() {
    document.querySelectorAll('.option-button').forEach(button => {
        button.addEventListener('click', () => {
            // Remove selected class from siblings
            button.parentElement.querySelectorAll('.option-button')
                .forEach(btn => btn.classList.remove('selected'));
            // Add selected class to clicked button
            button.classList.add('selected');
        });
    });
}

function saveProfileChanges() {
    const userData = JSON.parse(localStorage.getItem('userData'));
    const grade = document.querySelector('#gradeOptions .option-button.selected')?.dataset.value;
    const classLetter = document.querySelector('#classOptions .option-button.selected')?.dataset.value;
    
    const updatedData = {
        ...userData,
        name: document.getElementById('editName').value,
        class: grade + classLetter,
        emoji: document.querySelector('.avatar-option.selected')?.dataset.emoji || '😊'
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

// Add this function to initialize theme
function initializeTheme() {
    const isDark = localStorage.getItem('theme') === 'dark';
    document.body.classList.toggle('dark', isDark);
    const themeSwitch = document.getElementById('theme-switch');
    if (themeSwitch) {
        themeSwitch.checked = isDark;
    }
}

// Call setup when DOM loads
document.addEventListener('DOMContentLoaded', () => {
    initializeProfile();
    
    const themeToggle = document.getElementById('themeToggle');
    
    // Set initial state based on current theme
    themeToggle.checked = document.body.classList.contains('dark');
    
    // Add event listener for theme toggle
    themeToggle.addEventListener('change', () => {
        document.body.classList.toggle('dark');
        localStorage.setItem('theme', themeToggle.checked ? 'dark' : 'light');
    });
});

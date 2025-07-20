// Import Firebase auth functions
import { auth } from './shared/firebase.js';

console.log('Firebase auth imported:', auth);

// DOM Elements
const profileAvatar = document.getElementById('profileAvatar');
const editAvatarBtn = document.querySelector('.edit-avatar-btn');
const themeToggle = document.getElementById('theme-toggle');
const settingItems = document.querySelectorAll('.setting-item');
const logoutBtn = document.getElementById('logoutBtn');

console.log('DOM elements found:', {
    profileAvatar: profileAvatar,
    editAvatarBtn: editAvatarBtn,
    themeToggle: themeToggle,
    settingItems: settingItems.length,
    logoutBtn: logoutBtn
});

// Initialize Profile
function initializeProfile() {
    console.log('Initializing profile...');
    
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
    
    console.log('Profile initialization complete');
    
    // Add a test function to check user data
    window.testUserData = function() {
        const userData = localStorage.getItem('userData');
        console.log('Raw userData from localStorage:', userData);
        if (userData) {
            const parsed = JSON.parse(userData);
            console.log('Parsed userData:', parsed);
            console.log('Name field:', parsed.name);
            console.log('Email field:', parsed.email);
        }
        
        // Check all localStorage keys
        console.log('All localStorage keys:');
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key.startsWith('userData')) {
                console.log(key, ':', localStorage.getItem(key));
            }
        }
        
        // Check DOM elements
        console.log('Profile name element:', document.querySelector('.profile-name'));
        console.log('Profile info element:', document.querySelector('.profile-info'));
        console.log('Profile avatar element:', document.getElementById('profileAvatar'));
    };
}

// Load User Data
function loadUserData() {
    const storedData = localStorage.getItem('userData');
    if (!storedData) {
        window.location.href = 'onboarding.html';
        return;
    }
    const userData = JSON.parse(storedData);

    console.log('Loading user data:', userData);

    // Set name
    const profileNameElement = document.querySelector('.profile-name');
    if (profileNameElement) {
        // Use name if available, otherwise use email prefix, otherwise use 'User'
        const displayName = userData.name || (userData.email ? userData.email.split('@')[0] : 'User');
        profileNameElement.textContent = displayName;
        console.log('Set profile name to:', displayName);
    } else {
        console.error('Profile name element not found');
    }

    // Set profile info and emoji for control member
    const profileInfoElement = document.querySelector('.profile-info');
    if (profileInfoElement) {
        if (userData.isControl) {
            profileInfoElement.textContent = `Control Member • Email: ${userData.email}`;
        } else {
            profileInfoElement.textContent = `Student • Email: ${userData.email}`;
        }
        console.log('Set profile info to:', profileInfoElement.textContent);
    } else {
        console.error('Profile info element not found');
    }

    // Set avatar
    if (profileAvatar) {
        profileAvatar.textContent = userData.emoji || '😊';
        console.log('Set avatar to:', userData.emoji || '😊');
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
        console.log('Setting up logout handler for button:', logoutBtn);
        logoutBtn.addEventListener('click', async () => {
            console.log('Logout button clicked');
            try {
                // Sign out from Firebase
                console.log('Attempting to sign out from Firebase...');
                if (auth && typeof auth.signOut === 'function') {
                    await auth.signOut();
                    console.log('Successfully signed out from Firebase');
                } else {
                    console.log('Firebase auth not available, skipping Firebase signout');
                }
                // Clear local storage
                localStorage.removeItem('userData');
                console.log('Cleared local storage, redirecting...');
                window.location.href = 'onboarding.html';
            } catch (error) {
                console.error('Error signing out:', error);
                // Still clear local storage and redirect
                localStorage.removeItem('userData');
                window.location.href = 'onboarding.html';
            }
        });
    } else {
        console.error('Logout button not found!');
        // Try to find it by class name as fallback
        const logoutByClass = document.querySelector('.logout-item');
        if (logoutByClass) {
            console.log('Found logout button by class, setting up handler');
            logoutByClass.addEventListener('click', () => {
                console.log('Logout button clicked (found by class)');
                localStorage.removeItem('userData');
                window.location.href = 'onboarding.html';
            });
        }
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
    
    const updatedData = {
        ...userData,
        name: document.getElementById('editName').value,
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

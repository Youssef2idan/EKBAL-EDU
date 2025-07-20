// Import Firebase auth functions
import { auth, onAuthStateChanged } from './firebase.js';

function checkAuth() {
    const publicPages = ['onboarding.html'];
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    
    // Check Firebase authentication state
    onAuthStateChanged(auth, (user) => {
        if (user) {
            // User is signed in
            const userData = localStorage.getItem('userData');
            if (!userData && !publicPages.includes(currentPage)) {
                // User is authenticated but no local data, redirect to onboarding
                window.location.href = 'onboarding.html';
                return;
            }
        } else {
            // User is signed out
            if (!publicPages.includes(currentPage)) {
                window.location.href = 'onboarding.html';
                return;
            }
        }
    });
}

// Run auth check when DOM loads
document.addEventListener('DOMContentLoaded', checkAuth);

// When setting user data during login
function setUserData(userData) {
    localStorage.setItem('userData', JSON.stringify(userData));
}

// Export functions for use in other modules
export { setUserData, checkAuth }; 
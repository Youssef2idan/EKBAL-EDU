function checkAuth() {
    const publicPages = ['onboarding.html'];
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    
    // Get current user data
    const userData = localStorage.getItem('userData');
    
    // If user is not authenticated and trying to access any page except onboarding
    if (!userData && !publicPages.includes(currentPage)) {
        window.location.href = 'onboarding.html';
        return;
    }
}

// Run auth check when DOM loads
document.addEventListener('DOMContentLoaded', checkAuth);

// When setting user data during login
function setUserData(userData) {
    // Normalize the class format before storing
    if (userData.class) {
        // Convert to lowercase and remove spaces
        userData.class = userData.class.toLowerCase().replace(/\s+/g, '');
        
        // Ensure it follows the format: middle1a, middle1b, etc.
        if (!userData.class.match(/^middle[12][abc]$/)) {
            console.error('Invalid class format:', userData.class);
            // Set a default or handle the error
        }
    }
    
    localStorage.setItem('userData', JSON.stringify(userData));
} 
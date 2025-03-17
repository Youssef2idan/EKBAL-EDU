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
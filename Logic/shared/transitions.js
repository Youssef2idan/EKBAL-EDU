// Page Transition Handler
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

// Initialize transitions when DOM is loaded
document.addEventListener('DOMContentLoaded', setupPageTransitions); 
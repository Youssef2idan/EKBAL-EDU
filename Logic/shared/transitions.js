// Page Transition Handler
function handlePageTransition(event, targetPage) {
    event.preventDefault();
    
    // Get the transition overlay
    const overlay = document.querySelector('.page-transition-overlay');
    
    // Add the active class to start the transition
    overlay.classList.add('active');

    // Wait for the transition animation
    setTimeout(() => {
        window.location.href = targetPage;
    }, 300);
}

// When the page loads, remove the active class from the overlay
document.addEventListener('DOMContentLoaded', () => {
    const overlay = document.querySelector('.page-transition-overlay');
    if (overlay) {
        overlay.classList.remove('active');
    }
}); 
function handlePageTransition(event, page) {
    event.preventDefault();
   

    const overlay = document.querySelector('.page-transition-overlay');
    if (overlay) {
        overlay.style.opacity = '1';
        setTimeout(() => {
            window.location.href = page;
        }, 300);
    } else {
        window.location.href = page;
    }
} 
document.addEventListener('DOMContentLoaded', () => {
    const termOne = document.getElementById('termOne');
    const termTwo = document.getElementById('termTwo');
    const bookCards = document.querySelectorAll('.book-card');
    const modal = document.getElementById('pdfModal');
    const closeBtn = document.querySelector('.close-btn');
    const pdfViewer = document.getElementById('pdfViewer');

    // Term selection handlers
    termOne.addEventListener('click', () => {
        termOne.classList.add('active');
        termTwo.classList.remove('active');
        updateVisibleBooks('one');
    });

    termTwo.addEventListener('click', () => {
        termTwo.classList.add('active');
        termOne.classList.remove('active');
        updateVisibleBooks('two');
    });

    // Close modal when clicking the close button
    closeBtn.addEventListener('click', () => {
        modal.style.display = 'none';
        pdfViewer.src = '';
    });

    // Close modal when clicking outside
    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
            pdfViewer.src = '';
        }
    });

    // Initialize with first term books visible
    updateVisibleBooks('one');
});

// Update visible books based on selected term
function updateVisibleBooks(term) {
    const bookCards = document.querySelectorAll('.book-card');
    bookCards.forEach(card => {
        if (card.dataset.term === term) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

// Preview PDF in modal
function previewBook(bookId) {
    const modal = document.getElementById('pdfModal');
    const pdfViewer = document.getElementById('pdfViewer');
    
    // Get the PDF URL based on bookId
    const pdfUrl = getPdfUrl(bookId);
    
    if (pdfUrl) {
        pdfViewer.src = pdfUrl;
        modal.style.display = 'block';
    } else {
        showError('PDF not available');
    }
}

// Download PDF
function downloadBook(bookId) {
    const pdfUrl = getPdfUrl(bookId);
    
    if (pdfUrl) {
        const link = document.createElement('a');
        link.href = pdfUrl;
        link.download = getBookFileName(bookId);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    } else {
        showError('PDF not available');
    }
}

// Get PDF URL based on book ID
function getPdfUrl(bookId) {
    // Map book IDs to their corresponding PDF paths
    const pdfPaths = {
        'arabic-term1': '/Resources/Books/Arabic/term1.pdf',
        'arabic-term2': '/Resources/Books/Arabic/term2.pdf',
        'math-term1': '/Resources/Books/Math/term1.pdf',
        'math-term2': '/Resources/Books/Math/term2.pdf',
        'english-term1': '/Resources/Books/English/term1.pdf',
        'english-term2': '/Resources/Books/English/term2.pdf',
        'science-term1': '/Resources/Books/Science/term1.pdf',
        'science-term2': '/Resources/Books/Science/term2.pdf',
        'religion-term1': '/Resources/Books/Religion/term1.pdf',
        'religion-term2': '/Resources/Books/Religion/term2.pdf',
        'social-term1': '/Resources/Books/Social/term1.pdf',
        'social-term2': '/Resources/Books/Social/term2.pdf'
    };

    return pdfPaths[bookId] || null;
}

// Get book file name for download
function getBookFileName(bookId) {
    const [subject, term] = bookId.split('-');
    const termNumber = term === 'term1' ? '1' : '2';
    return `${subject.charAt(0).toUpperCase() + subject.slice(1)}_Book_Term${termNumber}.pdf`;
}

// Show error message
function showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.innerHTML = `
        <span class="error-icon">⚠️</span>
        ${message}
    `;
    
    document.body.appendChild(errorDiv);
    
    // Remove error message after 3 seconds
    setTimeout(() => {
        errorDiv.remove();
    }, 3000);
} 
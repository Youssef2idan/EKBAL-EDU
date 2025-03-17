// Add this at the top of the file, outside any other functions
const moreButton = document.getElementById('moreBtn');
const moreMenu = document.getElementById('moreMenu');
const closeMenu = document.getElementById('closeMenu');

moreButton.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    moreMenu.classList.add('active');
});

closeMenu.addEventListener('click', () => {
    moreMenu.classList.remove('active');
});

document.addEventListener('click', (e) => {
    if (!moreMenu.contains(e.target) && !moreButton.contains(e.target)) {
        moreMenu.classList.remove('active');
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const modeToggle = document.querySelector('.mode-toggle');
    const body = document.querySelector('body');
    const gradeSelect = document.getElementById('gradeSelect');
    const studentCode = document.getElementById('studentCode');
    const getMarksBtn = document.getElementById('getMarks');
    const resultsContainer = document.getElementById('resultsContainer');
    const myDataBtn = document.getElementById('myDataBtn');

    // Dark mode handler
    let getMode = localStorage.getItem("mode");
    if(getMode && getMode === "dark") {
        body.classList.toggle("dark");
    }

    modeToggle.addEventListener("click", () => {
        body.classList.toggle("dark");
        localStorage.setItem("mode", body.classList.contains("dark") ? "dark" : "light");
    });

    // My Data button handler
    myDataBtn.addEventListener('click', async () => {
        const userData = JSON.parse(localStorage.getItem('userData'));
        if (!userData || !userData.studentCode) {
            showError('Please log in to view your marks');
            return;
        }

        const timePeriod = gradeSelect.value;
        if (!timePeriod) {
            showError('Please select a time period');
            return;
        }

        try {
            const marks = await fetchMarks(userData.studentCode, timePeriod);
            displayMarks(marks);
        } catch (error) {
            showError('Failed to fetch marks. Please try again.');
        }
    });

    // Manual search handler
    getMarksBtn.addEventListener('click', async () => {
        const code = studentCode.value.trim();
        const timePeriod = gradeSelect.value;

        if (!code) {
            showError('Please enter a student code');
            return;
        }

        if (!timePeriod) {
            showError('Please select a time period');
            return;
        }

        try {
            const marks = await fetchMarks(code, timePeriod);
            displayMarks(marks);
        } catch (error) {
            showError('Failed to fetch marks. Please try again.');
        }
    });

    function showError(message) {
        resultsContainer.innerHTML = `
            <div class="error-message">
                <span class="error-icon">⚠️</span>
                ${message}
            </div>
        `;
    }

    async function fetchMarks(studentCode, timePeriod) {
        // This is a mock function - replace with actual API call
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    subjects: [
                        { name: 'Mathematics', grade: 'A+', score: 95, trend: '+5%' },
                        { name: 'Science', grade: 'A', score: 88, trend: '+3%' },
                        { name: 'English', grade: 'B+', score: 82, trend: '-2%' }
                    ]
                });
            }, 1000);
        });
    }

    function displayMarks(data) {
        resultsContainer.innerHTML = data.subjects.map(subject => `
            <div class="subject-card">
                <div class="subject-header">
                    <h3>${subject.name}</h3>
                    <span class="grade">${subject.grade}</span>
                </div>
                <div class="progress-bar">
                    <div class="progress" style="width: ${subject.score}%"></div>
                </div>
                <div class="marks-details">
                    <span>${subject.score}/100</span>
                    <span class="trend ${subject.trend.includes('+') ? 'positive' : 'negative'}">
                        ${subject.trend}
                    </span>
                </div>
            </div>
        `).join('');
    }
});

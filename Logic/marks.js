document.addEventListener('DOMContentLoaded', () => {
    const studentCode = document.getElementById('studentCode');
    const getMarksBtn = document.getElementById('getMarks');
    const resultsContainer = document.getElementById('resultsContainer');
    const monthOne = document.getElementById('monthOne');
    const monthTwo = document.getElementById('monthTwo');

    let selectedMonth = null;

    // Month selection handlers
    monthOne.addEventListener('click', () => {
        selectedMonth = 'one';
        monthOne.classList.add('active');
        monthTwo.classList.remove('active');
    });

    monthTwo.addEventListener('click', () => {
        selectedMonth = 'two';
        monthTwo.classList.add('active');
        monthOne.classList.remove('active');
    });

    // Get marks button handler
    getMarksBtn.addEventListener('click', async () => {
        const code = studentCode.value.trim();

        if (!code) {
            showError('Please enter a student code');
            return;
        }

        if (!selectedMonth) {
            showError('Please select a month');
            return;
        }

        try {
            const marks = await fetchMarks(code, selectedMonth);
            if (marks) {
                displayMarks(marks);
            } else {
                showError('No data found for this student code');
            }
        } catch (error) {
            console.error('Error:', error);
            showError('Failed to fetch marks. Please try again.');
        }
    });

    async function fetchMarks(studentCode, month) {
        try {
            // Fix the file path for month two
            const filePath = month === 'one' 
                ? '/Data/Marks/Control/month_one/m1sm.json'
                : '/Data/Marks/Control/month_two/m2sm.json';  // Changed from m1sm.json to m2sm.json
            
            const response = await fetch(filePath);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            
            // Find the student data
            const studentData = data.find(student => student['رقم جاوس'] === studentCode);
            
            if (!studentData) return null;

            return {
                name: studentData['اسم'],
                subjects: [
                    { name: 'Arabic', score: studentData['Arabic'] },
                    { name: 'English', score: studentData['English'] },
                    { name: 'Math', score: studentData['Math'] },
                    { name: 'Science', score: studentData['Science'] },
                    { name: 'Social Studies', score: studentData['Social studies'] },
                    { name: 'H.L', score: studentData['H.L'] },
                    { name: 'Art', score: studentData['ART'] },
                    { name: 'Computer', score: studentData['Computer'] },
                    { name: 'Religion', score: studentData['Religion'] },
                    { name: 'French', score: studentData['French'] }
                ]
            };
        } catch (error) {
            console.error('Error details:', error);
            throw error;
        }
    }

    function displayMarks(data) {
        resultsContainer.setAttribute('data-student', JSON.stringify(data));
        resultsContainer.innerHTML = `
            <div class="student-info">
                <h2>${data.name}</h2>
                <div class="marks-grid">
                    ${data.subjects.map(subject => `
                        <div class="subject-card">
                            <h3>${subject.name}</h3>
                            <p class="score">${subject.score}</p>
                        </div>
                    `).join('')}
                </div>
                <button class="download-btn" onclick="downloadCertificate()">Download Certificate</button>
            </div>
        `;
    }

    async function downloadCertificate() {
        const studentData = JSON.parse(resultsContainer.getAttribute('data-student'));
        const certificateCard = document.getElementById('certificateCard');
        const certificateOverlay = document.getElementById('certificateOverlay');
        const certStudentName = document.getElementById('certStudentName');
        const certMarksGrid = document.getElementById('certMarksGrid');
        const certDate = document.getElementById('certDate');
        
        // Update certificate content
        certStudentName.textContent = studentData.name;
        
        // Update marks grid
        certMarksGrid.innerHTML = studentData.subjects.map(subject => `
            <div class="subject-box">
                <div class="subject-name">${subject.name}</div>
                <div class="subject-score">${subject.score}</div>
            </div>
        `).join('');
        
        // Update date
        const today = new Date();
        certDate.textContent = today.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
        
        // Show overlay and certificate
        certificateOverlay.style.display = 'block';
        certificateCard.style.display = 'block';
        
        // Wait a bit to ensure elements are rendered
        await new Promise(resolve => setTimeout(resolve, 100));
        
        try {
            const canvas = await html2canvas(certificateCard, {
                backgroundColor: '#ffffff',
                scale: 2,
                logging: false,
                useCORS: true
            });
            
            const image = canvas.toDataURL('image/png', 1.0);
            const link = document.createElement('a');
            link.download = `EDU-Certificate-${studentData.name}.png`;
            link.href = image;
            link.click();
            
            // Hide overlay and certificate after capture
            certificateOverlay.style.display = 'none';
            certificateCard.style.display = 'none';
        } catch (error) {
            console.error('Error generating certificate:', error);
            showError('Failed to generate certificate. Please try again.');
            // Hide overlay and certificate on error
            certificateOverlay.style.display = 'none';
            certificateCard.style.display = 'none';
        }
    }

    function showError(message) {
        resultsContainer.innerHTML = `
            <div class="error-message">
                <span class="error-icon">⚠️</span>
                ${message}
            </div>
        `;
    }

    // Add global function for download
    window.downloadCertificate = downloadCertificate;
});

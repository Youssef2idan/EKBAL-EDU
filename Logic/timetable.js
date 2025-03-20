document.addEventListener('DOMContentLoaded', () => {
    const gradeSelect = document.getElementById('gradeSelect');
    const classSelect = document.getElementById('classSelect');
    const getMyDataBtn = document.getElementById('getMyData');
    const placeholder = document.getElementById('placeholder');

    // Enable class select when grade is selected
    gradeSelect.addEventListener('change', () => {
        if (gradeSelect.value) {
            classSelect.disabled = false;  // Enable class select when grade is chosen
        } else {
            classSelect.disabled = true;   // Disable if no grade selected
            classSelect.value = '';        // Reset class selection
            hideAllTimetables();
            showPlaceholder();
        }
    });

    // Show timetable when both grade and class are selected
    function updateTimetable() {
        const grade = gradeSelect.value;
        const classLetter = classSelect.value;

        hideAllTimetables();  // Always hide all timetables first
        
        if (grade && classLetter) {
            const timetableId = `${grade}${classLetter}-timetable`;
            console.log('Looking for timetable:', timetableId); // Debug log
            const selectedTimetable = document.getElementById(timetableId);
            if (selectedTimetable) {
                selectedTimetable.style.display = 'block';
                hidePlaceholder();
            } else {
                console.log('Timetable not found'); // Debug log
                showPlaceholder();
            }
        } else {
            showPlaceholder();
        }
    }

    function hideAllTimetables() {
        document.querySelectorAll('.timetable').forEach(timetable => {
            timetable.style.display = 'none';
        });
    }

    function showPlaceholder() {
        placeholder.style.display = 'block';
    }

    function hidePlaceholder() {
        placeholder.style.display = 'none';
    }

    // Event listeners for select changes
    gradeSelect.addEventListener('change', updateTimetable);
    classSelect.addEventListener('change', updateTimetable);

    // My Data button handler
    getMyDataBtn.addEventListener('click', () => {
        try {
            // Get user data from localStorage
            const userData = localStorage.getItem('userData');
            if (!userData) {
                alert('Please log in first');
                return;
            }

            // Parse the user data
            const userInfo = JSON.parse(userData);
            console.log('User Data:', userInfo); // Debug log

            // Get the class information
            const userClass = userInfo.class ? userInfo.class.toLowerCase() : '';
            console.log('User Class:', userClass); // Debug log

            if (!userClass) {
                alert('Class information not found');
                return;
            }

            // Extract grade level (middle1, middle2, etc)
            let grade;
            // More flexible grade detection
            if (userClass.match(/middle\s*1|m1|middle\s*one/i)) {
                grade = 'middle1';
            } else if (userClass.match(/middle\s*2|m2|middle\s*two/i)) {
                grade = 'middle2';
            } else {
                console.error('Grade level not recognized:', userClass);
                alert('Grade level not recognized. Please check your profile data.');
                return;
            }

            // Extract class letter (a, b, c)
            const classMatch = userClass.match(/[abc]$/i);
            if (!classMatch) {
                console.error('Class letter not found:', userClass);
                alert('Class letter not recognized. Please check your profile data.');
                return;
            }
            const classLetter = classMatch[0].toLowerCase();
            
            console.log('Extracted Grade:', grade); // Debug log
            console.log('Extracted Class:', classLetter); // Debug log

            // Set the grade select
            gradeSelect.value = grade;
            
            // Enable and set class select
            classSelect.disabled = false;
            classSelect.value = classLetter;
            
            // Update timetable display
            updateTimetable();
        } catch (error) {
            console.error('Error loading user data:', error);
            alert('Error loading user data. Please try logging in again.');
        }
    });

    // Initialize with all timetables hidden
    hideAllTimetables();
    showPlaceholder();
});

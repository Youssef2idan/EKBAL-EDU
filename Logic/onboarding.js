document.addEventListener('DOMContentLoaded', () => {
    // Check if user has completed onboarding
    if (localStorage.getItem('userData')) {
        window.location.href = 'index.html';
        return;
    }

    // Setup avatar selection
    setupAvatarSelection();
    
    // Setup control button
    setupControlButton();
});

function setupAvatarSelection() {
    const avatarOptions = document.querySelectorAll('.avatar-option');
    avatarOptions.forEach(option => {
        option.addEventListener('click', () => {
            avatarOptions.forEach(opt => opt.classList.remove('selected'));
            option.classList.add('selected');
        });
    });
}

async function nextStep(currentStepId, nextStepId) {
    const currentStep = document.getElementById(currentStepId);
    const nextStep = document.getElementById(nextStepId);
    
    // Special handling for student code validation
    if (currentStepId === 'codeStep') {
        const studentCode = document.getElementById('studentCode').value;
        const validationResult = await validateStudentCode(studentCode);
        
        if (!validationResult.isValid) {
            showError('Invalid student code. Please check and try again.', 'studentCode');
            return;
        }
        
        // If it's a control member, save their data and redirect to home page
        if (validationResult.isControl) {
            // Set constant user data for control member
            const userData = {
                name: 'Hasan Magdy',
                emoji: '😈',
                code: 'HR26626',
                isControl: true,
                stats: {
                    attendance: '100%',
                    average: '100%',
                    assignments: '%%%'
                }
            };
            localStorage.setItem('userData', JSON.stringify(userData));
            window.location.href = 'index.html';
            return;
        }
    }
    
    // Validate current step
    if (!validateStep(currentStepId)) {
        const errorMessage = getErrorMessage(currentStepId);
        showError(errorMessage, currentStepId);
        return;
    }

    currentStep.classList.remove('active');
    nextStep.classList.add('active');
    updateDobyMessage(nextStepId);
    updateProgress(nextStepId);
}

function validateStep(stepId) {
    switch(stepId) {
        case 'nameStep':
            return document.getElementById('userName').value.trim() !== '';
        case 'avatarStep':
            return document.querySelector('.avatar-option.selected') !== null;
        case 'codeStep':
            return document.getElementById('studentCode').value.trim() !== '';
        case 'gradeStep':
            return document.getElementById('grade').value !== '' && 
                   document.getElementById('class').value !== '';
        default:
            return true;
    }
}

function updateDobyMessage(stepId) {
    const dobyMessage = document.querySelector('.doby-message p');
    switch(stepId) {
        case 'nameStep':
            dobyMessage.textContent = "Hi! I'm Doby, your personal assistant. Let's get your account set up! What's your name?";
            break;
        case 'avatarStep':
            dobyMessage.textContent = "Great! Now, let's pick a cool avatar for you! Choose one that matches your style!";
            break;
        case 'codeStep':
            dobyMessage.textContent = "Perfect! I'll need your student ID to set up your account properly.";
            break;
        case 'gradeStep':
            dobyMessage.textContent = "Almost done! Just need to know which grade and class you're in.";
            break;
        case 'welcomeStep':
            dobyMessage.textContent = "Awesome! Everything is ready for you. Welcome to EKBAL EDU!";
            break;
    }
}

// Add this function to validate student code
async function validateStudentCode(code) {
    try {
        const response = await fetch('/Data/studentData/student-check.json');
        const data = await response.json();
        
        // First check if the code is in the control array
        const controlCodes = data.find(grade => grade.control)?.control || [];
        if (controlCodes.includes(code)) {
            return { isValid: true, isControl: true };
        }
        
        // If not in control, check other grades
        const isInOtherGrades = data.some(grade => {
            const gradeCodes = Object.values(grade)[0];
            return Array.isArray(gradeCodes) && gradeCodes.includes(code);
        });
        
        return { isValid: isInOtherGrades, isControl: false };
    } catch (error) {
        console.error('Error validating student code:', error);
        return { isValid: false, isControl: false };
    }
}

// Add this function to show error message
function showError(message, inputId) {
    const input = document.getElementById(inputId);
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.style.cssText = 'color: red; font-size: 14px; margin-bottom: 8px;';
    errorDiv.textContent = message;
    
    // Remove any existing error message
    const existingError = input.parentElement.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }
    
    // Insert error message before the input
    input.parentElement.insertBefore(errorDiv, input);
}

// Update the completeOnboarding function
async function completeOnboarding() {
    if (!validateStep('gradeStep')) return;

    const studentCode = document.getElementById('studentCode').value;
    const isValidCode = await validateStudentCode(studentCode);

    if (!isValidCode) {
        alert('Invalid student code. Please check and try again.');
        return;
    }

    const userData = {
        name: document.getElementById('userName').value,
        emoji: document.querySelector('.avatar-option.selected').dataset.emoji,
        code: studentCode,
        grade: document.getElementById('grade').value,
        class: document.getElementById('class').value,
        stats: {
            attendance: '0%',
            average: '0%',
            assignments: '0'
        }
    };

    // Show welcome screen
    document.getElementById('gradeStep').classList.remove('active');
    document.getElementById('welcomeStep').classList.add('active');
    document.getElementById('welcomeName').textContent = userData.name;

    // Save user data
    localStorage.setItem('userData', JSON.stringify(userData));

    // Redirect to main app after delay
    setTimeout(() => {
        window.location.href = 'userProfile.html';
    }, 3000);
}

// Add error messages for each step
function getErrorMessage(stepId) {
    switch(stepId) {
        case 'nameStep':
            return 'Please enter your name';
        case 'avatarStep':
            return 'Please select an avatar';
        case 'codeStep':
            return 'Please enter a valid student code';
        case 'gradeStep':
            return 'Please select your grade and class';
        default:
            return 'Please complete this step';
    }
}

// Add these new functions
function nextSlide(currentId, nextId) {
    document.getElementById(currentId).classList.remove('active');
    document.getElementById(nextId).classList.add('active');
    
    // Update progress dots
    document.querySelector(`[data-slide="${currentId}"]`).classList.remove('active');
    document.querySelector(`[data-slide="${nextId}"]`).classList.add('active');
}

function startOnboarding() {
    // Hide the intro slides and show the onboarding form
    document.querySelectorAll('.slide').forEach(slide => slide.classList.remove('active'));
    document.getElementById('onboardingForm').classList.add('active');
    document.querySelector('.progress-dots').style.display = 'none';
}

function updateProgress(stepId) {
    const totalSteps = 4;
    let currentStep;
    
    switch(stepId) {
        case 'nameStep': currentStep = 1; break;
        case 'avatarStep': currentStep = 2; break;
        case 'codeStep': currentStep = 3; break;
        case 'gradeStep': currentStep = 4; break;
        default: currentStep = 1;
    }
    
    const progress = (currentStep / totalSteps) * 100;
    document.querySelectorAll('.progress').forEach(bar => {
        bar.style.width = `${progress}%`;
    });
}

function setupControlButton() {
    // Create and add control button
    const controlButton = document.createElement('button');
    controlButton.className = 'control-button';
    controlButton.textContent = 'Control Member';
    controlButton.style.cssText = `
        margin-top: 10px;
        padding: 10px 20px;
        background-color: #2c3e50;
        color: white;
        border: none;
        border-radius: 6px;
        cursor: pointer;
        font-weight: bold;
        transition: all 0.3s ease;
        box-shadow: 0 2px 5px rgba(0,0,0,0.2);
    `;
    
    // Add hover effect
    controlButton.addEventListener('mouseover', () => {
        controlButton.style.backgroundColor = '#34495e';
        controlButton.style.transform = 'translateY(-2px)';
    });
    
    controlButton.addEventListener('mouseout', () => {
        controlButton.style.backgroundColor = '#2c3e50';
        controlButton.style.transform = 'translateY(0)';
    });
    
    // Add button to the first step
    const firstStep = document.getElementById('nameStep');
    firstStep.appendChild(controlButton);
    
    // Create popup menu
    const popup = document.createElement('div');
    popup.className = 'control-popup';
    popup.style.cssText = `
        display: none;
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: white;
        padding: 25px;
        border-radius: 12px;
        box-shadow: 0 4px 20px rgba(0,0,0,0.15);
        z-index: 1000;
        min-width: 300px;
    `;
    
    // Add popup content
    popup.innerHTML = `
        <h3 style="margin-bottom: 20px; color: #2c3e50; font-size: 1.5em;">Control Member Access</h3>
        <input type="text" id="controlCode" placeholder="Enter control code" style="
            width: 100%;
            padding: 12px;
            margin-bottom: 20px;
            border: 2px solid #e0e0e0;
            border-radius: 6px;
            font-size: 1em;
            transition: border-color 0.3s ease;
        ">
        <div style="display: flex; gap: 12px;">
            <button id="submitControlCode" style="
                padding: 12px 24px;
                background-color: #2c3e50;
                color: white;
                border: none;
                border-radius: 6px;
                cursor: pointer;
                font-weight: bold;
                transition: all 0.3s ease;
                flex: 1;
            ">Submit</button>
            <button id="cancelControl" style="
                padding: 12px 24px;
                background-color: #e74c3c;
                color: white;
                border: none;
                border-radius: 6px;
                cursor: pointer;
                font-weight: bold;
                transition: all 0.3s ease;
                flex: 1;
            ">Cancel</button>
        </div>
    `;
    
    // Add popup to body
    document.body.appendChild(popup);
    
    // Add overlay
    const overlay = document.createElement('div');
    overlay.className = 'popup-overlay';
    overlay.style.cssText = `
        display: none;
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0,0,0,0.6);
        z-index: 999;
        backdrop-filter: blur(3px);
    `;
    document.body.appendChild(overlay);
    
    // Add event listeners
    controlButton.addEventListener('click', () => {
        popup.style.display = 'block';
        overlay.style.display = 'block';
    });
    
    document.getElementById('cancelControl').addEventListener('click', () => {
        popup.style.display = 'none';
        overlay.style.display = 'none';
    });
    
    document.getElementById('submitControlCode').addEventListener('click', async () => {
        const controlCode = document.getElementById('controlCode').value;
        const validationResult = await validateStudentCode(controlCode);
        
        if (validationResult.isValid && validationResult.isControl) {
            // Set constant user data for control member
            const userData = {
                name: 'Hasan Magdy',
                emoji: '😈',
                code: 'HR26626',
                isControl: true,
                stats: {
                    attendance: '0%',
                    average: '0%',
                    assignments: '0'
                }
            };
            localStorage.setItem('userData', JSON.stringify(userData));
            window.location.href = 'index.html';
        } else {
            const errorDiv = document.createElement('div');
            errorDiv.style.cssText = 'color: #e74c3c; margin-top: 15px; font-size: 0.9em;';
            errorDiv.textContent = 'Invalid control code. Please try again.';
            
            const existingError = popup.querySelector('.error-message');
            if (existingError) {
                existingError.remove();
            }
            
            popup.appendChild(errorDiv);
        }
    });
    
    // Add hover effects for popup buttons
    const submitButton = document.getElementById('submitControlCode');
    const cancelButton = document.getElementById('cancelControl');
    
    submitButton.addEventListener('mouseover', () => {
        submitButton.style.backgroundColor = '#34495e';
        submitButton.style.transform = 'translateY(-2px)';
    });
    
    submitButton.addEventListener('mouseout', () => {
        submitButton.style.backgroundColor = '#2c3e50';
        submitButton.style.transform = 'translateY(0)';
    });
    
    cancelButton.addEventListener('mouseover', () => {
        cancelButton.style.backgroundColor = '#c0392b';
        cancelButton.style.transform = 'translateY(-2px)';
    });
    
    cancelButton.addEventListener('mouseout', () => {
        cancelButton.style.backgroundColor = '#e74c3c';
        cancelButton.style.transform = 'translateY(0)';
    });
}
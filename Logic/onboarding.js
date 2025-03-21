document.addEventListener('DOMContentLoaded', () => {
    // Check if user has completed onboarding
    if (localStorage.getItem('userData')) {
        window.location.href = 'userProfile.html';
        return;
    }

    // Setup avatar selection
    setupAvatarSelection();
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
        const isValidCode = await validateStudentCode(studentCode);
        
        if (!isValidCode) {
            showError('Invalid student code. Please check and try again.', 'studentCode');
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
        const response = await fetch('/Data/studentCodes.json');
        const data = await response.json();
        return data.validCodes.includes(code);
    } catch (error) {
        console.error('Error validating student code:', error);
        return false;
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
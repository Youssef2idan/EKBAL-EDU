// Import Firebase auth functions
import { auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, db } from './shared/firebase.js';
import { setDoc, doc, getDoc } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, setting up onboarding...');
    
    // Check if user has completed onboarding
    if (localStorage.getItem('userData')) {
        window.location.href = 'index.html';
        return;
    }

    // Setup avatar selection
    setupAvatarSelection();
    
    // Setup control button
    setupControlButton();
    
    // Make functions globally available for onclick handlers
window.nextStep = nextStep;
window.nextSlide = nextSlide;
window.startOnboarding = startOnboarding;
window.completeOnboarding = completeOnboarding;
window.chooseAction = chooseAction;
window.completeSignup = completeSignup;
window.completeLogin = completeLogin;
    
    console.log('Functions made global:', {
        nextStep: typeof window.nextStep,
        nextSlide: typeof window.nextSlide,
        startOnboarding: typeof window.startOnboarding,
        completeOnboarding: typeof window.completeOnboarding,
        chooseAction: typeof window.chooseAction,
        completeSignup: typeof window.completeSignup,
        completeLogin: typeof window.completeLogin
    });
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
    console.log('nextStep called with:', currentStepId, nextStepId);
    
    const currentStep = document.getElementById(currentStepId);
    const nextStepElement = document.getElementById(nextStepId);
    
    console.log('Elements found:', {
        currentStep: currentStep,
        nextStep: nextStepElement
    });
    
    // Validate current step
    if (!validateStep(currentStepId)) {
        const errorMessage = getErrorMessage(currentStepId);
        showError(errorMessage, currentStepId);
        return;
    }

    currentStep.classList.remove('active');
    nextStepElement.classList.add('active');
    updateDobyMessage(nextStepId);
    updateProgress(nextStepId);
    
    console.log('Step transition completed');
}

function validateStep(stepId) {
    switch(stepId) {
        case 'nameStep':
            return document.getElementById('userName').value.trim() !== '';
        case 'avatarStep':
            return document.querySelector('.avatar-option.selected') !== null;
        case 'signupAuthStep':
            return validateSignupStep();
        case 'loginAuthStep':
            return validateLoginStep();
        default:
            return true;
    }
}

function updateDobyMessage(stepId) {
    const dobyMessage = document.querySelector('.doby-message p');
    switch(stepId) {
        case 'chooseActionStep':
            dobyMessage.textContent = "Hi! I'm Doby, your personal assistant. Welcome back! What would you like to do today?";
            break;
        case 'nameStep':
            dobyMessage.textContent = "Hi! I'm Doby, your personal assistant. Let's get your account set up! What's your name?";
            break;
        case 'avatarStep':
            dobyMessage.textContent = "Great! Now, let's pick a cool avatar for you! Choose one that matches your style!";
            break;
        case 'signupAuthStep':
            dobyMessage.textContent = "Perfect! Now let's create your account. Please enter your email and choose a secure password.";
            break;
        case 'loginAuthStep':
            dobyMessage.textContent = "Great! Please enter your email and password to sign in to your account.";
            break;
        case 'welcomeStep':
            dobyMessage.textContent = "Awesome! Everything is ready for you. Welcome to EKBAL EDU!";
            break;
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
    if (!validateStep('authStep')) {
        const errorMessage = getErrorMessage('authStep');
        showError(errorMessage, 'authStep');
        return;
    }

    const email = document.getElementById('userEmail').value.trim();
    const password = document.getElementById('userPassword').value;
    const name = document.getElementById('userName').value;
    const emoji = document.querySelector('.avatar-option.selected').dataset.emoji;

    try {
        // Create user account with Firebase
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        const userData = {
            name: name,
            emoji: emoji,
            email: email,
            uid: user.uid,
            stats: {
                attendance: '0%',
                average: '0%',
                assignments: '0'
            }
        };

        // Show welcome screen
        document.getElementById('authStep').classList.remove('active');
        document.getElementById('welcomeStep').classList.add('active');
        document.getElementById('welcomeName').textContent = userData.name;

        // Save user data
        localStorage.setItem('userData', JSON.stringify(userData));

        // Redirect to main app after delay
        setTimeout(() => {
            window.location.href = 'userProfile.html';
        }, 3000);

    } catch (error) {
        console.error('Error creating account:', error);
        let errorMessage = 'An error occurred while creating your account.';
        
        if (error.code === 'auth/email-already-in-use') {
            errorMessage = 'This email is already registered. Please use a different email or try signing in.';
        } else if (error.code === 'auth/weak-password') {
            errorMessage = 'Password should be at least 6 characters long.';
        } else if (error.code === 'auth/invalid-email') {
            errorMessage = 'Please enter a valid email address.';
        }
        
        showError(errorMessage, 'authStep');
    }
}

// Add error messages for each step
function getErrorMessage(stepId) {
    switch(stepId) {
        case 'nameStep':
            return 'Please enter your name';
        case 'avatarStep':
            return 'Please select an avatar';
        case 'signupAuthStep':
            return getSignupErrorMessage();
        case 'loginAuthStep':
            return getLoginErrorMessage();
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
    const totalSteps = 3;
    let currentStep;
    
    switch(stepId) {
        case 'chooseActionStep': currentStep = 1; break;
        case 'nameStep': currentStep = 2; break;
        case 'avatarStep': currentStep = 2; break;
        case 'signupAuthStep': currentStep = 3; break;
        case 'loginAuthStep': currentStep = 3; break;
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
    
    // Add button to the choose action step
    const chooseActionStep = document.getElementById('chooseActionStep');
    chooseActionStep.appendChild(controlButton);
    
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
        
        // For now, we'll use a simple control code check
        // You can modify this to use Firebase authentication for control members
        if (controlCode === 'HR26626') {
            // Set constant user data for control member
            const userData = {
                name: 'Hasan Magdy',
                emoji: '😈',
                email: 'control@ekbal.edu',
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

// New functions for signup/login flow
function chooseAction(action) {
    console.log('Action chosen:', action);
    
    if (action === 'signup') {
        // Go to name step for signup
        document.getElementById('chooseActionStep').classList.remove('active');
        document.getElementById('nameStep').classList.add('active');
        updateDobyMessage('nameStep');
        updateProgress('nameStep');
    } else if (action === 'login') {
        // Go directly to login step
        document.getElementById('chooseActionStep').classList.remove('active');
        document.getElementById('loginAuthStep').classList.add('active');
        updateDobyMessage('loginAuthStep');
        updateProgress('loginAuthStep');
    }
}

async function completeSignup() {
    if (!validateSignupStep()) {
        const errorMessage = getSignupErrorMessage();
        showError(errorMessage, 'signupAuthStep');
        return;
    }

    const email = document.getElementById('signupEmail').value.trim();
    const password = document.getElementById('signupPassword').value;
    const name = document.getElementById('userName').value;
    const emoji = document.querySelector('.avatar-option.selected').dataset.emoji;
    const studentCode = document.getElementById('studentCode').value.trim();

    try {
        // Create user account with Firebase
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        const userData = {
            name: name,
            emoji: emoji,
            email: email,
            uid: user.uid,
            studentCode: studentCode,
            stats: {
                attendance: '0%',
                average: '0%',
                assignments: '0'
            }
        };

        // Save user data to Firestore
        await setDoc(doc(db, "students", user.uid), {
            name: name,
            email: email,
            studentCode: studentCode
        });

        // Show welcome screen
        document.getElementById('signupAuthStep').classList.remove('active');
        document.getElementById('welcomeStep').classList.add('active');
        
        const welcomeNameElement = document.getElementById('welcomeName');
        const welcomeMessageElement = document.getElementById('welcomeMessage');
        
        if (welcomeNameElement) {
            // Use name if available, otherwise use email prefix
            const displayName = userData.name || (userData.email ? userData.email.split('@')[0] : 'User');
            welcomeNameElement.textContent = displayName;
            console.log('Set welcome name to:', displayName);
        } else {
            console.error('Welcome name element not found');
        }
        
        if (welcomeMessageElement) {
            welcomeMessageElement.textContent = 'Your account has been created successfully.';
        } else {
            console.error('Welcome message element not found');
        }

        // Save user data
        localStorage.setItem('userData', JSON.stringify(userData));
        // Also save user data by email for future logins
        localStorage.setItem(`userData_${email}`, JSON.stringify(userData));

        // Redirect to main app after delay
        setTimeout(() => {
            window.location.href = 'userProfile.html';
        }, 3000);

    } catch (error) {
        console.error('Error creating account:', error);
        let errorMessage = 'An error occurred while creating your account.';
        
        if (error.code === 'auth/email-already-in-use') {
            errorMessage = 'This email is already registered. Please use a different email or try signing in.';
        } else if (error.code === 'auth/weak-password') {
            errorMessage = 'Password should be at least 6 characters long.';
        } else if (error.code === 'auth/invalid-email') {
            errorMessage = 'Please enter a valid email address.';
        }
        
        showError(errorMessage, 'signupAuthStep');
    }
}

async function completeLogin() {
    if (!validateLoginStep()) {
        const errorMessage = getLoginErrorMessage();
        showError(errorMessage, 'loginAuthStep');
        return;
    }

    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;

    try {
        // Sign in with Firebase
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // جلب بيانات المستخدم من Firestore
        let userData = null;
        const userDoc = await getDoc(doc(db, "students", user.uid));
        if (userDoc.exists()) {
            userData = userDoc.data();
            userData.uid = user.uid;
        } else {
            // fallback لو مش موجود في Firestore
            userData = {
                name: email.split('@')[0],
                emoji: '😊',
                email: email,
                uid: user.uid,
                stats: {
                    attendance: '0%',
                    average: '0%',
                    assignments: '0'
                }
            };
        }

        // Show welcome screen
        document.getElementById('loginAuthStep').classList.remove('active');
        document.getElementById('welcomeStep').classList.add('active');
        
        const welcomeNameElement = document.getElementById('welcomeName');
        const welcomeMessageElement = document.getElementById('welcomeMessage');
        
        if (welcomeNameElement) {
            // Use name if available, otherwise use email prefix
            const displayName = userData.name || (userData.email ? userData.email.split('@')[0] : 'User');
            welcomeNameElement.textContent = displayName;
            console.log('Set welcome name to:', displayName);
        } else {
            console.error('Welcome name element not found');
        }
        
        if (welcomeMessageElement) {
            welcomeMessageElement.textContent = 'Welcome back! You have successfully signed in.';
        } else {
            console.error('Welcome message element not found');
        }

        // Save user data
        localStorage.setItem('userData', JSON.stringify(userData));
        // Also save user data by email for future logins
        localStorage.setItem(`userData_${email}`, JSON.stringify(userData));

        // Redirect to main app after delay
        setTimeout(() => {
            window.location.href = 'userProfile.html';
        }, 3000);

    } catch (error) {
        console.error('Error signing in:', error);
        let errorMessage = 'An error occurred while signing in.';
        
        if (error.code === 'auth/user-not-found') {
            errorMessage = 'No account found with this email. Please create an account first.';
        } else if (error.code === 'auth/wrong-password') {
            errorMessage = 'Incorrect password. Please try again.';
        } else if (error.code === 'auth/invalid-email') {
            errorMessage = 'Please enter a valid email address.';
        }
        
        showError(errorMessage, 'loginAuthStep');
    }
}

function validateSignupStep() {
    const email = document.getElementById('signupEmail').value.trim();
    const password = document.getElementById('signupPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return false;
    }
    
    // Password validation (minimum 6 characters)
    if (password.length < 6) {
        return false;
    }
    
    // Confirm password validation
    if (password !== confirmPassword) {
        return false;
    }
    
    return true;
}

function validateLoginStep() {
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;
    
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return false;
    }
    
    // Password validation
    if (password.length === 0) {
        return false;
    }
    
    return true;
}

function getSignupErrorMessage() {
    const email = document.getElementById('signupEmail').value.trim();
    const password = document.getElementById('signupPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    if (!email) {
        return 'Please enter your email address';
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return 'Please enter a valid email address';
    }
    
    if (!password) {
        return 'Please enter a password';
    }
    
    if (password.length < 6) {
        return 'Password must be at least 6 characters long';
    }
    
    if (!confirmPassword) {
        return 'Please confirm your password';
    }
    
    if (password !== confirmPassword) {
        return 'Passwords do not match';
    }
    
    return 'Please complete all fields correctly';
}

function getLoginErrorMessage() {
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;
    
    if (!email) {
        return 'Please enter your email address';
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return 'Please enter a valid email address';
    }
    
    if (!password) {
        return 'Please enter your password';
    }
    
    return 'Please complete all fields correctly';
}
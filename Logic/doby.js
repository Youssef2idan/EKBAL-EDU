document.addEventListener('DOMContentLoaded', () => {
    const messageInput = document.getElementById('messageInput');
    const sendBtn = document.getElementById('sendBtn');
    const voiceBtn = document.getElementById('voiceBtn');
    const chatMessages = document.getElementById('chatMessages');
    const quickActions = document.querySelectorAll('.action-btn');
    const mainOptions = document.querySelectorAll('.option-btn');
    const subOptionsContainer = document.querySelector('.sub-options');
    const contentDisplay = document.querySelector('.content-display');

    let isListening = false;

    // Options data structure
    const optionsData = {
        videos: {
            title: 'Educational Videos',
            subOptions: ['Lecture Videos', 'Tutorial Videos', 'Practice Videos'],
            content: {
                'Lecture Videos': [
                    { title: 'Introduction to Calculus', size: '250MB', link: '#' },
                    { title: 'Advanced Algebra', size: '180MB', link: '#' }
                ],
                'Tutorial Videos': [
                    { title: 'Problem Solving Techniques', size: '200MB', link: '#' },
                    { title: 'Step-by-Step Solutions', size: '150MB', link: '#' }
                ],
                'Practice Videos': [
                    { title: 'Practice Problems Set 1', size: '220MB', link: '#' },
                    { title: 'Practice Problems Set 2', size: '190MB', link: '#' }
                ]
            }
        },
        sheets: {
            title: 'Study Sheets',
            subOptions: ['Explanation Sheets', 'Revision Sheets', 'Exercise Sheets'],
            content: {
                'Explanation Sheets': [
                    { title: 'Algebra Concepts', size: '2.5MB', link: '#' },
                    { title: 'Geometry Basics', size: '1.8MB', link: '#' }
                ],
                'Revision Sheets': [
                    { title: 'Quick Review Guide', size: '1.5MB', link: '#' },
                    { title: 'Final Exam Prep', size: '2.0MB', link: '#' }
                ],
                'Exercise Sheets': [
                    { title: 'Practice Problems', size: '1.2MB', link: '#' },
                    { title: 'Challenge Questions', size: '1.7MB', link: '#' }
                ]
            }
        },
        // Add more options as needed
    };

    // Function to add a message to the chat
    function addMessage(message, isUser = false) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${isUser ? 'user-message' : 'ai-message'}`;
        
        messageDiv.innerHTML = `
            <div class="message-avatar"></div>
            <div class="message-content">
                <p>${message}</p>
            </div>
        `;
        
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // Quick action button handlers
    const actionResponses = {
        'homework': "I'm ready to help with your homework! What subject are you working on?",
        'study': "Let's create a study plan together. What are your current goals?",
        'practice': "I can generate practice questions for you. Which topic would you like to focus on?",
        'explain': "I'd be happy to explain any topic. What would you like to learn about?"
    };

    quickActions.forEach(btn => {
        btn.addEventListener('click', () => {
            const action = btn.classList[1];
            addMessage(actionResponses[action]);
        });
    });

    // Send message handler
    function sendMessage() {
        const message = messageInput.value.trim();
        if (message) {
            addMessage(message, true);
            messageInput.value = '';
            
            // Simulate AI thinking
            setTimeout(() => {
                processUserInput(message);
            }, 1000);
        }
    }

    // Process user input and generate response
    function processUserInput(message) {
        let response;
        
        // Simple response logic - can be expanded
        if (message.toLowerCase().includes('hello') || message.toLowerCase().includes('hi')) {
            response = "Hello! How can I help you with your studies today?";
        } else if (message.toLowerCase().includes('help')) {
            response = "I'm here to help! What subject would you like assistance with?";
        } else if (message.toLowerCase().includes('thank')) {
            response = "You're welcome! Let me know if you need anything else.";
        } else {
            response = "I understand. Would you like me to explain this topic in more detail?";
        }
        
        addMessage(response);
    }

    // Voice input handler
    function toggleVoiceInput() {
        if (!isListening && 'webkitSpeechRecognition' in window) {
            const recognition = new webkitSpeechRecognition();
            recognition.continuous = false;
            recognition.interimResults = false;

            recognition.onstart = () => {
                isListening = true;
                voiceBtn.style.backgroundColor = '#ff4444';
            };

            recognition.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                messageInput.value = transcript;
                sendMessage();
            };

            recognition.onend = () => {
                isListening = false;
                voiceBtn.style.backgroundColor = '';
            };

            recognition.start();
        } else if (isListening) {
            recognition.stop();
        }
    }

    // Event listeners
    sendBtn.addEventListener('click', sendMessage);
    voiceBtn.addEventListener('click', toggleVoiceInput);
    
    messageInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });

    // Animation for avatar
    const avatarCore = document.querySelector('.avatar-core');
    
    function pulseAnimation() {
        avatarCore.style.transform = 'scale(1.1)';
        setTimeout(() => {
            avatarCore.style.transform = 'scale(1)';
        }, 200);
    }

    // Pulse animation when AI responds
    setInterval(pulseAnimation, 3000);

    // Handle main option selection
    mainOptions.forEach(option => {
        option.addEventListener('click', () => {
            const type = option.classList[1];
            if (optionsData[type]) {
                showSubOptions(type);
            }
        });
    });

    // Show sub-options
    function showSubOptions(type) {
        subOptionsContainer.style.display = 'grid';
        subOptionsContainer.innerHTML = optionsData[type].subOptions
            .map(subOption => `
                <button class="sub-option-btn" data-type="${type}" data-sub="${subOption}">
                    ${subOption}
                </button>
            `).join('');

        // Handle sub-option selection
        const subOptions = document.querySelectorAll('.sub-option-btn');
        subOptions.forEach(subOption => {
            subOption.addEventListener('click', () => {
                const type = subOption.dataset.type;
                const sub = subOption.dataset.sub;
                showContent(type, sub);
            });
        });
    }

    // Show content
    function showContent(type, subOption) {
        contentDisplay.style.display = 'block';
        const content = optionsData[type].content[subOption];
        
        contentDisplay.innerHTML = `
            <h3>${subOption}</h3>
            ${content.map(item => `
                <div class="content-card">
                    <div class="content-info">
                        <h4>${item.title}</h4>
                        <span>${item.size}</span>
                    </div>
                    <button class="download-btn" data-link="${item.link}">
                        Download
                    </button>
                </div>
            `).join('')}
        `;

        // Handle downloads
        const downloadButtons = document.querySelectorAll('.download-btn');
        downloadButtons.forEach(button => {
            button.addEventListener('click', () => {
                // Implement download functionality
                alert('Download started!');
            });
        });
    }
}); 
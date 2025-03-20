document.addEventListener('DOMContentLoaded', () => {
    const messageInput = document.getElementById('messageInput');
    const sendBtn = document.getElementById('sendBtn');
    const voiceBtn = document.getElementById('voiceBtn');
    const chatMessages = document.getElementById('chatMessages');
    const quickActions = document.querySelectorAll('.action-btn');
    const newChatBtn = document.querySelector('.new-chat');
    const menuToggle = document.getElementById('menuToggle');
    const sidebar = document.querySelector('.sidebar');

    let isListening = false;
    let chatHistory = [];
    let isProcessing = false;

    // AI Response Categories
    const aiResponses = {
        videos: {
            keywords: ['video', 'watch', 'tutorial', 'lecture'],
            subCategories: {
                lectures: ['calculus', 'algebra', 'physics', 'chemistry'],
                tutorials: ['problem solving', 'exam prep', 'study tips'],
                practice: ['exercises', 'examples', 'solutions']
            }
        },
        sheets: {
            keywords: ['sheet', 'document', 'notes', 'pdf'],
            subCategories: {
                explanation: ['concept notes', 'theory', 'formulas'],
                revision: ['summary', 'quick review', 'key points'],
                exercises: ['practice problems', 'worksheets', 'assignments']
            }
        },
        questions: {
            keywords: ['question', 'problem', 'solve', 'answer'],
            types: ['multiple choice', 'short answer', 'detailed solution']
        }
    };

    // Message Processing
    async function processUserMessage(message) {
        const lowerMessage = message.toLowerCase();
        let response = '';

        // Check for resource requests
        if (aiResponses.videos.keywords.some(k => lowerMessage.includes(k))) {
            response = handleResourceRequest('videos', lowerMessage);
        } else if (aiResponses.sheets.keywords.some(k => lowerMessage.includes(k))) {
            response = handleResourceRequest('sheets', lowerMessage);
        } else if (aiResponses.questions.keywords.some(k => lowerMessage.includes(k))) {
            response = handleQuestionRequest(lowerMessage);
        } else {
            response = await generateGeneralResponse(lowerMessage);
        }

        return response;
    }

    // Resource Request Handler
    function handleResourceRequest(type, message) {
        const resources = aiResponses[type];
        let response = `I can help you find ${type}. What specific type are you looking for?\n\n`;
        
        if (type === 'videos' || type === 'sheets') {
            Object.entries(resources.subCategories).forEach(([category, topics]) => {
                response += `📁 ${category.charAt(0).toUpperCase() + category.slice(1)}:\n`;
                topics.forEach(topic => {
                    response += `   • ${topic}\n`;
                });
                response += '\n';
            });
        }

        return response;
    }

    // Question Request Handler
    function handleQuestionRequest(message) {
        const subjects = ['math', 'physics', 'chemistry', 'biology'];
        const subject = subjects.find(s => message.includes(s)) || 'general';
        
        return `I can help you with ${subject} questions. Would you like:\n\n` +
               `1. Practice questions\n` +
               `2. Step-by-step solutions\n` +
               `3. Quick concept check\n\n` +
               `Just let me know your preference!`;
    }

    // General Response Generator
    async function generateGeneralResponse(message) {
        // Simulate AI processing
        await new Promise(resolve => setTimeout(resolve, 500));

        if (message.includes('help')) {
            return "I'm here to help! I can:\n\n" +
                   "1. Find educational videos\n" +
                   "2. Provide study sheets\n" +
                   "3. Generate practice questions\n" +
                   "4. Explain concepts\n\n" +
                   "What would you like to focus on?";
        }

        // Add more response patterns here
        return "I understand you're asking about " + message + ". How can I help you with that?";
    }

    // Message Display with Typing Effect
    async function addMessage(message, isUser = false) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${isUser ? 'user-message' : 'ai-message'}`;
        
        if (!isUser) {
            messageDiv.innerHTML = `
                <div class="ai-avatar">
                    <div class="avatar-core"></div>
                </div>
                <div class="message-content">
                    <p class="typing"></p>
                </div>
            `;
            chatMessages.appendChild(messageDiv);
            chatMessages.scrollTop = chatMessages.scrollHeight;

            // Typing effect
            const typingElement = messageDiv.querySelector('.typing');
            await typeMessage(message, typingElement);
        } else {
            messageDiv.innerHTML = `
                <div class="message-content">
                    <p>${message}</p>
                </div>
            `;
            chatMessages.appendChild(messageDiv);
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }

        chatHistory.push({ message, isUser });
        updateChatHistory();
    }

    // Typing Effect Function
    async function typeMessage(message, element) {
        const words = message.split(' ');
        for (let i = 0; i < words.length; i++) {
            element.textContent += words[i] + ' ';
            await new Promise(resolve => setTimeout(resolve, 50));
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }
    }

    // Send Message Handler
    async function sendMessage() {
        if (isProcessing) return;

        const message = messageInput.value.trim();
        if (message) {
            isProcessing = true;
            messageInput.value = '';
            messageInput.style.height = 'auto';

            // Add user message
            await addMessage(message, true);

            // Process and add AI response
            const response = await processUserMessage(message);
            await addMessage(response, false);

            isProcessing = false;

            // Close sidebar on mobile
            if (window.innerWidth <= 768) {
                sidebar.classList.remove('active');
            }
        }
    }

    // Event Listeners
    messageInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });

    messageInput.addEventListener('input', () => {
        messageInput.style.height = 'auto';
        messageInput.style.height = messageInput.scrollHeight + 'px';
    });

    // Quick Actions
    quickActions.forEach(btn => {
        btn.addEventListener('click', async () => {
            const action = btn.textContent.split(' ')[1].toLowerCase();
            const responses = {
                'help': "What subject do you need help with? I can assist with:\n\n" +
                        "• Mathematics\n• Physics\n• Chemistry\n• Biology\n• Literature\n\n" +
                        "Just let me know the subject and topic!",
                'plan': "Let's create a study plan! Please tell me:\n\n" +
                        "1. Your current subjects\n" +
                        "2. Goals/targets\n" +
                        "3. Available study time\n" +
                        "4. Preferred learning style",
                'questions': "I can generate practice questions. Choose a subject:\n\n" +
                            "1. Mathematics\n2. Physics\n3. Chemistry\n4. Biology\n\n" +
                            "Then specify the topic and difficulty level.",
                'topic': "What topic would you like me to explain? I can help with:\n\n" +
                        "• Basic concepts\n• Complex theories\n• Problem-solving methods\n" +
                        "• Exam preparation\n\nJust name the subject and topic!"
            };
            await addMessage(responses[action], false);
        });
    });

    // Voice Input Handler
    voiceBtn.addEventListener('click', toggleVoiceInput);
    
    function toggleVoiceInput() {
        if (!isListening && 'webkitSpeechRecognition' in window) {
            const recognition = new webkitSpeechRecognition();
            recognition.continuous = false;
            recognition.interimResults = false;
            
            recognition.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                messageInput.value = transcript;
                sendMessage();
            };
            
            recognition.start();
            isListening = true;
            voiceBtn.classList.add('listening');
        } else if (isListening) {
            recognition.stop();
            isListening = false;
            voiceBtn.classList.remove('listening');
        }
    }

    // Mobile Menu Handlers
    menuToggle.addEventListener('click', () => {
        sidebar.classList.toggle('active');
    });

    document.addEventListener('click', (e) => {
        if (sidebar.classList.contains('active') && 
            !sidebar.contains(e.target) && 
            !menuToggle.contains(e.target)) {
            sidebar.classList.remove('active');
        }
    });

    // Initialize
    sendBtn.addEventListener('click', sendMessage);
    newChatBtn.addEventListener('click', () => {
        chatMessages.innerHTML = `
            <div class="welcome-message">
                <div class="ai-avatar">
                    <div class="avatar-ring"></div>
                    <div class="avatar-core"></div>
                </div>
                <h1>Hello! I'm Doby AI</h1>
                <p>I'm here to help you with your studies. What would you like to learn today?</p>
            </div>
        `;
        chatHistory = [];
        updateChatHistory();
    });

    // Update chat history in sidebar
    function updateChatHistory() {
        const historyList = document.querySelector('.history-list');
        historyList.innerHTML = chatHistory
            .filter(chat => chat.isUser)
            .slice(-5)
            .reverse()
            .map(chat => `
                <button class="history-item">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" stroke-width="2"/>
                    </svg>
                    ${chat.message.substring(0, 30)}${chat.message.length > 30 ? '...' : ''}
                </button>
            `)
            .join('');
    }
}); 
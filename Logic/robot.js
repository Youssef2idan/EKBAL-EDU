document.addEventListener('DOMContentLoaded', () => {
    const chatMessages = document.getElementById('chatMessages');
    const userInput = document.getElementById('userInput');
    const sendButton = document.getElementById('sendMessage');
    const quickActions = document.querySelectorAll('.quick-action-btn');

    function addMessage(message, isUser = false) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${isUser ? 'user-message' : 'bot-message'}`;
        
        const messageContent = document.createElement('div');
        messageContent.className = 'message-content';

        if (!isUser) {
            const botAvatar = document.createElement('div');
            botAvatar.className = 'bot-avatar';
            botAvatar.textContent = '🤖';
            messageContent.appendChild(botAvatar);
        }

        const messageText = document.createElement('div');
        messageText.className = 'message-text';
        messageText.innerHTML = `<p>${message}</p>`;
        messageContent.appendChild(messageText);

        messageDiv.appendChild(messageContent);

        const timestamp = document.createElement('span');
        timestamp.className = 'timestamp';
        timestamp.textContent = 'Just now';
        messageDiv.appendChild(timestamp);

        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function handleUserMessage(message) {
        addMessage(message, true);
        // Simulate bot thinking
        setTimeout(() => {
            const responses = [
                "I understand your question. Let me help you with that.",
                "That's an interesting topic! Here's what I know...",
                "Great question! Here's my explanation...",
                "I'd be happy to help you understand this better.",
            ];
            const randomResponse = responses[Math.floor(Math.random() * responses.length)];
            addMessage(randomResponse);
        }, 1000);
    }

    sendButton.addEventListener('click', () => {
        const message = userInput.value.trim();
        if (message) {
            handleUserMessage(message);
            userInput.value = '';
        }
    });

    userInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && userInput.value.trim()) {
            handleUserMessage(userInput.value.trim());
            userInput.value = '';
        }
    });

    quickActions.forEach(button => {
        button.addEventListener('click', () => {
            handleUserMessage(button.textContent);
        });
    });
}); 
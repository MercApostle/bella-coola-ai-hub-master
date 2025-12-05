// ====================================
// CHATBOT FUNCTIONALITY
// ====================================

document.addEventListener('DOMContentLoaded', function() {
    const chatbotBtn = document.getElementById('chatbotBtn');
    const chatbotPanel = document.getElementById('chatbotPanel');
    const chatbotCloseBtn = document.getElementById('chatbotCloseBtn');
    const chatbotInput = document.getElementById('chatbotInput');
    const chatbotSendBtn = document.getElementById('chatbotSendBtn');
    const chatbotMessages = document.getElementById('chatbotMessages');

    // Open chatbot panel
    chatbotBtn.addEventListener('click', function() {
        chatbotPanel.classList.add('open');
        chatbotInput.focus();
    });

    // Close chatbot panel
    chatbotCloseBtn.addEventListener('click', function() {
        chatbotPanel.classList.remove('open');
    });

    // Close on escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && chatbotPanel.classList.contains('open')) {
            chatbotPanel.classList.remove('open');
        }
    });

    // Send message function
    function sendMessage() {
        const message = chatbotInput.value.trim();
        if (!message) return;

        // Add user message
        addMessage(message, 'user');
        chatbotInput.value = '';

        // Simulate AI response (replace with actual API call)
        setTimeout(() => {
            const response = getAIResponse(message);
            addMessage(response, 'bot');
        }, 500);
    }

    // Send on button click
    chatbotSendBtn.addEventListener('click', sendMessage);

    // Send on Enter key
    chatbotInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });

    // Add message to chat
    function addMessage(text, type) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `chatbot-message ${type}`;
        
        if (type === 'bot') {
            messageDiv.innerHTML = `<strong>AI:</strong> ${text}`;
        } else {
            messageDiv.innerHTML = `<strong>You:</strong> ${text}`;
        }
        
        chatbotMessages.appendChild(messageDiv);
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
    }

    // Simple AI response logic (replace with actual API integration)
    function getAIResponse(userMessage) {
        const lowerMessage = userMessage.toLowerCase();
        
        if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
            return "Hello! I'm here to help you learn about AI systems for your business. What would you like to know?";
        } else if (lowerMessage.includes('audit') || lowerMessage.includes('business audit')) {
            return "Great! The Business Audit is a low-risk, no-obligation session where we map your operations and identify automation opportunities. Would you like to schedule one?";
        } else if (lowerMessage.includes('price') || lowerMessage.includes('cost')) {
            return "Our Business Audit is designed to be accessible. Let's discuss your specific needs - would you like to schedule a consultation?";
        } else if (lowerMessage.includes('how it works') || lowerMessage.includes('process')) {
            return "The process is simple: 1) Business Audit to identify opportunities, 2) Pilot System to prove ROI, 3) Full AI Operations System for ongoing automation. Would you like to start with an audit?";
        } else if (lowerMessage.includes('example') || lowerMessage.includes('what can you build')) {
            return "I can build systems like lead capture & follow-up, review monitoring & response, booking & inquiry triage, and customer FAQ & messaging. What type of business do you run?";
        } else if (lowerMessage.includes('contact') || lowerMessage.includes('email') || lowerMessage.includes('phone')) {
            return "You can reach us at jeremyashe@gmail.com or 587-338-5257. We're based in Bella Coola, British Columbia. Would you like to schedule a call?";
        } else {
            return "That's a great question! I'd love to help you with that. Would you like to schedule a Business Audit to discuss your specific needs, or do you have other questions about our AI systems?";
        }
    }
});


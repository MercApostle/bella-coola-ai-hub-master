// ====================================
// CHATBOT FUNCTIONALITY - FAQ-Based Response Engine
// ====================================

// BOOKING / FORM LINKS — REPLACE WITH YOUR REAL URLS
const BUSINESS_AUDIT_URL = "audit.html";          // same as the button
const AUDIT_FORM_URL = "audit.html";              // or leave separate if you want

/* -------------------------------------------------------------------------- */
/* 1. FAQ CONFIG — EDIT ONLY THIS SECTION TO CHANGE ANSWERS                   */
/* -------------------------------------------------------------------------- */

const FAQ_ENTRIES = [
  {
    id: "greeting",
    patterns: ["hi", "hello", "hey", "good morning", "good evening"],
    keywords: ["hi", "hello", "hey"],
    response: `
Hi, I'm the Bella Coola AI HUB assistant. Here are four ways I can help right now:

1) Leads & follow-up  
2) Reviews & reputation  
3) Booking & inquiries  
4) Operations & reporting  

Reply with 1, 2, 3, or 4 to choose. At any time, you can also type 0 or "menu" to see these options again.
    `.trim(),
    state: "await_main_choice"
  },
  {
    id: "what_is_business_audit",
    patterns: [
      "what is the business audit",
      "explain the business audit",
      "tell me about the audit",
      "what do i get in the audit"
    ],
    keywords: ["business audit", "audit", "assessment"],
    response: `
The Business Audit is the first step.

You get:
- A breakdown of your current workflow
- Identification of bottlenecks, leaks, and missed opportunities
- A custom action plan with prioritized recommendations
- Your first AI system mapped out for a fast, clear win

It's low risk, low commitment, and designed for small businesses.
    `.trim()
  },
  {
    id: "how_ai_systems_help",
    patterns: [
      "how can ai systems help my business",
      "what can ai systems do for me",
      "why should i use ai systems",
      "benefits of ai systems"
    ],
    keywords: ["help", "benefit", "ai systems", "save time", "stress"],
    response: `
AI systems help by:
- Automating repetitive work (messages, intake, follow-up)
- Reducing stress and daily interruptions
- Capturing and organizing leads
- Improving reviews and reputation
- Giving clearer visibility into what's happening

Result: more time, less chaos, and better decisions.
    `.trim()
  },
  {
    id: "industries",
    patterns: [
      "what industries do you work with",
      "do you work with my industry",
      "which businesses can you help",
      "do you help tourism or trades"
    ],
    keywords: ["industry", "industries", "tourism", "trades", "restaurants"],
    response: `
I design AI systems for most small businesses, including:

- Tourism & hospitality
- Trades & home services
- Restaurants & food services
- Retail & local shops
- Forestry & natural resources
- Fishing & marine services
- Transportation & logistics
- Health & personal services
- Community & nonprofit services

The patterns are the same: leads, messaging, reviews, bookings, reporting.
    `.trim()
  },
  {
    id: "pricing",
    patterns: [
      "how much does it cost",
      "what is the price",
      "pricing",
      "cost",
      "rates"
    ],
    keywords: ["cost", "price", "pricing", "expensive", "afford"],
    response: `
Pricing is structured in three levels:

1) Business Audit — low cost, low commitment  
2) Pilot System — one clear AI system built and deployed  
3) Full AI Operations System — monthly support with multiple systems

Most businesses aim for a 3–4× return on investment as a baseline target.
    `.trim()
  },
  {
    id: "location_bella_coola",
    patterns: [
      "where are you located",
      "are you local",
      "are you in bella coola",
      "do you work remotely"
    ],
    keywords: ["bella coola", "local", "valley", "location"],
    response: `
Bella Coola AI HUB is based in Bella Coola, British Columbia.

I prioritize businesses in the valley, but I also work with clients across Canada.
Bella Coola residents receive priority support and a lifetime technician availability guarantee.
    `.trim()
  },
  {
    id: "support_breaks",
    patterns: [
      "what happens if something breaks",
      "support",
      "maintenance",
      "do you provide support"
    ],
    keywords: ["support", "breaks", "maintenance", "help"],
    response: `
If something breaks or needs adjustment, you're not left alone.

- Diagnostics and troubleshooting
- Clear communication about the issue
- Transparent pricing for fixes or upgrades

For Bella Coola Valley businesses, there's a lifetime technician availability guarantee:
you will always have someone you can reach to help keep your systems running.
    `.trim()
  },
  {
    id: "not_technical",
    patterns: [
      "i'm not technical",
      "i am not technical",
      "i don't understand ai",
      "i don't get technology",
      "im not good with tech"
    ],
    keywords: ["not technical", "don't understand", "tech"],
    response: `
You don't need to be technical.

I handle the setup and configuration.
You use simple links, buttons, or website widgets.
We keep explanations in plain language so you can stay focused on your business.
    `.trim()
  },
  {
    id: "book_audit",
    patterns: [
      "book a business audit",
      "book audit",
      "schedule audit",
      "schedule a business audit",
      "book a call",
      "schedule a call",
      "set up a call",
      "set up a meeting",
      "book meeting",
      "schedule meeting"
    ],
    keywords: ["book", "schedule", "audit", "call", "meeting"],
    response: `
You can book a Business Audit directly here: <a href="${BUSINESS_AUDIT_URL}" target="_blank" rel="noopener noreferrer">Book a Business Audit</a>. If you prefer to answer a few questions first, you can also use this short form: <a href="${AUDIT_FORM_URL}" target="_blank" rel="noopener noreferrer">Start the Audit Form</a>.
    `.trim()
  },
  {
    id: "fallback",
    patterns: [],
    keywords: [],
    response: `
I'm not sure I fully understood that.

You can ask me things like:
- "What is the Business Audit?"
- "How can AI systems help my business?"
- "What industries do you work with?"
- "How much does this cost?"
    `.trim()
  }
];

const MATCH_SETTINGS = {
  MIN_SCORE: 1,
  PATTERN_WEIGHT: 3,
  KEYWORD_WEIGHT: 1
};

let botState = null; // null = normal FAQ mode; other values = we're in a choice flow

/* -------------------------------------------------------------------------- */
/* 2. MATCHING LOGIC — USUALLY DO NOT EDIT                                    */
/* -------------------------------------------------------------------------- */

function normalizeInput(text) {
  return text
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
}

function computeFaqScore(userText, faqEntry) {
  let score = 0;

  faqEntry.patterns.forEach((pattern) => {
    const normalizedPattern = pattern.toLowerCase().trim();
    if (normalizedPattern && userText.includes(normalizedPattern)) {
      score += MATCH_SETTINGS.PATTERN_WEIGHT;
    }
  });

  faqEntry.keywords.forEach((kw) => {
    const normalizedKeyword = kw.toLowerCase().trim();
    if (!normalizedKeyword) return;

    if (userText.includes(normalizedKeyword)) {
      score += MATCH_SETTINGS.KEYWORD_WEIGHT;
    }
  });

  return score;
}

function findBestFaq(userInput) {
  const text = normalizeInput(userInput);

  let bestEntry = null;
  let bestScore = 0;

  FAQ_ENTRIES.forEach((entry) => {
    if (entry.id === "fallback") return;

    const score = computeFaqScore(text, entry);
    if (score > bestScore) {
      bestScore = score;
      bestEntry = entry;
    }
  });

  if (!bestEntry || bestScore < MATCH_SETTINGS.MIN_SCORE) {
    return FAQ_ENTRIES.find((e) => e.id === "fallback");
  }

  return bestEntry;
}

/* -------------------------------------------------------------------------- */
/* 3. CHAT UI INTEGRATION                                                    */
/* -------------------------------------------------------------------------- */

document.addEventListener('DOMContentLoaded', function() {
    const chatbotBtn = document.getElementById('chatbotBtn');
    const chatbotPanel = document.getElementById('chatbotPanel');
    const chatbotCloseBtn = document.getElementById('chatbotCloseBtn');
    const messageInput = document.getElementById('messageInput');
    const chatForm = document.getElementById('chatForm');
    const messages = document.getElementById('messages');
    const chatbotWrapper = document.querySelector('.chatbot-wrapper');

    // Check if all required elements exist
    if (!chatbotBtn || !chatbotPanel || !chatbotCloseBtn || !messageInput || !chatForm || !messages || !chatbotWrapper) {
        console.error('Chatbot: Missing required elements', {
            chatbotBtn: !!chatbotBtn,
            chatbotPanel: !!chatbotPanel,
            chatbotCloseBtn: !!chatbotCloseBtn,
            messageInput: !!messageInput,
            chatForm: !!chatForm,
            messages: !!messages,
            chatbotWrapper: !!chatbotWrapper
        });
        return;
    }

    // Function to show/hide wrapper
    function toggleWrapper(show) {
        if (show) {
            chatbotWrapper.style.display = 'flex';
        } else {
            chatbotWrapper.style.display = 'none';
        }
    }

    // Open chatbot panel
    chatbotBtn.addEventListener('click', function() {
        chatbotPanel.classList.add('open');
        toggleWrapper(false); // Hide button and label
        messageInput.focus();
        
        // Show greeting only if messages container is empty
        if (messages && messages.children.length === 0) {
            const greetingEntry = FAQ_ENTRIES.find((e) => e.id === "greeting");
            if (greetingEntry) {
                appendMessage("bot", greetingEntry.response);
                if (greetingEntry.state) {
                    botState = greetingEntry.state;
                }
            }
        }
    });

    // Close chatbot panel
    chatbotCloseBtn.addEventListener('click', function() {
        chatbotPanel.classList.remove('open');
        toggleWrapper(true); // Show button and label
    });

    // Close on escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && chatbotPanel.classList.contains('open')) {
            chatbotPanel.classList.remove('open');
            toggleWrapper(true); // Show button and label
        }
    });

    // Add message to chat (using existing CSS classes)
    function addMessage(text, type) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `chatbot-message ${type}`;
        
        if (type === 'bot') {
            messageDiv.innerHTML = `<strong>AI:</strong> ${text}`;
        } else {
            messageDiv.innerHTML = `<strong>You:</strong> ${text}`;
        }
        
        messages.appendChild(messageDiv);
        messages.scrollTop = messages.scrollHeight;
    }

    // Append message function that allows HTML links in bot messages
    function appendMessage(sender, text) {
        if (!messages) return;

        const messageEl = document.createElement("div");
        messageEl.classList.add("chatbot-message", sender);

        if (sender === "bot") {
            // We control bot text, so it's safe to use innerHTML for links
            messageEl.innerHTML = `<strong>AI:</strong> ${text}`;
        } else {
            // Never trust user input as HTML
            messageEl.innerHTML = `<strong>You:</strong> ${text}`;
        }

        messages.appendChild(messageEl);
        messages.scrollTop = messages.scrollHeight;
    }

    // Helper function to show the main menu
    function showMainMenu() {
        appendMessage(
            "bot",
            `
Here are the main options:

1) Leads & follow-up  
2) Reviews & reputation  
3) Booking & inquiries  
4) Operations & reporting  

Reply with 1, 2, 3, or 4 to choose.
            `.trim()
        );
        botState = "await_main_choice";
    }

    // Handle user message with state-aware FAQ matching
    function handleUserMessage(rawText) {
        const text = rawText.trim();
        if (!text) return;

        // show user message first
        appendMessage("user", text);

        const normalized = text.toLowerCase();

        // 1) GLOBAL SHORTCUTS: 0 / menu / index / ?
        if (
            normalized === "0" ||
            normalized === "menu" ||
            normalized === "index" ||
            normalized === "?"
        ) {
            showMainMenu();
            return;
        }

        // 2) IF WE'RE WAITING FOR MAIN CHOICE (1–4)
        if (botState === "await_main_choice") {
            const choice = text.trim().toUpperCase();

            if (choice === "1") {
                appendMessage(
                    "bot",
                    `
Leads & follow-up systems make sure every inquiry is captured and answered automatically so nothing slips through. This is often the highest-return system for most small businesses. If you want to explore this for your business, you can <a href="${BUSINESS_AUDIT_URL}" target="_blank" rel="noopener noreferrer">book a Business Audit here</a>.
                    `.trim()
                );
                botState = null;
                return;
            }

            if (choice === "2") {
                appendMessage(
                    "bot",
                    `
Reviews & reputation systems ask happy customers for reviews at the right time and help you respond quickly. This builds trust and improves your visibility without adding more work. To see what this could look like for you, <a href="${BUSINESS_AUDIT_URL}" target="_blank" rel="noopener noreferrer">book a Business Audit</a>.
                    `.trim()
                );
                botState = null;
                return;
            }

            if (choice === "3") {
                appendMessage(
                    "bot",
                    `
Booking & inquiry systems collect the details you need and reduce back-and-forth texting. This gives you cleaner information and fewer interruptions in your day. If you're curious how this could work in your business, start with a Business Audit: <a href="${BUSINESS_AUDIT_URL}" target="_blank" rel="noopener noreferrer">book here</a>.
                    `.trim()
                );
                botState = null;
                return;
            }

            if (choice === "4") {
                appendMessage(
                    "bot",
                    `
Operations & reporting systems give you weekly insights into leads, reviews, and activity so you can make better decisions. They reduce admin work and help stabilize your workflow over time. To map out the right system for you, <a href="${BUSINESS_AUDIT_URL}" target="_blank" rel="noopener noreferrer">book a Business Audit</a>.
                    `.trim()
                );
                botState = null;
                return;
            }

            appendMessage("bot", "Please choose 1, 2, 3, or 4, or type 0 for the menu.");
            return;
        }

        // 3) NORMAL FAQ MODE
        const faqEntry = findBestFaq(text);
        const reply = faqEntry.response;

        if (faqEntry.state) {
            botState = faqEntry.state;
        } else {
            botState = null;
        }

        setTimeout(() => {
            appendMessage("bot", reply);
        }, 200);
    }

    // Send on form submission
    chatForm.addEventListener('submit', function(e) {
        e.preventDefault();
        handleUserMessage(messageInput.value);
        messageInput.value = '';
        messageInput.focus();
    });

    // Greeting will be shown when panel is first opened (see chatbotBtn click handler above)
});

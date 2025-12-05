// ====================================
// BELLA COOLA AI HUB - MAIN JAVASCRIPT
// ====================================

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeContent();
    initializeNavigation();
    initializeIndustrySelector();
    initializeSmoothScroll();
    setCurrentYear();
});

// ====================================
// CONTENT INJECTION
// ====================================

function initializeContent() {
    // Inject simple text content via data-content attributes
    document.querySelectorAll('[data-content]').forEach(element => {
        const contentPath = element.getAttribute('data-content');
        const content = getNestedProperty(PAGE_CONTENT, contentPath);
        if (content) {
            element.textContent = content;
        }
    });

    // Inject list content via data-content-list attributes
    document.querySelectorAll('[data-content-list]').forEach(element => {
        const contentPath = element.getAttribute('data-content-list');
        const items = getNestedProperty(PAGE_CONTENT, contentPath);
        if (Array.isArray(items)) {
            element.innerHTML = items.map(item => `<li>${item}</li>`).join('');
        }
    });

    // Generate service tier cards
    generateServiceTiers();
    
    // Generate example cards
    generateExampleCards();
    
    // Generate process steps
    generateProcessSteps();
    
    // Generate FAQ items
    generateFAQItems();
    
    // Ensure all AI assistant buttons have the correct class
    ensureAIAssistantButtons();
}

// Ensure all buttons with "Talk with our AI assistant" text have the ai-assistant-btn class
function ensureAIAssistantButtons() {
    document.querySelectorAll('button').forEach(button => {
        const text = button.textContent.trim().toLowerCase();
        if (text.includes('talk with our ai assistant') || text.includes('talk with our ai')) {
            button.classList.add('ai-assistant-btn');
        }
    });
}

// Helper function to get nested properties from object using dot notation
function getNestedProperty(obj, path) {
    return path.split('.').reduce((current, prop) => current?.[prop], obj);
}

// ====================================
// SERVICE TIERS GENERATION
// ====================================

function generateServiceTiers() {
    const container = document.querySelector('.service-tiers');
    if (!container || !PAGE_CONTENT.whatIDo.tiers) return;

    container.innerHTML = PAGE_CONTENT.whatIDo.tiers.map(tier => `
        <div class="card">
            <div class="card-icon">${tier.icon}</div>
            <h3>${tier.title}</h3>
            <p>${tier.description}</p>
            ${tier.deliverables ? `
                <ul class="bullet-list">
                    ${tier.deliverables.map(item => `<li>${item}</li>`).join('')}
                </ul>
            ` : ''}
            ${tier.examples ? `
                <p><strong>Examples:</strong></p>
                <ul class="bullet-list">
                    ${tier.examples.map(item => `<li>${item}</li>`).join('')}
                </ul>
            ` : ''}
            ${tier.includes ? `
                <ul class="bullet-list">
                    ${tier.includes.map(item => `<li>${item}</li>`).join('')}
                </ul>
            ` : ''}
            <button class="btn primary-btn" data-scroll-to="get-started">${tier.cta}</button>
        </div>
    `).join('');

    // Re-initialize scroll listeners for new buttons
    initializeSmoothScroll();
}

// ====================================
// EXAMPLE CARDS GENERATION
// ====================================

function generateExampleCards() {
    const container = document.querySelector('.examples-grid');
    if (!container || !PAGE_CONTENT.examples.systems) return;

    container.innerHTML = PAGE_CONTENT.examples.systems.map(system => `
        <div class="example-card">
            <div class="card-icon">${system.icon}</div>
            <h4>${system.title}</h4>
            <p>${system.description}</p>
            <p class="why-it-matters"><strong>Why it matters:</strong> ${system.whyItMatters}</p>
            <p class="result"><strong>Result:</strong> ${system.result}</p>
        </div>
    `).join('');
}

// ====================================
// PROCESS STEPS GENERATION
// ====================================

function generateProcessSteps() {
    const container = document.querySelector('.process-steps');
    if (!container || !PAGE_CONTENT.howItWorks.steps) return;

    container.innerHTML = PAGE_CONTENT.howItWorks.steps.map(step => `
        <div class="process-step">
            <div class="step-number">${step.number}</div>
            <h3>${step.title}</h3>
            <p>${step.description}</p>
        </div>
    `).join('');
}

// ====================================
// FAQ ITEMS GENERATION
// ====================================

function generateFAQItems() {
    const container = document.querySelector('.faq-list');
    if (!container || !PAGE_CONTENT.faq.items) return;

    container.innerHTML = PAGE_CONTENT.faq.items.map(item => {
        // Check if this is the guarantee question to add special styling
        const isGuaranteeQuestion = item.question.includes('something breaks');
        const answerHTML = isGuaranteeQuestion ? 
            `<div class="faq-answer">
                <p>${item.answer.split('Important clarification:')[0]}</p>
                ${item.answer.includes('Important clarification:') ? 
                    `<div class="lifetime-guarantee">
                        <p><strong>Important clarification:</strong> ${item.answer.split('Important clarification:')[1]}</p>
                    </div>` : ''
                }
            </div>` :
            `<div class="faq-answer"><p>${item.answer}</p></div>`;

        return `
            <div class="faq-item">
                <div class="faq-question">${item.question}</div>
                ${answerHTML}
            </div>
        `;
    }).join('');
}

// ====================================
// NAVIGATION
// ====================================

function initializeNavigation() {
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-menu a');

    if (!navToggle || !navMenu) return;

    // Toggle mobile menu
    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close mobile menu when clicking a link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
        }
    });
}

// ====================================
// SMOOTH SCROLL
// ====================================

function initializeSmoothScroll() {
    // Handle all elements with data-scroll-to attribute
    document.querySelectorAll('[data-scroll-to]').forEach(element => {
        element.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('data-scroll-to');
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                const headerOffset = 80; // Account for sticky header
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Handle regular anchor links in navigation
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            
            e.preventDefault();
            const targetId = href.substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                const headerOffset = 80;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ====================================
// INDUSTRY SELECTOR
// ====================================

let selectedIndustry = 'Trades & Home Services'; // Default

function initializeIndustrySelector() {
    const container = document.querySelector('.industry-buttons');
    if (!container || !PAGE_CONTENT.industries) return;

    // Generate industry buttons
    container.innerHTML = PAGE_CONTENT.industries.map(industry => `
        <button class="industry-btn ${industry === selectedIndustry ? 'active' : ''}" 
                data-industry="${industry}">
            ${industry}
        </button>
    `).join('');

    // Add click handlers
    container.querySelectorAll('.industry-btn').forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            container.querySelectorAll('.industry-btn').forEach(btn => {
                btn.classList.remove('active');
            });
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Update selected industry
            selectedIndustry = this.getAttribute('data-industry');
            
            // Update all elements with data-selected-industry
            updateSelectedIndustryDisplay();
        });
    });

    // Initialize display
    updateSelectedIndustryDisplay();
}

function updateSelectedIndustryDisplay() {
    document.querySelectorAll('[data-selected-industry]').forEach(element => {
        element.textContent = selectedIndustry;
    });
}

// ====================================
// UTILITIES
// ====================================

function setCurrentYear() {
    const yearElements = document.querySelectorAll('.current-year');
    const currentYear = new Date().getFullYear();
    yearElements.forEach(element => {
        element.textContent = currentYear;
    });
}

// ====================================
// ANALYTICS & TRACKING (Optional)
// ====================================

// Track CTA button clicks (for future analytics integration)
function trackCTAClick(ctaLabel) {
    console.log('CTA Clicked:', ctaLabel);
    // Add analytics tracking here (Google Analytics, etc.)
}

// Add tracking to all CTA buttons
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
        document.querySelectorAll('.btn').forEach(button => {
            button.addEventListener('click', function() {
                const ctaText = this.textContent.trim();
                trackCTAClick(ctaText);
            });
        });
    }, 500); // Small delay to ensure content is loaded
});


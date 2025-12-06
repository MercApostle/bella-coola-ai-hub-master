// audit.js
// Renders the Lite Audit form from auditConfig.js and builds a JSON payload.

import { AUDIT_QUESTIONS } from "./auditConfig.js";

document.addEventListener("DOMContentLoaded", () => {
  const formEl = document.getElementById("audit-form");
  const resultEl = document.getElementById("audit-result");

  if (!formEl) {
    console.warn("Audit form element not found.");
    return;
  }

  // Render fields based on config
  AUDIT_QUESTIONS.forEach((q) => {
    const wrapper = document.createElement("div");
    wrapper.classList.add("audit-field");

    const label = document.createElement("label");
    label.classList.add("audit-label");
    label.setAttribute("for", q.id);
    label.textContent = q.label + (q.required ? " *" : "");

    let inputEl;

    if (q.type === "textarea") {
      inputEl = document.createElement("textarea");
      inputEl.classList.add("audit-textarea");
    } else if (q.type === "select") {
      inputEl = document.createElement("select");
      inputEl.classList.add("audit-select");

      const placeholderOption = document.createElement("option");
      placeholderOption.value = "";
      placeholderOption.textContent = "-- Select an option --";
      inputEl.appendChild(placeholderOption);

      (q.options || []).forEach((opt) => {
        const optEl = document.createElement("option");
        optEl.value = opt;
        optEl.textContent = opt;
        inputEl.appendChild(optEl);
      });
    } else {
      inputEl = document.createElement("input");
      inputEl.classList.add("audit-input");
      inputEl.type = q.type || "text";
    }

    inputEl.id = q.id;
    inputEl.name = q.id;
    if (q.required) inputEl.required = true;

    wrapper.appendChild(label);
    wrapper.appendChild(inputEl);
    formEl.appendChild(wrapper);
  });

  // Add submit button and actions at the bottom of the form
  const actionsDiv = document.createElement("div");
  actionsDiv.classList.add("audit-actions");
  
  const submitBtn = document.createElement("button");
  submitBtn.type = "submit";
  submitBtn.id = "audit-submit";
  submitBtn.classList.add("btn-primary");
  submitBtn.textContent = "Submit Audit";
  
  const hintP = document.createElement("p");
  hintP.classList.add("audit-hint");
  hintP.textContent = "Your answers will be reviewed manually. We'll follow up with a recommended first system and next steps.";
  
  actionsDiv.appendChild(submitBtn);
  actionsDiv.appendChild(hintP);
  formEl.appendChild(actionsDiv);

  // Now get the submit button reference after it's created
  const submitBtnRef = document.getElementById("audit-submit");

  // Function to format email body with all form responses
  function formatEmailBody(formData) {
    let body = "NEW BUSINESS AUDIT SUBMISSION\n";
    body += "=".repeat(50) + "\n\n";
    
    // Contact Information Section
    body += "CONTACT INFORMATION\n";
    body += "-".repeat(30) + "\n";
    const contactName = formData.get('contact_name') || 'Not provided';
    const contactEmail = formData.get('contact_email') || 'Not provided';
    const businessName = formData.get('business_name') || 'Not provided';
    const location = formData.get('location') || 'Not provided';
    const industry = formData.get('industry') || 'Not provided';
    
    body += `Name: ${contactName}\n`;
    body += `Email: ${contactEmail}\n`;
    body += `Business: ${businessName}\n`;
    body += `Location: ${location}\n`;
    body += `Industry: ${industry}\n\n`;
    
    // Business Details Section
    body += "BUSINESS DETAILS\n";
    body += "-".repeat(30) + "\n";
    const teamSize = formData.get('team_size') || 'Not provided';
    const monthlyLeads = formData.get('monthly_leads_estimate') || 'Not provided';
    const responseTime = formData.get('lead_response_time') || 'Not provided';
    
    body += `Team Size: ${teamSize}\n`;
    body += `Monthly Leads: ${monthlyLeads}\n`;
    body += `Response Time: ${responseTime}\n\n`;
    
    // Pain Points Section
    body += "PAIN POINTS & AUTOMATION\n";
    body += "-".repeat(30) + "\n";
    const bottleneck = formData.get('primary_bottleneck_area') || 'Not provided';
    const painPoint = formData.get('main_pain_point') || 'Not provided';
    const automationChoice = formData.get('first_automation_choice') || 'Not provided';
    
    body += `Primary Bottleneck: ${bottleneck}\n\n`;
    body += `Main Frustration:\n${painPoint}\n\n`;
    if (automationChoice && automationChoice !== 'Not provided') {
      body += `First Automation Choice:\n${automationChoice}\n\n`;
    }
    
    // Follow-up Section
    const followup = formData.get('preferred_followup_channel') || 'Not provided';
    body += "FOLLOW-UP\n";
    body += "-".repeat(30) + "\n";
    body += `Preferred Channel: ${followup}\n\n`;
    
    // Meta Information
    body += "META\n";
    body += "-".repeat(30) + "\n";
    body += `Submitted: ${new Date().toLocaleString()}\n`;
    body += `Source: web_audit_form\n`;
    
    return body;
  }

  // Handle submit
  formEl.addEventListener("submit", (e) => {
    e.preventDefault(); // Prevent default submission
    
    // Basic HTML5 validation
    if (!formEl.reportValidity()) {
      return;
    }

    // LOCAL TESTING MODE: Simulate success on localhost
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      // Simulate successful submission for local testing
      formEl.style.display = "none";
      const titleEl = document.querySelector('.audit-title');
      const subtitleEl = document.querySelector('.audit-subtitle');
      if (titleEl) titleEl.style.display = "none";
      if (subtitleEl) subtitleEl.style.display = "none";
      
      if (resultEl) {
        resultEl.style.display = "block";
        resultEl.innerHTML = `
          <p class="audit-hint" style="margin-bottom: 1.5rem; font-size: 1rem; line-height: 1.6;">
            Your answers will be reviewed manually. We'll follow up with a recommended first system and next steps.
          </p>
          <a href="index.html" class="btn-primary" style="display: inline-block; text-decoration: none; text-align: center; padding: 0.5rem 1rem; font-size: 0.875rem;">
            Close
          </a>
        `;
        resultEl.style.color = "#d4af37";
        resultEl.style.borderColor = "#d4af37";
        resultEl.style.textAlign = "center";
      }
      return; // Stop here for local testing
    }

    // Prepare FormData for Netlify submission
    const formData = new FormData(formEl);
    
    // Format and populate email body
    const emailBody = formatEmailBody(formData);
    const emailBodyField = document.getElementById('email-body');
    if (emailBodyField) {
      emailBodyField.value = emailBody;
      formData.set('body', emailBody);
    }
    
    // Set dynamic subject line
    const contactName = formData.get('contact_name') || 'New Submission';
    const businessName = formData.get('business_name') || '';
    const subjectField = document.getElementById('email-subject');
    if (subjectField) {
      const subject = businessName 
        ? `New Business Audit: ${contactName} - ${businessName}`
        : `New Business Audit: ${contactName}`;
      subjectField.value = subject;
      formData.set('subject', subject);
    }
    
    // Add meta fields
    formData.append('submitted_at', new Date().toISOString());
    formData.append('source', 'web_audit_form');
    
    // Ensure form-name is set (required by Netlify)
    formData.set('form-name', 'business-audit');

    // Submit to Netlify Forms using fetch
    fetch('/', {
      method: 'POST',
      body: formData
    })
    .then(response => {
      if (response.ok) {
        // Hide the form and title/subtitle
        formEl.style.display = "none";
        const titleEl = document.querySelector('.audit-title');
        const subtitleEl = document.querySelector('.audit-subtitle');
        if (titleEl) titleEl.style.display = "none";
        if (subtitleEl) subtitleEl.style.display = "none";
        
        // Show success message with hint text and close button
        if (resultEl) {
          resultEl.style.display = "block";
          resultEl.innerHTML = `
            <p class="audit-hint" style="margin-bottom: 1.5rem; font-size: 1rem; line-height: 1.6;">
              Your answers will be reviewed manually. We'll follow up with a recommended first system and next steps.
            </p>
            <a href="index.html" class="btn-primary" style="display: inline-block; text-decoration: none; text-align: center; padding: 0.25rem 0.5rem; font-size: 0.875rem; font-weight: 700;">
              Close
            </a>
          `;
          resultEl.style.color = "#d4af37";
          resultEl.style.borderColor = "#d4af37";
          resultEl.style.textAlign = "center";
        }
      } else {
        throw new Error('Form submission failed');
      }
    })
    .catch(error => {
      console.error('Error submitting form:', error);
      if (resultEl) {
        resultEl.style.display = "block";
        resultEl.textContent = "There was an error submitting your form. Please try again or contact us directly.";
        resultEl.style.color = "#ff6b6b";
        resultEl.style.borderColor = "#ff6b6b";
      }
    });
  });
});


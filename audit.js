// audit.js
// Renders the Lite Audit form from auditConfig.js and builds a JSON payload.

import { AUDIT_QUESTIONS } from "./auditConfig.js";

document.addEventListener("DOMContentLoaded", () => {
  const formEl = document.getElementById("audit-form");
  const submitBtn = document.getElementById("audit-submit");
  const resultEl = document.getElementById("audit-result");

  if (!formEl || !submitBtn) {
    console.warn("Audit form elements not found.");
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

  // Handle submit
  formEl.addEventListener("submit", (e) => {
    e.preventDefault(); // Prevent default submission
    
    // Basic HTML5 validation
    if (!formEl.reportValidity()) {
      return;
    }

    // Prepare FormData for Netlify submission
    const formData = new FormData(formEl);
    
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
        // Show success message
        if (resultEl) {
          resultEl.style.display = "block";
          resultEl.textContent = "Thank you! Your audit has been submitted. We'll review your answers and follow up with you soon.";
          resultEl.style.color = "#d4af37";
          resultEl.style.borderColor = "#d4af37";
        }
        // Reset form
        formEl.reset();
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


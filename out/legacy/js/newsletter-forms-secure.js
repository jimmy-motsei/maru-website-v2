/**
 * Secure Newsletter Form Handler - HubSpot Embedded Forms
 * Uses HubSpot embedded forms for secure newsletter subscription
 * Optimized for fast loading and performance
 */

class SecureNewsletterFormHandler {
  constructor() {
    this.hubspotPortalId = "146669350";
    this.newsletterFormId = "cd4d47e9-93e9-4d8e-a221-ad7496701f99"; // Actual HubSpot form ID
    this.isInitialized = false;
    this.formsProcessed = new Set();
    this.consentListenerAttached = false;
    this.onConsentChange = this.onConsentChange.bind(this);
    this.init();
  }

  init() {
    // Only initialize if not already done
    if (this.isInitialized) {
      return;
    }

    this.isInitialized = true;

    const banner = window.cookieBannerManager;
    if (banner) {
      if (banner.hasConsent && banner.hasConsent("marketing")) {
        this.loadWithConsent();
      } else {
        this.showFallbackForms();
        if (!this.consentListenerAttached) {
          document.addEventListener("maruConsentChanged", this.onConsentChange);
          this.consentListenerAttached = true;
        }
      }
    } else {
      // Fallback: proceed as before if banner is unavailable
      this.loadWithConsent();
    }
  }

  onConsentChange(event) {
    const detail = event.detail || {};
    if (detail.marketing) {
      if (this.consentListenerAttached) {
        document.removeEventListener("maruConsentChanged", this.onConsentChange);
        this.consentListenerAttached = false;
      }
      this.loadWithConsent();
    } else {
      this.showFallbackForms();
    }
  }

  loadWithConsent() {
    if (typeof window.loadHubSpot === "function") {
      window.loadHubSpot();
    }
    this.waitForHubSpot();
  }

  loadHubSpotFormsScript() {
    return new Promise((resolve, reject) => {
      // Check if script is already loaded
      if (window.hbspt && window.hbspt.forms) {
        resolve();
        return;
      }

      // Check if script is already being loaded
      if (document.querySelector('script[src*="hsforms.net"]')) {
        // Wait for it to load
        const checkLoaded = setInterval(() => {
          if (window.hbspt && window.hbspt.forms) {
            clearInterval(checkLoaded);
            resolve();
          }
        }, 100);

        // Timeout after 10 seconds
        setTimeout(() => {
          clearInterval(checkLoaded);
          reject(new Error("HubSpot forms script load timeout"));
        }, 10000);
        return;
      }

      // Load the script
      const script = document.createElement("script");
      script.src = "https://js-eu1.hsforms.net/forms/embed/146669350.js";
      script.defer = true;
      script.onload = () => {
        // Wait a bit for the script to initialize
        setTimeout(() => {
          if (window.hbspt && window.hbspt.forms) {
            resolve();
          } else {
            reject(new Error("HubSpot forms not initialized"));
          }
        }, 500);
      };
      script.onerror = () => {
        reject(new Error("Failed to load HubSpot forms script"));
      };
      document.head.appendChild(script);
    });
  }

  waitForHubSpot() {
    if (window.hbspt && window.hbspt.forms) {
      this.createNewsletterForms();
    } else {
      // Wait for HubSpot to load
      const checkHubSpot = setInterval(() => {
        if (window.hbspt && window.hbspt.forms) {
          clearInterval(checkHubSpot);
          this.createNewsletterForms();
        }
      }, 100);

      // Fallback after 10 seconds
      setTimeout(() => {
        if (!window.hbspt || !window.hbspt.forms) {
          clearInterval(checkHubSpot);
          this.showFallbackForms();
        }
      }, 10000);
    }
  }

  createNewsletterForms() {
    const forms = document.querySelectorAll(".mil-subscribe-form");

    forms.forEach((form, index) => {
      // Skip if already processed
      if (
        this.formsProcessed.has(form) ||
        form.hasAttribute("data-hubspot-integrated")
      ) {
        return;
      }

      this.formsProcessed.add(form);
      form.setAttribute("data-hubspot-integrated", "true");
      this.replaceWithHubSpotForm(form, index);
    });
  }

  replaceWithHubSpotForm(originalForm, index) {
    const container = originalForm.parentNode;
    const formId = `hubspot-newsletter-${index}`;

    // Create container for HubSpot form using the correct approach
    const hubspotContainer = document.createElement("div");
    hubspotContainer.className = "hs-form-frame hubspot-newsletter-form";
    hubspotContainer.setAttribute("data-region", "eu1");
    hubspotContainer.setAttribute("data-form-id", this.newsletterFormId);
    hubspotContainer.setAttribute("data-portal-id", this.hubspotPortalId);

    // Replace original form
    container.replaceChild(hubspotContainer, originalForm);

    // Load HubSpot forms script if not already loaded
    this.loadHubSpotFormsScript()
      .then(() => {
        try {
          // Initialize the form using the correct method
          if (window.hbspt && window.hbspt.forms) {
            hbspt.forms.create({
              portalId: this.hubspotPortalId,
              formId: this.newsletterFormId,
              target: hubspotContainer,
              region: "eu1",
              onFormReady: (form) => {
                this.onFormReady(form, index);
                this.addArrowIconToHubSpotButton(form);
              },
              onFormSubmit: (form) => {
                this.onFormSubmit(form, index);
              },
              onFormSubmitted: (form) => {
                this.onFormSubmitted(form, index);
              },
            });
          } else {
            throw new Error("HubSpot forms not available");
          }
        } catch (error) {
          console.error("Error creating HubSpot newsletter form:", error);
          console.log(
            "Falling back to custom form for newsletter subscription"
          );
          this.showFallbackForm(container, index);
        }
      })
      .catch((error) => {
        console.error("Error loading HubSpot forms script:", error);
        this.showFallbackForm(container, index);
      });
  }

  onFormReady(form, index) {
    console.log(`HubSpot newsletter form ${index} ready`);
    this.styleHubSpotForm(form);
  }

  onFormSubmit(form, index) {
    console.log(`Newsletter form ${index} submitted`);
    this.showFormSubmissionState(form);
    this.trackSubmissionEvent(index);
  }

  onFormSubmitted(form, index) {
    console.log(`Newsletter form ${index} successfully submitted`);
    this.showFormSuccessState(form);
    this.updateAllFormsAsSubscribed();
    this.trackSuccessfulSubmission(index);
  }

  styleHubSpotForm(form) {
    // Add custom CSS to match the footer design exactly
    const style = document.createElement("style");
    style.textContent = `
      .hubspot-newsletter-form {
        position: relative !important;
        height: 70px !important;
        width: 100% !important;
      }
      
      .hubspot-newsletter-form .hs-form {
        font-family: "Outfit", sans-serif !important;
        margin: 0 !important;
        padding: 0 !important;
      }
      
      .hubspot-newsletter-form .hs-form-field {
        margin: 0 !important;
        padding: 0 !important;
        position: relative !important;
        height: 70px !important;
      }
      
      .hubspot-newsletter-form .hs-form input[type="email"],
      .hubspot-newsletter-form .hs-form input[type="text"] {
        height: 100% !important;
        width: 100% !important;
        background-color: rgba(255, 255, 255, 0.1) !important;
        color: rgb(0, 0, 0) !important;
        font-size: 12px !important;
        font-weight: 500 !important;
        text-transform: uppercase !important;
        letter-spacing: 2px !important;
        border: none !important;
        border-radius: 70px !important;
        padding: 0 0 0 50px !important;
        margin: 0 !important;
        transition: 0.4s cubic-bezier(0, 0, 0.3642, 1) !important;
        box-sizing: border-box !important;
      }
      
      .hubspot-newsletter-form .hs-form input::-webkit-input-placeholder {
        color: rgb(128, 128, 128) !important;
        font-family: "Outfit", sans-serif !important;
        font-size: 12px !important;
        font-weight: 500 !important;
        text-transform: uppercase !important;
        letter-spacing: 2px !important;
      }
      
      .hubspot-newsletter-form .hs-form input::-moz-placeholder {
        color: rgb(128, 128, 128) !important;
        font-family: "Outfit", sans-serif !important;
        font-size: 12px !important;
        font-weight: 500 !important;
        text-transform: uppercase !important;
        letter-spacing: 2px !important;
      }
      
      .hubspot-newsletter-form .hs-form input:-ms-input-placeholder {
        color: rgb(128, 128, 128) !important;
        font-family: "Outfit", sans-serif !important;
        font-size: 12px !important;
        font-weight: 500 !important;
        text-transform: uppercase !important;
        letter-spacing: 2px !important;
      }
      
      .hubspot-newsletter-form .hs-form input::-ms-input-placeholder {
        color: rgb(128, 128, 128) !important;
        font-family: "Outfit", sans-serif !important;
        font-size: 12px !important;
        font-weight: 500 !important;
        text-transform: uppercase !important;
        letter-spacing: 2px !important;
      }
      
      .hubspot-newsletter-form .hs-form input::placeholder {
        color: rgb(128, 128, 128) !important;
        font-family: "Outfit", sans-serif !important;
        font-size: 12px !important;
        font-weight: 500 !important;
        text-transform: uppercase !important;
        letter-spacing: 2px !important;
      }
      
      .hubspot-newsletter-form .hs-form input:focus {
        background-color: rgb(255, 255, 255) !important;
        outline: inherit !important;
      }
      
      .hubspot-newsletter-form .hs-form input:hover {
        background-color: rgb(255, 255, 255) !important;
      }
      
      .hubspot-newsletter-form .hs-form .hs-button {
        display: none !important;
      }
      
      .hubspot-newsletter-form::after {
        content: "" !important;
        position: absolute !important;
        top: 15px !important;
        right: 15px !important;
        width: 40px !important;
        height: 40px !important;
        background-color: rgb(0, 0, 0) !important;
        border-radius: 50% !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        transition: 0.4s cubic-bezier(0, 0, 0.3642, 1) !important;
        cursor: pointer !important;
        background-image: url("data:image/svg+xml,%3Csvg width='24' height='24' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M5 12h14m-7-7l7 7-7 7' stroke='%2300BCD4' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E") !important;
        background-repeat: no-repeat !important;
        background-position: center !important;
        background-size: 20px 20px !important;
      }
      
      .hubspot-newsletter-form:hover::after {
        transform: scale(1.15) !important;
      }
      
      .hubspot-newsletter-form .hs-form .hs-button::after {
        content: "" !important;
      }
      
      .hubspot-newsletter-form .hs-form .hs-button:hover {
        transform: scale(1.015) !important;
        filter: brightness(110%) !important;
      }
      
      .hubspot-newsletter-form .hs-form .hs-button svg {
        margin-left: 20px !important;
        border-radius: 50% !important;
        width: 40px !important;
        height: 40px !important;
        padding: 10px !important;
        background-color: rgb(0, 0, 0) !important;
        transition: 0.4s cubic-bezier(0, 0, 0.3642, 1) !important;
      }
      
      .hubspot-newsletter-form .hs-form .hs-button svg path {
        fill: rgb(61, 184, 198) !important;
      }
      
      .hubspot-newsletter-form .hs-form .hs-button:hover svg {
        transform: scale(1.15) !important;
      }
      
      .hubspot-newsletter-form .hs-form .hs-error-msgs {
        color: #dc3545 !important;
        font-size: 12px !important;
        margin-top: 5px !important;
        text-align: center !important;
        font-family: "Outfit", sans-serif !important;
      }
      
      .hubspot-newsletter-form .hs-form .hs-error-msg {
        color: #dc3545 !important;
        font-size: 12px !important;
        font-family: "Outfit", sans-serif !important;
      }
      
      .hubspot-newsletter-form .hs-form .hs-form-required {
        display: none !important;
      }
      
      .hubspot-newsletter-form .hs-form .hs-fieldtype-text {
        margin: 0 !important;
        padding: 0 !important;
      }
      
      .hubspot-newsletter-form .hs-form .hs-form-field {
        margin: 0 !important;
        padding: 0 !important;
      }
      
      /* Footer integration styles */
      .mil-footer .hubspot-newsletter-form {
        margin-top: 20px !important;
      }
      
      .mil-footer .hubspot-newsletter-form .hs-form {
        background: transparent !important;
      }
      
      /* Mobile responsive styles */
      @media screen and (max-width: 768px) {
        .hubspot-newsletter-form {
          height: 60px !important;
        }
        
        .hubspot-newsletter-form .hs-form input[type="email"],
        .hubspot-newsletter-form .hs-form input[type="text"] {
          font-size: 11px !important;
          padding: 0 15px !important;
        }
        
        .hubspot-newsletter-form .hs-form .hs-button {
          padding: 12px 18px 12px 22px !important;
          font-size: 11px !important;
          top: 12px !important;
          right: 12px !important;
          min-width: 100px !important;
        }
        
        .hubspot-newsletter-form .hs-form .hs-button::after {
          font-size: 12px !important;
        }
      }
    `;

    document.head.appendChild(style);
  }

  showFormSubmissionState(form) {
    const submitButton = form.querySelector(".hs-button");
    if (submitButton) {
      submitButton.disabled = true;
      submitButton.textContent = "Subscribing...";
    }
  }

  showFormSuccessState(form) {
    const successDiv = document.createElement("div");
    successDiv.className = "form-success";
    successDiv.innerHTML = `
      <div class="mil-success-banner">
        <h4 class="mil-success-banner__title">🎉 Welcome to AI Insights!</h4>
        <p class="mil-success-banner__text">Thank you for subscribing! Check your email for confirmation and your first AI insights.</p>
      </div>
    `;

    form.appendChild(successDiv);

    // Remove success message after 10 seconds
    setTimeout(() => {
      if (successDiv.parentNode) {
        successDiv.remove();
      }
    }, 10000);
  }

  updateAllFormsAsSubscribed() {
    // Update all newsletter forms to show subscribed state
    const forms = document.querySelectorAll(".mil-subscribe-form");

    forms.forEach((form) => {
      if (!form.hasAttribute("data-hubspot-integrated")) {
        const emailInput = form.querySelector(
          'input[type="email"], input[type="text"]'
        );
        if (emailInput) {
          emailInput.value = "Already subscribed!";
          emailInput.disabled = true;
          emailInput.classList.add("mil-subscribe-disabled");

          const indicator = document.createElement("small");
          indicator.textContent = "✓ Subscribed to AI Insights Newsletter";
          indicator.className = "mil-subscribe-indicator";

          if (!form.querySelector(".subscription-indicator")) {
            indicator.className = "subscription-indicator";
            emailInput.parentNode.appendChild(indicator);
          }
        }
      }
    });
  }

  trackSubmissionEvent(index) {
    // Track form submission in analytics
    if (window.gtag) {
      gtag("event", "newsletter_form_submit", {
        event_category: "engagement",
        event_label: "AI Insights Newsletter",
        value: 1,
      });
    }

    if (window._hsq) {
      _hsq.push([
        "trackEvent",
        {
          id: "newsletter_form_submit",
          value: index,
        },
      ]);
    }
  }

  trackSuccessfulSubmission(index) {
    // Track successful subscription
    if (window.gtag) {
      gtag("event", "newsletter_subscription_success", {
        event_category: "engagement",
        event_label: "AI Insights Newsletter",
        value: 1,
      });
    }

    if (window._hsq) {
      _hsq.push([
        "trackEvent",
        {
          id: "newsletter_subscription_success",
          value: index,
        },
      ]);
    }
  }

  showFallbackForms() {
    console.log("Showing fallback newsletter forms");

    const forms = document.querySelectorAll(".mil-subscribe-form");

    forms.forEach((form) => {
      if (!form.hasAttribute("data-fallback-added")) {
        form.setAttribute("data-fallback-added", "true");
        this.addFallbackFunctionality(form);
      }
    });
  }

  addArrowIconToHubSpotButton(form) {
    // Wait a bit for the form to be fully rendered
    setTimeout(() => {
      const button = form.querySelector(".hs-form .hs-button");
      if (button) {
        // Remove any existing content
        button.innerHTML = "";

        // Add the text and arrow icon
        const textSpan = document.createElement("span");
        textSpan.textContent = "ENTER YOUR EMAIL";
        button.appendChild(textSpan);

        const svg = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "svg"
        );
        svg.setAttribute("width", "40");
        svg.setAttribute("height", "40");
        svg.setAttribute("viewBox", "0 0 24 24");
        svg.setAttribute("fill", "none");
        svg.style.marginLeft = "20px";
        svg.style.borderRadius = "50%";
        svg.style.width = "40px";
        svg.style.height = "40px";
        svg.style.padding = "10px";
        svg.style.backgroundColor = "rgb(0, 0, 0)";
        svg.style.transition = "0.4s cubic-bezier(0, 0, 0.3642, 1)";

        const path = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "path"
        );
        path.setAttribute("d", "M5 12h14m-7-7l7 7-7 7");
        path.setAttribute("stroke", "rgb(61, 184, 198)");
        path.setAttribute("stroke-width", "2");
        path.setAttribute("stroke-linecap", "round");
        path.setAttribute("stroke-linejoin", "round");

        svg.appendChild(path);
        button.appendChild(svg);
      }
    }, 100);
  }

  addFallbackFunctionality(form) {
    const emailInput = form.querySelector('input[type="email"]');
    const submitButton = form.querySelector('button[type="submit"]');

    if (emailInput && submitButton) {
      // Enhanced form submission handling
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        this.handleNewsletterSubmission(form, emailInput, submitButton);
      });

      // Real-time email validation
      emailInput.addEventListener("input", () => {
        this.validateEmailInput(emailInput);
      });

      // Enhanced button interactions
      submitButton.addEventListener("mouseenter", () => {
        if (!submitButton.disabled) {
          submitButton.style.transform = "scale(1.05)";
          submitButton.style.filter = "brightness(110%)";
        }
      });

      submitButton.addEventListener("mouseleave", () => {
        if (!submitButton.disabled) {
          submitButton.style.transform = "scale(1)";
          submitButton.style.filter = "brightness(100%)";
        }
      });
    }
  }

  validateEmailInput(input) {
    const email = input.value.trim();
    const isValid = this.validateEmail(email);

    if (email.length > 0) {
      if (isValid) {
        input.style.backgroundColor = "rgba(255, 255, 255, 0.9)";
        input.style.color = "rgb(0, 0, 0)";
      } else {
        input.style.backgroundColor = "rgba(255, 200, 200, 0.9)";
        input.style.color = "rgb(200, 0, 0)";
      }
    } else {
      input.style.backgroundColor = "rgba(255, 255, 255, 0.1)";
      input.style.color = "rgb(0, 0, 0)";
    }
  }

  showMessage(messageDiv, text, type) {
    if (messageDiv) {
      messageDiv.textContent = text;
      messageDiv.className = `mil-newsletter-message ${type}`;
      messageDiv.style.display = "block";
    }
  }

  hideMessage(messageDiv) {
    if (messageDiv) {
      messageDiv.style.display = "none";
    }
  }

  handleNewsletterSubmission(form, emailInput, submitButton) {
    const email = emailInput.value.trim();

    if (!this.validateEmail(email)) {
      emailInput.style.backgroundColor = "rgba(255, 200, 200, 0.9)";
      emailInput.style.color = "rgb(200, 0, 0)";
      emailInput.focus();
      return;
    }

    // Show loading state
    this.showLoadingState(submitButton);

    // Simulate API call (replace with actual HubSpot integration)
    setTimeout(() => {
      this.showSuccessState(form, emailInput, submitButton);
    }, 1500);
  }

  showLoadingState(submitButton) {
    submitButton.disabled = true;
    submitButton.style.opacity = "0.7";
    submitButton.style.cursor = "not-allowed";

    const originalContent = submitButton.innerHTML;
    submitButton.innerHTML = `
      <span>Subscribing...</span>
    `;
  }

  showSuccessState(form, emailInput, submitButton) {
    submitButton.disabled = false;
    submitButton.style.opacity = "1";
    submitButton.style.cursor = "pointer";

    // Reset button content
    submitButton.innerHTML = `
      <span>Subscribe</span>
    `;

    // Show success feedback
    emailInput.style.backgroundColor = "rgba(200, 255, 200, 0.9)";
    emailInput.style.color = "rgb(0, 100, 0)";
    emailInput.value = "✓ Subscribed!";

    // Clear form after 3 seconds
    setTimeout(() => {
      emailInput.value = "";
      emailInput.style.backgroundColor = "rgba(255, 255, 255, 0.1)";
      emailInput.style.color = "rgb(0, 0, 0)";
    }, 3000);
  }

  validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  handleFallbackSubmission(form, email) {
    // Show loading state
    const submitButton = form.querySelector("button");
    if (submitButton) {
      submitButton.disabled = true;
      submitButton.innerHTML = "<span>Subscribing...</span>";
    }

    // Simulate submission (in production, this would send to your server)
    setTimeout(() => {
      // Show success message
      const successDiv = document.createElement("div");
      successDiv.innerHTML = `
        <div class="mil-success-banner">
          <p class="mil-success-banner__text">Thank you for subscribing! We'll add you to our newsletter list.</p>
        </div>
      `;

      form.appendChild(successDiv);

      // Reset form
      emailInput.value = "";
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.innerHTML = "";
      }

      // Remove success message after 5 seconds
      setTimeout(() => {
        if (successDiv.parentNode) {
          successDiv.remove();
        }
      }, 5000);
    }, 1000);
  }
}

// Initialize when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  new SecureNewsletterFormHandler();
});

// Also initialize on page load
window.addEventListener("load", () => {
  if (!document.querySelector(".hubspot-newsletter-form")) {
    new SecureNewsletterFormHandler();
  }
});

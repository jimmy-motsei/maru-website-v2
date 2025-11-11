/**
 * Contact Form Enhancer - Optimized for Speed
 * Improves HubSpot contact form with faster loading and better error handling
 */

class ContactFormEnhancer {
  constructor() {
    this.isInitialized = false;
    this.formCreated = false;
    this.init();
  }

  init() {
    // Only initialize if not already done
    if (this.isInitialized) {
      return;
    }

    this.isInitialized = true;
    this.setupContactForm();
    this.addLoadingState();
  }

  setupContactForm() {
    // Check if HubSpot is already loaded
    if (window.hbspt && window.hbspt.forms) {
      console.log("HubSpot already loaded, creating form immediately...");
      this.createHubSpotForm();
      return;
    }

    // Check if scripts are marked as loaded
    if (window.hsLoaded && window.hsFormsLoaded) {
      console.log("HubSpot scripts loaded, creating form...");
      this.createHubSpotForm();
      return;
    }

    // Wait for HubSpot to load with optimized polling
    console.log("Waiting for HubSpot to load...");
    this.waitForHubSpot();
  }

  waitForHubSpot() {
    let attempts = 0;
    const maxAttempts = 50; // 5 seconds max (50 * 100ms)

    const checkHubSpot = setInterval(() => {
      attempts++;

      if (window.hbspt && window.hbspt.forms) {
        console.log("HubSpot loaded, creating form...");
        clearInterval(checkHubSpot);
        this.createHubSpotForm();
        return;
      }

      // Fallback after max attempts
      if (attempts >= maxAttempts) {
        console.log(
          "HubSpot failed to load within timeout, showing fallback form"
        );
        clearInterval(checkHubSpot);
        this.showFallbackForm();
      }
    }, 100);

    // Also listen for script load events
    this.listenForScriptLoads(checkHubSpot);
  }

  listenForScriptLoads(checkInterval) {
    // Listen for both scripts to load
    const checkBothLoaded = () => {
      if (window.hsLoaded && window.hsFormsLoaded) {
        // Give a small delay for scripts to initialize
        setTimeout(() => {
          if (window.hbspt && window.hbspt.forms) {
            console.log("HubSpot scripts loaded, creating form...");
            clearInterval(checkInterval);
            this.createHubSpotForm();
          }
        }, 100);
      }
    };

    // Check every 50ms for faster response
    const scriptCheck = setInterval(() => {
      checkBothLoaded();
      if (window.hbspt && window.hbspt.forms) {
        clearInterval(scriptCheck);
      }
    }, 50);
  }

  createHubSpotForm() {
    // Prevent duplicate form creation
    if (this.formCreated) {
      return;
    }

    try {
      const container = document.getElementById("hubspot-container");
      if (!container) {
        console.error("HubSpot container not found");
        return;
      }

      this.formCreated = true;

      // Remove loading state
      this.hideLoadingState();

      // Create the HubSpot form
      hbspt.forms.create({
        portalId: "146669350",
        formId: "e1a0f3ac-6a78-4c42-8dce-be1ea519666e",
        region: "eu1",
        target: "#hubspot-container",
        onFormReady: () => {
          console.log("HubSpot form ready");
          this.hideLoadingState();
        },
        onFormSubmit: () => {
          console.log("Form submitted");
        },
      });

      console.log("HubSpot form created successfully");
    } catch (error) {
      console.error("Error creating HubSpot form:", error);
      this.showFallbackForm();
    }
  }

  addLoadingState() {
    const container = document.getElementById("hubspot-container");
    if (container) {
      const loadingHTML = `
        <div id="hubspot-loading" class="mil-loader">
          <div class="mil-loader__spinner-wrapper">
            <div class="mil-loader__spinner"></div>
          </div>
          <p class="mil-loader__text">Loading contact form...</p>
        </div>
      `;

      container.insertAdjacentHTML("afterbegin", loadingHTML);
    }
  }

  hideLoadingState() {
    const loading = document.getElementById("hubspot-loading");
    if (loading) {
      loading.style.display = "none";
    }
  }

  showFallbackForm() {
    const container = document.getElementById("hubspot-container");
    if (!container) {
      console.error("Fallback container not found");
      return;
    }

    // Remove loading state
    this.hideLoadingState();

    // Create a fallback contact form
    container.innerHTML = `
      <div class="mil-contact-form">
        <form id="fallback-contact-form" class="mil-up">
          <div class="row">
            <div class="col-md-6">
              <div class="mil-input-group">
                <label for="fallback-firstname" class="mil-sr-only">First Name</label>
                <input type="text" id="fallback-firstname" name="firstname" placeholder="First Name *" aria-label="First Name" required />
              </div>
            </div>
            <div class="col-md-6">
              <div class="mil-input-group">
                <label for="fallback-lastname" class="mil-sr-only">Last Name</label>
                <input type="text" id="fallback-lastname" name="lastname" placeholder="Last Name *" aria-label="Last Name" required />
              </div>
            </div>
          </div>
          <div class="mil-input-group">
            <label for="fallback-email" class="mil-sr-only">Email Address</label>
            <input type="email" id="fallback-email" name="email" placeholder="Email Address *" aria-label="Email Address" required />
          </div>
          <div class="mil-input-group">
            <label for="fallback-message" class="mil-sr-only">Your Message</label>
            <textarea id="fallback-message" name="message" placeholder="Your Message *" rows="5" aria-label="Your Message" required></textarea>
          </div>
          <div class="mil-center">
            <button type="submit" class="mil-button mil-arrow-place" aria-label="Send contact message">
              <span>Send Message</span>
            </button>
          </div>
        </form>
      </div>
    `;

    // Add form submission handler
    const form = document.getElementById("fallback-contact-form");
    if (form) {
      form.addEventListener("submit", this.handleFallbackFormSubmit);
    }
  }

  handleFallbackFormSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData);

    // For now, just show a success message
    // In production, you'd send this to your server
    alert("Thank you for your message! We'll get back to you soon.");
    event.target.reset();
  }
}

// Initialize when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  new ContactFormEnhancer();
});

// Also initialize on page load
window.addEventListener("load", () => {
  if (!document.querySelector("#hubspot-container[data-enhanced]")) {
    new ContactFormEnhancer();
  }
});

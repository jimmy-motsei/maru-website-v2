/**
 * Form Performance Optimizer
 * Optimizes form loading for maximum speed and user experience
 */

class FormPerformanceOptimizer {
  constructor() {
    this.formsLoaded = new Set();
    this.scriptsLoaded = new Set();
    this.observers = new Map();
    this.init();
  }

  init() {
    this.setupIntersectionObserver();
    this.optimizeScriptLoading();
    this.setupFormLazyLoading();
  }

  /**
   * Setup Intersection Observer for lazy loading forms
   */
  setupIntersectionObserver() {
    if (!("IntersectionObserver" in window)) {
      // Fallback for older browsers
      this.loadAllForms();
      return;
    }

    const options = {
      root: null,
      rootMargin: "100px", // Load forms 100px before they come into view
      threshold: 0.1,
    };

    this.observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          this.loadForm(entry.target);
          this.observer.unobserve(entry.target);
        }
      });
    }, options);
  }

  /**
   * Setup lazy loading for all forms
   */
  setupFormLazyLoading() {
    // Newsletter forms
    const newsletterForms = document.querySelectorAll(".mil-subscribe-form");
    newsletterForms.forEach((form) => {
      this.observer.observe(form);
    });

    // Contact forms
    const contactForms = document.querySelectorAll(
      "#hubspot-container, .mil-contact-form"
    );
    contactForms.forEach((form) => {
      this.observer.observe(form);
    });

    // Demo forms (Calendly)
    const demoForms = document.querySelectorAll(".calendly-inline-widget");
    demoForms.forEach((form) => {
      this.observer.observe(form);
    });
  }

  /**
   * Load specific form when it comes into view
   */
  loadForm(formElement) {
    const formType = this.getFormType(formElement);

    if (this.formsLoaded.has(formType)) {
      return;
    }

    console.log(`Loading ${formType} form...`);

    switch (formType) {
      case "newsletter":
        this.loadNewsletterForm(formElement);
        break;
      case "contact":
        this.loadContactForm(formElement);
        break;
      case "demo":
        this.loadDemoForm(formElement);
        break;
    }

    this.formsLoaded.add(formType);
  }

  /**
   * Determine form type from element
   */
  getFormType(element) {
    if (element.classList.contains("mil-subscribe-form")) {
      return "newsletter";
    }
    if (
      element.id === "hubspot-container" ||
      element.classList.contains("mil-contact-form")
    ) {
      return "contact";
    }
    if (element.classList.contains("calendly-inline-widget")) {
      return "demo";
    }
    return "unknown";
  }

  /**
   * Load newsletter form with optimized script loading
   */
  loadNewsletterForm(formElement) {
    // Load newsletter script only if not already loaded
    if (!this.scriptsLoaded.has("newsletter")) {
      this.loadScript("js/newsletter-forms-secure.js", "newsletter");
    }
  }

  /**
   * Load contact form with optimized script loading
   */
  loadContactForm(formElement) {
    // Load contact form script only if not already loaded
    if (!this.scriptsLoaded.has("contact")) {
      this.loadScript("js/contact-form-enhancer.js", "contact");
    }
  }

  /**
   * Load demo form (Calendly) with optimized script loading
   */
  loadDemoForm(formElement) {
    // Load Calendly script only if not already loaded
    if (!this.scriptsLoaded.has("calendly")) {
      this.loadScript("js/calendly-loader.js", "calendly");
    }
  }

  /**
   * Optimized script loading with caching and error handling
   */
  loadScript(src, scriptType) {
    return new Promise((resolve, reject) => {
      // Check if script is already loaded
      if (document.querySelector(`script[src="${src}"]`)) {
        this.scriptsLoaded.add(scriptType);
        resolve();
        return;
      }

      const script = document.createElement("script");
      script.src = src;
      script.async = true;
      script.defer = true;

      script.onload = () => {
        console.log(`${scriptType} script loaded successfully`);
        this.scriptsLoaded.add(scriptType);
        resolve();
      };

      script.onerror = () => {
        console.error(`Failed to load ${scriptType} script: ${src}`);
        reject(new Error(`Script load failed: ${src}`));
      };

      document.head.appendChild(script);
    });
  }

  /**
   * Optimize script loading order and dependencies
   */
  optimizeScriptLoading() {
    // Load critical scripts first
    this.loadCriticalScripts();

    // Load form-specific scripts on demand
    this.setupFormScripts();
  }

  /**
   * Load critical scripts that are needed immediately
   */
  loadCriticalScripts() {
    const criticalScripts = [
      "js/plugins/jquery.min.js",
      "js/plugins/swup.min.js",
      "js/main.js",
    ];

    criticalScripts.forEach((src) => {
      if (!document.querySelector(`script[src="${src}"]`)) {
        this.loadScript(src, "critical");
      }
    });
  }

  /**
   * Setup form-specific scripts with lazy loading
   */
  setupFormScripts() {
    // Only load form scripts when forms are actually needed
    const formScripts = {
      newsletter: "js/newsletter-forms-secure.js",
      contact: "js/contact-form-enhancer.js",
      calendly: "js/calendly-loader.js",
    };

    // Store script mappings for later use
    this.formScripts = formScripts;
  }

  /**
   * Fallback: Load all forms if IntersectionObserver is not supported
   */
  loadAllForms() {
    console.log(
      "IntersectionObserver not supported, loading all forms immediately"
    );

    // Load all form scripts
    Object.values(this.formScripts).forEach((src) => {
      this.loadScript(src, "fallback");
    });
  }

  /**
   * Preload critical form scripts for better performance
   */
  preloadFormScripts() {
    const criticalFormScripts = [
      "js/newsletter-forms-secure.js",
      "js/contact-form-enhancer.js",
    ];

    criticalFormScripts.forEach((src) => {
      const link = document.createElement("link");
      link.rel = "preload";
      link.as = "script";
      link.href = src;
      document.head.appendChild(link);
    });
  }

  /**
   * Optimize HubSpot script loading
   */
  optimizeHubSpotLoading() {
    // Check if HubSpot script is already loaded
    if (window.hbspt && window.hbspt.forms) {
      return;
    }

    // Load HubSpot script with optimized settings
    const script = document.createElement("script");
    script.src = "//js-eu1.hs-scripts.com/146669350.js";
    script.async = true;
    script.defer = true;
    script.id = "hs-script-loader";

    // Add error handling
    script.onerror = () => {
      console.warn("HubSpot script failed to load, using fallback forms");
    };

    document.head.appendChild(script);
  }

  /**
   * Get performance metrics for forms
   */
  getFormPerformanceMetrics() {
    return {
      formsLoaded: Array.from(this.formsLoaded),
      scriptsLoaded: Array.from(this.scriptsLoaded),
      totalForms: document.querySelectorAll(
        "form, .mil-subscribe-form, #hubspot-container, .calendly-inline-widget"
      ).length,
      observerSupported: "IntersectionObserver" in window,
    };
  }
}

// Initialize form performance optimizer
document.addEventListener("DOMContentLoaded", () => {
  window.formOptimizer = new FormPerformanceOptimizer();

  // Preload critical form scripts
  window.formOptimizer.preloadFormScripts();

  // Optimize HubSpot loading
  window.formOptimizer.optimizeHubSpotLoading();
});

// Export for debugging
if (typeof module !== "undefined" && module.exports) {
  module.exports = FormPerformanceOptimizer;
}

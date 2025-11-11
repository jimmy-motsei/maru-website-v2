/**
 * Cookie Banner Manager
 * Handles cookie consent and GDPR compliance
 */

class CookieBannerManager {
  constructor() {
    this.banner = null;
    this.acceptAllBtn = null;
    this.settingsBtn = null;
    this.declineBtn = null;
    this.cookieConsent = null;
    this.init();
  }

  init() {
    // Wait for DOM to be ready
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", () => this.setup());
    } else {
      this.setup();
    }
  }

  setup() {
    this.banner = document.getElementById("cookie-banner");
    this.acceptAllBtn = document.getElementById("cookie-accept-all");
    this.settingsBtn = document.getElementById("cookie-settings");
    this.declineBtn = document.getElementById("cookie-decline");

    if (!this.banner) {
      console.warn("Cookie banner not found");
      return;
    }

    this.cookieConsent = this.getCookieConsent();
    this.setupEventListeners();
    this.showBannerIfNeeded();
  }

  setupEventListeners() {
    if (this.acceptAllBtn) {
      this.acceptAllBtn.addEventListener("click", () => this.acceptAll());
    }

    if (this.settingsBtn) {
      this.settingsBtn.addEventListener("click", () => this.showSettings());
    }

    if (this.declineBtn) {
      this.declineBtn.addEventListener("click", () => this.decline());
    }
  }

  getCookieConsent() {
    const consent = localStorage.getItem("maru-cookie-consent");
    if (consent) {
      try {
        return JSON.parse(consent);
      } catch (e) {
        console.warn("Invalid cookie consent data");
        return null;
      }
    }
    return null;
  }

  setCookieConsent(consent) {
    localStorage.setItem("maru-cookie-consent", JSON.stringify(consent));
    this.cookieConsent = consent;
  }

  showBannerIfNeeded() {
    // Don't show banner if user has already made a choice
    if (this.cookieConsent) {
      this.hideBanner();
      this.applyConsent(this.cookieConsent);
      return;
    }

    // Show banner after a short delay for better UX
    setTimeout(() => {
      this.showBanner();
    }, 1000);
  }

  showBanner() {
    if (this.banner) {
      this.banner.style.display = "block";
      // Trigger animation
      setTimeout(() => {
        this.banner.classList.add("show");
      }, 100);
    }
  }

  hideBanner() {
    if (this.banner) {
      this.banner.classList.remove("show");
      setTimeout(() => {
        this.banner.style.display = "none";
      }, 400);
    }
  }

  acceptAll() {
    const consent = {
      necessary: true,
      analytics: true,
      marketing: true,
      preferences: true,
      timestamp: Date.now(),
      version: "1.0",
    };

    this.setCookieConsent(consent);
    this.hideBanner();
    this.applyConsent(consent);
    this.trackConsent("accept_all");
  }

  decline() {
    const consent = {
      necessary: true,
      analytics: false,
      marketing: false,
      preferences: false,
      timestamp: Date.now(),
      version: "1.0",
    };

    this.setCookieConsent(consent);
    this.hideBanner();
    this.applyConsent(consent);
    this.trackConsent("decline");
  }

  showSettings() {
    // For now, just accept all - in a full implementation, you'd show a modal
    // with granular cookie settings
    this.acceptAll();
    console.log("Cookie settings modal would open here");
  }

  applyConsent(consent) {
    // Apply consent to different services
    this.applyAnalyticsConsent(consent.analytics);
    this.applyMarketingConsent(consent.marketing);
    this.applyPreferencesConsent(consent.preferences);
    const event = new CustomEvent("maruConsentChanged", { detail: consent });
    document.dispatchEvent(event);
  }

  applyAnalyticsConsent(accepted) {
    if (accepted) {
      // Enable Google Analytics
      this.enableGoogleAnalytics();
      // Enable other analytics tools
      this.enableAnalytics();
    } else {
      // Disable analytics
      this.disableAnalytics();
    }
  }

  applyMarketingConsent(accepted) {
    if (accepted) {
      // Enable marketing cookies
      this.enableMarketing();
    } else {
      // Disable marketing cookies
      this.disableMarketing();
    }
  }

  applyPreferencesConsent(accepted) {
    if (accepted) {
      // Enable preference cookies
      this.enablePreferences();
    } else {
      // Disable preference cookies
      this.disablePreferences();
    }
  }

  enableGoogleAnalytics() {
    // Load Google Analytics if not already loaded
    if (typeof window.loadGoogleAnalytics === "function") {
      window.loadGoogleAnalytics();
    } else if (typeof gtag !== "undefined") {
      gtag("consent", "update", {
        analytics_storage: "granted",
      });
    }
  }

  enableAnalytics() {
    // Enable other analytics tools
    console.log("Analytics enabled");
  }

  disableAnalytics() {
    // Disable analytics
    if (typeof gtag !== "undefined") {
      gtag("consent", "update", {
        analytics_storage: "denied",
      });
    }
    if (typeof window.disableAnalyticsScripts === "function") {
      window.disableAnalyticsScripts();
    }
    console.log("Analytics disabled");
  }

  enableMarketing() {
    // Load HubSpot if not already loaded
    if (typeof window.loadHubSpot === "function") {
      window.loadHubSpot();
    }
    console.log("Marketing enabled");
  }

  disableMarketing() {
    // Disable marketing tools
    console.log("Marketing disabled");
  }

  enablePreferences() {
    // Enable preference storage
    console.log("Preferences enabled");
  }

  disablePreferences() {
    // Disable preference storage
    console.log("Preferences disabled");
  }

  trackConsent(action) {
    // Track consent action (only if analytics is enabled)
    if (this.cookieConsent && this.cookieConsent.analytics) {
      if (typeof gtag !== "undefined") {
        gtag("event", "cookie_consent", {
          event_category: "privacy",
          event_label: action,
          value: 1,
        });
      }
    }
  }

  // Public method to check if specific consent is given
  hasConsent(type) {
    if (!this.cookieConsent) return false;
    return this.cookieConsent[type] === true;
  }

  // Public method to reset consent (for testing)
  resetConsent() {
    localStorage.removeItem("maru-cookie-consent");
    this.cookieConsent = null;
    this.showBannerIfNeeded();
  }

  // Public method to get current consent status
  getConsentStatus() {
    return this.cookieConsent;
  }
}

// Initialize cookie banner manager
window.cookieBannerManager = new CookieBannerManager();

// Export for debugging
if (typeof module !== "undefined" && module.exports) {
  module.exports = CookieBannerManager;
}

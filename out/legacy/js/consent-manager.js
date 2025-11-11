(function () {
  "use strict";

  var GA_ID = "G-RKBNFTLK64";
  var HUBSPOT_SRC = "//js-eu1.hs-scripts.com/146669350.js";
  var dataLayer = (window.dataLayer = window.dataLayer || []);

  function gtag() {
    dataLayer.push(arguments);
  }
  window.gtag = window.gtag || gtag;

  // Default consent aligned with POPIA/GDPR requirements
  gtag("consent", "default", {
    analytics_storage: "denied",
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
  });

  window.loadGoogleAnalytics = window.loadGoogleAnalytics || function () {
    if (window.__gaLoaded) {
      gtag("consent", "update", { analytics_storage: "granted" });
      return;
    }
    var script = document.createElement("script");
    script.async = true;
    script.src = "https://www.googletagmanager.com/gtag/js?id=" + GA_ID;
    script.onload = function () {
      gtag("js", new Date());
      gtag("config", GA_ID, { anonymize_ip: true });
      gtag("consent", "update", { analytics_storage: "granted" });
    };
    document.head.appendChild(script);
    window.__gaLoaded = true;
  };

  window.loadHubSpot = window.loadHubSpot || function () {
    if (document.getElementById("hs-script-loader")) {
      return;
    }
    var script = document.createElement("script");
    script.type = "text/javascript";
    script.id = "hs-script-loader";
    script.async = true;
    script.defer = true;
    script.src = HUBSPOT_SRC;
    document.head.appendChild(script);
  };

  window.disableAnalyticsScripts = window.disableAnalyticsScripts || function () {
    if (window.__gaLoaded && typeof gtag === "function") {
      gtag("consent", "update", { analytics_storage: "denied" });
    }
    var hubspot = document.getElementById("hs-script-loader");
    if (hubspot && hubspot.parentNode) {
      hubspot.parentNode.removeChild(hubspot);
    }
  };
})();

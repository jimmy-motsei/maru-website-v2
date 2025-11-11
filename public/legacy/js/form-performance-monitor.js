/**
 * Form Performance Monitor
 * Tracks form loading performance and provides optimization insights
 */

class FormPerformanceMonitor {
  constructor() {
    this.metrics = {
      formLoadTimes: new Map(),
      scriptLoadTimes: new Map(),
      totalForms: 0,
      loadedForms: 0,
      errors: [],
    };
    this.startTime = performance.now();
    this.init();
  }

  init() {
    this.setupPerformanceObserver();
    this.trackFormLoadTimes();
    this.trackScriptLoadTimes();
    this.setupErrorTracking();
  }

  /**
   * Setup Performance Observer for form loading metrics
   */
  setupPerformanceObserver() {
    if (!("PerformanceObserver" in window)) {
      console.warn(
        "PerformanceObserver not supported, using fallback tracking"
      );
      return;
    }

    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.entryType === "measure") {
          this.recordMetric(entry.name, entry.duration);
        }
      }
    });

    observer.observe({ entryTypes: ["measure"] });
  }

  /**
   * Track form loading times
   */
  trackFormLoadTimes() {
    const forms = document.querySelectorAll(
      "form, .mil-subscribe-form, #hubspot-container, .calendly-inline-widget"
    );
    this.metrics.totalForms = forms.length;

    forms.forEach((form, index) => {
      const formId = form.id || `form-${index}`;
      const startTime = performance.now();

      // Mark form load start
      performance.mark(`form-${formId}-start`);

      // Track when form becomes visible
      if ("IntersectionObserver" in window) {
        const observer = new IntersectionObserver((entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              performance.mark(`form-${formId}-visible`);
              performance.measure(
                `form-${formId}-load-time`,
                `form-${formId}-start`,
                `form-${formId}-visible`
              );

              const loadTime = performance.getEntriesByName(
                `form-${formId}-load-time`
              )[0]?.duration;
              if (loadTime) {
                this.metrics.formLoadTimes.set(formId, loadTime);
                this.metrics.loadedForms++;
              }

              observer.unobserve(entry.target);
            }
          });
        });

        observer.observe(form);
      }
    });
  }

  /**
   * Track script loading times
   */
  trackScriptLoadTimes() {
    const scripts = document.querySelectorAll("script[src]");

    scripts.forEach((script) => {
      const scriptSrc = script.src;
      const startTime = performance.now();

      script.addEventListener("load", () => {
        const loadTime = performance.now() - startTime;
        this.metrics.scriptLoadTimes.set(scriptSrc, loadTime);
      });

      script.addEventListener("error", () => {
        this.metrics.errors.push({
          type: "script_load_error",
          src: scriptSrc,
          timestamp: Date.now(),
        });
      });
    });
  }

  /**
   * Setup error tracking for forms
   */
  setupErrorTracking() {
    window.addEventListener("error", (event) => {
      if (event.target.tagName === "SCRIPT" || event.message.includes("form")) {
        this.metrics.errors.push({
          type: "javascript_error",
          message: event.message,
          filename: event.filename,
          lineno: event.lineno,
          timestamp: Date.now(),
        });
      }
    });

    window.addEventListener("unhandledrejection", (event) => {
      if (event.reason && event.reason.toString().includes("form")) {
        this.metrics.errors.push({
          type: "unhandled_promise_rejection",
          reason: event.reason.toString(),
          timestamp: Date.now(),
        });
      }
    });
  }

  /**
   * Record a performance metric
   */
  recordMetric(name, duration) {
    if (name.includes("form")) {
      this.metrics.formLoadTimes.set(name, duration);
    } else if (name.includes("script")) {
      this.metrics.scriptLoadTimes.set(name, duration);
    }
  }

  /**
   * Get performance report
   */
  getPerformanceReport() {
    const totalTime = performance.now() - this.startTime;
    const avgFormLoadTime = this.calculateAverageFormLoadTime();
    const avgScriptLoadTime = this.calculateAverageScriptLoadTime();

    return {
      totalPageLoadTime: totalTime,
      totalForms: this.metrics.totalForms,
      loadedForms: this.metrics.loadedForms,
      formLoadSuccessRate:
        (this.metrics.loadedForms / this.metrics.totalForms) * 100,
      averageFormLoadTime: avgFormLoadTime,
      averageScriptLoadTime: avgScriptLoadTime,
      slowestForm: this.getSlowestForm(),
      slowestScript: this.getSlowestScript(),
      errors: this.metrics.errors,
      recommendations: this.getOptimizationRecommendations(),
    };
  }

  /**
   * Calculate average form load time
   */
  calculateAverageFormLoadTime() {
    if (this.metrics.formLoadTimes.size === 0) return 0;

    const times = Array.from(this.metrics.formLoadTimes.values());
    return times.reduce((sum, time) => sum + time, 0) / times.length;
  }

  /**
   * Calculate average script load time
   */
  calculateAverageScriptLoadTime() {
    if (this.metrics.scriptLoadTimes.size === 0) return 0;

    const times = Array.from(this.metrics.scriptLoadTimes.values());
    return times.reduce((sum, time) => sum + time, 0) / times.length;
  }

  /**
   * Get slowest loading form
   */
  getSlowestForm() {
    if (this.metrics.formLoadTimes.size === 0) return null;

    let slowest = null;
    let maxTime = 0;

    for (const [formId, time] of this.metrics.formLoadTimes) {
      if (time > maxTime) {
        maxTime = time;
        slowest = { formId, time };
      }
    }

    return slowest;
  }

  /**
   * Get slowest loading script
   */
  getSlowestScript() {
    if (this.metrics.scriptLoadTimes.size === 0) return null;

    let slowest = null;
    let maxTime = 0;

    for (const [scriptSrc, time] of this.metrics.scriptLoadTimes) {
      if (time > maxTime) {
        maxTime = time;
        slowest = { scriptSrc, time };
      }
    }

    return slowest;
  }

  /**
   * Get optimization recommendations
   */
  getOptimizationRecommendations() {
    const recommendations = [];
    const avgFormTime = this.calculateAverageFormLoadTime();
    const avgScriptTime = this.calculateAverageScriptLoadTime();

    if (avgFormTime > 1000) {
      recommendations.push({
        type: "form_loading",
        message:
          "Forms are loading slowly. Consider implementing lazy loading.",
        priority: "high",
      });
    }

    if (avgScriptTime > 500) {
      recommendations.push({
        type: "script_loading",
        message:
          "Scripts are loading slowly. Consider using async/defer attributes.",
        priority: "medium",
      });
    }

    if (this.metrics.errors.length > 0) {
      recommendations.push({
        type: "error_handling",
        message: `${this.metrics.errors.length} errors detected. Review error handling.`,
        priority: "high",
      });
    }

    if (this.metrics.loadedForms < this.metrics.totalForms) {
      recommendations.push({
        type: "form_completion",
        message:
          "Not all forms loaded successfully. Check form initialization.",
        priority: "high",
      });
    }

    return recommendations;
  }

  /**
   * Log performance report to console
   */
  logPerformanceReport() {
    const report = this.getPerformanceReport();
    console.group("🚀 Form Performance Report");
    console.log("📊 Overall Metrics:", {
      "Total Load Time": `${report.totalPageLoadTime.toFixed(2)}ms`,
      "Forms Loaded": `${report.loadedForms}/${report.totalForms}`,
      "Success Rate": `${report.formLoadSuccessRate.toFixed(1)}%`,
    });

    console.log("⚡ Performance Metrics:", {
      "Avg Form Load Time": `${report.averageFormLoadTime.toFixed(2)}ms`,
      "Avg Script Load Time": `${report.averageScriptLoadTime.toFixed(2)}ms`,
      "Slowest Form": report.slowestForm
        ? `${report.slowestForm.formId}: ${report.slowestForm.time.toFixed(
            2
          )}ms`
        : "N/A",
      "Slowest Script": report.slowestScript
        ? `${report.slowestScript.scriptSrc
            .split("/")
            .pop()}: ${report.slowestScript.time.toFixed(2)}ms`
        : "N/A",
    });

    if (report.errors.length > 0) {
      console.warn("⚠️ Errors:", report.errors);
    }

    if (report.recommendations.length > 0) {
      console.log("💡 Recommendations:", report.recommendations);
    }

    console.groupEnd();
  }
}

// Initialize performance monitor
document.addEventListener("DOMContentLoaded", () => {
  window.formPerformanceMonitor = new FormPerformanceMonitor();

  // Log report after 3 seconds
  setTimeout(() => {
    window.formPerformanceMonitor.logPerformanceReport();
  }, 3000);
});

// Export for debugging
if (typeof module !== "undefined" && module.exports) {
  module.exports = FormPerformanceMonitor;
}

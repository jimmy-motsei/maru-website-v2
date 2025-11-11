(function () {
  if (typeof window === "undefined") {
    return;
  }

  var gsapInstance = window.gsap;
  var scrollToPlugin = window.ScrollToPlugin;

  if (!gsapInstance || !scrollToPlugin) {
    if (window && window.console) {
      console.warn("GSAP ScrollToPlugin not available; smooth anchor scrolling skipped.");
    }
    return;
  }

  gsapInstance.registerPlugin(scrollToPlugin);

  var CANCEL_EVENTS = ["wheel", "touchstart", "keydown", "mousedown"];
  var cancelBound = false;
  var clickBound = false;
  var lastHash = null;

  function getOffset() {
    var offsetElement = document.querySelector("[data-anchor-offset]");
    if (offsetElement) {
      return offsetElement.offsetHeight || 0;
    }
    return 0;
  }

  function isReducedMotion() {
    if (typeof window.matchMedia !== "function") {
      return false;
    }
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }

  function computeScrollPosition(target) {
    var offset = getOffset();
    var rect = target.getBoundingClientRect();
    return rect.top + window.pageYOffset - offset;
  }

  function focusTarget(target) {
    if (!target || typeof target.focus !== "function") {
      return;
    }

    var hadTabIndex = target.hasAttribute("tabindex");
    if (!hadTabIndex) {
      target.setAttribute("tabindex", "-1");
    }

    try {
      target.focus({ preventScroll: true });
    } catch (error) {
      target.focus();
    }

    if (!hadTabIndex) {
      target.addEventListener(
        "blur",
        function handleBlur() {
          target.removeAttribute("tabindex");
          target.removeEventListener("blur", handleBlur);
        }
      );
    }
  }

  function killTweens() {
    gsapInstance.killTweensOf(window);
  }

  function bindCancellation() {
    if (cancelBound) {
      return;
    }
    CANCEL_EVENTS.forEach(function (evt) {
      window.addEventListener(evt, killTweens, { passive: true });
    });
    cancelBound = true;
  }

  function samePage(link) {
    if (!link) {
      return false;
    }
    var linkPath = link.pathname ? link.pathname.replace(/^\//, "") : "";
    var currentPath = window.location.pathname
      ? window.location.pathname.replace(/^\//, "")
      : "";
    return linkPath === currentPath && link.host === window.location.host;
  }

  function animateToTarget(target, hash, options) {
    if (!target) {
      return;
    }

    var settings = Object.assign(
      {
        skipHistory: false,
        focus: true,
      },
      options || {}
    );

    gsapInstance.killTweensOf(window);

    gsapInstance.to(window, {
      duration: 0.75,
      ease: "power2.out",
      scrollTo: {
        y: target,
        offsetY: getOffset(),
        autoKill: true,
      },
      overwrite: "auto",
      onComplete: function () {
        if (settings.focus) {
          focusTarget(target);
        }
        if (!settings.skipHistory && hash) {
          if (hash !== window.location.hash) {
            history.pushState(null, "", hash);
          }
        }
      },
    });
  }

  function instantToTarget(target, hash, options) {
    if (!target) {
      return;
    }

    var settings = Object.assign(
      {
        skipHistory: false,
        focus: true,
      },
      options || {}
    );

    var y = computeScrollPosition(target);
    window.scrollTo(0, y);

    if (settings.focus) {
      focusTarget(target);
    }

    if (!settings.skipHistory && hash && hash !== window.location.hash) {
      history.pushState(null, "", hash);
    }
  }

  function handleClick(event) {
    var link = event.target.closest('a[href^="#"]');
    if (!link) {
      return;
    }

    if (!samePage(link)) {
      return;
    }

    var hash = link.hash || link.getAttribute("href");
    if (!hash) {
      return;
    }

    var id = hash.replace(/^#/, "");
    if (!id) {
      return;
    }

    var target = document.getElementById(id);
    if (!target) {
      return;
    }

    event.preventDefault();
    lastHash = hash;
    if (isReducedMotion()) {
      instantToTarget(target, hash, { skipHistory: false, focus: true });
    } else {
      animateToTarget(target, hash, { skipHistory: false, focus: true });
    }
  }

  function scrollToHash(options) {
    var hash = window.location.hash;
    if (!hash) {
      return;
    }

    if (hash === lastHash && !(options && options.force)) {
      return;
    }

    var id = hash.replace(/^#/, "");
    if (!id) {
      return;
    }

    var target = document.getElementById(id);
    if (!target) {
      return;
    }

    lastHash = hash;
    var settings = Object.assign({ force: false }, options || {});

    if (isReducedMotion()) {
      instantToTarget(target, hash, {
        skipHistory: true,
        focus: true,
      });
    } else {
      animateToTarget(target, hash, {
        skipHistory: true,
        focus: true,
      });
    }
  }

  function init() {
    bindCancellation();

    if (!clickBound) {
      document.addEventListener("click", handleClick, false);
      clickBound = true;
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () {
      init();
      window.requestAnimationFrame(function () {
        scrollToHash({ force: true });
      });
    });
  } else {
    init();
    window.requestAnimationFrame(function () {
      scrollToHash({ force: true });
    });
  }

  document.addEventListener("swup:contentReplaced", function () {
    window.requestAnimationFrame(function () {
      scrollToHash({ force: true });
    });
  });
})();

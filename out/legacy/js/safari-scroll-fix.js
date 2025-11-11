/**
 * Minimal Safari scroll adjustments aligned with Ashley baseline.
 */
(function () {
  "use strict";

  function isSafari() {
    return /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
  }

  if (!isSafari()) {
    return;
  }

  var propsToClear = [
    "height",
    "min-height",
    "overflow",
    "overflow-x",
    "overflow-y",
    "position",
    "display",
    "transform",
    "will-change",
    "-webkit-overflow-scrolling",
  ];

  function clearOverrides() {
    var mainTargets = [
      document.documentElement,
      document.body,
      document.querySelector(".mil-wrapper"),
      document.querySelector(".mil-content"),
      document.querySelector(".mil-main-transition"),
      document.querySelector(".mil-banner"),
    ];

    mainTargets.forEach(function (target) {
      if (!target) {
        return;
      }
      propsToClear.forEach(function (prop) {
        target.style.removeProperty(prop);
      });
    });

    document.querySelectorAll("section").forEach(function (section) {
      ["height", "min-height", "overflow", "overflow-y", "position", "display"].forEach(
        function (prop) {
          section.style.removeProperty(prop);
        }
      );
    });
  }

  function applySafariFixes() {
    clearOverrides();
    document.documentElement.style.webkitOverflowScrolling = "touch";
    document.body.style.webkitOverflowScrolling = "touch";
  }

  function init() {
    applySafariFixes();
  }

  if (document.readyState === "loading") {
    document.addEventListener(
      "DOMContentLoaded",
      function handleDomReady() {
        init();
        document.removeEventListener("DOMContentLoaded", handleDomReady);
      }
    );
  } else {
    init();
  }

  window.addEventListener("pageshow", applySafariFixes);
  document.addEventListener("swup:contentReplaced", applySafariFixes);
})();

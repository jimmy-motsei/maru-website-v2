(function () {
  "use strict";

  var host = window.location.hostname;
  if (!host || host === "localhost" || host === "127.0.0.1") {
    return;
  }

  var script = document.createElement("script");
  script.async = true;
  script.src = "https://assets.calendly.com/assets/external/widget.js";
  document.head.appendChild(script);
})();

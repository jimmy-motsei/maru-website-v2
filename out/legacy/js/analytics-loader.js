(function () {
  "use strict";

  var host = window.location.hostname;
  if (!host || host === "localhost" || host === "127.0.0.1") {
    return;
  }

  var script = document.createElement("script");
  script.defer = true;
  script.src = "https://static.cloudflareinsights.com/beacon.min.js";
  script.setAttribute(
    "data-cf-beacon",
    '{"token": "ee8074bea9274223aef11729f33c7e15"}'
  );
  document.head.appendChild(script);
})();

/* lzclink.com — site script: theme toggle, copy email, abstract expanders. */
(function () {
  "use strict";

  /* ---------- theme ---------- */
  function applyTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    var btn = document.querySelector(".theme-toggle");
    if (btn) btn.textContent = theme === "dark" ? "light" : "dark";
    try {
      localStorage.setItem("theme", theme);
    } catch (e) {}
  }

  function initTheme() {
    var current = document.documentElement.getAttribute("data-theme") || "light";
    var btn = document.querySelector(".theme-toggle");
    if (!btn) return;
    btn.textContent = current === "dark" ? "light" : "dark";
    btn.addEventListener("click", function () {
      var now = document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark";
      applyTheme(now);
    });
  }

  /* ---------- copy email ---------- */
  function initCopyEmail() {
    var btn = document.querySelector(".copy-email");
    if (!btn) return;
    var label = btn.textContent;
    btn.addEventListener("click", function () {
      var email = (btn.dataset.email || "").replace(" (at) ", "@");
      navigator.clipboard.writeText(email).then(function () {
        btn.textContent = "copied: " + email;
        setTimeout(function () {
          btn.textContent = label;
        }, 1600);
      });
    });
  }

  /* ---------- abstracts: "show more" only when actually clamped ---------- */
  function initAbstracts() {
    document.querySelectorAll(".pub-abstract").forEach(function (box) {
      var p = box.querySelector("p");
      if (!p || p.scrollHeight <= p.clientHeight + 2) return;
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "pub-more";
      btn.textContent = "show more";
      btn.addEventListener("click", function () {
        var open = box.classList.toggle("open");
        btn.textContent = open ? "show less" : "show more";
      });
      box.appendChild(btn);
    });
  }

  function init() {
    initTheme();
    initCopyEmail();
    initAbstracts();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();

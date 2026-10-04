/* lzclink.com — site script: theme toggle, copy email, abstract expanders, hover loops. */
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

  /* ---------- hover-to-play loops on [data-loop] thumbnails ----------
     The video is created on first hover (nothing downloads until then) and
     only fades in once frames are actually playing, so there is no black flash. */
  function initHoverLoops() {
    var canHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!canHover || reduced) return;
    document.querySelectorAll("[data-loop]").forEach(function (el) {
      var src = el.getAttribute("data-loop");
      if (!src) return;
      var video = null;
      el.addEventListener("mouseenter", function () {
        if (!video) {
          video = document.createElement("video");
          video.className = "hover-loop";
          video.muted = true;
          video.loop = true;
          video.playsInline = true;
          video.setAttribute("playsinline", "");
          video.setAttribute("aria-hidden", "true");
          video.preload = "auto";
          video.src = src;
          video.addEventListener("playing", function () {
            video.classList.add("ready");
          });
          /* Chrome can abort a play() issued before any data has buffered
             (power-saving for video-only media); retry once data is ready */
          video.addEventListener("canplay", function () {
            if (el.classList.contains("is-looping") && video.paused) start();
          });
          el.appendChild(video);
        }
        el.classList.add("is-looping");
        start();
      });
      function start() {
        var p = video.play();
        if (p && p.catch) p.catch(function () {});
      }
      el.addEventListener("mouseleave", function () {
        el.classList.remove("is-looping");
        if (video) video.pause();
      });
    });
  }

  function init() {
    initTheme();
    initCopyEmail();
    initAbstracts();
    initHoverLoops();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();

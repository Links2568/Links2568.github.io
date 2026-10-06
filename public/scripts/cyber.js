/* lzclink.com — theme toggle, copy buttons, hover-to-play loops, research-interest filter. */
(function () {
  "use strict";

  /* ---------- theme ---------- */
  function label(theme) {
    return theme === "dark" ? "Light" : "Dark";
  }

  function initTheme() {
    var btn = document.querySelector(".theme-toggle");
    if (!btn) return;
    btn.textContent = label(document.documentElement.getAttribute("data-theme"));
    btn.addEventListener("click", function () {
      var next = document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark";
      document.documentElement.setAttribute("data-theme", next);
      btn.textContent = label(next);
      try {
        localStorage.setItem("theme", next);
      } catch (e) {}
    });
  }

  /* ---------- copy buttons ---------- */
  function flash(btn, text) {
    var original = btn.textContent;
    btn.textContent = text;
    setTimeout(function () {
      btn.textContent = original;
    }, 1600);
  }

  function initCopy() {
    var email = document.querySelector(".copy-email");
    if (email) {
      email.addEventListener("click", function () {
        var addr = (email.dataset.email || "").replace(" (at) ", "@");
        navigator.clipboard.writeText(addr).then(function () {
          flash(email, "Copied " + addr);
        });
      });
    }
    document.querySelectorAll(".copy-bib").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var code = btn.parentElement.querySelector("code");
        if (!code) return;
        navigator.clipboard.writeText(code.textContent).then(function () {
          flash(btn, "Copied");
        });
      });
    });
  }

  /* ---------- hover-to-play loops on [data-loop] media ----------
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
      function start() {
        var p = video.play();
        if (p && p.catch) p.catch(function () {});
      }
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
      el.addEventListener("mouseleave", function () {
        el.classList.remove("is-looping");
        if (video) video.pause();
      });
    });
  }

  /* ---------- research-interest filter ---------- */
  function initThemeFilter() {
    var chips = Array.prototype.slice.call(document.querySelectorAll(".theme-chip"));
    if (!chips.length) return;
    var items = document.querySelectorAll("[data-topics]");
    var empty = document.querySelector(".filter-empty");
    function apply() {
      var on = chips
        .filter(function (c) {
          return c.getAttribute("aria-pressed") === "true";
        })
        .map(function (c) {
          return c.dataset.topic;
        });
      var shown = 0;
      items.forEach(function (it) {
        var mine = (it.getAttribute("data-topics") || "").split(" ");
        var match =
          !on.length ||
          on.some(function (t) {
            return mine.indexOf(t) !== -1;
          });
        it.hidden = !match;
        if (match) shown++;
      });
      /* hide a group's heading (and the figure note) when the filter empties it */
      document.querySelectorAll(".figs, .minis").forEach(function (group) {
        var any = Array.prototype.some.call(group.children, function (c) {
          return !c.hidden;
        });
        var head = group.previousElementSibling;
        if (head && (head.classList.contains("sub-head") || head.classList.contains("note"))) head.hidden = !any;
      });
      if (empty) empty.hidden = shown > 0;
    }
    chips.forEach(function (c) {
      c.addEventListener("click", function () {
        c.setAttribute("aria-pressed", c.getAttribute("aria-pressed") === "true" ? "false" : "true");
        apply();
      });
    });
  }

  function init() {
    initTheme();
    initCopy();
    initHoverLoops();
    initThemeFilter();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();

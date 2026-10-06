/* Homepage: the research stage (a big screen driven by the list beside it),
   statement keywords that light up related rows, and the scroll-spy nav. */
(function () {
  "use strict";
  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var main = document.querySelector(".home-main");
  var screen = document.querySelector(".stage-screen");
  var slides = {};
  document.querySelectorAll(".stage-screen .slide[data-slide]").forEach(function (s) {
    slides[s.getAttribute("data-slide")] = s;
  });
  var stageRows = document.querySelectorAll(".stage-list .row[data-preview]");
  var current = null;
  document.querySelectorAll(".stage-screen .slide:not([hidden])").forEach(function (s) {
    current = s.getAttribute("data-slide");
  });
  var onScreen = true;

  function stageShown() {
    return screen && getComputedStyle(screen).display !== "none";
  }

  /* ---------- stage video ---------- */
  function videoFor(slide) {
    var media = slide.querySelector(".slide-media");
    var src = media && media.getAttribute("data-loop");
    if (!src) return null;
    var v = media.querySelector("video");
    if (v) return v;
    v = document.createElement("video");
    v.className = "hover-loop";
    v.muted = true;
    v.loop = true;
    v.playsInline = true;
    v.setAttribute("playsinline", "");
    v.setAttribute("aria-hidden", "true");
    v.preload = "auto";
    v.src = src;
    v.addEventListener("playing", function () {
      v.classList.add("ready");
    });
    /* Chrome may abort a play() issued before data has buffered; retry once ready */
    v.addEventListener("canplay", function () {
      if (current === slide.getAttribute("data-slide") && v.paused && v.dataset.want === "1") play(v);
    });
    media.appendChild(v);
    media.classList.add("is-looping");
    return v;
  }

  function play(v) {
    v.dataset.want = "1";
    var p = v.play();
    if (p && p.catch) p.catch(function () {});
  }

  function stop(slide) {
    var v = slide && slide.querySelector("video");
    if (v) {
      v.dataset.want = "0";
      v.pause();
    }
  }

  function playCurrent() {
    if (reduced || !onScreen || document.hidden || !stageShown() || !current) return;
    var v = videoFor(slides[current]);
    if (v) play(v);
  }

  function select(id) {
    var next = slides[id];
    if (!next) return;
    if (current !== id) {
      if (current) {
        stop(slides[current]);
        slides[current].hidden = true;
      }
      next.hidden = false;
      current = id;
      stageRows.forEach(function (r) {
        r.classList.toggle("is-current", r.getAttribute("data-preview") === id);
      });
    }
    playCurrent();
  }

  /* hover intent: a short pause before switching, so sweeping across the
     list on the way to the stage's buttons doesn't change the project */
  var intent = null;
  stageRows.forEach(function (row) {
    var id = row.getAttribute("data-preview");
    row.addEventListener("mouseenter", function () {
      clearTimeout(intent);
      intent = setTimeout(function () {
        select(id);
      }, 90);
    });
    row.addEventListener("mouseleave", function () {
      clearTimeout(intent);
    });
    row.addEventListener("focus", function () {
      select(id);
    });
  });

  if (screen && "IntersectionObserver" in window) {
    new IntersectionObserver(function (entries) {
      onScreen = entries[0].isIntersecting;
      if (onScreen) playCurrent();
      else if (current) stop(slides[current]);
    }).observe(screen);
  }
  document.addEventListener("visibilitychange", function () {
    if (document.hidden) {
      if (current) stop(slides[current]);
    } else playCurrent();
  });
  playCurrent();

  /* ---------- statement keywords light up related rows ---------- */
  document.querySelectorAll(".kw[data-match]").forEach(function (kw) {
    var ids = kw.getAttribute("data-match").split(" ");
    function on() {
      if (!main) return;
      main.classList.add("kw-active");
      document.querySelectorAll(".row[data-preview]").forEach(function (row) {
        row.classList.toggle("match", ids.indexOf(row.getAttribute("data-preview")) !== -1);
      });
      for (var i = 0; i < ids.length; i++) {
        if (slides[ids[i]]) {
          select(ids[i]);
          break;
        }
      }
    }
    function off() {
      if (!main) return;
      main.classList.remove("kw-active");
      document.querySelectorAll(".row.match").forEach(function (row) {
        row.classList.remove("match");
      });
    }
    kw.addEventListener("mouseenter", on);
    kw.addEventListener("focus", on);
    kw.addEventListener("mouseleave", off);
    kw.addEventListener("blur", off);
  });

  /* ---------- side nav follows the scroll ---------- */
  var links = {};
  document.querySelectorAll(".side-nav a[data-spy]").forEach(function (a) {
    links[a.getAttribute("data-spy")] = a;
  });
  function setActive(id) {
    Object.keys(links).forEach(function (k) {
      if (k === id) links[k].setAttribute("aria-current", "location");
      else links[k].removeAttribute("aria-current");
    });
  }
  if ("IntersectionObserver" in window) {
    var spy = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { rootMargin: "-25% 0px -65% 0px" }
    );
    Object.keys(links).forEach(function (id) {
      var el = document.getElementById(id);
      if (el) spy.observe(el);
    });
  }
})();

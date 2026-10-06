/* Homepage: index rows drive the preview panel, bio keywords highlight
   related rows, and the side nav follows the scroll position. */
(function () {
  "use strict";
  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var lists = document.querySelector(".index-lists");
  var slides = {};
  document.querySelectorAll(".slide[data-slide]").forEach(function (s) {
    slides[s.getAttribute("data-slide")] = s;
  });
  var current = null;
  document.querySelectorAll(".slide:not([hidden])").forEach(function (s) {
    current = s.getAttribute("data-slide");
  });

  /* ---------- preview panel ---------- */
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
      if (current === slide.getAttribute("data-slide") && v.paused && v.dataset.want === "1") start(v);
    });
    media.appendChild(v);
    media.classList.add("is-looping");
    return v;
  }

  function start(v) {
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

  function show(id) {
    var next = slides[id];
    if (!next) return;
    if (current && current !== id) {
      stop(slides[current]);
      slides[current].hidden = true;
    }
    next.hidden = false;
    current = id;
    if (!reduced) {
      var v = videoFor(next);
      if (v) start(v);
    }
  }

  function pauseCurrent() {
    if (current) stop(slides[current]);
  }

  document.querySelectorAll(".row[data-preview]").forEach(function (row) {
    var id = row.getAttribute("data-preview");
    row.addEventListener("mouseenter", function () {
      show(id);
    });
    row.addEventListener("focus", function () {
      show(id);
    });
  });
  if (lists) lists.addEventListener("mouseleave", pauseCurrent);

  /* ---------- bio keywords light up related rows ---------- */
  document.querySelectorAll(".kw[data-match]").forEach(function (kw) {
    var ids = kw.getAttribute("data-match").split(" ");
    function on() {
      if (!lists) return;
      lists.classList.add("kw-active");
      document.querySelectorAll(".row[data-preview]").forEach(function (row) {
        row.classList.toggle("match", ids.indexOf(row.getAttribute("data-preview")) !== -1);
      });
      show(ids[0]);
    }
    function off() {
      if (!lists) return;
      lists.classList.remove("kw-active");
      document.querySelectorAll(".row.match").forEach(function (row) {
        row.classList.remove("match");
      });
      pauseCurrent();
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

/* Homepage: the research Cover Flow and the scroll-spy nav. */
(function () {
  "use strict";
  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var canHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  /* ---------- Cover Flow ---------- */
  var flow = document.querySelector(".coverflow");
  if (flow) {
    var cards = Array.prototype.slice.call(flow.querySelectorAll(".cf-card"));
    var captions = Array.prototype.slice.call(flow.querySelectorAll(".cf-caption"));
    var tabs = Array.prototype.slice.call(flow.querySelectorAll(".cf-tab"));
    var n = cards.length;
    var cur = 0;

    /* circular distance from the front: 0 = front, ±1 = neighbours, the rest sit behind */
    function pos(i) {
      var d = (((i - cur) % n) + n) % n;
      if (d > n / 2) d -= n;
      return d;
    }

    function layout() {
      cards.forEach(function (c, i) {
        var d = pos(i);
        c.setAttribute("data-pos", String(d));
        c.tabIndex = d === 0 ? 0 : -1;
        if (d === 0) c.removeAttribute("aria-hidden");
        else c.setAttribute("aria-hidden", "true");
      });
      captions.forEach(function (cp, i) {
        cp.hidden = i !== cur;
      });
      tabs.forEach(function (t, i) {
        t.setAttribute("aria-selected", i === cur ? "true" : "false");
      });
    }

    function stopLoop(card) {
      var media = card.querySelector(".cf-media");
      var v = media && media.querySelector("video");
      media.classList.remove("is-looping");
      if (v) v.pause();
    }

    function playLoop(card) {
      if (reduced) return;
      var media = card.querySelector(".cf-media");
      var src = media && media.getAttribute("data-loop");
      if (!src) return;
      var v = media.querySelector("video");
      if (!v) {
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
          if (media.classList.contains("is-looping") && v.paused) start(v);
        });
        media.appendChild(v);
      }
      media.classList.add("is-looping");
      start(v);
    }

    function start(v) {
      var p = v.play();
      if (p && p.catch) p.catch(function () {});
    }

    function go(i) {
      if (cards[cur]) stopLoop(cards[cur]);
      cur = ((i % n) + n) % n;
      layout();
    }

    cards.forEach(function (card, i) {
      /* a side cover turns the ring; the front cover opens the project */
      card.addEventListener("click", function (e) {
        if (pos(i) !== 0 || flow.dataset.swiped === "1") {
          e.preventDefault();
          if (pos(i) !== 0) go(i);
        }
      });
      if (canHover) {
        card.addEventListener("mouseenter", function () {
          if (pos(i) === 0) playLoop(card);
        });
        card.addEventListener("mouseleave", function () {
          stopLoop(card);
        });
      }
    });

    flow.querySelector(".cf-prev").addEventListener("click", function () {
      go(cur - 1);
    });
    flow.querySelector(".cf-next").addEventListener("click", function () {
      go(cur + 1);
    });
    tabs.forEach(function (t, i) {
      t.addEventListener("click", function () {
        go(i);
      });
    });

    flow.addEventListener("keydown", function (e) {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        go(cur - 1);
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        go(cur + 1);
      }
    });

    /* swipe / drag */
    var stage = flow.querySelector(".cf-stage");
    var x0 = null;
    stage.addEventListener("pointerdown", function (e) {
      x0 = e.clientX;
      flow.dataset.swiped = "0";
    });
    stage.addEventListener("pointerup", function (e) {
      if (x0 === null) return;
      var dx = e.clientX - x0;
      x0 = null;
      if (Math.abs(dx) > 40) {
        flow.dataset.swiped = "1";
        go(cur + (dx < 0 ? 1 : -1));
        setTimeout(function () {
          flow.dataset.swiped = "0";
        }, 0);
      }
    });

    layout();
  }

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

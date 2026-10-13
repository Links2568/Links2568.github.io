/* Homepage: the research Cover Flow and the scroll-spy nav. */
(function () {
  "use strict";
  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var canHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  /* ---------- Cover Flow ----------
     The ring's position is a float `x` (project index; it grows without
     wrapping). Each cover's transform is a continuous function of its
     distance from `x`, so drags and trackpad swipes scrub the ring directly,
     and releases, clicks, keys and tabs settle it with a spring. */
  var flow = document.querySelector(".coverflow");
  if (flow) {
    var stage = flow.querySelector(".cf-stage");
    var cards = Array.prototype.slice.call(flow.querySelectorAll(".cf-card"));
    var captions = Array.prototype.slice.call(flow.querySelectorAll(".cf-caption"));
    var tabs = Array.prototype.slice.call(flow.querySelectorAll(".cf-tab"));
    var dots = Array.prototype.slice.call(flow.querySelectorAll(".cf-dot"));
    var pill = flow.querySelector(".cf-pill");
    var n = cards.length;

    var x = 0; /* rendered position */
    var target = 0; /* where the spring is heading (an integer) */
    var v = 0; /* velocity, projects per second */
    var cur = 0; /* front project, 0..n-1 */
    var raf = 0;
    var last = 0;
    var free = false; /* true while a finger / trackpad drives x directly */
    var tiltX = 0; /* hover tilt of the front cover, degrees (eased toward tX/tY) */
    var tiltY = 0;
    var tX = 0;
    var tY = 0;
    var K = 210; /* spring stiffness */
    var C = 2 * 0.86 * Math.sqrt(K); /* damping: just under critical, a hint of overshoot */
    var TILT_X = 5; /* max hover tilt, degrees */
    var TILT_Y = 8;

    var P = {}; /* geometry, read from CSS custom properties on .coverflow */
    var cw = 1; /* card width in px */
    function measure() {
      var cs = getComputedStyle(flow);
      ["x1", "xs", "rot", "z", "shade"].forEach(function (k) {
        P[k] = parseFloat(cs.getPropertyValue("--cf-" + k)) || 0;
      });
      cw = cards[0].offsetWidth || 1;
      placePill(false);
    }

    function mod(a) {
      return ((a % n) + n) % n;
    }

    /* signed circular distance of cover i from the front, in (-n/2, n/2] */
    function offset(i) {
      var o = mod(i - x);
      return o > n / 2 ? o - n : o;
    }

    function render() {
      cards.forEach(function (c, i) {
        var o = offset(i);
        var a = Math.abs(o);
        var s = o < 0 ? -1 : 1;
        var t = Math.min(a, 1);
        var beyond = Math.max(a - 1, 0);
        var tx = s * (P.x1 * t + P.xs * beyond); /* in card widths */
        var rot = -s * P.rot * Math.sin((t * Math.PI) / 2);
        var tz = -cw * P.z * (t + 0.6 * beyond);
        var op = 1 - Math.min(beyond / 0.55, 1);
        var w = 1 - t; /* hover tilt fades out as a cover leaves the front */
        c.style.transform =
          "translateX(" + (-50 + tx * 100).toFixed(3) + "%) translateZ(" + tz.toFixed(1) + "px) rotateY(" + rot.toFixed(2) + "deg)" +
          (w > 0 && (tiltX || tiltY) ? " rotateX(" + (tiltX * w).toFixed(2) + "deg) rotateY(" + (tiltY * w).toFixed(2) + "deg)" : "");
        c.style.opacity = op.toFixed(3);
        c.style.visibility = op < 0.002 ? "hidden" : "";
        c.style.zIndex = String(100 - Math.round(a * 10));
        c.style.setProperty("--shade", (t * P.shade).toFixed(3));
        c.setAttribute("data-side", o < 0 ? "left" : "right");
      });
      var front = mod(Math.round(x));
      if (front !== cur) {
        stopLoop(cards[cur]);
        cur = front;
        sync();
      }
    }

    /* everything that follows the front project: a11y, caption, tabs, dots */
    function sync() {
      cards.forEach(function (c, i) {
        var d = mod(i - cur);
        if (d > n / 2) d -= n;
        c.setAttribute("data-pos", String(d));
        c.tabIndex = d === 0 ? 0 : -1;
        if (d === 0) c.removeAttribute("aria-hidden");
        else c.setAttribute("aria-hidden", "true");
      });
      captions.forEach(function (cp, i) {
        var on = i === cur;
        cp.classList.toggle("is-current", on);
        cp.inert = !on;
        if (on) cp.removeAttribute("aria-hidden");
        else cp.setAttribute("aria-hidden", "true");
      });
      tabs.forEach(function (t, i) {
        t.setAttribute("aria-selected", i === cur ? "true" : "false");
      });
      dots.forEach(function (d, i) {
        d.classList.toggle("is-current", i === cur);
      });
      placePill(true);
    }

    function placePill(animate) {
      var t = tabs[cur];
      if (!pill || !t || !t.offsetWidth) return;
      if (!animate) pill.style.transition = "none";
      pill.style.width = t.offsetWidth + "px";
      pill.style.transform = "translateX(" + t.offsetLeft + "px)";
      if (!animate) {
        void pill.offsetWidth;
        pill.style.transition = "";
      }
    }

    function turning() {
      return free || x !== target || v !== 0;
    }

    function tick(now) {
      raf = 0;
      var dt = last ? Math.min((now - last) / 1000, 1 / 30) : 1 / 60;
      last = now;
      var more = false;
      var arrived = false;
      if (!free && (x !== target || v !== 0)) {
        v += (-K * (x - target) - C * v) * dt;
        x += v * dt;
        if (Math.abs(x - target) < 0.0004 && Math.abs(v) < 0.003) {
          x = target;
          v = 0;
          arrived = true;
        } else more = true;
      }
      var e = 1 - Math.exp(-dt * 9);
      tiltX += (tX - tiltX) * e;
      tiltY += (tY - tiltY) * e;
      if (Math.abs(tX - tiltX) + Math.abs(tY - tiltY) > 0.02) more = true;
      else {
        tiltX = tX;
        tiltY = tY;
      }
      render();
      if (arrived) settled();
      if (more) raf = requestAnimationFrame(tick);
    }

    function kick() {
      if (!raf && !document.hidden) {
        last = 0;
        raf = requestAnimationFrame(tick);
      }
    }

    function animate() {
      /* no frames arrive in a background tab, and reduced motion means no glide */
      if (reduced || document.hidden) {
        x = target;
        v = 0;
        render();
        settled();
        return;
      }
      kick();
    }

    /* the cover that just arrived under the pointer starts playing */
    function settled() {
      if (canHover && cards[cur].matches(":hover")) playLoop(cards[cur]);
    }

    function setTilt(rx, ry) {
      tX = rx;
      tY = ry;
      kick();
    }

    /* turn to project i along the shorter way round */
    function go(i) {
      setTilt(0, 0);
      var d = mod(i - mod(target));
      if (d > n / 2) d -= n;
      target += d;
      animate();
    }

    function step(dir) {
      setTilt(0, 0);
      target = Math.round(target) + dir;
      animate();
    }

    function stopLoop(card) {
      var media = card && card.querySelector(".cf-media");
      if (!media) return;
      var vid = media.querySelector("video");
      media.classList.remove("is-looping");
      if (vid) vid.pause();
    }

    function playLoop(card) {
      if (reduced || free) return;
      var media = card.querySelector(".cf-media");
      var src = media && media.getAttribute("data-loop");
      if (!src) return;
      var vid = media.querySelector("video");
      if (!vid) {
        vid = document.createElement("video");
        vid.className = "hover-loop";
        vid.muted = true;
        vid.loop = true;
        vid.playsInline = true;
        vid.setAttribute("playsinline", "");
        vid.setAttribute("aria-hidden", "true");
        vid.preload = "auto";
        vid.src = src;
        vid.addEventListener("playing", function () {
          vid.classList.add("ready");
        });
        /* Chrome may abort a play() issued before data has buffered; retry once ready */
        vid.addEventListener("canplay", function () {
          if (media.classList.contains("is-looping") && vid.paused) start(vid);
        });
        media.insertBefore(vid, media.querySelector(".cf-shade"));
      }
      media.classList.add("is-looping");
      start(vid);
    }

    function start(vid) {
      var p = vid.play();
      if (p && p.catch) p.catch(function () {});
    }

    /* ----- input ----- */
    var suppressClick = false;

    cards.forEach(function (card, i) {
      /* a side cover turns the ring; the front cover opens the project */
      card.addEventListener("click", function (e) {
        if (suppressClick || i !== cur) {
          e.preventDefault();
          if (!suppressClick) go(i);
        }
      });
      if (canHover) {
        card.addEventListener("mouseenter", function () {
          if (i === cur && !turning()) playLoop(card);
        });
        card.addEventListener("mouseleave", function () {
          stopLoop(card);
          setTilt(0, 0);
        });
        /* the front display leans away from the pointer, showing its edge */
        card.addEventListener("pointermove", function (e) {
          if (i !== cur || reduced || turning() || e.pointerType !== "mouse") return;
          var r = card.getBoundingClientRect();
          var px = (e.clientX - r.left) / r.width - 0.5;
          var py = (e.clientY - r.top) / r.height - 0.5;
          setTilt(-py * 2 * TILT_X, px * 2 * TILT_Y);
        });
      }
    });

    flow.querySelector(".cf-prev").addEventListener("click", function () {
      step(-1);
    });
    flow.querySelector(".cf-next").addEventListener("click", function () {
      step(1);
    });
    tabs.forEach(function (t, i) {
      t.addEventListener("click", function () {
        go(i);
      });
    });

    flow.addEventListener("keydown", function (e) {
      if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
        e.preventDefault();
        step(e.key === "ArrowLeft" ? -1 : 1);
      }
    });

    /* drag / swipe: the ring follows the pointer, then a flick carries it on */
    var drag = null;
    function unit() {
      return Math.max(cw * P.x1, 1); /* px that moves the ring by one project */
    }
    function beginFree() {
      free = true;
      v = 0;
      tX = tY = tiltX = tiltY = 0;
      stopLoop(cards[cur]);
      flow.classList.add("is-dragging");
    }
    function endFree(velocity) {
      free = false;
      flow.classList.remove("is-dragging");
      var from = Math.round(x);
      var proj = Math.round(x + velocity * 0.16);
      target = Math.max(from - 1, Math.min(from + 1, proj));
      v = velocity;
      animate();
    }

    stage.addEventListener("pointerdown", function (e) {
      if (e.button !== 0 || e.target.closest(".cf-arrow")) return;
      drag = { id: e.pointerId, x0: e.clientX, y0: e.clientY, start: x, live: false, pts: [] };
      window.addEventListener("pointermove", onMove);
      window.addEventListener("pointerup", onUp);
      window.addEventListener("pointercancel", onUp);
    });

    function onMove(e) {
      if (!drag || e.pointerId !== drag.id) return;
      var dx = e.clientX - drag.x0;
      if (!drag.live) {
        if (Math.abs(dx) < 6) return;
        if (Math.abs(e.clientY - drag.y0) > Math.abs(dx)) return finish(e, true);
        drag.live = true;
        drag.x0 = e.clientX;
        drag.start = x;
        dx = 0;
        beginFree();
      }
      x = drag.start - dx / unit();
      drag.pts.push([e.timeStamp, e.clientX]);
      while (drag.pts.length > 2 && e.timeStamp - drag.pts[0][0] > 90) drag.pts.shift();
      render();
    }

    function onUp(e) {
      if (!drag || e.pointerId !== drag.id) return;
      finish(e, e.type === "pointercancel");
    }

    function finish(e, cancelled) {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
      var d = drag;
      drag = null;
      if (!d || !d.live) return;
      var vel = 0;
      if (!cancelled && d.pts.length > 1) {
        var a = d.pts[0];
        var b = d.pts[d.pts.length - 1];
        var dt = (b[0] - a[0]) / 1000;
        if (dt > 0 && e.timeStamp - b[0] < 80) vel = -((b[1] - a[1]) / unit()) / dt;
      }
      vel = Math.max(-8, Math.min(8, vel));
      suppressClick = true;
      setTimeout(function () {
        suppressClick = false;
      }, 0);
      endFree(vel);
    }

    /* two-finger horizontal trackpad swipes scrub the ring; vertical scrolling is left alone */
    var wheelTimer = 0;
    stage.addEventListener(
      "wheel",
      function (e) {
        if (Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return;
        e.preventDefault();
        if (!free) beginFree();
        var px = e.deltaMode === 1 ? e.deltaX * 16 : e.deltaX;
        x += px / unit();
        render();
        clearTimeout(wheelTimer);
        wheelTimer = setTimeout(function () {
          endFree(0);
        }, 120);
      },
      { passive: false }
    );

    window.addEventListener("resize", function () {
      measure();
      render();
    });
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(function () {
        placePill(false);
      });
    }

    flow.classList.add("is-live");
    measure();
    render();
    sync();
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

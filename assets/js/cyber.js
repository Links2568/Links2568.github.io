/* cyber.js — theme toggle, copy-email, ambient wind-field canvas */
(function () {
  "use strict";

  /* ---------- theme ---------- */
  var root = document.documentElement;

  function currentTheme() {
    return root.getAttribute("data-theme") === "light" ? "light" : "dark";
  }

  function applyTheme(theme) {
    root.setAttribute("data-theme", theme);
    try {
      localStorage.setItem("theme", theme);
    } catch (e) {}
    var btn = document.querySelector(".theme-toggle");
    if (btn) {
      btn.textContent = "theme: " + theme;
      btn.setAttribute("aria-label", "Switch to " + (theme === "dark" ? "light" : "dark") + " theme");
    }
    document.dispatchEvent(new CustomEvent("themechange"));
  }

  document.addEventListener("DOMContentLoaded", function () {
    applyTheme(currentTheme());
    var btn = document.querySelector(".theme-toggle");
    if (btn) {
      btn.addEventListener("click", function () {
        applyTheme(currentTheme() === "dark" ? "light" : "dark");
      });
    }

    /* ---------- copy email ---------- */
    var copyBtn = document.querySelector(".copy-email");
    if (copyBtn) {
      var label = copyBtn.textContent;
      copyBtn.addEventListener("click", function () {
        var email = (copyBtn.getAttribute("data-email") || "")
          .replace(/\s*\(at\)\s*/g, "@")
          .replace(/\s*\(dot\)\s*/g, ".")
          .replace(/\s+/g, "");
        function done() {
          copyBtn.classList.add("copied");
          copyBtn.textContent = "copied ✓";
          setTimeout(function () {
            copyBtn.classList.remove("copied");
            copyBtn.textContent = label;
          }, 1600);
        }
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(email).then(done, done);
        } else {
          done();
        }
      });
    }

    initBoot();
    initField();
  });

  /* ---------- boot sequence ----------
     Terminal-style opening: progress bar counts to 100, then the page
     rises in section by section. Runs once per session; the inline gate
     in <head> skips it for reduced-motion users and repeat visits. */
  function initBoot() {
    if (root.getAttribute("data-boot") !== "pending") return;
    var boot = document.getElementById("boot");
    if (!boot) {
      root.removeAttribute("data-boot");
      return;
    }

    var blocksEl = document.getElementById("boot-blocks");
    var pctEl = document.getElementById("boot-pct");
    var msgEl = document.getElementById("boot-msg");
    var TOTAL = 24;
    var pct = 0;
    var msgs = [
      [0, "loading modules…"],
      [40, "compiling wind field…"],
      [78, "calibrating sensors…"],
      [100, "signal acquired ✓"]
    ];

    function render() {
      var filled = Math.round((pct / 100) * TOTAL);
      blocksEl.textContent =
        new Array(filled + 1).join("▓") + new Array(TOTAL - filled + 1).join("░");
      pctEl.textContent = pct + "%";
      for (var i = msgs.length - 1; i >= 0; i--) {
        if (pct >= msgs[i][0]) {
          msgEl.textContent = msgs[i][1];
          break;
        }
      }
    }

    function step() {
      pct = Math.min(100, pct + 4 + Math.floor(Math.random() * 11));
      render();
      if (pct < 100) {
        setTimeout(step, 14 + Math.random() * 38);
      } else {
        setTimeout(finish, 220);
      }
    }

    function finish() {
      try {
        sessionStorage.setItem("booted", "1");
      } catch (e) {}
      root.setAttribute("data-boot", "done");
      boot.classList.add("boot-exit");
      setTimeout(function () {
        boot.style.display = "none";
      }, 500);
    }

    render();
    setTimeout(step, 120);
  }

  /* ---------- ambient wind field ----------
     An atmospheric circulation model in miniature:
     - a meandering jet stream carries particles west → east
     - two slow-drifting pressure systems add cyclonic curvature
     - the cursor is a moving low-pressure system (cyclonic inflow)
     - a click fires a downburst: an expanding gust ring
     Very low opacity by design. */
  function initField() {
    var canvas = document.getElementById("field");
    if (!canvas) return;

    var ctx = canvas.getContext("2d");
    var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    var dpr, W, H, particles, raf, t;
    var pointer = { x: -1e4, y: -1e4, power: 0 };
    var gusts = [];

    /* two ambient pressure systems, positions as fractions of the viewport;
       k > 0 spins one way, k < 0 the other (a low and a high) */
    var systems = [
      { fx: 0.24, fy: 0.3, fr: 0.3, k: 1.0, drift: 0.05 },
      { fx: 0.76, fy: 0.7, fr: 0.34, k: -0.85, drift: 0.037 }
    ];

    function accentColor() {
      return getComputedStyle(root).getPropertyValue("--accent").trim();
    }
    function bgColor() {
      return getComputedStyle(root).getPropertyValue("--bg").trim();
    }

    /* wind velocity (px/step) at a point */
    function vel(x, y, time) {
      // jet stream: meandering band of strong eastward flow
      var jetY = H * (0.42 + 0.09 * Math.sin(time * 0.06 + x * 0.0014));
      var band = Math.exp(-Math.pow((y - jetY) / (H * 0.17), 2));
      var u = 0.3 + 1.15 * band;
      var v = 0.4 * Math.sin(x * 0.0028 - time * 0.11) * (0.25 + band);

      // pressure systems: Gaussian vortices drifting slowly
      for (var i = 0; i < systems.length; i++) {
        var s = systems[i];
        var cx = (s.fx + 0.06 * Math.sin(time * s.drift)) * W;
        var cy = (s.fy + 0.05 * Math.cos(time * s.drift * 1.3)) * H;
        var R = s.fr * Math.min(W, H);
        var dx = x - cx;
        var dy = y - cy;
        var g = Math.exp(-(dx * dx + dy * dy) / (R * R));
        u += (-dy / R) * s.k * 1.15 * g;
        v += (dx / R) * s.k * 1.15 * g;
      }

      // cursor: low-pressure system — cyclonic swirl with slight inflow
      if (pointer.power > 0.02) {
        var pr = 150;
        var pdx = x - pointer.x;
        var pdy = y - pointer.y;
        var pg = Math.exp(-(pdx * pdx + pdy * pdy) / (pr * pr)) * pointer.power;
        u += ((-pdy - pdx * 0.35) / pr) * 2.8 * pg;
        v += ((pdx - pdy * 0.35) / pr) * 2.8 * pg;
      }

      // gust rings from clicks: radial outward push on an expanding front
      for (var j = 0; j < gusts.length; j++) {
        var gu = gusts[j];
        var gdx = x - gu.x;
        var gdy = y - gu.y;
        var d = Math.sqrt(gdx * gdx + gdy * gdy) || 1;
        var front = gu.age * 260;
        var ring = Math.exp(-Math.pow((d - front) / 55, 2)) * (1 - gu.age) * 3.2;
        u += (gdx / d) * ring;
        v += (gdy / d) * ring;
      }

      // cap the magnitude so vortex cores never go wild
      var m = Math.sqrt(u * u + v * v);
      if (m > 3) {
        u = (u / m) * 3;
        v = (v / m) * 3;
      }
      return { u: u, v: v };
    }

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = canvas.clientWidth;
      H = canvas.clientHeight;
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      seed();
      paintBase();
      if (reduceMotion.matches) drawStatic();
    }

    /* enter from the western boundary, like a wind chart */
    function spawn(p, anywhere) {
      if (anywhere || Math.random() < 0.25) {
        p.x = Math.random() * W;
        p.y = Math.random() * H;
      } else {
        p.x = -4;
        p.y = Math.random() * H;
      }
      p.life = 200 + Math.random() * 400;
    }

    var baseCount = 0;

    function seed() {
      baseCount = Math.max(45, Math.min(110, Math.round((W * H) / 30000)));
      particles = [];
      for (var i = 0; i < baseCount; i++) {
        var p = {};
        spawn(p, true);
        particles.push(p);
      }
      t = Math.random() * 100;
    }

    function paintBase() {
      ctx.globalAlpha = 1;
      ctx.fillStyle = bgColor();
      ctx.fillRect(0, 0, W, H);
    }

    function step() {
      // translucent veil of bg → trails fade slowly
      ctx.globalAlpha = 0.035;
      ctx.fillStyle = bgColor();
      ctx.fillRect(0, 0, W, H);

      ctx.globalAlpha = 0.17;
      ctx.strokeStyle = accentColor();
      ctx.lineWidth = 0.8;
      t += 0.016;
      pointer.power *= 0.97;

      for (var j = gusts.length - 1; j >= 0; j--) {
        gusts[j].age += 0.016;
        if (gusts[j].age >= 1) gusts.splice(j, 1);
      }

      for (var i = 0; i < particles.length; i++) {
        var p = particles[i];
        var w = vel(p.x, p.y, t);
        var nx = p.x + w.u * 1.4;
        var ny = p.y + w.v * 1.4;
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(nx, ny);
        ctx.stroke();
        p.x = nx;
        p.y = ny;
        p.life -= 1;
        if (p.life <= 0 || p.x < -12 || p.x > W + 12 || p.y < -12 || p.y > H + 12) {
          if (particles.length > baseCount) {
            particles.splice(i, 1);
            i--;
          } else {
            spawn(p, false);
          }
        }
      }
      raf = requestAnimationFrame(step);
    }

    /* static streamlines for reduced-motion users: no cursor, no gusts */
    function drawStatic() {
      paintBase();
      ctx.globalAlpha = 0.09;
      ctx.strokeStyle = accentColor();
      ctx.lineWidth = 0.7;
      var rows = 26;
      for (var i = 0; i < rows; i++) {
        var x = 0;
        var y = (i + 0.5) * (H / rows);
        ctx.beginPath();
        ctx.moveTo(x, y);
        for (var s = 0; s < 320; s++) {
          var w = vel(x, y, 0);
          x += w.u * 2;
          y += w.v * 2;
          if (x > W || y < 0 || y > H) break;
          ctx.lineTo(x, y);
        }
        ctx.stroke();
      }
    }

    function start() {
      cancelAnimationFrame(raf);
      if (reduceMotion.matches) {
        drawStatic();
      } else {
        raf = requestAnimationFrame(step);
      }
    }

    window.addEventListener("resize", resize);
    window.addEventListener(
      "mousemove",
      function (e) {
        pointer.x = e.clientX;
        pointer.y = e.clientY;
        pointer.power = 1;
      },
      { passive: true }
    );
    window.addEventListener(
      "touchmove",
      function (e) {
        if (e.touches.length) {
          pointer.x = e.touches[0].clientX;
          pointer.y = e.touches[0].clientY;
          pointer.power = 1;
        }
      },
      { passive: true }
    );
    window.addEventListener(
      "click",
      function (e) {
        if (reduceMotion.matches) return;
        gusts.push({ x: e.clientX, y: e.clientY, age: 0 });
        if (gusts.length > 4) gusts.shift();
        // kick up tracer particles so the gust is visible even in calm regions
        for (var i = 0; i < 16; i++) {
          particles.push({
            x: e.clientX + (Math.random() - 0.5) * 10,
            y: e.clientY + (Math.random() - 0.5) * 10,
            life: 50 + Math.random() * 50
          });
        }
      },
      { passive: true }
    );
    document.addEventListener("visibilitychange", function () {
      if (document.hidden) {
        cancelAnimationFrame(raf);
      } else {
        // if the page loaded in a background tab, the canvas sized to 0×0
        if (canvas.clientWidth !== W || canvas.clientHeight !== H) resize();
        start();
      }
    });
    document.addEventListener("themechange", function () {
      paintBase();
      if (reduceMotion.matches) drawStatic();
    });
    if (reduceMotion.addEventListener) {
      reduceMotion.addEventListener("change", start);
    }

    resize();
    start();
  }
})();

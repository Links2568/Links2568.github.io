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

    initField();
  });

  /* ---------- ambient wind field ----------
     A quiet flow of particles following a layered-sine wind field —
     a nod to weather charts. Very low opacity by design. */
  function initField() {
    var canvas = document.getElementById("field");
    if (!canvas) return;

    var ctx = canvas.getContext("2d");
    var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    var dpr, W, H, particles, raf, t;

    function accentColor() {
      return getComputedStyle(root).getPropertyValue("--accent").trim();
    }
    function bgColor() {
      return getComputedStyle(root).getPropertyValue("--bg").trim();
    }

    function angle(x, y, time) {
      return (
        (Math.sin(x * 0.0016 + time * 0.11) +
          Math.cos(y * 0.0013 - time * 0.07) +
          Math.sin((x + y) * 0.0007)) *
        Math.PI * 0.75
      );
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

    function seed() {
      var n = Math.max(50, Math.min(130, Math.round((W * H) / 26000)));
      particles = [];
      for (var i = 0; i < n; i++) {
        particles.push({
          x: Math.random() * W,
          y: Math.random() * H,
          life: 60 + Math.random() * 240
        });
      }
      t = Math.random() * 100;
    }

    function paintBase() {
      ctx.globalAlpha = 1;
      ctx.fillStyle = bgColor();
      ctx.fillRect(0, 0, W, H);
    }

    function respawn(p) {
      p.x = Math.random() * W;
      p.y = Math.random() * H;
      p.life = 60 + Math.random() * 240;
    }

    function step() {
      // translucent veil of bg → trails fade slowly
      ctx.globalAlpha = 0.03;
      ctx.fillStyle = bgColor();
      ctx.fillRect(0, 0, W, H);

      ctx.globalAlpha = 0.2;
      ctx.strokeStyle = accentColor();
      ctx.lineWidth = 0.8;
      t += 0.016;

      for (var i = 0; i < particles.length; i++) {
        var p = particles[i];
        var a = angle(p.x, p.y, t);
        var nx = p.x + Math.cos(a) * 1.3;
        var ny = p.y + Math.sin(a) * 1.3;
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(nx, ny);
        ctx.stroke();
        p.x = nx;
        p.y = ny;
        p.life -= 1;
        if (p.life <= 0 || p.x < -10 || p.x > W + 10 || p.y < -10 || p.y > H + 10) {
          respawn(p);
        }
      }
      raf = requestAnimationFrame(step);
    }

    /* one static frame of streamlines for reduced-motion users */
    function drawStatic() {
      paintBase();
      ctx.globalAlpha = 0.1;
      ctx.strokeStyle = accentColor();
      ctx.lineWidth = 0.6;
      for (var i = 0; i < 42; i++) {
        var x = Math.random() * W;
        var y = Math.random() * H;
        ctx.beginPath();
        ctx.moveTo(x, y);
        for (var s = 0; s < 140; s++) {
          var a = angle(x, y, 0);
          x += Math.cos(a) * 1.4;
          y += Math.sin(a) * 1.4;
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
    document.addEventListener("visibilitychange", function () {
      if (document.hidden) {
        cancelAnimationFrame(raf);
      } else {
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

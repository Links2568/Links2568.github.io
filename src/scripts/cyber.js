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
      { fx: 0.11, fy: 0.24, fr: 0.3, k: 1.0, drift: 0.05 },
      { fx: 0.88, fy: 0.72, fr: 0.34, k: -0.85, drift: 0.037 }
    ];

    function accentColor() {
      return getComputedStyle(root).getPropertyValue("--accent").trim();
    }
    function dimColor() {
      return getComputedStyle(root).getPropertyValue("--dim").trim();
    }

    function jetAxisY(x, time) {
      return H * (0.42 + 0.09 * Math.sin(time * 0.06 + x * 0.0014));
    }

    function sysCenter(s, time) {
      return {
        x: (s.fx + 0.06 * Math.sin(time * s.drift)) * W,
        y: (s.fy + 0.05 * Math.cos(time * s.drift * 1.3)) * H,
        R: s.fr * Math.min(W, H)
      };
    }

    /* surface pressure (hPa) at a point — drives the isobars and HUD.
       systems[0] spins clockwise on screen = high; systems[1] = low */
    function pressure(x, y, time) {
      var p = 1012 - ((y / H) - 0.5) * 6;
      var hi = sysCenter(systems[0], time);
      var lo = sysCenter(systems[1], time);
      p += 12 * Math.exp(-((x - hi.x) * (x - hi.x) + (y - hi.y) * (y - hi.y)) / (hi.R * hi.R));
      p -= 16 * Math.exp(-((x - lo.x) * (x - lo.x) + (y - lo.y) * (y - lo.y)) / (lo.R * lo.R));
      return p;
    }

    /* wind velocity (px/step) at a point */
    function vel(x, y, time) {
      // jet stream: meandering band of strong eastward flow
      var jetY = jetAxisY(x, time);
      var band = Math.exp(-Math.pow((y - jetY) / (H * 0.17), 2));
      var u = 0.3 + 1.15 * band;
      var v = 0.4 * Math.sin(x * 0.0028 - time * 0.11) * (0.25 + band);

      // pressure systems: Gaussian vortices drifting slowly
      for (var i = 0; i < systems.length; i++) {
        var c = sysCenter(systems[i], time);
        var dx = x - c.x;
        var dy = y - c.y;
        var g = Math.exp(-(dx * dx + dy * dy) / (c.R * c.R));
        u += (-dy / c.R) * systems[i].k * 1.15 * g;
        v += (dx / c.R) * systems[i].k * 1.15 * g;
      }

      // cursor: low-pressure system — cyclonic (counterclockwise) swirl
      // with slight inflow, as a Northern Hemisphere low should be
      if (pointer.power > 0.02) {
        var pr = 150;
        var pdx = x - pointer.x;
        var pdy = y - pointer.y;
        var pg = Math.exp(-(pdx * pdx + pdy * pdy) / (pr * pr)) * pointer.power;
        u += ((pdy - pdx * 0.35) / pr) * 2.8 * pg;
        v += ((-pdx - pdy * 0.35) / pr) * 2.8 * pg;
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
      p.trail = [];
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

    var TRAIL = 12;
    var ISO_LEVELS = [1000, 1004, 1008, 1012, 1016, 1020];

    /* isobars via marching squares over the pressure field */
    function drawIsobars(time) {
      var nx = 56;
      var ny = 32;
      var gw = W / nx;
      var gh = H / ny;
      var grid = [];
      for (var iy = 0; iy <= ny; iy++) {
        for (var ix = 0; ix <= nx; ix++) {
          grid[iy * (nx + 1) + ix] = pressure(ix * gw, iy * gh, time);
        }
      }

      ctx.strokeStyle = accentColor();
      ctx.globalAlpha = 0.06;
      ctx.lineWidth = 1;
      ctx.beginPath();

      function f(a, b, L) {
        return (L - a) / (b - a);
      }

      for (var li = 0; li < ISO_LEVELS.length; li++) {
        var L = ISO_LEVELS[li];
        for (var cy = 0; cy < ny; cy++) {
          for (var cx = 0; cx < nx; cx++) {
            var tl = grid[cy * (nx + 1) + cx];
            var tr = grid[cy * (nx + 1) + cx + 1];
            var br = grid[(cy + 1) * (nx + 1) + cx + 1];
            var bl = grid[(cy + 1) * (nx + 1) + cx];
            var idx = (tl > L ? 8 : 0) | (tr > L ? 4 : 0) | (br > L ? 2 : 0) | (bl > L ? 1 : 0);
            if (idx === 0 || idx === 15) continue;
            var x0 = cx * gw;
            var y0 = cy * gh;
            var top = [x0 + gw * f(tl, tr, L), y0];
            var rgt = [x0 + gw, y0 + gh * f(tr, br, L)];
            var bot = [x0 + gw * f(bl, br, L), y0 + gh];
            var lft = [x0, y0 + gh * f(tl, bl, L)];
            var segs;
            switch (idx) {
              case 1: case 14: segs = [lft, bot]; break;
              case 2: case 13: segs = [bot, rgt]; break;
              case 3: case 12: segs = [lft, rgt]; break;
              case 4: case 11: segs = [top, rgt]; break;
              case 6: case 9: segs = [top, bot]; break;
              case 7: case 8: segs = [lft, top]; break;
              case 5: segs = [lft, top, bot, rgt]; break;
              case 10: segs = [lft, bot, top, rgt]; break;
            }
            for (var si = 0; si < segs.length; si += 2) {
              ctx.moveTo(segs[si][0], segs[si][1]);
              ctx.lineTo(segs[si + 1][0], segs[si + 1][1]);
            }
          }
        }
      }
      ctx.stroke();
    }

    /* jet axis, isobars, and pressure-center markers */
    function drawSynoptic(time) {
      drawIsobars(time);

      // jet axis: the Rossby-wave meander made visible
      ctx.strokeStyle = accentColor();
      ctx.globalAlpha = 0.08;
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 9]);
      ctx.beginPath();
      for (var x = 0; x <= W; x += 20) {
        var y = jetAxisY(x, time);
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
      ctx.setLineDash([]);

      // pressure centers: L (accent) and H (dim), with central pressure
      var lo = sysCenter(systems[1], time);
      var hi = sysCenter(systems[0], time);
      ctx.textAlign = "center";
      ctx.fillStyle = accentColor();
      ctx.globalAlpha = 0.5;
      ctx.font = '600 15px "IBM Plex Mono", ui-monospace, monospace';
      ctx.fillText("L", lo.x, lo.y);
      ctx.globalAlpha = 0.35;
      ctx.font = '10px "IBM Plex Mono", ui-monospace, monospace';
      ctx.fillText("996", lo.x, lo.y + 14);
      ctx.fillStyle = dimColor();
      ctx.globalAlpha = 0.45;
      ctx.font = '600 15px "IBM Plex Mono", ui-monospace, monospace';
      ctx.fillText("H", hi.x, hi.y);
      ctx.globalAlpha = 0.3;
      ctx.font = '10px "IBM Plex Mono", ui-monospace, monospace';
      ctx.fillText("1024", hi.x, hi.y + 14);
    }

    /* spinning dust rings that ride the tornado cursor — the funnel is
       the CSS cursor image (tip at the hotspot), these make it spin */
    function drawCursorVortex(time) {
      if (pointer.power < 0.05 || pointer.x < 0 || pointer.x > W || pointer.y < 0 || pointer.y > H) return;
      var a = Math.min(1, pointer.power);
      ctx.strokeStyle = accentColor();
      ctx.lineWidth = 1;
      for (var i = 0; i < 3; i++) {
        var cx = pointer.x + 1.5 + i * 3;
        var cy = pointer.y - 3 - i * 7.5;
        var rx = 3.5 + i * 4.5;
        var start = time * (7 - i * 1.4) + i * 2.1;
        ctx.globalAlpha = (0.35 - i * 0.07) * a;
        ctx.beginPath();
        ctx.ellipse(cx, cy, rx, rx * 0.42, 0, start, start + 2.1);
        ctx.stroke();
      }
    }

    function step() {
      // full clear every frame — trails are drawn explicitly, so no
      // accumulation and no 8-bit rounding ghosts
      ctx.clearRect(0, 0, W, H);

      t += 0.016;
      pointer.power *= 0.97;

      drawSynoptic(t);

      for (var j = gusts.length - 1; j >= 0; j--) {
        gusts[j].age += 0.016;
        if (gusts[j].age >= 1) gusts.splice(j, 1);
      }

      // advance particles, recording a short position history
      for (var i = 0; i < particles.length; i++) {
        var p = particles[i];
        p.trail.push({ x: p.x, y: p.y });
        if (p.trail.length > TRAIL) p.trail.shift();
        var w = vel(p.x, p.y, t);
        p.x += w.u * 1.4;
        p.y += w.v * 1.4;
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

      // draw trails in 4 bands: tail faint and thin → head bright and wide
      ctx.strokeStyle = accentColor();
      var widths = [0.6, 0.7, 0.85, 1.05];
      for (var b = 0; b < 4; b++) {
        ctx.globalAlpha = 0.05 + 0.15 * (b / 3);
        ctx.lineWidth = widths[b];
        ctx.beginPath();
        for (var k = 0; k < particles.length; k++) {
          var tr = particles[k].trail;
          var lo = Math.floor((tr.length - 1) * (b / 4));
          var hi = Math.floor((tr.length - 1) * ((b + 1) / 4));
          for (var s = lo; s < hi; s++) {
            ctx.moveTo(tr[s].x, tr[s].y);
            ctx.lineTo(tr[s + 1].x, tr[s + 1].y);
          }
        }
        ctx.stroke();
      }

      drawCursorVortex(t);

      raf = requestAnimationFrame(step);
    }

    /* static chart for reduced-motion users: no cursor, no gusts */
    function drawStatic() {
      ctx.clearRect(0, 0, W, H);
      drawSynoptic(0);
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
            life: 50 + Math.random() * 50,
            trail: []
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
      if (reduceMotion.matches) drawStatic();
    });
    if (reduceMotion.addEventListener) {
      reduceMotion.addEventListener("change", start);
    }

    resize();
    start();
  }
})();

/* Homepage exhibit: MoiréDeform's sensing principle, live.
   Two fine line gratings overlap. The visitor's pointer displaces one of them
   the way a body presses into a mesh chair, and the tiny shift shows up as
   large moiré fringes. At rest the fringes drift at a breathing cadence. */
(function () {
  "use strict";
  var canvas = document.querySelector(".moire-canvas");
  if (!canvas || !canvas.getContext) return;
  var host = canvas.parentElement;
  var ctx = canvas.getContext("2d");
  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var PERIOD = 5; // grating period, CSS px
  var LINE = 1.8; // line width, CSS px (≈36% duty: strong fringes)
  var ANGLE_A = -0.052; // fixed layer
  var ANGLE_B = -0.03; // displaced layer
  var BREATH_MS = 4600; // ~13 breaths per minute

  var dpr = 1;
  var W = 0;
  var H = 0;
  var ink = "#00274c";
  var layerA = document.createElement("canvas");
  var actx = layerA.getContext("2d");

  /* the "fabric": amplitude and press depth are damped springs */
  var pointer = { x: -1e4, y: -1e4 };
  var amp = { v: 0, vel: 0, target: 0 };
  var press = { v: 0, vel: 0, target: 0 };
  var running = false;
  var onScreen = true;

  function spring(s, k, damping) {
    s.vel += (s.target - s.v) * k;
    s.vel *= damping;
    s.v += s.vel;
  }

  function readInk() {
    var v = getComputedStyle(document.documentElement).getPropertyValue("--moire-ink").trim();
    if (v) ink = v;
  }

  function straight(c, angle, period) {
    c.save();
    c.setTransform(dpr, 0, 0, dpr, 0, 0);
    c.translate(W / 2, H / 2);
    c.rotate(angle);
    var R = Math.hypot(W, H) / 2 + period;
    c.strokeStyle = ink;
    c.lineWidth = LINE;
    c.beginPath();
    for (var x = -R; x <= R; x += period) {
      c.moveTo(x, -R);
      c.lineTo(x, R);
    }
    c.stroke();
    c.restore();
  }

  function drawLayerA() {
    actx.setTransform(1, 0, 0, 1, 0, 0);
    actx.clearRect(0, 0, layerA.width, layerA.height);
    straight(actx, ANGLE_A, PERIOD);
  }

  function drawLayerB(now) {
    var breath = reduced ? 0 : Math.sin((now / BREATH_MS) * 2 * Math.PI);
    var period = PERIOD * (1.011 + 0.005 * breath);
    var cos = Math.cos(ANGLE_B);
    var sin = Math.sin(ANGLE_B);
    var dx = pointer.x - W / 2;
    var dy = pointer.y - H / 2;
    var pu = dx * cos + dy * sin; // pointer in the layer's rotated frame
    var pv = -dx * sin + dy * cos;
    var sigma = 70 + 95 * Math.max(0, press.v);
    var A = amp.v * (9 + 20 * Math.max(0, press.v)); // peak displacement, CSS px
    var s2 = sigma * sigma;
    var reach = 3 * sigma;
    var R = Math.hypot(W, H) / 2 + period;
    var step = 7;

    ctx.save();
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.translate(W / 2, H / 2);
    ctx.rotate(ANGLE_B);
    ctx.strokeStyle = ink;
    ctx.lineWidth = LINE;
    ctx.beginPath();
    for (var u = -R; u <= R; u += period) {
      var du = u - pu;
      if (Math.abs(A) < 0.05 || Math.abs(du) > reach) {
        ctx.moveTo(u, -R);
        ctx.lineTo(u, R);
        continue;
      }
      /* straight outside the pressed region, a displaced polyline inside it */
      var v0 = Math.max(-R, pv - reach);
      var v1 = Math.min(R, pv + reach);
      ctx.moveTo(u, -R);
      ctx.lineTo(u, v0);
      for (var v = v0; v <= v1; v += step) {
        var dv = v - pv;
        var off = A * (du / sigma) * Math.exp(-(du * du + dv * dv) / s2);
        ctx.lineTo(u + off, v);
      }
      ctx.lineTo(u, v1);
      ctx.lineTo(u, R);
    }
    ctx.stroke();
    ctx.restore();
  }

  function draw(now) {
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(layerA, 0, 0);
    drawLayerB(now);
  }

  function frame(now) {
    spring(amp, 0.06, 0.82);
    spring(press, 0.07, 0.8);
    draw(now);
    if (running) requestAnimationFrame(frame);
  }

  function start() {
    if (running || reduced || !onScreen || document.hidden) return;
    running = true;
    requestAnimationFrame(frame);
  }

  function stop() {
    running = false;
  }

  function settle() {
    /* reduced motion: no animation, but the pattern still answers the pointer */
    amp.v = amp.target;
    press.v = press.target;
    draw(performance.now());
  }

  /* the mesh fades in just right of the text, wherever the text ends */
  function placeFade() {
    var text = host.querySelector(".exhibit-text");
    if (!text) return;
    var hr = host.getBoundingClientRect();
    var tr = text.getBoundingClientRect();
    var vertical = window.matchMedia("(max-width: 700px)").matches;
    var edge = vertical ? tr.bottom - hr.top : tr.right - hr.left;
    host.style.setProperty("--fade-start", Math.round(edge) + "px");
  }

  function resize() {
    placeFade();
    var r = host.getBoundingClientRect();
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = Math.max(1, Math.round(r.width));
    H = Math.max(1, Math.round(r.height));
    canvas.width = Math.round(W * dpr);
    canvas.height = Math.round(H * dpr);
    layerA.width = canvas.width;
    layerA.height = canvas.height;
    readInk();
    drawLayerA();
    draw(performance.now());
  }

  function locate(e) {
    var r = canvas.getBoundingClientRect();
    pointer.x = e.clientX - r.left;
    pointer.y = e.clientY - r.top;
  }

  host.addEventListener("pointermove", function (e) {
    locate(e);
    amp.target = 1;
    if (reduced) settle();
  });
  host.addEventListener("pointerleave", function () {
    amp.target = 0;
    press.target = 0;
    if (reduced) settle();
  });
  var touching = false;
  host.addEventListener("pointerdown", function (e) {
    if (e.target.closest && e.target.closest("a, button")) return;
    touching = e.pointerType === "touch";
    locate(e);
    amp.target = 1;
    press.target = 1;
    if (reduced) settle();
  });
  window.addEventListener("pointerup", function () {
    press.target = 0;
    if (touching) amp.target = 0; /* a finger lifting is like leaving the chair */
    touching = false;
    if (reduced) settle();
  });

  window.addEventListener("resize", resize);
  document.addEventListener("visibilitychange", function () {
    if (document.hidden) stop();
    else start();
  });
  if ("IntersectionObserver" in window) {
    new IntersectionObserver(function (entries) {
      onScreen = entries[0].isIntersecting;
      if (onScreen) start();
      else stop();
    }).observe(host);
  }
  /* repaint in the new ink when the color theme flips */
  new MutationObserver(function () {
    readInk();
    drawLayerA();
    draw(performance.now());
  }).observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });

  resize();
  start();
})();

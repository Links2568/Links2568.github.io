/* The looping video screen (/projects/<slug>/loop/): one of a project's videos on
   repeat for a booth or a lab TV. It starts muted, the only way browsers autoplay,
   with subtitles on. The bar shows on any movement and hides when idle; the choices
   go into the URL (?v=<video>&cc=<lang|off>) so a reload comes back the same. */
(function () {
  "use strict";
  var video = document.getElementById("screen");
  if (!video) return;

  var videos = JSON.parse(video.dataset.videos);
  var bar = document.getElementById("bar");
  var startBtn = document.getElementById("start");
  var soundBtn = document.getElementById("sound");
  var fsBtn = document.getElementById("fs");
  var ccGroup = document.getElementById("cc");
  var videoBtns = document.querySelectorAll("[data-video]");
  var ccBtns = document.querySelectorAll("[data-cc]");
  var defaultCc = ccBtns.length ? ccBtns[0].dataset.cc : "off";

  function byId(id) {
    for (var i = 0; i < videos.length; i++) if (videos[i].id === id) return videos[i];
    return null;
  }

  var params = new URLSearchParams(location.search);
  var state = {
    v: byId(params.get("v")) ? params.get("v") : video.dataset.start,
    cc: params.get("cc") || defaultCc,
  };

  function press(buttons, test) {
    for (var i = 0; i < buttons.length; i++) buttons[i].setAttribute("aria-pressed", String(test(buttons[i])));
  }

  function save() {
    var p = new URLSearchParams();
    if (state.v !== video.dataset.start) p.set("v", state.v);
    if (state.cc !== defaultCc) p.set("cc", state.cc);
    var q = p.toString();
    history.replaceState(null, "", location.pathname + (q ? "?" + q : ""));
  }

  /* ---------- playback ---------- */
  function play() {
    var p = video.play();
    if (p && p.then)
      p.then(
        function () {
          startBtn.hidden = true;
        },
        function (err) {
          // Low Power Mode and some kiosk browsers refuse even muted autoplay
          if (err && err.name === "NotAllowedError") startBtn.hidden = false;
        }
      );
  }

  function setModes() {
    var tracks = video.querySelectorAll("track");
    for (var i = 0; i < tracks.length; i++) {
      var mode = tracks[i].srclang === state.cc ? "showing" : "disabled";
      if (tracks[i].track.mode !== mode) tracks[i].track.mode = mode;
    }
  }
  // a newly loaded video can switch a track on by itself; put the chosen one back
  video.textTracks.addEventListener("change", setModes);

  function showCaptions() {
    if (ccGroup) ccGroup.hidden = video.querySelectorAll("track").length === 0;
    setModes();
    press(ccBtns, function (b) {
      return b.dataset.cc === state.cc;
    });
    placeCues();
  }

  // the bar covers the bottom of the picture: while it shows, lift the subtitles above it
  function placeCues() {
    var pic = video.getBoundingClientRect();
    var top = Infinity;
    for (var i = 0; i < bar.children.length; i++) top = Math.min(top, bar.children[i].getBoundingClientRect().top);
    var line = idle() ? 100 : ((top - pic.top) / pic.height) * 100 - 2;
    for (var t = 0; t < video.textTracks.length; t++) {
      var cues = video.textTracks[t].cues;
      for (var c = 0; cues && c < cues.length; c++) {
        if (line >= 96) {
          cues[c].snapToLines = true;
          cues[c].line = "auto";
          cues[c].lineAlign = "start";
        } else {
          cues[c].snapToLines = false;
          cues[c].line = Math.max(line, 10);
          cues[c].lineAlign = "end";
        }
      }
    }
  }
  // a track's cues arrive with its load event, which doesn't bubble
  video.addEventListener("load", placeCues, true);
  window.addEventListener("resize", placeCues);

  function load(id) {
    var v = byId(id);
    video.querySelectorAll("track").forEach(function (t) {
      t.remove();
    });
    v.captions.forEach(function (c) {
      var t = document.createElement("track");
      t.kind = "subtitles";
      t.srclang = c.lang;
      t.label = c.label;
      t.src = c.src;
      video.appendChild(t);
    });
    video.poster = v.poster;
    video.src = v.src;
    press(videoBtns, function (b) {
      return b.dataset.video === id;
    });
    showCaptions();
    play();
  }

  if (state.v !== video.dataset.start) load(state.v);
  else {
    showCaptions();
    play();
  }

  startBtn.addEventListener("click", play);
  videoBtns.forEach(function (b) {
    b.addEventListener("click", function () {
      if (b.dataset.video === state.v) return;
      state.v = b.dataset.video;
      save();
      load(state.v);
    });
  });
  ccBtns.forEach(function (b) {
    b.addEventListener("click", function () {
      state.cc = b.dataset.cc;
      save();
      showCaptions();
    });
  });

  // an unattended screen: if the picture hasn't moved for 30 s (a dropped connection,
  // a stalled decoder), reload the video and start it again
  var last = -1;
  var still = 0;
  setInterval(function () {
    if (!startBtn.hidden || document.visibilityState !== "visible") return;
    still = video.currentTime === last ? still + 5 : 0;
    last = video.currentTime;
    if (still >= 30) {
      still = 0;
      video.load();
      showCaptions();
      play();
    }
  }, 5000);

  // keep the display from going to sleep while it plays
  var lock = null;
  function keepAwake() {
    if (!navigator.wakeLock || lock || document.visibilityState !== "visible") return;
    navigator.wakeLock.request("screen").then(
      function (l) {
        lock = l;
        l.addEventListener("release", function () {
          lock = null;
        });
      },
      function () {}
    );
  }
  video.addEventListener("playing", keepAwake);
  document.addEventListener("visibilitychange", keepAwake);

  /* ---------- sound and full screen ---------- */
  function soundLabel() {
    soundBtn.textContent = video.muted ? "Unmute" : "Mute";
  }
  soundBtn.addEventListener("click", function () {
    video.muted = !video.muted;
    if (!video.muted) video.volume = 1;
  });
  video.addEventListener("volumechange", soundLabel);
  soundLabel();

  var root = document.documentElement;
  var enterFs = root.requestFullscreen || root.webkitRequestFullscreen;
  var exitFs = document.exitFullscreen || document.webkitExitFullscreen;
  function inFs() {
    return !!(document.fullscreenElement || document.webkitFullscreenElement);
  }
  function toggleFs() {
    var p = inFs() ? exitFs.call(document) : enterFs.call(root);
    if (p && p.catch) p.catch(function () {});
  }
  function fsLabel() {
    fsBtn.textContent = inFs() ? "Exit full screen" : "Full screen";
  }
  // iPhone Safari has no page full screen
  if (!enterFs) fsBtn.hidden = true;
  fsBtn.addEventListener("click", toggleFs);
  document.addEventListener("fullscreenchange", fsLabel);
  document.addEventListener("webkitfullscreenchange", fsLabel);

  /* ---------- the bar: shown on movement, hidden when idle ---------- */
  var timer;
  function sleep() {
    // stay up while the pointer rests on it or the keyboard is inside it
    if (bar.matches(":hover") || bar.querySelector(":focus-visible")) wake();
    else rest();
  }
  function rest() {
    clearTimeout(timer);
    document.body.classList.add("idle");
    placeCues();
  }
  function wake(ms) {
    var was = idle();
    document.body.classList.remove("idle");
    if (was) placeCues();
    clearTimeout(timer);
    timer = setTimeout(sleep, ms || 3000);
  }
  function idle() {
    return document.body.classList.contains("idle");
  }
  document.addEventListener("pointermove", function (e) {
    if (e.pointerType === "mouse") wake();
  });
  document.addEventListener("pointerdown", function (e) {
    // a tap on the picture toggles the bar
    if (!idle() && (e.target === video || e.target === document.body)) rest();
    else wake();
  });
  document.addEventListener("keydown", function (e) {
    wake();
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    if (e.key === "f" || e.key === "F") toggleFs();
    else if (e.key === "m" || e.key === "M") soundBtn.click();
  });
  wake(5000);
})();

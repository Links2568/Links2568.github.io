/* lzclink.com — project pages: the screening-room video player and the figure viewer. */
(function () {
  "use strict";

  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var touch = window.matchMedia("(hover: none)").matches;
  var EASE = "cubic-bezier(0.2, 0.8, 0.2, 1)";

  var ICONS = {
    play: '<path d="M8 5.2v13.6a.8.8 0 0 0 1.2.7l10.6-6.8a.8.8 0 0 0 0-1.4L9.2 4.5a.8.8 0 0 0-1.2.7Z"/>',
    pause: '<rect x="6.5" y="5" width="3.6" height="14" rx="1"/><rect x="13.9" y="5" width="3.6" height="14" rx="1"/>',
    volume:
      '<path d="M4 9.5h3.2L12 5.5v13l-4.8-4H4z"/><path d="M15.5 9a4 4 0 0 1 0 6M18 6.5a7.5 7.5 0 0 1 0 11" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/>',
    muted:
      '<path d="M4 9.5h3.2L12 5.5v13l-4.8-4H4z"/><path d="M16 9.5l5 5M21 9.5l-5 5" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/>',
    subtitles:
      '<rect x="3" y="5.5" width="18" height="13" rx="2.5" fill="none" stroke="currentColor" stroke-width="1.7"/><path d="M10.4 10.3a2.3 2.3 0 1 0 0 3.4M16.4 10.3a2.3 2.3 0 1 0 0 3.4" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>',
    expand:
      '<path d="M4.5 9V5.5a1 1 0 0 1 1-1H9M15 4.5h3.5a1 1 0 0 1 1 1V9M19.5 15v3.5a1 1 0 0 1-1 1H15M9 19.5H5.5a1 1 0 0 1-1-1V15" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>',
    shrink:
      '<path d="M9 4.5V8a1 1 0 0 1-1 1H4.5M19.5 9H16a1 1 0 0 1-1-1V4.5M15 19.5V16a1 1 0 0 1 1-1h3.5M4.5 15H8a1 1 0 0 1 1 1v3.5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>',
    close: '<path d="M6 6l12 12M18 6L6 18"/>',
    prev: '<path d="M14.5 5.5L8 12l6.5 6.5"/>',
    next: '<path d="M9.5 5.5L16 12l-6.5 6.5"/>',
  };

  function svg(name) {
    return '<svg viewBox="0 0 24 24" aria-hidden="true">' + ICONS[name] + "</svg>";
  }

  function fmt(t) {
    if (!isFinite(t) || t < 0) t = 0;
    var m = Math.floor(t / 60);
    var s = Math.floor(t % 60);
    return m + ":" + (s < 10 ? "0" : "") + s;
  }

  function fullscreenElement() {
    return document.fullscreenElement || document.webkitFullscreenElement || null;
  }

  /* ---------- screening room ----------
     One screen and a list of videos. The poster waits under a frosted play
     button; once a video runs, the controls step aside after a moment of
     stillness and come back on any movement. Switching videos freezes the
     current picture and dissolves it into the next one. */
  var SUBTITLE_KEY = "subtitles";

  function initPlayer(root) {
    var stage = root.querySelector(".vp-stage");
    var video = stage.querySelector("video");
    var cover = stage.querySelector(".vp-cover");
    var coverText = cover.querySelector(".vp-cover-text");
    var coverTitle = cover.querySelector(".vp-cover-title");
    var coverMeta = cover.querySelector(".vp-cover-meta");
    var coverNext = cover.querySelector(".vp-next");
    var items = Array.prototype.slice.call(root.querySelectorAll(".vp-item"));
    var current = 0;
    var resumeAt = items.map(function () {
      return 0;
    });
    var dragging = false;
    var idleTimer = 0;
    var lang = "off";

    video.controls = false;
    video.removeAttribute("controls");

    var bar = document.createElement("div");
    bar.className = "vp-bar";
    bar.innerHTML =
      '<div class="vp-scrub" role="slider" tabindex="0" aria-label="Seek" aria-valuemin="0" aria-valuemax="0" aria-valuenow="0">' +
      '<span class="vp-rail"><span class="vp-buffered"></span><span class="vp-played"></span></span>' +
      '<span class="vp-knob"></span><span class="vp-tip" aria-hidden="true">0:00</span></div>' +
      '<div class="vp-row">' +
      '<button class="vp-btn vp-toggle" type="button" aria-label="Play">' + svg("play") + "</button>" +
      '<span class="vp-time"><span class="vp-cur">0:00</span><span class="vp-of"> / <span class="vp-dur">0:00</span></span></span>' +
      '<span class="vp-gap"></span>' +
      '<span class="vp-cc-wrap"><button class="vp-btn vp-cc" type="button" aria-label="Subtitles" aria-haspopup="menu" aria-expanded="false">' +
      svg("subtitles") + '</button><span class="vp-menu" role="menu" aria-label="Subtitles" hidden></span></span>' +
      '<button class="vp-btn vp-mute" type="button" aria-label="Mute">' + svg("volume") + "</button>" +
      '<button class="vp-btn vp-fs" type="button" aria-label="Full screen">' + svg("expand") + "</button>" +
      "</div>";
    var captions = document.createElement("div");
    captions.className = "vp-captions";
    captions.setAttribute("aria-hidden", "true");
    var spinner = document.createElement("span");
    spinner.className = "vp-spin";
    stage.appendChild(captions);
    stage.appendChild(spinner);
    stage.appendChild(bar);

    var scrub = bar.querySelector(".vp-scrub");
    var played = bar.querySelector(".vp-played");
    var buffered = bar.querySelector(".vp-buffered");
    var knob = bar.querySelector(".vp-knob");
    var tip = bar.querySelector(".vp-tip");
    var toggleBtn = bar.querySelector(".vp-toggle");
    var curEl = bar.querySelector(".vp-cur");
    var durEl = bar.querySelector(".vp-dur");
    var ccWrap = bar.querySelector(".vp-cc-wrap");
    var ccBtn = bar.querySelector(".vp-cc");
    var menu = bar.querySelector(".vp-menu");
    var muteBtn = bar.querySelector(".vp-mute");
    var fsBtn = bar.querySelector(".vp-fs");

    root.classList.add("is-ready");

    function setIcon(btn, name, label) {
      btn.innerHTML = svg(name);
      btn.setAttribute("aria-label", label);
    }

    function play() {
      var wasCover = document.activeElement === cover;
      root.classList.add("is-started");
      video.preload = "auto";
      if (video.readyState < 3) root.classList.add("is-waiting");
      var p = video.play();
      if (p && p.catch) p.catch(function () {});
      if (wasCover) toggleBtn.focus({ preventScroll: true });
      wake();
    }

    function toggle() {
      if (video.paused || video.ended) play();
      else video.pause();
    }

    /* ----- controls that step aside ----- */
    function wake() {
      root.classList.remove("is-idle");
      clearTimeout(idleTimer);
      idleTimer = setTimeout(rest, touch ? 3000 : 2200);
    }

    function rest() {
      if (video.paused || dragging || !menu.hidden || bar.matches(":hover")) return;
      if (bar.contains(document.activeElement) && bar.querySelector(":focus-visible")) return;
      root.classList.add("is-idle");
    }

    stage.addEventListener("pointermove", function (e) {
      if (e.pointerType === "mouse") wake();
    });
    stage.addEventListener("pointerleave", function (e) {
      if (e.pointerType !== "mouse" || dragging) return;
      clearTimeout(idleTimer);
      idleTimer = setTimeout(rest, 400);
    });
    bar.addEventListener("focusin", wake);

    /* ----- playback state ----- */
    function paint(t) {
      var d = video.duration;
      var time = typeof t === "number" ? t : video.currentTime;
      var f = d ? Math.min(1, Math.max(0, time / d)) : 0;
      played.style.transform = "scaleX(" + f + ")";
      knob.style.left = f * 100 + "%";
      curEl.textContent = fmt(time);
      scrub.setAttribute("aria-valuenow", String(Math.floor(time)));
      scrub.setAttribute("aria-valuetext", fmt(time) + " of " + fmt(d));
      if (items[current]) items[current].style.setProperty("--watched", String(f));
    }

    function paintBuffered() {
      var d = video.duration;
      var b = video.buffered;
      if (!d || !b.length) return;
      var end = 0;
      for (var i = 0; i < b.length; i++) {
        if (b.start(i) <= video.currentTime + 0.5) end = Math.max(end, b.end(i));
      }
      buffered.style.transform = "scaleX(" + Math.min(1, end / d) + ")";
    }

    video.addEventListener("play", function () {
      root.classList.add("is-playing");
      setIcon(toggleBtn, "pause", "Pause");
      wake();
    });
    video.addEventListener("pause", function () {
      root.classList.remove("is-playing");
      setIcon(toggleBtn, "play", "Play");
      wake();
    });
    video.addEventListener("waiting", function () {
      root.classList.add("is-waiting");
    });
    ["playing", "canplay", "pause"].forEach(function (ev) {
      video.addEventListener(ev, function () {
        root.classList.remove("is-waiting");
      });
    });
    video.addEventListener("loadedmetadata", function () {
      durEl.textContent = fmt(Math.round(video.duration));
      scrub.setAttribute("aria-valuemax", String(Math.floor(video.duration)));
      var at = resumeAt[current];
      if (at > 1 && at < video.duration - 2) video.currentTime = at;
      paint();
    });
    video.addEventListener("timeupdate", function () {
      if (!dragging) paint();
      resumeAt[current] = video.currentTime;
    });
    video.addEventListener("progress", paintBuffered);
    video.addEventListener("volumechange", function () {
      setIcon(muteBtn, video.muted ? "muted" : "volume", video.muted ? "Unmute" : "Mute");
    });
    video.addEventListener("ended", function () {
      resumeAt[current] = 0;
      if (current + 1 < items.length) {
        select(current + 1, { upNext: true });
      } else {
        root.classList.remove("is-started", "is-idle");
        cover.setAttribute("aria-label", "Play " + coverTitle.textContent + " again");
      }
    });

    cover.addEventListener("click", play);
    toggleBtn.addEventListener("click", toggle);
    muteBtn.addEventListener("click", function () {
      video.muted = !video.muted;
    });

    /* a click on the picture plays or pauses; on touch screens a tap first brings the controls back */
    video.addEventListener("click", function () {
      if (!root.classList.contains("is-started")) return;
      if (touch) {
        if (root.classList.contains("is-idle")) wake();
        else if (!video.paused) {
          clearTimeout(idleTimer);
          root.classList.add("is-idle");
        }
        return;
      }
      toggle();
    });
    video.addEventListener("dblclick", toggleFullscreen);

    /* ----- seeking ----- */
    function ratioAt(e) {
      var r = scrub.getBoundingClientRect();
      return Math.max(0, Math.min(1, (e.clientX - r.left) / r.width));
    }

    function seekTo(t) {
      if (!video.duration) return;
      t = Math.max(0, Math.min(video.duration, t));
      video.currentTime = t;
      paint(t);
      wake();
    }

    scrub.addEventListener("pointerdown", function (e) {
      if (!video.duration) return;
      dragging = true;
      scrub.setPointerCapture(e.pointerId);
      root.classList.add("is-scrubbing");
      seekTo(ratioAt(e) * video.duration);
    });
    scrub.addEventListener("pointermove", function (e) {
      var f = ratioAt(e);
      tip.textContent = fmt(f * (video.duration || 0));
      tip.style.left = f * 100 + "%";
      if (dragging) seekTo(f * video.duration);
    });
    function endDrag() {
      if (!dragging) return;
      dragging = false;
      root.classList.remove("is-scrubbing");
      wake();
    }
    scrub.addEventListener("pointerup", endDrag);
    scrub.addEventListener("pointercancel", endDrag);
    scrub.addEventListener("lostpointercapture", endDrag);
    scrub.addEventListener("keydown", function (e) {
      var step = { ArrowLeft: -5, ArrowDown: -5, ArrowRight: 5, ArrowUp: 5, PageDown: -30, PageUp: 30 }[e.key];
      if (e.key === "Home") seekTo(0);
      else if (e.key === "End") seekTo(video.duration);
      else if (step) seekTo(video.currentTime + step);
      else return;
      e.preventDefault();
      e.stopPropagation();
    });

    /* ----- full screen: the whole stage goes, so the controls come along ----- */
    function toggleFullscreen() {
      if (fullscreenElement()) {
        (document.exitFullscreen || document.webkitExitFullscreen).call(document);
        return;
      }
      var p;
      if (stage.requestFullscreen) p = stage.requestFullscreen();
      else if (stage.webkitRequestFullscreen) stage.webkitRequestFullscreen();
      else if (video.webkitEnterFullscreen) video.webkitEnterFullscreen();
      if (p && p.catch) p.catch(function () {});
    }

    function onFullscreen() {
      var on = fullscreenElement() === stage;
      root.classList.toggle("is-fs", on);
      setIcon(fsBtn, on ? "shrink" : "expand", on ? "Exit full screen" : "Full screen");
    }

    fsBtn.addEventListener("click", toggleFullscreen);
    document.addEventListener("fullscreenchange", onFullscreen);
    document.addEventListener("webkitfullscreenchange", onFullscreen);

    /* ----- subtitles, drawn by the page so they can move above the controls ----- */
    function tracks() {
      return Array.prototype.slice.call(video.querySelectorAll("track"));
    }

    function savedLang() {
      try {
        return localStorage.getItem(SUBTITLE_KEY) || "off";
      } catch (e) {
        return "off";
      }
    }

    function drawCues() {
      var t = tracks().filter(function (x) {
        return x.srclang === lang;
      })[0];
      var cues = t && t.track.activeCues;
      captions.textContent = "";
      if (!cues || !cues.length) return;
      Array.prototype.forEach.call(cues, function (c) {
        String(c.text)
          .replace(/<[^>]+>/g, "")
          .split("\n")
          .forEach(function (line) {
            var span = document.createElement("span");
            span.textContent = line;
            captions.appendChild(span);
          });
      });
    }

    function applyLang(next) {
      lang = next;
      tracks().forEach(function (t) {
        t.track.mode = t.srclang === lang ? "hidden" : "disabled";
      });
      var on = lang !== "off";
      ccBtn.classList.toggle("is-on", on);
      menu.querySelectorAll("[data-lang]").forEach(function (b) {
        b.setAttribute("aria-checked", b.dataset.lang === lang ? "true" : "false");
      });
      drawCues();
    }

    function buildSubtitles() {
      var ts = tracks();
      ccWrap.hidden = !ts.length;
      menu.textContent = "";
      [{ lang: "off", label: "Off" }]
        .concat(
          ts.map(function (t) {
            return { lang: t.srclang, label: t.label };
          })
        )
        .forEach(function (o) {
          var b = document.createElement("button");
          b.type = "button";
          b.setAttribute("role", "menuitemradio");
          b.dataset.lang = o.lang;
          b.textContent = o.label;
          b.addEventListener("click", function () {
            try {
              localStorage.setItem(SUBTITLE_KEY, o.lang);
            } catch (e) {}
            applyLang(o.lang);
            closeMenu();
            ccBtn.focus({ preventScroll: true });
          });
          menu.appendChild(b);
        });
      ts.forEach(function (t) {
        t.track.addEventListener("cuechange", drawCues);
      });
      var want = savedLang();
      applyLang(
        ts.some(function (t) {
          return t.srclang === want;
        })
          ? want
          : "off"
      );
    }

    function openMenu() {
      menu.hidden = false;
      ccBtn.setAttribute("aria-expanded", "true");
      var checked = menu.querySelector('[aria-checked="true"]') || menu.firstChild;
      if (checked) checked.focus({ preventScroll: true });
      wake();
    }

    function closeMenu() {
      menu.hidden = true;
      ccBtn.setAttribute("aria-expanded", "false");
    }

    ccBtn.addEventListener("click", function () {
      if (menu.hidden) openMenu();
      else closeMenu();
    });
    menu.addEventListener("keydown", function (e) {
      var opts = Array.prototype.slice.call(menu.children);
      var i = opts.indexOf(document.activeElement);
      if (e.key === "ArrowDown" || e.key === "ArrowUp") {
        e.preventDefault();
        var n = (i + (e.key === "ArrowDown" ? 1 : -1) + opts.length) % opts.length;
        opts[n].focus();
      } else if (e.key === "Escape") {
        e.preventDefault();
        e.stopPropagation();
        closeMenu();
        ccBtn.focus();
      }
    });
    document.addEventListener("pointerdown", function (e) {
      if (!menu.hidden && !ccWrap.contains(e.target)) closeMenu();
    });

    /* ----- keyboard: space or k, ← →, f, m, c — while the player has focus or nothing else does ----- */
    document.addEventListener("keydown", function (e) {
      if (!root.classList.contains("is-started") || e.metaKey || e.ctrlKey || e.altKey) return;
      var t = e.target;
      if (t !== document.body && !stage.contains(t)) return;
      if (!menu.hidden) return;
      /* once the screen is scrolled away, the page gets its keys back */
      var r = stage.getBoundingClientRect();
      if (t === document.body && (r.bottom < 0 || r.top > window.innerHeight)) return;
      var k = e.key.toLowerCase();
      if ((k === " " && t.tagName !== "BUTTON") || k === "k") toggle();
      else if (k === "arrowleft" && t !== scrub) seekTo(video.currentTime - 5);
      else if (k === "arrowright" && t !== scrub) seekTo(video.currentTime + 5);
      else if (k === "f") toggleFullscreen();
      else if (k === "m") video.muted = !video.muted;
      else if (k === "c" && tracks().length) {
        var order = ["off"].concat(
          tracks().map(function (x) {
            return x.srclang;
          })
        );
        applyLang(order[(order.indexOf(lang) + 1) % order.length]);
        wake();
      } else return;
      e.preventDefault();
    });

    /* ----- switching between videos ----- */
    function freezeFrame() {
      if (reduced) return null;
      var el;
      if (root.classList.contains("is-started") && video.readyState >= 2 && video.videoWidth) {
        el = document.createElement("canvas");
        el.width = video.videoWidth;
        el.height = video.videoHeight;
        try {
          el.getContext("2d").drawImage(video, 0, 0);
        } catch (err) {
          return null;
        }
      } else {
        el = document.createElement("img");
        el.alt = "";
        el.src = video.poster;
      }
      el.className = "vp-freeze";
      stage.insertBefore(el, captions);
      return el;
    }

    function select(i, opts) {
      opts = opts || {};
      if (i === current) {
        if (opts.autoplay) play();
        return;
      }
      var it = items[i];
      var freeze = freezeFrame();
      video.pause();
      while (video.firstChild) video.removeChild(video.firstChild);
      var source = document.createElement("source");
      source.src = it.dataset.src;
      source.type = "video/mp4";
      video.appendChild(source);
      JSON.parse(it.dataset.captions || "[]").forEach(function (c) {
        var track = document.createElement("track");
        track.kind = "subtitles";
        track.srclang = c.lang;
        track.label = c.label;
        track.src = c.src;
        video.appendChild(track);
      });
      video.poster = it.dataset.poster;
      video.preload = opts.autoplay ? "auto" : "none";
      video.load();

      current = i;
      items.forEach(function (x, j) {
        if (j === i) x.setAttribute("aria-current", "true");
        else x.removeAttribute("aria-current");
      });
      coverTitle.textContent = it.dataset.label;
      coverMeta.textContent = it.dataset.meta;
      coverNext.hidden = !opts.upNext;
      cover.setAttribute("aria-label", "Play " + it.dataset.label);
      durEl.textContent = it.querySelector(".vp-item-meta").textContent;
      buffered.style.transform = "scaleX(0)";
      paint(0);
      buildSubtitles();
      root.classList.toggle("is-started", !!opts.autoplay);

      if (!reduced) {
        coverText.animate(
          [
            { opacity: 0, transform: "translateY(6px)" },
            { opacity: 1, transform: "none" },
          ],
          { duration: 520, easing: EASE }
        );
      }
      if (freeze) {
        requestAnimationFrame(function () {
          requestAnimationFrame(function () {
            freeze.classList.add("is-gone");
            setTimeout(function () {
              freeze.remove();
            }, 700);
          });
        });
      }
      if (opts.autoplay) play();
    }

    items.forEach(function (it, i) {
      it.addEventListener("click", function (e) {
        if (e.metaKey || e.ctrlKey || e.shiftKey) return;
        e.preventDefault();
        select(i, { autoplay: true });
        var r = stage.getBoundingClientRect();
        if (r.top < 0 || r.bottom > window.innerHeight) {
          stage.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "center" });
        }
      });
    });

    buildSubtitles();
  }

  /* ---------- figure viewer ----------
     Figures open in place: the thumbnail grows into the viewer and shrinks
     back into the page on close. ← → step through, a swipe works on phones. */
  function initFigures() {
    var links = Array.prototype.slice.call(document.querySelectorAll(".teaser-img, .paper-figures a"));
    if (!links.length) return;
    var figs = links.map(function (a) {
      var fig = a.closest("figure");
      return { link: a, thumb: a.querySelector("img"), caption: fig && fig.querySelector("figcaption") };
    });

    var fv = document.createElement("div");
    fv.className = "fv";
    fv.hidden = true;
    fv.setAttribute("role", "dialog");
    fv.setAttribute("aria-modal", "true");
    fv.setAttribute("aria-label", "Figure");
    fv.innerHTML =
      '<button class="fv-close" type="button" aria-label="Close">' + svg("close") + "</button>" +
      '<button class="fv-arrow fv-prev" type="button" aria-label="Previous figure">' + svg("prev") + "</button>" +
      '<button class="fv-arrow fv-next" type="button" aria-label="Next figure">' + svg("next") + "</button>" +
      '<figure class="fv-stage"><img class="fv-img" alt="" /><figcaption class="fv-cap"></figcaption></figure>';
    document.body.appendChild(fv);

    var img = fv.querySelector(".fv-img");
    var cap = fv.querySelector(".fv-cap");
    var closeBtn = fv.querySelector(".fv-close");
    var prevBtn = fv.querySelector(".fv-prev");
    var nextBtn = fv.querySelector(".fv-next");
    var current = -1;
    var closing = false;

    function fill(i) {
      var f = figs[i];
      current = i;
      img.src = f.link.getAttribute("href");
      img.alt = f.thumb ? f.thumb.alt : "";
      cap.textContent = "";
      if (f.caption) {
        Array.prototype.forEach.call(f.caption.childNodes, function (n) {
          cap.appendChild(n.cloneNode(true));
        });
      }
      prevBtn.disabled = i === 0;
      nextBtn.disabled = i === figs.length - 1;
      /* leave the caption its room under the figure */
      fv.style.setProperty("--fv-cap-h", cap.offsetHeight + "px");
    }

    function zoom(fromRect, toRect, reverse) {
      var s = fromRect.width / toRect.width;
      var frames = [
        { transform: "translate(" + (fromRect.left - toRect.left) + "px, " + (fromRect.top - toRect.top) + "px) scale(" + s + ")" },
        { transform: "none" },
      ];
      if (reverse) frames.reverse();
      return img.animate(frames, { duration: reverse ? 380 : 460, easing: EASE, fill: reverse ? "forwards" : "none" });
    }

    function open(i) {
      var f = figs[i];
      fv.hidden = false;
      document.documentElement.classList.add("fv-open");
      fill(i);
      var from = f.thumb && f.thumb.getBoundingClientRect();
      requestAnimationFrame(function () {
        fv.classList.add("is-open");
      });
      if (!reduced && from && from.width && img.complete && img.naturalWidth) {
        var to = img.getBoundingClientRect();
        if (to.width) {
          f.thumb.style.visibility = "hidden";
          zoom(from, to).onfinish = function () {
            f.thumb.style.visibility = "";
          };
        }
      }
      closeBtn.focus({ preventScroll: true });
    }

    function close() {
      if (closing || fv.hidden) return;
      closing = true;
      var f = figs[current];
      var from = img.getBoundingClientRect();
      var to = f.thumb && f.thumb.getBoundingClientRect();
      var onScreen = to && to.width && to.bottom > 0 && to.top < window.innerHeight;
      fv.classList.remove("is-open");
      function done() {
        fv.hidden = true;
        img.getAnimations().forEach(function (a) {
          a.cancel();
        });
        if (f.thumb) f.thumb.style.visibility = "";
        document.documentElement.classList.remove("fv-open");
        closing = false;
        f.link.focus({ preventScroll: true });
      }
      if (!reduced && onScreen && from.width) {
        f.thumb.style.visibility = "hidden";
        zoom(to, from, true).onfinish = done;
      } else {
        setTimeout(done, reduced ? 0 : 300);
      }
    }

    function step(dir) {
      var i = current + dir;
      if (i < 0 || i >= figs.length) return;
      fill(i);
      if (!reduced) {
        img.animate(
          [
            { opacity: 0, transform: "translateX(" + dir * 28 + "px)" },
            { opacity: 1, transform: "none" },
          ],
          { duration: 360, easing: EASE }
        );
        cap.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 360, easing: EASE });
      }
    }

    links.forEach(function (a, i) {
      a.addEventListener("click", function (e) {
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
        e.preventDefault();
        open(i);
      });
    });
    closeBtn.addEventListener("click", close);
    prevBtn.addEventListener("click", function () {
      step(-1);
    });
    nextBtn.addEventListener("click", function () {
      step(1);
    });

    /* a tap anywhere else closes; a horizontal swipe steps instead */
    var x0 = null;
    var y0 = 0;
    var swiped = false;
    fv.addEventListener("pointerdown", function (e) {
      x0 = e.clientX;
      y0 = e.clientY;
      swiped = false;
    });
    fv.addEventListener("pointerup", function (e) {
      if (x0 === null) return;
      var dx = e.clientX - x0;
      var dy = e.clientY - y0;
      x0 = null;
      if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.4) {
        swiped = true;
        step(dx < 0 ? 1 : -1);
      }
    });
    fv.addEventListener("click", function (e) {
      if (swiped) {
        swiped = false;
        return;
      }
      if (e.target.closest("button") || e.target.closest(".fv-cap")) return;
      close();
    });

    document.addEventListener("keydown", function (e) {
      if (fv.hidden) return;
      if (e.key === "Escape") close();
      else if (e.key === "ArrowLeft") step(-1);
      else if (e.key === "ArrowRight") step(1);
      else if (e.key === "Tab") {
        var stops = [closeBtn, prevBtn, nextBtn].filter(function (b) {
          return !b.disabled && getComputedStyle(b).display !== "none";
        });
        var at = stops.indexOf(document.activeElement);
        var n = (at + (e.shiftKey ? -1 : 1) + stops.length) % stops.length;
        stops[n].focus();
      } else return;
      e.preventDefault();
    });
  }

  /* ---------- in-page links in the paper header glide instead of jumping ---------- */
  function initAnchors() {
    document.querySelectorAll('.paper-buttons a[href^="#"]').forEach(function (a) {
      a.addEventListener("click", function (e) {
        var target = document.querySelector(a.getAttribute("href"));
        if (!target) return;
        e.preventDefault();
        var isVideo = target.id === "video";
        target.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: isVideo ? "center" : "start" });
        history.replaceState(null, "", a.getAttribute("href"));
        var c = isVideo && target.querySelector(".vp-cover");
        if (c) c.focus({ preventScroll: true });
      });
    });
  }

  function init() {
    document.querySelectorAll("[data-player]").forEach(initPlayer);
    initFigures();
    initAnchors();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();

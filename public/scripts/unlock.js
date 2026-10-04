/* Password-protected project pages: decrypts ciphertext written by
   scripts/encrypt-protected.mjs, entirely in the browser (WebCrypto). */
(function () {
  "use strict";
  var root = document.getElementById("locked");
  var out = document.getElementById("unlocked");
  if (!root || !out || !window.crypto || !crypto.subtle) return;

  var base = root.dataset.base;
  var form = document.getElementById("unlock-form");
  var input = document.getElementById("unlock-pw");
  var status = document.getElementById("unlock-status");
  var storeKey = "unlock:" + base;
  var key = null;
  var manifest = null;

  function b64(s) {
    return Uint8Array.from(atob(s), function (c) {
      return c.charCodeAt(0);
    });
  }

  function getManifest() {
    if (manifest) return Promise.resolve(manifest);
    return fetch(base + "manifest.json", { cache: "no-cache" })
      .then(function (r) {
        if (!r.ok) throw new Error("manifest " + r.status);
        return r.json();
      })
      .then(function (m) {
        return (manifest = m);
      });
  }

  function deriveKey(pw, m) {
    return crypto.subtle
      .importKey("raw", new TextEncoder().encode(pw), "PBKDF2", false, ["deriveKey"])
      .then(function (k) {
        return crypto.subtle.deriveKey(
          { name: "PBKDF2", salt: b64(m.salt), iterations: m.iterations, hash: "SHA-256" },
          k,
          { name: "AES-GCM", length: 256 },
          false,
          ["decrypt"]
        );
      });
  }

  /* fetch with optional progress callback (0..1) */
  function fetchBuf(url, onProgress) {
    return fetch(url).then(function (r) {
      if (!r.ok) throw new Error(url + " " + r.status);
      var total = +r.headers.get("content-length") || 0;
      if (!onProgress || !total || !r.body) return r.arrayBuffer();
      var reader = r.body.getReader();
      var chunks = [];
      var got = 0;
      function pump() {
        return reader.read().then(function (res) {
          if (res.done) {
            var buf = new Uint8Array(got);
            var o = 0;
            chunks.forEach(function (c) {
              buf.set(c, o);
              o += c.length;
            });
            return buf.buffer;
          }
          chunks.push(res.value);
          got += res.value.length;
          onProgress(got / total);
          return pump();
        });
      }
      return pump();
    });
  }

  function open(id, type, onProgress) {
    return fetchBuf(base + id + ".bin", onProgress)
      .then(function (buf) {
        return crypto.subtle.decrypt({ name: "AES-GCM", iv: buf.slice(0, 12) }, key, buf.slice(12));
      })
      .then(function (plain) {
        return URL.createObjectURL(new Blob([plain], { type: type }));
      });
  }

  function wireAssets() {
    out.querySelectorAll("[data-asset]").forEach(function (el) {
      open(el.dataset.asset, el.dataset.typeAsset).then(function (url) {
        el.src = url;
        if (el.tagName === "SOURCE" && el.parentElement.load) el.parentElement.load();
      });
    });
    out.querySelectorAll("[data-poster-asset]").forEach(function (el) {
      open(el.dataset.posterAsset, el.dataset.typePosterAsset).then(function (url) {
        el.poster = url;
      });
    });
    out.querySelectorAll("video[data-lazy-asset]").forEach(function (video) {
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "pvideo-load";
      btn.textContent = "▶ " + (video.dataset.label || "play");
      video.insertAdjacentElement("afterend", btn);
      btn.addEventListener("click", function () {
        btn.disabled = true;
        btn.textContent = "decrypting…";
        open(video.dataset.lazyAsset, video.dataset.typeLazyAsset, function (p) {
          btn.textContent = "decrypting… " + Math.round(p * 100) + "%";
        })
          .then(function (url) {
            video.src = url;
            btn.remove();
            video.play();
          })
          .catch(function () {
            btn.disabled = false;
            btn.textContent = "failed — retry";
          });
      });
    });
  }

  function unlock(pw) {
    status.textContent = "checking…";
    return getManifest()
      .then(function (m) {
        return deriveKey(pw, m);
      })
      .then(function (k) {
        key = k;
        return fetchBuf(base + manifest.content + ".bin");
      })
      .then(function (buf) {
        return crypto.subtle
          .decrypt({ name: "AES-GCM", iv: buf.slice(0, 12) }, key, buf.slice(12))
          .catch(function () {
            throw new Error("wrong password");
          });
      })
      .then(function (plain) {
        out.innerHTML = new TextDecoder().decode(plain);
        out.hidden = false;
        root.hidden = true;
        try {
          sessionStorage.setItem(storeKey, pw);
        } catch (e) {}
        wireAssets();
      })
      .catch(function (e) {
        key = null;
        status.textContent = e.message === "wrong password" ? "wrong password." : "could not load — try again.";
        try {
          sessionStorage.removeItem(storeKey);
        } catch (e2) {}
      });
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    unlock(input.value);
  });

  try {
    var saved = sessionStorage.getItem(storeKey);
    if (saved) unlock(saved);
  } catch (e) {}
})();

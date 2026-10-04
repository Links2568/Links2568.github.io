#!/usr/bin/env node
/**
 * Encrypt a password-protected project page.
 *
 *   node scripts/encrypt-protected.mjs <slug>
 *
 * Reads plaintext from  private-media/<slug>/   (gitignored — never committed):
 *   content.html   the page body; reference media files by filename via
 *                  data-asset="x.webp"        → <img>/<track> src, decrypted on unlock
 *                  data-poster-asset="x.webp" → <video> poster, decrypted on unlock
 *                  data-lazy-asset="x.mp4"    → <video> src, decrypted when "play" is pressed
 *   .password      the password (one line). Or set PROTECT_PASSWORD instead.
 *
 * Writes ciphertext to  public/protected/<slug>/   (safe to commit):
 *   manifest.json  { v, kdf params, salt, content id }
 *   <id>.bin       12-byte IV || AES-256-GCM ciphertext || 16-byte tag
 *
 * Key = PBKDF2-SHA256(password, random salt, 600k iterations). Every run uses a
 * fresh salt and fresh file ids, so re-running (e.g. with a new password) fully
 * replaces the previous output. Decryption happens in public/scripts/unlock.js.
 */
import { pbkdf2Sync, randomBytes, createCipheriv } from "node:crypto";
import { readFileSync, writeFileSync, mkdirSync, readdirSync, rmSync, existsSync } from "node:fs";
import { join, extname } from "node:path";

const slug = process.argv[2];
if (!slug) {
  console.error("usage: node scripts/encrypt-protected.mjs <slug>");
  process.exit(1);
}
const src = join("private-media", slug);
const out = join("public", "protected", slug);

let password = process.env.PROTECT_PASSWORD;
if (!password && existsSync(join(src, ".password"))) {
  password = readFileSync(join(src, ".password"), "utf8").trim();
}
if (!password) {
  console.error(`no password: set PROTECT_PASSWORD or create ${join(src, ".password")}`);
  process.exit(1);
}

const MIME = {
  ".mp4": "video/mp4",
  ".webp": "image/webp",
  ".jpg": "image/jpeg",
  ".png": "image/png",
  ".vtt": "text/vtt",
};

const ITER = 600_000;
const salt = randomBytes(16);
const key = pbkdf2Sync(password, salt, ITER, 32, "sha256");

function seal(buf) {
  const iv = randomBytes(12);
  const c = createCipheriv("aes-256-gcm", key, iv);
  const ct = Buffer.concat([c.update(buf), c.final()]);
  return Buffer.concat([iv, ct, c.getAuthTag()]);
}

// fresh output dir
if (existsSync(out)) for (const f of readdirSync(out)) rmSync(join(out, f));
mkdirSync(out, { recursive: true });

let html = readFileSync(join(src, "content.html"), "utf8");
const ids = new Map(); // filename -> opaque id

html = html.replace(/data-(asset|poster-asset|lazy-asset)="([^"]+)"/g, (_, kind, file) => {
  if (!ids.has(file)) {
    const ext = extname(file).toLowerCase();
    if (!MIME[ext]) throw new Error(`unsupported asset type: ${file}`);
    const id = randomBytes(6).toString("hex");
    writeFileSync(join(out, `${id}.bin`), seal(readFileSync(join(src, file))));
    ids.set(file, { id, type: MIME[ext] });
  }
  const { id, type } = ids.get(file);
  return `data-${kind}="${id}" data-type-${kind}="${type}"`;
});

const contentId = randomBytes(6).toString("hex");
writeFileSync(join(out, `${contentId}.bin`), seal(Buffer.from(html, "utf8")));

writeFileSync(
  join(out, "manifest.json"),
  JSON.stringify(
    { v: 1, kdf: "PBKDF2-SHA256", iterations: ITER, salt: salt.toString("base64"), content: contentId },
    null,
    1
  ) + "\n"
);

console.log(`encrypted ${ids.size} assets + content → ${out}/`);

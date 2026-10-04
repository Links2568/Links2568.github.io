import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";

/**
 * Cache-busting URL for a file in public/: appends ?v=<content hash>.
 * Cloudflare tells browsers to cache static files for 4 hours, so a file
 * replaced under the same name (CV, site scripts) would otherwise stay stale.
 * Runs at build time only.
 */
export function asset(path: string): string {
  const hash = createHash("sha1").update(readFileSync(`public${path}`)).digest("hex").slice(0, 8);
  return `${path}?v=${hash}`;
}

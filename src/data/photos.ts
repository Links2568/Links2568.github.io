/**
 * Gallery photo manifest.
 *
 * To add a photo:
 *   1. Drop the image file into  src/assets/gallery/   (jpg/jpeg/png/webp)
 *   2. Add an entry here, in the order you want it to appear.
 *
 * Astro optimizes every photo at build time (responsive WebP, lazy loading),
 * so drop in full-resolution files — originals are never shipped as-is.
 */
export type Photo = {
  file: string; // filename inside src/assets/gallery/
  alt: string; // short description (accessibility + SEO)
  caption?: string; // shown on hover and in the lightbox
  location?: string; // e.g. "Ann Arbor, MI"
  date?: string; // e.g. "2025.11"
  series?: string; // e.g. "weather" | "daily" | "street" — enables filters when 2+ series exist
};

export const photos: Photo[] = [
  // { file: "storm-front.jpg", alt: "Shelf cloud over a corn field", caption: "outflow ahead of the line", location: "Champaign, IL", date: "2024.04", series: "weather" },
];

# lzclink.com

Personal homepage of Zuchen Li — built with [Astro](https://astro.build), deployed to GitHub Pages.

Quiet-terminal design system: IBM Plex Mono/Sans, dark-first with a light theme toggle, and an
interactive synoptic-chart background (jet stream, pressure systems, isobars, tornado cursor).

## Develop

```sh
npm install
npm run dev        # http://localhost:4321
npm run build      # outputs to dist/
```

## Add a project

Create `src/content/projects/<slug>.md` with frontmatter (`title`, `tagline`, `period`, `tags`,
`order`, optional `cover`/`links`), write the body in Markdown, and drop media files into
`public/projects/<slug>/`. Images, GIFs, and `<video autoplay muted loop playsinline>` all work —
see the how-to comment in `optical-music-recognition.md`.

## Add gallery photos

Put images in `public/assets/img/gallery/` and add `masonry-item` entries in
`src/pages/gallery.astro`.

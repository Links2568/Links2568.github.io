# lzclink.com

Personal homepage of Zuchen Li — built with [Astro](https://astro.build), deployed to GitHub Pages.

Plain academic design: IBM Plex Mono for headings, IBM Plex Sans for prose, light-first with a
dark theme toggle. No animations.

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

1. Drop the image (full resolution is fine) into `src/assets/gallery/`.
2. Add an entry to `src/data/photos.ts` — alt text required; caption, location,
   date, and series optional. Astro generates responsive WebP at build time.

Series filters appear automatically once photos span 2+ series.

## Write a blog post

Create `src/content/blog/<slug>.md` with frontmatter (`title`, `description`,
`date`, optional `tags`), write Markdown. The index, RSS feed (`/rss.xml`),
reading time, and prev/next links are generated automatically.

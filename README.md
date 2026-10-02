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

## Add a demo video

Put the file in `public/projects/<slug>/` and use one of the three snippets from the
how-to comment in `magicbaton.md` (silent loop / controls+poster / YouTube embed).
Encode with ffmpeg before committing — GitHub rejects files over 100MB, and loops
should stay under ~8MB:

```sh
# 10-15s silent loop (GIF replacement)
ffmpeg -i raw.mov -an -vf "scale=1280:-2,fps=30" -c:v libx264 -crf 26 \
  -preset slow -pix_fmt yuv420p -movflags +faststart demo-loop.mp4

# full demo with audio
ffmpeg -i raw.mov -vf "scale=1920:-2" -c:v libx264 -crf 23 -preset slow \
  -pix_fmt yuv420p -c:a aac -b:a 128k -movflags +faststart demo.mp4

# poster frame at the 2s mark
ffmpeg -i demo.mp4 -ss 00:00:02 -frames:v 1 poster.jpg
```

`-movflags +faststart` matters: it moves the index to the front of the file so the
video starts playing before it finishes downloading. Demos longer than ~3 minutes or
bigger than ~40MB belong on YouTube (unlisted), embedded with the `.video-embed` snippet.

## Add gallery photos

1. Drop the image (full resolution is fine) into `src/assets/gallery/`.
2. Add an entry to `src/data/photos.ts` — alt text required; caption, location,
   date, and series optional. Astro generates responsive WebP at build time.

Series filters appear automatically once photos span 2+ series.

## Write a blog post

Create `src/content/blog/<slug>.md` with frontmatter (`title`, `description`,
`date`, optional `tags`), write Markdown. The index, RSS feed (`/rss.xml`),
reading time, and prev/next links are generated automatically.

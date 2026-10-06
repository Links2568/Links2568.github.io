import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const projects = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/projects" }),
  schema: z.object({
    title: z.string(),
    tagline: z.string(),
    period: z.string(),
    role: z.string().optional(),
    org: z.string().optional(),
    tags: z.array(z.string()).default([]),
    status: z.enum(["active", "done"]).default("active"),
    order: z.number().default(99),
    cover: z.string().optional(),
    links: z.array(z.object({ label: z.string(), url: z.string() })).default([]),
    draft: z.boolean().default(false),
    // research-project fields
    kind: z.enum(["research", "project"]).default("project"),
    fullTitle: z.string().optional(), // paper title
    venue: z.string().optional(),
    authors: z.string().optional(), // "A*, B*, C" — the site owner is bolded automatically
    thumb: z.string().optional(), // figure-tile image, 16:9
    themes: z.array(z.enum(["hai", "context", "sensing", "ai4sci"])).default([]),
    badges: z.array(z.string()).default([]), // venue/status chips, e.g. "MobiCom 2026 Demo"
    bibtex: z.string().optional(),
    abstract: z.string().optional(), // homepage card summary
    // password-protected: body/media live encrypted in public/protected/<slug>/
    protected: z.boolean().default(false),
    hero: z
      .object({ src: z.string(), poster: z.string(), width: z.number(), height: z.number() })
      .optional(),
    videos: z
      .array(
        z.object({
          label: z.string(),
          src: z.string(),
          poster: z.string(),
          duration: z.string(),
          width: z.number().default(1920),
          height: z.number().default(1080),
          captions: z
            .array(z.object({ lang: z.string(), label: z.string(), src: z.string() }))
            .default([]),
        })
      )
      .default([]),
    gallery: z
      .array(
        z.object({
          src: z.string(),
          alt: z.string(),
          width: z.number(),
          height: z.number(),
        })
      )
      .default([]),
  }),
});

const blog = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/blog" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
  }),
});

export const collections = { projects, blog };

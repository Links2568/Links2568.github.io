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
    // course and side projects: the exact course is the project's tag
    course: z.string().optional(), // e.g. "EECS 498"
    courseName: z.string().optional(), // e.g. "Machine Learning for Computational Sensors in Mobile/IoT Systems"
    built: z.array(z.string()).default([]), // what the project is made of, as short tags
    work: z.array(z.string()).default([]), // the kinds of work it involved
    skills: z.array(z.string()).default([]), // the knowledge, methods and tools it used
    links: z.array(z.object({ label: z.string(), url: z.string() })).default([]),
    draft: z.boolean().default(false),
    // research-project fields
    kind: z.enum(["research", "project"]).default("project"),
    fullTitle: z.string().optional(), // paper title
    shortTitle: z.string().optional(), // for tight one-line lists
    venue: z.string().optional(),
    authors: z.string().optional(), // "A*, B*, C" — the site owner is bolded automatically
    thumb: z.string().optional(), // figure-tile image, 16:9
    themes: z.array(z.enum(["hai", "context", "sensing", "ai4sci"])).default([]),
    badges: z.array(z.string()).default([]), // venue/status chips, e.g. "MobiCom 2026 Demo"
    bibtex: z.string().optional(),
    abstract: z.string().optional(), // homepage card summary
    // password-protected: body/media live encrypted in public/protected/<slug>/
    protected: z.boolean().default(false),
    // a static Figure 1 (e.g. the paper's teaser); shown instead of the hero loop on the project page
    teaser: z
      .object({ src: z.string(), width: z.number(), height: z.number(), caption: z.string() })
      .optional(),
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
          wide: z.boolean().default(false), // spans the whole figure grid on the project page
        })
      )
      .default([]),
  }),
});

export const collections = { projects };

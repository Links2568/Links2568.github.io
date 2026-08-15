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
  }),
});

export const collections = { projects };

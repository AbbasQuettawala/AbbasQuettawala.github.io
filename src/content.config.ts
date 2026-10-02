import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';

const projects = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    subtitle: z.string(),
    summary: z.string(),
    order: z.number(),
    category: z.enum(['Robotics', 'AI/software']),
    organisation: z.string(),
    role: z.string(),
    status: z.string(),
    tags: z.array(z.string()),
    illustration: z.enum(['waddle', 'arms', 'manumentor', 'hollow-knight']),
    media: z.array(z.object({
      type: z.enum(['image', 'video']),
      src: z.string(),
      alt: z.string(),
      caption: z.string(),
      poster: z.string().optional(),
      captions: z.string().optional(),
    })).default([]),
  }),
});
export const collections = { projects };

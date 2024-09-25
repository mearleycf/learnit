import { defineCollection, z } from 'astro:content'
import { glob, file } from 'astro/loaders'

// define a schema for common fields across all collections
const commonFields = {
  title: z.string(),
  description: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
}

const courseCollection = defineCollection({
  loader: glob({ pattern: 'courses/*.md' }),
  schema: z.object({
    ...commonFields,
    slug: z.string(),
    language: z.enum(['python', 'javascript', 'typescript', 'react']),
    level: z.enum(['beginner', 'intermediate', 'advanced']),
    tags: z.array(z.string()),
    price: z.number(),
    isFeatured: z.boolean().optional(),
  }),
})

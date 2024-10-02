import { defineCollection, z } from 'astro:content'
import fs from 'fs/promises'
import path from 'path'

// define a schema for common fields across all collections
const commonFields = {
  title: z.string(),
  description: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
}

const courseCollection = defineCollection({
  type: 'content',
  schema: z.object({
    ...commonFields,
    slug: z.string(),
    language: z.enum(['python', 'javascript', 'typescript', 'react']),
    level: z.enum(['beginner', 'intermediate', 'advanced']),
    tags: z.array(z.string()),
    price: z.number(),
    isFeatured: z.boolean().optional(),
  }),
  loader: async () => {
    const coursesDir = path.join(process.cwd(), 'src/content/courses')
    const courseFiles = await fs.readdir(coursesDir)
    return Promise.all(
      courseFiles.map(async file => {
        const content = await fs.readFile(path.join(coursesDir, file), 'utf-8')
        return { id: path.parse(file).name, content }
      }),
    )
  },
})

const chapterCollection = defineCollection({
  type: 'content',
  schema: z.object({
    ...commonFields,
    courseId: z.string(),
    order: z.number(),
    content: z.string(),
  }),
})

const exerciseCollection = defineCollection({
  type: 'content',
  schema: z.object({
    ...commonFields,
    chapterId: z.string(),
    order: z.number(),
    initialCode: z.string(),
    solution: z.string(),
    tests: z.array(
      z.object({
        name: z.string(),
        test: z.string(),
      }),
    ),
  }),
})

export const collections = {
  courses: courseCollection,
  chapters: chapterCollection,
  exercises: exerciseCollection,
}

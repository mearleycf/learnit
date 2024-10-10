import { defineCollection, z } from 'astro:content'

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
    language: z.enum(['python', 'javascript', 'typescript', 'react']),
    level: z.enum(['beginner', 'intermediate', 'advanced']),
    tags: z.array(z.string()),
    price: z.number(),
    isFeatured: z.boolean().optional(),
  }),
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

const userCollection = defineCollection({
  type: 'data',
  schema: z.object({
    id: z.string(),
    name: z.string(),
    email: z.string().email(),
    role: z.enum(['student', 'instructor', 'admin']),
    enrolledCourses: z.array(z.string()),
    progress: z.record(z.string(), z.number()),
  }),
})

const feedbackCollection = defineCollection({
  type: 'content',
  schema: z.object({
    ...commonFields,
    userId: z.string(),
    contentId: z.string(),
    contentType: z.enum(['course', 'chapter', 'exercise']),
    rating: z.number().min(1).max(5).optional(),
    status: z.enum(['open', 'in-progress', 'resolved']),
  }),
})

const noteCollection = defineCollection({
  type: 'content',
  schema: z.object({
    ...commonFields,
    userId: z.string(),
    contentId: z.string(),
    contentType: z.enum(['chapter', 'exercise']),
    highlightedText: z.string().optional(),
    noteText: z.string(),
  }),
})

export const collections = {
  courses: courseCollection,
  chapters: chapterCollection,
  exercises: exerciseCollection,
  users: userCollection,
  feedback: feedbackCollection,
  notes: noteCollection,
}

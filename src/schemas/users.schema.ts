import { z } from 'zod'

export const userSchema = z.object({
  id: z.string().ulid(),
  first_name: z.string(),
  last_name: z.string(),
  email: z.string().email(),
  avatar_url: z.string().url().optional(),
  role: z.enum(['student', 'author', 'course_admin', 'app_admin']),
  enrolled_courses: z.array(z.string().ulid()).optional().default([]),
  assigned_courses: z.array(z.string().ulid()).optional().default([]),
  auth_provider: z.string().optional(),
  auth_provider_id: z.string().optional(),
  github_username: z.string().optional(),
  google_id: z.string().optional(),
  gitlab_username: z.string().optional(),
  bitbucket_username: z.string().optional(),
  last_sign_in: z.date().optional(),
  created_at: z.date(),
  updated_at: z.date(),
})

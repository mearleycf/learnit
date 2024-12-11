import {
  courseSchema,
  chapterSchema,
  sectionSchema,
  exerciseSchema,
  noteSchema,
  feedbackSchema,
  userSchema,
  studentProgressSchema,
  studentExerciseProgressSchema,
} from '@schemas/index'
import { z } from 'zod'

// Export inferred types from schemas
export type Course = z.infer<typeof courseSchema>
export type Chapter = z.infer<typeof chapterSchema>
export type Section = z.infer<typeof sectionSchema>
export type Exercise = z.infer<typeof exerciseSchema>
export type Note = z.infer<typeof noteSchema>
export type Feedback = z.infer<typeof feedbackSchema>
export type User = z.infer<typeof userSchema>
export type StudentProgress = z.infer<typeof studentProgressSchema>
export type StudentExerciseProgress = z.infer<typeof studentExerciseProgressSchema>

// Re-export common enums used across schemas
export type CourseLevel = z.infer<typeof courseSchema.shape.level>
export type SectionContentType = z.infer<typeof sectionSchema.shape.content_type>
export type SectionAccessLevel = z.infer<typeof sectionSchema.shape.access_level>
export type ExerciseDifficulty = z.infer<typeof exerciseSchema.shape.difficulty>
export type FeedbackStatus = z.infer<typeof feedbackSchema.shape.status>
export type FeedbackCategory = z.infer<typeof feedbackSchema.shape.category>
export type UserRole = z.infer<typeof userSchema.shape.role>

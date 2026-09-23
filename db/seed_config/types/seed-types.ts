import type { DateOptions } from '@utils/general_utils'

/**
 * Authoring shapes for seed data.
 *
 * These deliberately do NOT derive from the database row types. Seed files are
 * written by hand and omit anything the seeder can derive: parent foreign keys,
 * sort order, and timestamps. The previous versions of these types were
 * `Omit<Course, 'created_at' | 'updated_at'>` and friends, which demanded
 * columns the data never carried and produced most of the type-check failures.
 */
type BaseEntityConfig = {
  /**
   * Derived by the seeder from a natural key, never authored. Present only so
   * existing fixtures that still set it keep type-checking.
   */
  id?: string
  seedSequence: number
  /** Overrides the default date distribution for this entity. */
  dateConfig?: DateOptions
  /** Authoring note; ignored by the seeder. */
  comment?: string
}

export type CourseLevel = 'beginner' | 'intermediate' | 'advanced'
export type SectionContentType = 'lesson' | 'recap' | 'exercise'
export type SectionAccessLevel = 'purchased' | 'free'
export type ExerciseDifficulty = 'easy' | 'medium' | 'hard'

export type ExerciseConfig = BaseEntityConfig & {
  exercise_display_number: number
  instructions: string
  /** Markup for the live preview. Omitted by exercises that are pure logic. */
  browser_html?: unknown
  code_files: unknown
  tests: unknown
  hints: unknown
  /** `null` means "let the seeder pick"; resolved before insert. */
  difficulty: ExerciseDifficulty | null
  default_solution: unknown
  student_solution: unknown
  estimated_time_minutes: number
}

export type SectionConfig = BaseEntityConfig & {
  title: string
  description: string
  section_display_number: number
  content_type: SectionContentType
  content?: unknown
  access_level: SectionAccessLevel
  exercise?: ExerciseConfig
}

export type ChapterConfig = BaseEntityConfig & {
  title: string
  description: string
  chapter_display_number: number
  /** Human-authored duration such as "3 hours"; parsed to minutes on insert. */
  estimated_time?: string
  estimated_time_minutes?: number
  sections: SectionConfig[]
}

export type CourseConfig = BaseEntityConfig & {
  title: string
  description: string
  slug: string
  subject_area: string
  level: CourseLevel
  tags: string[]
  price?: number | null
  purchase_active_length?: number | null
  chapters: ChapterConfig[]
}

export type CourseSeedData = {
  courses: CourseConfig[]
}

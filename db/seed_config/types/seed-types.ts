import type { DateOptions } from '@utils/general_utils'

type BaseEntityConfig = {
  id: string
  seedSequence: number
  dateConfig: DateOptions
  comment?: string
}

export type CourseLevel = 'beginner' | 'intermediate' | 'advanced'
export type SectionContentType = 'lesson' | 'exercise' | 'recap'
export type SectionAccessLevel = 'purchased' | 'free'
export type ExerciseDifficulty = 'beginner' | 'intermediate' | 'advanced' | null
export type FeedbackStatus = 'submitted' | 'pending' | 'in_progress' | 'resolved' | 'no_action_required'
export type FeedbackCategory =
  | 'incorrect_content'
  | 'general_feedback'
  | 'technical_issue'
  | 'feature_request'
  | 'clarity_improvement'
  | 'typo_or_grammar'
export type UserRole = 'student' | 'author' | 'course_admin' | 'app_admin'

export type CourseConfig = BaseEntityConfig & {
  title: string
  description: string
  slug: string
  subject_area: string
  level: CourseLevel
  tags: string[]
  price: number | null
  purchase_active_length: number | null
  chapters: ChapterConfig[]
}

export type ChapterConfig = BaseEntityConfig & {
  title: string
  description: string
  chapter_display_number: number
  estimated_time: string
  sections: SectionConfig[]
}

export type SectionConfig = BaseEntityConfig & {
  title: string
  description: string
  section_display_number: number
  content_type: SectionContentType
  content: Record<string, string> | null
  access_level: SectionAccessLevel
  exercise: ExerciseConfig
}

export type ExerciseConfig = BaseEntityConfig & {
  instructions: string
  exercise_display_number: number
  browser_html: Record<string, string>
  code_files: Record<string, string>
  tests: Record<string, string>
  hints: Record<string, string>
  difficulty: ExerciseDifficulty
  default_solution: Record<string, string>
  student_solution: Record<string, string>
  estimated_time_minutes: number
}

export type FeedbackConfig = BaseEntityConfig & {
  student_id: string
  section_id: string
  assigned_to_id: string | null
  feedback_text: Record<string, string>
  rating: number | null
  status: FeedbackStatus
  category: FeedbackCategory | null
  admin_notes: string | null
  github_issue_link: string | null
}

export type NoteConfig = BaseEntityConfig & {
  student_id: string
  section_id: string
  note_text: Record<string, string>
  highlighted_text: Record<string, string>
}

export type StudentExerciseProgressConfig = BaseEntityConfig & {
  student_id: string
  exercise_id: string
  score: number
  completed: boolean
  attempts: number
  last_attempt_date: Date
}

export type StudentProgressConfig = BaseEntityConfig & {
  student_id: string
  course_id: string
  current_section_id: string | null
  completed_sections: string[]
  last_accessed_at: Date | null
  enrollment_date: Date
  purchase_date: Date | null
  expiration_date: Date | null
}

export type UsersConfig = BaseEntityConfig & {
  name: string
  email: string
  role: UserRole
  enrolled_courses: string[]
  assigned_courses: string[]
  auth_provider: string | null
  auth_provider_id: string | null
  github_username: string | null
  google_id: string | null
  gitlab_username: string | null
  bitbucket_username: string | null
  last_sign_in: Date | null
}

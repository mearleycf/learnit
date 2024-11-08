import type { DateOptions } from '@utils/general_utils'
import type { SeedingError } from './seed-error-types'
import type { LogInfo } from '@utils/logger'

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

export type SeededCourse = {
  id: string
  createdAt: Date
  updatedAt: Date | null
}

type BaseTimestamps = {
  stateStarted: Date
  stateEnded: Date | null
}

type BaseState = {
  timestamps: BaseTimestamps
}

type DataState<T> = BaseState & {
  dataSet: T[]
}

type FailureState<T> = BaseState & {
  error: SeedingError
  lastValidState: SeederState<T>
}

export type SeederState<T> =
  | (BaseState & { status: 'notStarted' })
  | (DataState<T> & { status: 'buildingData' | 'builtData'; rowsBuilt: number })
  | (DataState<T> & { status: 'insertingData' | 'insertedData'; rowsInserted: number })
  | (DataState<T> & { status: 'returningData' | 'returnedData'; rowsReturned: number })
  | (BaseState & { status: 'loggingResult' | 'loggedResult' })
  | (FailureState<T> & { status: 'failing' | 'failed'; phase: 'building' | 'inserting' | 'returning' | 'logging' })
  | (BaseState & { status: 'seederCompleted'; lastValidState: SeederState<T> })

export type ValidationResult = {
  isValid: boolean
  error?: string
}

type BaseEvent = {
  timestamps: BaseTimestamps
  logInfo: LogInfo
}

type SeederEventType =
  | 'START_BUILD'
  | 'BUILD_COMPLETE'
  | 'START_INSERT'
  | 'INSERT_COMPLETE'
  | 'START_RETURN'
  | 'RETURN_COMPLETE'
  | 'START_LOG'
  | 'LOG_COMPLETE'
  | 'FAILED'
type SeederPhase = 'building' | 'inserting' | 'returning' | 'logging'

export type SeederEvent =
  | (BaseEvent & { type: SeederEventType; phase: SeederPhase })
  | (BaseEvent & { type: SeederEventType; phase: SeederPhase; error: SeedingError })

export type Transition<T> = {
  from: SeederState<T>
  to: SeederState<T>
  event: SeederEvent
  validation?: ValidationResult
}

export type StateTransitionMap<T> = {
  [K in SeederState<T>['status']]: {
    [E in SeederEventType]: (state: Extract<SeederState<T>, { status: K }>, event: SeederEvent) => SeederState<T>
  }
}

export const isBuildingState = <T>(
  state: SeederState<T>,
): state is DataState<T> & {
  status: 'buildingData' | 'builtData'
  rowsBuilt: number
} => {
  return ['buildingData', 'builtData'].includes(state.status)
}

export const isInsertingState = <T>(
  state: SeederState<T>,
): state is DataState<T> & {
  status: 'insertingData' | 'insertedData'
  rowsInserted: number
} => {
  return ['insertingData', 'insertedData'].includes(state.status)
}

export const isReturningState = <T>(
  state: SeederState<T>,
): state is DataState<T> & {
  status: 'returningData' | 'returnedData'
  rowsReturned: number
} => {
  return ['returningData', 'returnedData'].includes(state.status)
}

export const isLoggingState = <T>(
  state: SeederState<T>,
): state is BaseState & {
  status: 'loggingResult' | 'loggedResult'
} => {
  return ['loggingResult', 'loggedResult'].includes(state.status)
}

export const isFailingState = <T>(
  state: SeederState<T>,
): state is FailureState<T> & {
  status: 'failing' | 'failed'
  phase: 'building' | 'inserting' | 'returning' | 'logging'
} => {
  return ['failing', 'failed'].includes(state.status)
}

export const isCompletedState = <T>(
  state: SeederState<T>,
): state is BaseState & {
  status: 'seederCompleted'
  lastValidState: SeederState<T>
} => {
  return state.status === 'seederCompleted'
}

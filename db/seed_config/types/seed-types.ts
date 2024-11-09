import type {
  Course,
  Chapter,
  Section,
  Exercise,
  Note,
  Feedback,
  User,
  StudentProgress,
  StudentExerciseProgress,
} from '@schemas/schema-types'
import type { DateOptions } from '@utils/general_utils'
import type { SeedingError } from './seed-error-types'
import type { LogInfo } from '@utils/logger'
import { z } from 'zod'

// Base config type that all seeder configs extend
type BaseEntityConfig = {
  id: string
  seedSequence: number
  dateConfig: DateOptions
  comment?: string
}

// Config types extend the base schema types with seeder-specific fields
export type CourseConfig = BaseEntityConfig &
  Omit<Course, 'created_at' | 'updated_at'> & {
    chapters: ChapterConfig[]
  }

export type ChapterConfig = BaseEntityConfig &
  Omit<Chapter, 'created_at' | 'updated_at'> & {
    sections: SectionConfig[]
  }

export type SectionConfig = BaseEntityConfig &
  Omit<Section, 'created_at' | 'updated_at'> & {
    exercise: ExerciseConfig
  }

export type ExerciseConfig = BaseEntityConfig & Omit<Exercise, 'created_at' | 'updated_at'>

export type FeedbackConfig = BaseEntityConfig & Omit<Feedback, 'created_at' | 'updated_at'>

export type NoteConfig = BaseEntityConfig & Omit<Note, 'created_at' | 'updated_at'>

export type StudentExerciseProgressConfig = BaseEntityConfig &
  Omit<StudentExerciseProgress, 'created_at' | 'updated_at'>

export type StudentProgressConfig = BaseEntityConfig & Omit<StudentProgress, 'created_at' | 'updated_at'>

export type UsersConfig = BaseEntityConfig & Omit<User, 'created_at' | 'updated_at'>

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
  dataSet?: T[]
}

type FailureState<T> = BaseState & {
  error?: SeedingError
  lastValidState?: SeederState<T>
}

export type SeederState<T> = BaseState &
  DataState<T> &
  FailureState<T> & {
    status:
      | 'notStarted'
      | 'buildingData'
      | 'builtData'
      | 'insertingData'
      | 'insertedData'
      | 'returningData'
      | 'returnedData'
      | 'loggingResult'
      | 'loggedResult'
      | 'failing'
      | 'failed'
      | 'seederCompleted'
    rowsBuilt?: number
    rowsInserted?: number
    rowsReturned?: number
    phase?: 'building' | 'inserting' | 'returning' | 'logging' | 'completed'
    lastValidState?: SeederState<T>
  }

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
  | 'START_FAIL'
  | 'FAIL_COMPLETE'
  | 'SEEDER_COMPLETE'
export type SeederPhase = 'building' | 'inserting' | 'returning' | 'logging' | 'completed'

export type SeederEvent = BaseEvent & { type: SeederEventType; phase: SeederPhase; error?: SeedingError }

export type Transition<T> = {
  from: SeederState<T>
  to: SeederState<T>
  event: SeederEvent
  validation?: ValidationResult
}

// transition function helper type
export type TransitionFunction<T, S extends SeederState<T>['status']> = (
  state: Extract<SeederState<T>, { status: S }>,
  event: SeederEvent,
) => SeederState<T>

export type StateTransitionMap<T> = {
  [S in SeederState<T>['status']]: {
    [E in SeederEventType]: TransitionFunction<T, S>
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

// Add this type to seed-types.ts
export type StateHistoryEntry = {
  status: SeederState<any>['status']
  stateStarted: Date
  stateEnded: Date | null
}

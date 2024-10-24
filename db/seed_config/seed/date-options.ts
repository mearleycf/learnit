import type { DateOptions } from '@utils/general_utils'

export const courseDateOptions = {
    courses: {
      start: 720, // courses created between 720 and 365 days ago
      end: 365,
      includeUpdated: true,
      chanceOfUpdate: 1, // courses always have an update date
    } as DateOptions,
    chapters: {
      // start relative to parent course start
      end: 182,
      includeUpdated: true,
      chanceOfUpdate: 0.8,
    } as DateOptions,
    sections: {
      // will be relative to parent chapter start
      end: 182,
      includeUpdated: true,
      chanceOfUpdate: 0.8,
    } as DateOptions,
    exercises: {
      // will be relative to parent section start
      end: 182,
      includeUpdated: true,
      chanceOfUpdate: 0.8,
    } as DateOptions,
    users: {
      start: 719,
      end: 14,
      includeUpdated: true,
      chanceOfUpdate: 0.5,
    } as DateOptions,
    feedback: {
      // start will be relative to parent student start
      end: 0,
      includeUpdated: true,
      chanceOfUpdate: 0.7,
    } as DateOptions,
    notes: {
      // start will be relative to parent student start
      end: 0,
      includeUpdated: true,
      chanceOfUpdate: 0.7,
    } as DateOptions,
    studentExerciseProgress: {
      // start will be relative to parent student start and exercise start
      end: 0,
      includeUpdated: true,
      chanceOfUpdate: 0.7,
    } as DateOptions,
    studentProgress: {
      // start will be relative to parent student start and course start
      end: 0,
      includeUpdated: true,
      chanceOfUpdate: 0.7,
    },
  }

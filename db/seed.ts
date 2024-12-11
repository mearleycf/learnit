import {
  db,
  Courses,
  Chapters,
  Sections,
  Exercises,
  Users,
  Feedback,
  Notes,
  Student_Progress,
  Student_Exercise_Progress,
} from 'astro:db'
import { Effect, Console, pipe } from 'effect'
import { seeders } from './seederFiles'

// Main seeding program using Effect
const runSeed = Effect.gen(function* () {
  yield* Console.log('Starting seed process...')

  // Clear existing data
  yield* Effect.tryPromise(() =>
    Promise.all([
      db.delete(Courses),
      db.delete(Chapters),
      db.delete(Sections),
      db.delete(Exercises),
      db.delete(Users),
      db.delete(Feedback),
      db.delete(Notes),
      db.delete(Student_Progress),
      db.delete(Student_Exercise_Progress),
    ]),
  )

  yield* Console.log('Existing data cleared.')

  // Seed each table in order
  yield* Effect.tryPromise(() => seeders.seedCourses())

  yield* Console.log('Seed process completed successfully')
})

// Run the program
export const seedDb = async () => {
  Effect.runPromise(pipe(runSeed, Effect.withLogSpan('Database Seeding')))
}

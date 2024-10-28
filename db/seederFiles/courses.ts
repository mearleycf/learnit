import type { SeededCourse } from '@db/seed_config/types/seed-success-types'
import { courseData as data } from '@db/seed_config/seed/courses/index'
import { SeedingError } from '@db/seed_config/types/seed-error-types'
import type { CourseConfig } from '@db/seed_config/types/seed-types'
import { randomDateGenerator } from '@utils/general_utils'
import { logWithContext } from '@utils/logger'
import { LoggerLive } from '@utils/logger'
import { db, Courses } from 'astro:db'
import { Effect } from 'effect'

const componentName = 'CourseSeeder'

// Helper to insert a single course
const insertCourse = (course: CourseConfig): Effect.Effect<SeededCourse, SeedingError, never> => {
  return Effect.gen(function* () {
    yield* logWithContext(componentName, `Starting to insert course: ${course.title}`, 'Info', {
      courseId: course.id,
    })

    try {
      const { createdDate, updatedDate } = randomDateGenerator(course.dateConfig)

      const courseData = {
        id: course.id,
        title: course.title,
        description: course.description,
        slug: course.slug,
        subject_area: course.subject_area,
        level: course.level,
        tags: JSON.stringify(course.tags),
        price: course.price,
        purchase_active_length: course.purchase_active_length,
        created_at: createdDate,
        updated_at: updatedDate || undefined,
      }

      yield* Effect.tryPromise(() => db.insert(Courses).values(courseData)).pipe(
        Effect.mapError(
          error =>
            new SeedingError(error, {
              table: 'courses',
              operation: 'insert',
              id: course.id,
            }),
        ),
      )

      yield* logWithContext(componentName, `Successfully inserted course: ${course.title}`, 'Info', {
        courseId: course.id,
      })

      return {
        id: course.id,
        createdAt: createdDate,
        updatedAt: updatedDate,
        title: course.title,
        seedSequence: course.seedSequence,
        dateConfig: {
          createdAt: createdDate,
          updatedAt: updatedDate,
        },
      }
    } catch (error) {
      yield* logWithContext(componentName, `Failed to insert course: ${course.title}`, 'Error', {
        courseId: course.id,
        error: error instanceof Error ? error.message : 'Unknown error',
      })

      throw new SeedingError(error, {
        table: 'courses',
        operation: 'insert',
        id: course.id,
      })
    }
  })
}

// main seeding function
export const seedCourses = (): Promise<SeededCourse[]> => {
  return Effect.runPromise(
    Effect.gen(function* () {
      yield* logWithContext(componentName, 'Starting course seeding process...')

      const seededCourses = yield* Effect.forEach(data.courses, insertCourse, { concurrency: 'unbounded' })

      yield* logWithContext(componentName, 'Course seeding process complete.')
      return seededCourses
    }).pipe(Effect.provide(LoggerLive)),
  )
}

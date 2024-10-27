import {
    db,
    Courses,
  } from 'astro:db'
  import { randomDateGenerator } from '@utils/general_utils'
  import { courseData as data } from '@db/seed_config/seed/courses/index'
  import type { CourseConfig } from '@db/seed_config/types/seed-types'
  import { Effect, pipe, Console } from "effect"
  import { SeedingError } from '@db/seed_config/types/seed-error-types'
  import type { SeededCourse } from '@db/seed_config/types/seed-success-types'
  
  // Helper to insert a single course
  const insertCourse = (course: CourseConfig): Effect.Effect<SeededCourse, SeedingError, never> => {
    return Effect.tryPromise({
      try: async () => {
        const { createdDate, updatedDate } = randomDateGenerator(course.dateConfig);
        
        const courseData = {
          id: course.id,
          title: course.title,
          description: course.description,
          slug: course.slug,
          subject_area: course.subject_area,
          level: course.level,
          tags: course.tags,
          price: course.price,
          purchase_active_length: course.purchase_active_length,
          created_at: createdDate,
          updated_at: updatedDate || createdDate
        };
  
        await db.insert(Courses).values(courseData);
        
        return {
          id: course.id,
          createdAt: createdDate,
          updatedAt: updatedDate,
          title: course.title,
          seedSequence: course.seedSequence,
          dateConfig: {
            createdAt: createdDate,
            updatedAt: updatedDate
        }
        };
  
      },
      catch: (error) => new SeedingError(error, { table: 'courses', operation: 'insert', id: course.id })
    })
  }
  
  // Insert and log a single course
  const insertAndLogCourse = (course: CourseConfig): Effect.Effect<SeededCourse, SeedingError, never> => 
    pipe(
      insertCourse(course),
      Effect.tap(seededCourse => 
        Effect.sync(() => console.log(`Seeded course: ${seededCourse.title} (${seededCourse.id})`))
      )
    );
  
  // Export just one function for seeding courses
  export const seedCourses = (): Promise<SeededCourse[]> => {
    return Effect.runPromise(
      Effect.gen(function* () {
        yield* (Console.log('Starting course seeding...'))
  
        const seededCourses = yield* (
          Effect.forEach(
            data.courses,
            (course) => pipe(
              insertAndLogCourse(course),
              Effect.tap(seeded => Console.log(`Seeded course: ${seeded.title} (${seeded.id})`)),
            ),
            { concurrency: 'unbounded' }
          )
        )
  
        yield* (Console.log('Course seeding complete.'))
        return seededCourses
      })
    )
  }
  
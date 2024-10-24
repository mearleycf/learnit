import {
  db,
  Courses,
  Chapters,
  Sections,
  Exercises,
  Users,
  Feedback,
  Notes,
  Student_Exercise_Progress,
  Student_Progress,
  and,
} from 'astro:db'
import { entriesGenerator, getRandomElement, getRandomElements, randomDateGenerator } from '@utils/general_utils'
import { courseData as data } from '@db/seed_config/seed/courses/index'
import { subDays } from 'date-fns'
import { eq } from 'astro:db'
import { ulid } from 'ulidx'
import type { CourseConfig } from '@db/seed_config/types/seed-types'

// ====================================================================

// general seeding utility functions and data

// ====================================================================

// seed function

export default async function seed() {
  try {
    console.log('Starting seed process...')

    // Clear existing data
    await db.delete(Student_Progress)
    await db.delete(Student_Exercise_Progress)
    await db.delete(Notes)
    await db.delete(Feedback)
    await db.delete(Users)
    await db.delete(Exercises)
    await db.delete(Sections)
    await db.delete(Chapters)
    await db.delete(Courses)

    console.log('Existing data cleared.')

    // ====================================================================

    // Seed Courses
    console.log('Seeding Courses...')

    async function seedCourses() {
      const courses: CourseConfig[] = data.courses;
    
    }

    console.log('Courses seeded')

    // ====================================================================

    // Seed Chapters
    console.log('Seeding Chapters...')

    // chapter seed functionality here

    console.log('Chapters seeded')

    // ====================================================================

    // Seed Sections
    console.log('Seeding Sections...')

    // section seed functionality here

    console.log('Sections seeded')

    // ====================================================================

    // Seed Exercises
    console.log('Seeding Exercises...')

    // exercise seed functionality here

    console.log('Exercises seeded')

    // ====================================================================

    // Seed Users
    console.log('Seeding Users...')

    // user seed functionality here

    console.log('Users seeded')

    // ====================================================================

    // Seed Feedback
    console.log('Seeding Feedback...')

    // feedback seed functionality here

    console.log('Feedback seeded')

    // ====================================================================

    // Seed Notes
    console.log('Seeding Notes...')

    // note seed functionality here

    console.log('Notes seeded')

    // ====================================================================

    // Seed Student_Exercise_Progress
    console.log('Seeding Student Exercise Progress...')

    // Student exercise progress seed functionality here

    console.log('Student Exercise Progress seeded')

    // ====================================================================

    // Seed Student_Progress
    console.log('Seeding Student Progress...')

    // Student progress seed functionality here

    console.log('Student Progress seeded')

    // ====================================================================\

    // seed function error handler

    console.log('Seed process completed successfully')
  } catch (error) {
    console.error('Error during seeding:', error)
  }
}

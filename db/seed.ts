import {
  db,
  Courses,
  Chapters,
  Sections,
  Exercises,
  Users,
  Feedback,
  Notes,
  User_Exercise_Progress,
  User_Progress,
  and,
} from 'astro:db'
import { entriesGenerator, getRandomElement, getRandomElements, randomDateGenerator } from '@utils/general_utils'
import { sampleDataConfig as data } from '@db/seedDataConfig'
import { subDays } from 'date-fns'
import { eq } from 'astro:db'
import { ulid } from 'ulidx'

// ====================================================================

// general seeding utility functions and data

// ====================================================================

// seed function

export default async function seed() {
  try {
    console.log('Starting seed process...')

    // Clear existing data
    await db.delete(User_Progress)
    await db.delete(User_Exercise_Progress)
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

    // course seed functionality here

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

    // Seed User_Exercise_Progress
    console.log('Seeding User Exercise Progress...')

    // user exercise progress seed functionality here

    console.log('User Exercise Progress seeded')

    // ====================================================================

    // Seed User_Progress
    console.log('Seeding User Progress...')

    // user progress seed functionality here

    console.log('User Progress seeded')

    // ====================================================================\

    // seed function error handler

    console.log('Seed process completed successfully')
  } catch (error) {
    console.error('Error during seeding:', error)
  }
}

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
} from 'astro:db'
import { calculateExpirationDate } from '@utils/astrodb_utils.ts'

async function getAllCourseIds(): Promise<string[]> {
  const courses = await db.select({ id: Courses.id }).from(Courses)
  return courses.map(course => course.id)
}

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

    // Seed Courses
    console.log('Seeding Courses...')
    await db.insert(Courses).values([
      {
        id: '1',
        title: 'Javascript Fundamentals',
        description: 'Learn the fundamentals of JavaScript programming',
        slug: 'javascript-fundamentals',
        subject_area: 'Programming',
        level: 'beginner',
        tags: JSON.stringify(['javascript', 'web development', 'programming', 'ES14', 'ECMAScript 2023']),
        price: 49.99,
        purchase_active_length: 1825, // course is available for 5 years
      },
      {
        id: '2',
        title: 'Advanced React Development',
        description: 'Master React and build complex applications',
        slug: 'advanced-react',
        subject_area: 'Web Development',
        level: 'advanced',
        tags: JSON.stringify(['react', 'javascript', 'frontend', 'typescript', 'react18', 'react19']),
        price: 79.99,
        purchase_active_length: null, // course is available to student indefinitely
      },
      {
        id: '3',
        title: 'Python Fundamentals',
        description: 'Master Python and build complex applications',
        slug: 'python-fundamentals',
        subject_area: 'Python Development',
        level: 'beginner',
        tags: JSON.stringify(['python', 'backend']),
        price: 0, // course is free for all sections
        purchase_active_length: null, // course is available to student indefinitely
      },
    ])
    console.log('Courses seeded')

    // Seed Chapters
    console.log('Seeding Chapters...')
    await db.insert(Chapters).values([
      {
        id: '1',
        course_id: '1',
        title: 'JavaScript Basics',
        description: 'Fundamental concepts of JavaScript',
        order_number: 1,
        estimated_time: '2 hours',
      },
      {
        id: '2',
        course_id: '1',
        title: 'Functions and Objects',
        description: 'Working with functions and objects in JavaScript',
        order_number: 2,
        estimated_time: '3 hours',
      },
      {
        id: '3',
        course_id: '2',
        title: 'React Fundamentals',
        description: 'Core concepts of React',
        order_number: 1,
        estimated_time: '4 hours',
      },
      {
        id: '4',
        course_id: '2',
        title: 'State Management',
        description: 'Advanced state management in React',
        order_number: 2,
        estimated_time: '5 hours',
      },
      {
        id: '5',
        course_id: '3',
        title: 'Python Basics',
        description: 'Fundamental concepts of Python',
        order_number: 1,
        estimated_time: '3 hours',
      },
      {
        id: '6',
        course_id: '3',
        title: 'Data Structures in Python',
        description: 'Working with data structures in Python',
        order_number: 2,
        estimated_time: '4 hours',
      },
      {
        id: '7',
        course_id: '3',
        title: 'Python Functions and Modules',
        description: 'Understanding functions and modules in Python',
        order_number: 3,
        estimated_time: '3 hours',
      },
    ])
    console.log('Chapters seeded')

    // Seed Sections
    console.log('Seeding Sections...')
    const sections = [
      // Course 1: JavaScript Fundamentals
      {
        id: '1',
        course_id: '1',
        chapter_id: '1',
        title: 'Introduction to JavaScript',
        content_type: 'lesson',
        order_number: 1,
        access_level: 'free',
      },
      {
        id: '2',
        course_id: '1',
        chapter_id: '1',
        title: 'Variables and Data Types',
        content_type: 'exercise',
        order_number: 2,
        access_level: 'free',
      },
      {
        id: '3',
        course_id: '1',
        chapter_id: '1',
        title: 'JavaScript Basics Recap',
        content_type: 'recap',
        order_number: 3,
        access_level: 'free',
      },
      {
        id: '4',
        course_id: '1',
        chapter_id: '2',
        title: 'Functions in JavaScript',
        content_type: 'lesson',
        order_number: 4,
        access_level: 'purchased',
      },
      {
        id: '5',
        course_id: '1',
        chapter_id: '2',
        title: 'Object-Oriented JavaScript',
        content_type: 'exercise',
        order_number: 5,
        access_level: 'purchased',
      },
      {
        id: '6',
        course_id: '1',
        chapter_id: '2',
        title: 'Functions and Objects Recap',
        content_type: 'recap',
        order_number: 6,
        access_level: 'purchased',
      },

      // Course 2: Advanced React Development
      {
        id: '7',
        course_id: '2',
        chapter_id: '3',
        title: 'React Components',
        content_type: 'lesson',
        order_number: 1,
        access_level: 'free',
      },
      {
        id: '8',
        course_id: '2',
        chapter_id: '3',
        title: 'React Props and State',
        content_type: 'exercise',
        order_number: 2,
        access_level: 'free',
      },
      {
        id: '9',
        course_id: '2',
        chapter_id: '3',
        title: 'React Fundamentals Recap',
        content_type: 'recap',
        order_number: 3,
        access_level: 'free',
      },
      {
        id: '10',
        course_id: '2',
        chapter_id: '4',
        title: 'Redux Basics',
        content_type: 'lesson',
        order_number: 4,
        access_level: 'purchased',
      },
      {
        id: '11',
        course_id: '2',
        chapter_id: '4',
        title: 'Advanced Redux Patterns',
        content_type: 'exercise',
        order_number: 5,
        access_level: 'purchased',
      },
      {
        id: '12',
        course_id: '2',
        chapter_id: '4',
        title: 'State Management Recap',
        content_type: 'recap',
        order_number: 6,
        access_level: 'purchased',
      },

      // Course 3: Python Fundamentals
      {
        id: '13',
        course_id: '3',
        chapter_id: '5',
        title: 'Introduction to Python',
        content_type: 'lesson',
        order_number: 1,
        access_level: 'free',
      },
      {
        id: '14',
        course_id: '3',
        chapter_id: '5',
        title: 'Python Syntax Basics',
        content_type: 'exercise',
        order_number: 2,
        access_level: 'free',
      },
      {
        id: '15',
        course_id: '3',
        chapter_id: '5',
        title: 'Variables and Data Types',
        content_type: 'lesson',
        order_number: 3,
        access_level: 'free',
      },
      {
        id: '16',
        course_id: '3',
        chapter_id: '5',
        title: 'Working with Numbers',
        content_type: 'exercise',
        order_number: 4,
        access_level: 'free',
      },
      {
        id: '17',
        course_id: '3',
        chapter_id: '5',
        title: 'String Operations',
        content_type: 'exercise',
        order_number: 5,
        access_level: 'free',
      },
      {
        id: '18',
        course_id: '3',
        chapter_id: '5',
        title: 'Python Basics Recap',
        content_type: 'recap',
        order_number: 6,
        access_level: 'free',
      },
      {
        id: '19',
        course_id: '3',
        chapter_id: '6',
        title: 'Python Data Structures',
        content_type: 'lesson',
        order_number: 7,
        access_level: 'free',
      },
      {
        id: '20',
        course_id: '3',
        chapter_id: '6',
        title: 'Lists and Tuples',
        content_type: 'exercise',
        order_number: 8,
        access_level: 'free',
      },
      {
        id: '21',
        course_id: '3',
        chapter_id: '6',
        title: 'Data Structures Recap',
        content_type: 'recap',
        order_number: 9,
        access_level: 'free',
      },
      {
        id: '22',
        course_id: '3',
        chapter_id: '7',
        title: 'Python Functions',
        content_type: 'lesson',
        order_number: 10,
        access_level: 'free',
      },
      {
        id: '23',
        course_id: '3',
        chapter_id: '7',
        title: 'Python Modules',
        content_type: 'lesson',
        order_number: 11,
        access_level: 'free',
      },
      {
        id: '24',
        course_id: '3',
        chapter_id: '7',
        title: 'Basic Function Exercise',
        content_type: 'exercise',
        order_number: 12,
        access_level: 'free',
      },
      {
        id: '25',
        course_id: '3',
        chapter_id: '7',
        title: 'Intermediate Function Exercise',
        content_type: 'exercise',
        order_number: 13,
        access_level: 'free',
      },
      {
        id: '26',
        course_id: '3',
        chapter_id: '7',
        title: 'Advanced Module Exercise',
        content_type: 'exercise',
        order_number: 14,
        access_level: 'free',
      },
      {
        id: '27',
        course_id: '3',
        chapter_id: '7',
        title: 'Functions and Modules Recap',
        content_type: 'recap',
        order_number: 15,
        access_level: 'free',
      },
    ]

    for (const section of sections) {
      try {
        await db.insert(Sections).values({
          ...section,
          description: `Description for ${section.title}`,
          content: JSON.stringify({ text: `Content for ${section.title}` }),
        })
        console.log(`Inserted section ${section.id}`)
      } catch (error) {
        console.error(`Error inserting section ${section.id}:`, error)
      }
    }
    console.log('Sections seeded')

    // Seed Exercises
    console.log('Seeding Exercises...')
    const exercises = [
      { id: '1', section_id: '2', difficulty: 'beginner', estimated_time_minutes: 10 },
      { id: '2', section_id: '5', difficulty: 'intermediate', estimated_time_minutes: 15 },
      { id: '3', section_id: '8', difficulty: 'intermediate', estimated_time_minutes: 20 },
      { id: '4', section_id: '11', difficulty: 'advanced', estimated_time_minutes: 25 },
      { id: '5', section_id: '14', difficulty: 'beginner', estimated_time_minutes: 15 },
      { id: '6', section_id: '16', difficulty: 'beginner', estimated_time_minutes: 15 },
      { id: '7', section_id: '17', difficulty: 'beginner', estimated_time_minutes: 20 },
      { id: '8', section_id: '20', difficulty: 'intermediate', estimated_time_minutes: 25 },
      { id: '9', section_id: '24', difficulty: 'beginner', estimated_time_minutes: 20 },
      { id: '10', section_id: '25', difficulty: 'intermediate', estimated_time_minutes: 25 },
      { id: '11', section_id: '26', difficulty: 'advanced', estimated_time_minutes: 30 },
    ]

    for (const exercise of exercises) {
      try {
        await db.insert(Exercises).values({
          ...exercise,
          instructions: `Instructions for Exercise ${exercise.id}`,
          browser_html: JSON.stringify({ html: '<div id="app"></div>' }),
          code_files: JSON.stringify({
            'script.js': '// Your code here',
            'styles.css': '/* Your styles here */',
          }),
          tests: JSON.stringify([
            { test: `assert(typeof exercise${exercise.id} !== "undefined");` },
            { test: `assert(exercise${exercise.id}() === true);` },
          ]),
          hints: JSON.stringify([`Hint 1 for Exercise ${exercise.id}`, `Hint 2 for Exercise ${exercise.id}`]),
          default_solution: JSON.stringify({ 'script.js': `function exercise${exercise.id}() { return true; }` }),
          user_solution: JSON.stringify({}),
        })
        console.log(`Inserted exercise ${exercise.id}`)
      } catch (error) {
        console.error(`Error inserting exercise ${exercise.id}:`, error)
      }
    }
    console.log('Exercises seeded')

    // Seed Users
    console.log('Seeding Users...')
    const allCourseIds = await getAllCourseIds()

    await db.insert(Users).values([
      // Students
      {
        id: '1',
        name: 'Student 1',
        email: 'student1@example.com',
        role: 'student',
        enrolled_courses: JSON.stringify(['1']),
        assigned_courses: null,
      },
      {
        id: '2',
        name: 'Student 2',
        email: 'student2@example.com',
        role: 'student',
        enrolled_courses: JSON.stringify(['2']),
        assigned_courses: null,
      },
      {
        id: '3',
        name: 'Student 3',
        email: 'student3@example.com',
        role: 'student',
        enrolled_courses: JSON.stringify(['2']),
        assigned_courses: null,
      },
      {
        id: '4',
        name: 'Student 4',
        email: 'student4@example.com',
        role: 'student',
        enrolled_courses: JSON.stringify(['3']),
        assigned_courses: null,
      },
      {
        id: '5',
        name: 'Student 5',
        email: 'student5@example.com',
        role: 'student',
        enrolled_courses: JSON.stringify(['3']),
        assigned_courses: null,
      },
      {
        id: '6',
        name: 'Student 6',
        email: 'student6@example.com',
        role: 'student',
        enrolled_courses: JSON.stringify(['1', '2']),
        assigned_courses: null,
      },
      {
        id: '7',
        name: 'Student 7',
        email: 'student7@example.com',
        role: 'student',
        enrolled_courses: JSON.stringify(['1', '2', '3']),
        assigned_courses: null,
      },
      {
        id: '8',
        name: 'Student 8',
        email: 'student8@example.com',
        role: 'student',
        enrolled_courses: JSON.stringify([]),
        assigned_courses: null,
      },
      // App Admin
      {
        id: '9',
        name: 'App Admin',
        email: 'admin@example.com',
        role: 'app_admin',
        enrolled_courses: JSON.stringify([]),
        assigned_courses: JSON.stringify(allCourseIds),
      },
      // Course Admins
      {
        id: '10',
        name: 'Course Admin 1',
        email: 'courseadmin1@example.com',
        role: 'course_admin',
        enrolled_courses: JSON.stringify([]),
        assigned_courses: JSON.stringify(['1']),
      },
      {
        id: '11',
        name: 'Course Admin 2',
        email: 'courseadmin2@example.com',
        role: 'course_admin',
        enrolled_courses: JSON.stringify([]),
        assigned_courses: JSON.stringify(['2']),
      },
      {
        id: '12',
        name: 'Course Admin 3',
        email: 'courseadmin3@example.com',
        role: 'course_admin',
        enrolled_courses: JSON.stringify([]),
        assigned_courses: JSON.stringify(['3']),
      },
      {
        id: '13',
        name: 'Course Admin 4',
        email: 'courseadmin4@example.com',
        role: 'course_admin',
        enrolled_courses: JSON.stringify([]),
        assigned_courses: JSON.stringify(['2', '3']),
      },
      // Authors
      {
        id: '14',
        name: 'Author 1',
        email: 'author1@example.com',
        role: 'author',
        enrolled_courses: JSON.stringify([]),
        assigned_courses: JSON.stringify(['1']),
      },
      {
        id: '15',
        name: 'Author 2',
        email: 'author2@example.com',
        role: 'author',
        enrolled_courses: JSON.stringify([]),
        assigned_courses: JSON.stringify(['2']),
      },
      {
        id: '16',
        name: 'Author 3',
        email: 'author3@example.com',
        role: 'author',
        enrolled_courses: JSON.stringify([]),
        assigned_courses: JSON.stringify(['3']),
      },
      {
        id: '17',
        name: 'Author 4',
        email: 'author4@example.com',
        role: 'author',
        enrolled_courses: JSON.stringify([]),
        assigned_courses: JSON.stringify(['2', '3']),
      },
    ])
    console.log('Users seeded')

    // Seed Feedback
    console.log('Seeding Feedback...')
    const statuses = ['pending', 'reviewed', 'resolved', 'ignored']
    const categories = [
      'incorrect_content',
      'general_feedback',
      'technical_issue',
      'feature_request',
      'clarity_improvement',
      'typo_or_grammar',
    ]
    const ratings = [0, 1, 2, 3, 4, 5]

    let feedbackId = 1
    const feedbackData = []

    for (const status of statuses) {
      for (const category of categories) {
        for (const rating of ratings) {
          feedbackData.push({
            id: String(feedbackId++),
            user_id: String(Math.floor(Math.random() * 8) + 1), // Random student user (1-8)
            section_id: String(Math.floor(Math.random() * 27) + 1), // Random section (1-27)
            feedback_text: `This is ${status} ${category} feedback with a rating of ${rating}.`,
            rating: rating,
            status: status,
            category: category,
          })
        }
      }
    }

    await db.insert(Feedback).values(feedbackData)
    console.log('Feedback seeded')

    // Seed Notes
    console.log('Seeding Notes...')
    let noteId = 1
    for (let courseId = 1; courseId <= 3; courseId++) {
      for (let chapterId = (courseId - 1) * 2 + 1; chapterId <= courseId * 2; chapterId++) {
        for (let sectionOrder = 1; sectionOrder <= 3; sectionOrder++) {
          const sectionId = (chapterId - 1) * 3 + sectionOrder
          const sectionType = ['lesson', 'exercise', 'recap'][sectionOrder - 1]
          try {
            if (sectionType === 'lesson') {
              await db.insert(Notes).values([
                {
                  id: String(noteId++),
                  user_id: '1',
                  section_id: String(sectionId),
                  note_text: `Note text for section ${sectionId}`,
                  highlighted_text: null,
                },
                {
                  id: String(noteId++),
                  user_id: '1',
                  section_id: String(sectionId),
                  note_text: null,
                  highlighted_text: `Highlighted text for section ${sectionId}`,
                },
                {
                  id: String(noteId++),
                  user_id: '1',
                  section_id: String(sectionId),
                  note_text: `Note with highlight for section ${sectionId}`,
                  highlighted_text: `Highlighted text with note for section ${sectionId}`,
                },
              ])
            } else if (sectionType === 'exercise') {
              await db.insert(Notes).values([
                {
                  id: String(noteId++),
                  user_id: '1',
                  section_id: String(sectionId),
                  note_text: `Note for exercise ${sectionId}`,
                  highlighted_text: null,
                },
                {
                  id: String(noteId++),
                  user_id: '1',
                  section_id: String(sectionId),
                  note_text: `Default solution for exercise ${sectionId}`,
                  highlighted_text: null,
                },
              ])
            } else if (sectionType === 'recap') {
              await db.insert(Notes).values([
                {
                  id: String(noteId++),
                  user_id: '1',
                  section_id: String(sectionId),
                  note_text: `Note for recap ${sectionId}`,
                  highlighted_text: null,
                },
                {
                  id: String(noteId++),
                  user_id: '1',
                  section_id: String(sectionId),
                  note_text: `Note with highlight for recap ${sectionId}`,
                  highlighted_text: `Highlighted text for recap ${sectionId}`,
                },
                {
                  id: String(noteId++),
                  user_id: '1',
                  section_id: String(sectionId),
                  note_text: null,
                  highlighted_text: `Highlighted text only for recap ${sectionId}`,
                },
                {
                  id: String(noteId++),
                  user_id: '1',
                  section_id: String(sectionId),
                  note_text: `Recap content for section ${sectionId}`,
                  highlighted_text: null,
                },
              ])
            }
            console.log(`Inserted notes for section ${sectionId}`)
          } catch (error) {
            console.error(`Error inserting notes for section ${sectionId}:`, error)
          }
        }
      }
    }
    console.log('Notes seeded')

    // Seed User_Exercise_Progress
    console.log('Seeding User Exercise Progress...')
    await db.insert(User_Exercise_Progress).values([
      // Course 1: JavaScript Fundamentals
      {
        id: '1',
        user_id: '1',
        exercise_id: '1',
        score: 100,
        completed: true,
        attempts: 1,
        last_attempt_at: new Date(),
      },
      { id: '2', user_id: '5', exercise_id: '1', score: 80, completed: true, attempts: 2, last_attempt_at: new Date() },
      { id: '3', user_id: '6', exercise_id: '1', score: 90, completed: true, attempts: 1, last_attempt_at: new Date() },
      { id: '4', user_id: '1', exercise_id: '2', score: 0, completed: false, attempts: 1, last_attempt_at: new Date() },
      {
        id: '5',
        user_id: '5',
        exercise_id: '2',
        score: 50,
        completed: false,
        attempts: 1,
        last_attempt_at: new Date(),
      },
      {
        id: '6',
        user_id: '6',
        exercise_id: '2',
        score: 100,
        completed: true,
        attempts: 1,
        last_attempt_at: new Date(),
      },

      // Course 2: Advanced React Development
      {
        id: '7',
        user_id: '2',
        exercise_id: '3',
        score: 100,
        completed: true,
        attempts: 1,
        last_attempt_at: new Date(),
      },
      { id: '8', user_id: '5', exercise_id: '3', score: 75, completed: true, attempts: 2, last_attempt_at: new Date() },
      { id: '9', user_id: '6', exercise_id: '3', score: 90, completed: true, attempts: 1, last_attempt_at: new Date() },
      {
        id: '10',
        user_id: '2',
        exercise_id: '4',
        score: 60,
        completed: false,
        attempts: 2,
        last_attempt_at: new Date(),
      },
      {
        id: '11',
        user_id: '5',
        exercise_id: '4',
        score: 100,
        completed: true,
        attempts: 1,
        last_attempt_at: new Date(),
      },
      {
        id: '12',
        user_id: '6',
        exercise_id: '4',
        score: 80,
        completed: true,
        attempts: 2,
        last_attempt_at: new Date(),
      },

      // Course 3: Python Fundamentals
      {
        id: '13',
        user_id: '3',
        exercise_id: '5',
        score: 100,
        completed: true,
        attempts: 1,
        last_attempt_at: new Date(),
      },
      {
        id: '14',
        user_id: '4',
        exercise_id: '5',
        score: 90,
        completed: true,
        attempts: 2,
        last_attempt_at: new Date(),
      },
      {
        id: '15',
        user_id: '6',
        exercise_id: '5',
        score: 100,
        completed: true,
        attempts: 1,
        last_attempt_at: new Date(),
      },
      {
        id: '16',
        user_id: '3',
        exercise_id: '6',
        score: 80,
        completed: true,
        attempts: 2,
        last_attempt_at: new Date(),
      },
      {
        id: '17',
        user_id: '4',
        exercise_id: '6',
        score: 70,
        completed: true,
        attempts: 3,
        last_attempt_at: new Date(),
      },
      {
        id: '18',
        user_id: '6',
        exercise_id: '6',
        score: 90,
        completed: true,
        attempts: 1,
        last_attempt_at: new Date(),
      },
      {
        id: '19',
        user_id: '3',
        exercise_id: '7',
        score: 60,
        completed: false,
        attempts: 1,
        last_attempt_at: new Date(),
      },
      {
        id: '20',
        user_id: '4',
        exercise_id: '7',
        score: 50,
        completed: false,
        attempts: 2,
        last_attempt_at: new Date(),
      },
      {
        id: '21',
        user_id: '6',
        exercise_id: '7',
        score: 100,
        completed: true,
        attempts: 1,
        last_attempt_at: new Date(),
      },
      {
        id: '22',
        user_id: '3',
        exercise_id: '8',
        score: 0,
        completed: false,
        attempts: 0,
        last_attempt_at: new Date(),
      },
      {
        id: '23',
        user_id: '4',
        exercise_id: '8',
        score: 40,
        completed: false,
        attempts: 1,
        last_attempt_at: new Date(),
      },
      {
        id: '24',
        user_id: '6',
        exercise_id: '8',
        score: 75,
        completed: true,
        attempts: 2,
        last_attempt_at: new Date(),
      },
      {
        id: '25',
        user_id: '3',
        exercise_id: '9',
        score: 100,
        completed: true,
        attempts: 1,
        last_attempt_at: new Date(),
      },
      {
        id: '26',
        user_id: '4',
        exercise_id: '9',
        score: 90,
        completed: true,
        attempts: 2,
        last_attempt_at: new Date(),
      },
      {
        id: '27',
        user_id: '6',
        exercise_id: '9',
        score: 95,
        completed: true,
        attempts: 1,
        last_attempt_at: new Date(),
      },
      {
        id: '28',
        user_id: '3',
        exercise_id: '10',
        score: 70,
        completed: true,
        attempts: 3,
        last_attempt_at: new Date(),
      },
      {
        id: '29',
        user_id: '4',
        exercise_id: '10',
        score: 80,
        completed: true,
        attempts: 2,
        last_attempt_at: new Date(),
      },
      {
        id: '30',
        user_id: '6',
        exercise_id: '10',
        score: 100,
        completed: true,
        attempts: 1,
        last_attempt_at: new Date(),
      },
      {
        id: '31',
        user_id: '3',
        exercise_id: '11',
        score: 0,
        completed: false,
        attempts: 0,
        last_attempt_at: new Date(),
      },
      {
        id: '32',
        user_id: '4',
        exercise_id: '11',
        score: 60,
        completed: false,
        attempts: 1,
        last_attempt_at: new Date(),
      },
      {
        id: '33',
        user_id: '6',
        exercise_id: '11',
        score: 85,
        completed: true,
        attempts: 2,
        last_attempt_at: new Date(),
      },
    ])
    console.log('User Exercise Progress seeded')

    // Seed User_Progress
    console.log('Seeding User Progress...')
    await db.insert(User_Progress).values([
      // Course 1: JavaScript Fundamentals
      {
        id: '1',
        user_id: '1',
        course_id: '1',
        current_section_id: '3',
        completed_sections: JSON.stringify(['1', '2']),
        enrollment_date: new Date('2024-01-01'),
        purchase_date: new Date('2024-01-02'),
        expiration_date: new Date('2029-01-02'), // 5 years from purchase date
        last_accessed_at: new Date(),
      },
      {
        id: '2',
        user_id: '5',
        course_id: '1',
        current_section_id: '4',
        completed_sections: JSON.stringify(['1', '2', '3']),
        enrollment_date: new Date('2024-01-05'),
        purchase_date: new Date('2024-01-06'),
        expiration_date: new Date('2029-01-06'), // 5 years from purchase date
        last_accessed_at: new Date(),
      },
      {
        id: '3',
        user_id: '6',
        course_id: '1',
        current_section_id: '6',
        completed_sections: JSON.stringify(['1', '2', '3', '4', '5']),
        enrollment_date: new Date('2024-01-10'),
        purchase_date: new Date('2024-01-11'),
        expiration_date: new Date('2029-01-11'), // 5 years from purchase date
        last_accessed_at: new Date(),
      },

      // Course 2: Advanced React Development
      {
        id: '4',
        user_id: '2',
        course_id: '2',
        current_section_id: '9',
        completed_sections: JSON.stringify(['7', '8']),
        enrollment_date: new Date('2024-02-01'),
        purchase_date: new Date('2024-02-02'),
        expiration_date: null, // indefinite access
        last_accessed_at: new Date(),
      },
      {
        id: '5',
        user_id: '5',
        course_id: '2',
        current_section_id: '10',
        completed_sections: JSON.stringify(['7', '8', '9']),
        enrollment_date: new Date('2024-02-05'),
        purchase_date: new Date('2024-02-06'),
        expiration_date: null, // indefinite access
        last_accessed_at: new Date(),
      },
      {
        id: '6',
        user_id: '6',
        course_id: '2',
        current_section_id: '12',
        completed_sections: JSON.stringify(['7', '8', '9', '10', '11']),
        enrollment_date: new Date('2024-02-10'),
        purchase_date: new Date('2024-02-11'),
        expiration_date: null, // indefinite access
        last_accessed_at: new Date(),
      },

      // Course 3: Python Fundamentals
      {
        id: '7',
        user_id: '3',
        course_id: '3',
        current_section_id: '22',
        completed_sections: JSON.stringify(['13', '14', '15', '16', '17', '18', '19', '20', '21']),
        enrollment_date: new Date('2024-03-01'),
        purchase_date: null, // free course
        expiration_date: null, // free course, indefinite access
        last_accessed_at: new Date(),
      },
      {
        id: '8',
        user_id: '4',
        course_id: '3',
        current_section_id: '23',
        completed_sections: JSON.stringify(['13', '14', '15', '16', '17', '18', '19', '20', '21', '22']),
        enrollment_date: new Date('2024-03-05'),
        purchase_date: null, // free course
        expiration_date: null, // free course, indefinite access
        last_accessed_at: new Date(),
      },
      {
        id: '9',
        user_id: '6',
        course_id: '3',
        current_section_id: '27',
        completed_sections: JSON.stringify([
          '13',
          '14',
          '15',
          '16',
          '17',
          '18',
          '19',
          '20',
          '21',
          '22',
          '23',
          '24',
          '25',
          '26',
        ]),
        enrollment_date: new Date('2024-03-10'),
        purchase_date: null, // free course
        expiration_date: null, // free course, indefinite access
        last_accessed_at: new Date(),
      },
    ])
    console.log('User Progress seeded')

    console.log('Seed process completed successfully')
  } catch (error) {
    console.error('Error during seeding:', error)
  }
}

# Old seed file, not using anymore

## seed file function

```ts
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
import { subDays } from 'date-fns'
import { eq } from 'astro:db'
import { ulid } from 'ulidx'

// ====================================================================

// general seeding utility functions and data

async function getAllCourseIds(): Promise<string[]> {
  const courses = await db.select({ id: Courses.id }).from(Courses)
  return courses.map(course => course.id)
}

const getAllUsers = async () => {
  const users = await db.select({ id: Users.id, created_at: Users.created_at, role: Users.role }).from(Users).all()
  return users
}

const getRandomSections = async (courseId: string, count: number) => {
  const sections = await db.select({ id: Sections.id }).from(Sections).where(eq(Sections.course_id, courseId)).all()
  return getRandomElements(sections, count).map(section => section.id)
}

type Exercise = {
  exerciseId: string
  createdAt: Date
  updatedAt: Date | null
}

type Section = {
  sectionId: string
  createdAt: Date
  updatedAt: Date | null
}

type Chapter = {
  chapterId: string
  createdAt: Date
  updatedAt: Date | null
  sections: Section[]
}

type Course = {
  courseId: string
  createdAt: Date
  updatedAt: Date | null
  chapters: Chapter[]
}

// ====================================================================

export default async function seed() {
  try {
    console.log('Starting seed process...')

    // ====================================================================

    // Seed Courses
    console.log('Seeding Courses...')

    const courses = [
      {
        id: ulid(),
        title: 'JavaScript Fundamentals',
        description: 'Learn the fundamentals of JavaScript programming',
        slug: 'javascript-fundamentals',
        subject_area: 'Programming',
        level: 'beginner',
        tags: JSON.stringify(['javascript', 'web development', 'programming', 'ES14', 'ECMAScript 2023']),
        price: 49.99,
        purchase_active_length: 1825, // course is available for 5 years
      },
      {
        id: ulid(),
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
        id: ulid(),
        title: 'Python Fundamentals',
        description: 'Master Python and build complex applications',
        slug: 'python-fundamentals',
        subject_area: 'Python Development',
        level: 'beginner',
        tags: JSON.stringify(['python', 'backend']),
        price: 0, // course is free for all sections
        purchase_active_length: null, // course is available to student indefinitely
      },
    ]

    for (const course of courses) {
      const { createdDate, updatedDate } = randomDateGenerator({
        start: 720,
        end: 365,
        includeUpdated: true,
        chanceOfUpdate: 1,
      })

      await db.insert(Courses).values({
        ...course,
        created_at: createdDate,
        updated_at: updatedDate || undefined,
      })

      console.log('Courses seeded')

      // ====================================================================

      // Seed Chapters
      console.log('Seeding Chapters...')

      const chapters = [
        {
          id: ulid(),
          course_id: '1',
          title: 'JavaScript Basics',
          description: 'Fundamental concepts of JavaScript',
          order_number: 1,
          estimated_time: '2 hours',
        },
        {
          id: ulid(),
          course_id: '1',
          title: 'Functions and Objects',
          description: 'Working with functions and objects in JavaScript',
          order_number: 2,
          estimated_time: '3 hours',
        },
        {
          id: ulid(),
          course_id: '2',
          title: 'React Fundamentals',
          description: 'Core concepts of React',
          order_number: 1,
          estimated_time: '4 hours',
        },
        {
          id: ulid(),
          course_id: '2',
          title: 'State Management',
          description: 'Advanced state management in React',
          order_number: 2,
          estimated_time: '5 hours',
        },
        {
          id: ulid(),
          course_id: '3',
          title: 'Python Basics',
          description: 'Fundamental concepts of Python',
          order_number: 1,
          estimated_time: '3 hours',
        },
        {
          id: ulid(),
          course_id: '3',
          title: 'Data Structures in Python',
          description: 'Working with data structures in Python',
          order_number: 2,
          estimated_time: '4 hours',
        },
        {
          id: ulid(),
          course_id: '3',
          title: 'Python Functions and Modules',
          description: 'Understanding functions and modules in Python',
          order_number: 3,
          estimated_time: '3 hours',
        },
      ]

      for (const chapter of chapters) {
        const { createdDate: chapterCreatedDate, updatedDate: chapterUpdatedDate } = randomDateGenerator({
          start: new Date(),
          end: subDays(new Date(), 182),
          includeUpdated: true,
          chanceOfUpdate: 1,
        })

        await db.insert(Chapters).values({
          ...chapter,
          chapter_display_number: 1,
          created_at: chapterCreatedDate,
          updated_at: chapterUpdatedDate || undefined,
        })
      }

      console.log('Chapters seeded')

      // ====================================================================

      // Seed Sections
      console.log('Seeding Sections...')

      const sections = [
        // Course 1: JavaScript Fundamentals
        {
          id: ulid(),
          course_id: '1',
          chapter_id: '1',
          title: 'Introduction to JavaScript',
          content_type: 'lesson',
          order_number: 1,
          access_level: 'free',
        },
        {
          id: ulid(),
          course_id: '1',
          chapter_id: '1',
          title: 'Variables and Data Types',
          content_type: 'exercise',
          order_number: 2,
          access_level: 'free',
        },
        {
          id: ulid(),
          course_id: '1',
          chapter_id: '1',
          title: 'JavaScript Basics Recap',
          content_type: 'recap',
          order_number: 3,
          access_level: 'free',
        },
        {
          id: ulid(),
          course_id: '1',
          chapter_id: '2',
          title: 'Functions in JavaScript',
          content_type: 'lesson',
          order_number: 4,
          access_level: 'purchased',
        },
        {
          id: ulid(),
          course_id: '1',
          chapter_id: '2',
          title: 'Object-Oriented JavaScript',
          content_type: 'exercise',
          order_number: 5,
          access_level: 'purchased',
        },
        {
          id: ulid(),
          course_id: '1',
          chapter_id: '2',
          title: 'Functions and Objects Recap',
          content_type: 'recap',
          order_number: 6,
          access_level: 'purchased',
        },

        // Course 2: Advanced React Development
        {
          id: ulid(),
          course_id: '2',
          chapter_id: '3',
          title: 'React Components',
          content_type: 'lesson',
          order_number: 1,
          access_level: 'free',
        },
        {
          id: ulid(),
          course_id: '2',
          chapter_id: '3',
          title: 'React Props and State',
          content_type: 'exercise',
          order_number: 2,
          access_level: 'free',
        },
        {
          id: ulid(),
          course_id: '2',
          chapter_id: '3',
          title: 'React Fundamentals Recap',
          content_type: 'recap',
          order_number: 3,
          access_level: 'free',
        },
        {
          id: ulid(),
          course_id: '2',
          chapter_id: '4',
          title: 'Redux Basics',
          content_type: 'lesson',
          order_number: 4,
          access_level: 'purchased',
        },
        {
          id: ulid(),
          course_id: '2',
          chapter_id: '4',
          title: 'Advanced Redux Patterns',
          content_type: 'exercise',
          order_number: 5,
          access_level: 'purchased',
        },
        {
          id: ulid(),
          course_id: '2',
          chapter_id: '4',
          title: 'State Management Recap',
          content_type: 'recap',
          order_number: 6,
          access_level: 'purchased',
        },

        // Course 3: Python Fundamentals
        {
          id: ulid(),
          course_id: '3',
          chapter_id: '5',
          title: 'Introduction to Python',
          content_type: 'lesson',
          order_number: 1,
          access_level: 'free',
        },
        {
          id: ulid(),
          course_id: '3',
          chapter_id: '5',
          title: 'Python Syntax Basics',
          content_type: 'exercise',
          order_number: 2,
          access_level: 'free',
        },
        {
          id: ulid(),
          course_id: '3',
          chapter_id: '5',
          title: 'Variables and Data Types',
          content_type: 'lesson',
          order_number: 3,
          access_level: 'free',
        },
        {
          id: ulid(),
          course_id: '3',
          chapter_id: '5',
          title: 'Working with Numbers',
          content_type: 'exercise',
          order_number: 4,
          access_level: 'free',
        },
        {
          id: ulid(),
          course_id: '3',
          chapter_id: '5',
          title: 'String Operations',
          content_type: 'exercise',
          order_number: 5,
          access_level: 'free',
        },
        {
          id: ulid(),
          course_id: '3',
          chapter_id: '5',
          title: 'Python Basics Recap',
          content_type: 'recap',
          order_number: 6,
          access_level: 'free',
        },
        {
          id: ulid(),
          course_id: '3',
          chapter_id: '6',
          title: 'Python Data Structures',
          content_type: 'lesson',
          order_number: 7,
          access_level: 'free',
        },
        {
          id: ulid(),
          course_id: '3',
          chapter_id: '6',
          title: 'Lists and Tuples',
          content_type: 'exercise',
          order_number: 8,
          access_level: 'free',
        },
        {
          id: ulid(),
          course_id: '3',
          chapter_id: '6',
          title: 'Data Structures Recap',
          content_type: 'recap',
          order_number: 9,
          access_level: 'free',
        },
        {
          id: ulid(),
          course_id: '3',
          chapter_id: '7',
          title: 'Python Functions',
          content_type: 'lesson',
          order_number: 10,
          access_level: 'free',
        },
        {
          id: ulid(),
          course_id: '3',
          chapter_id: '7',
          title: 'Python Modules',
          content_type: 'lesson',
          order_number: 11,
          access_level: 'free',
        },
        {
          id: ulid(),
          course_id: '3',
          chapter_id: '7',
          title: 'Basic Function Exercise',
          content_type: 'exercise',
          order_number: 12,
          access_level: 'free',
        },
        {
          id: ulid(),
          course_id: '3',
          chapter_id: '7',
          title: 'Intermediate Function Exercise',
          content_type: 'exercise',
          order_number: 13,
          access_level: 'free',
        },
        {
          id: ulid(),
          course_id: '3',
          chapter_id: '7',
          title: 'Advanced Module Exercise',
          content_type: 'exercise',
          order_number: 14,
          access_level: 'free',
        },
        {
          id: ulid(),
          course_id: '3',
          chapter_id: '7',
          title: 'Functions and Modules Recap',
          content_type: 'recap',
          order_number: 15,
          access_level: 'free',
        },
      ]

      for (const section of sections) {
        const { createdDate, updatedDate } = randomDateGenerator({
          start: new Date(),
          end: subDays(new Date(), 182),
          includeUpdated: true,
          chanceOfUpdate: 1,
        })

        try {
          await db.insert(Sections).values({
            ...section,
            section_display_number: 1,
            description: `Description for ${section.title}`,
            content: JSON.stringify({ text: `Content for ${section.title}` }),
            created_at: createdDate,
            updated_at: updatedDate || undefined,
          })

          console.log(`Inserted section ${section.id}`)
        } catch (error) {
          console.error(`Error inserting section ${section.id}:`, error)
        }
      }
      console.log('Sections seeded')

      // ====================================================================

      // Seed Exercises
      console.log('Seeding Exercises...')
      const exercises = [
        { id: ulid(), section_id: '2', difficulty: 'beginner', estimated_time_minutes: 10 },
        { id: ulid(), section_id: '5', difficulty: 'intermediate', estimated_time_minutes: 15 },
        { id: ulid(), section_id: '8', difficulty: 'intermediate', estimated_time_minutes: 20 },
        { id: ulid(), section_id: '11', difficulty: 'advanced', estimated_time_minutes: 25 },
        { id: ulid(), section_id: '14', difficulty: 'beginner', estimated_time_minutes: 15 },
        { id: ulid(), section_id: '16', difficulty: 'beginner', estimated_time_minutes: 15 },
        { id: ulid(), section_id: '17', difficulty: 'beginner', estimated_time_minutes: 20 },
        { id: ulid(), section_id: '20', difficulty: 'intermediate', estimated_time_minutes: 25 },
        { id: ulid(), section_id: '24', difficulty: 'beginner', estimated_time_minutes: 20 },
        { id: ulid(), section_id: '25', difficulty: 'intermediate', estimated_time_minutes: 25 },
        { id: ulid(), section_id: '26', difficulty: 'advanced', estimated_time_minutes: 30 },
      ]

      for (const exercise of exercises) {
        const { createdDate, updatedDate } = randomDateGenerator({
          start: new Date(),
          end: subDays(new Date(), 182),
          includeUpdated: true,
          chanceOfUpdate: 0.8, // 80% chance of having an update date
        })

        try {
          const defaultSolution = `function exercise${exercise.id}() { 
          // Default solution
          return true; 
        }`

          // array for using to randomize content
          const htmlFiles = [['index.html', `<div id="app">Hello World</div>`]]

          const codeFiles = [
            ['script.js', `// your code here`],
            ['global.css', `body {font-size: 1rem;}\n/* your styles here */`],
            ['index.html', `<div id="app">Hello World</div>`],
            ['calculate.js', `const sum = (x, y) => x + y\n//more code here`],
          ]

          const tests = [
            ['test', 'assert(typeof exercise !== "undefined");'],
            ['test', 'assert(exercise() === true);'],
            ['test', 'assert(exercise.toString().includes("return"));'],
            ['test', 'assert(exercise.length === 0);'],
          ]

          const hints = [
            ['Hint 1', 'Start by declaring a function named "exercise".'],
            ['Hint 2', 'The function should return a boolean value.'],
            ['Hint 3', 'Consider what condition would make the function return true.'],
            ['Hint 4', 'Remember, an empty function body implicitly returns undefined.'],
          ]

          const htmlFileResults = Object.fromEntries(htmlFiles.slice(0, entriesGenerator(1, 4)))
          const codeFileResults = Object.fromEntries(codeFiles.slice(0, entriesGenerator(1, 4)))
          const testResults = Object.fromEntries(tests.slice(0, entriesGenerator(1, 4)))
          const hintsResults = Object.fromEntries(hints.slice(0, entriesGenerator(1, 4)))

          const exerciseData = {
            ...exercise,
            instructions: `Complete the exercise${exercise.id} function to solve the problem.`,
            browser_html: JSON.stringify(htmlFileResults),
            code_files: JSON.stringify(codeFileResults),
            tests: JSON.stringify(testResults),
            hints: JSON.stringify(hintsResults),
            default_solution: JSON.stringify({ 'script.js': defaultSolution }),
            student_solution: JSON.stringify({}),
            created_at: createdDate,
            updated_at: updatedDate || undefined,
            exercise_display_number: 1,
          }

          // Check if any user has completed this exercise
          const completedProgress = await db
            .select()
            .from(Student_Exercise_Progress)
            .where(
              and(
                eq(Student_Exercise_Progress.exercise_id, exercise.id),
                eq(Student_Exercise_Progress.completed, true),
              ),
            )
            .limit(1)

          if (completedProgress.length > 0) {
            // Create a unique user solution
            const userSolution = `function exercise${exercise.id}() {
            // User's unique solution
            let result = false;
            // Some unique logic here
            result = !result;
            return result;
          }`
            exerciseData.student_solution = JSON.stringify({ 'script.js': userSolution })
          }

          await db.insert(Exercises).values(exerciseData)
          console.log(`Inserted exercise ${exercise.id}`)
        } catch (error) {
          console.error(`Error inserting exercise ${exercise.id}:`, error)
        }
      }
      console.log('Exercises seeded')

      // ====================================================================

      // Seed Users
      console.log('Seeding Users...')
      const allCourseIds = await getAllCourseIds()

      const usersData = [
        // Students
        {
          id: ulid(),
          name: 'Student 1',
          email: 'student1@example.com',
          role: 'student',
          enrolled_courses: JSON.stringify(['1']),
          assigned_courses: null,
        },
        {
          id: ulid(),
          name: 'Student 2',
          email: 'student2@example.com',
          role: 'student',
          enrolled_courses: JSON.stringify(['2']),
          assigned_courses: null,
        },
        {
          id: ulid(),
          name: 'Student 3',
          email: 'student3@example.com',
          role: 'student',
          enrolled_courses: JSON.stringify(['2']),
          assigned_courses: null,
        },
        {
          id: ulid(),
          name: 'Student 4',
          email: 'student4@example.com',
          role: 'student',
          enrolled_courses: JSON.stringify(['3']),
          assigned_courses: null,
        },
        {
          id: ulid(),
          name: 'Student 5',
          email: 'student5@example.com',
          role: 'student',
          enrolled_courses: JSON.stringify(['3']),
          assigned_courses: null,
        },
        {
          id: ulid(),
          name: 'Student 6',
          email: 'student6@example.com',
          role: 'student',
          enrolled_courses: JSON.stringify(['1', '2']),
          assigned_courses: null,
        },
        {
          id: ulid(),
          name: 'Student 7',
          email: 'student7@example.com',
          role: 'student',
          enrolled_courses: JSON.stringify(['1', '2', '3']),
          assigned_courses: null,
        },
        {
          id: ulid(),
          name: 'Student 8',
          email: 'student8@example.com',
          role: 'student',
          enrolled_courses: JSON.stringify([]),
          assigned_courses: null,
        },
        // App Admin
        {
          id: ulid(),
          name: 'App Admin',
          email: 'admin@example.com',
          role: 'app_admin',
          enrolled_courses: JSON.stringify([]),
          assigned_courses: JSON.stringify(allCourseIds),
        },
        // Course Admins
        {
          id: ulid(),
          name: 'Course Admin 1',
          email: 'courseadmin1@example.com',
          role: 'course_admin',
          enrolled_courses: JSON.stringify([]),
          assigned_courses: JSON.stringify(['1']),
        },
        {
          id: ulid(),
          name: 'Course Admin 2',
          email: 'courseadmin2@example.com',
          role: 'course_admin',
          enrolled_courses: JSON.stringify([]),
          assigned_courses: JSON.stringify(['2']),
        },
        {
          id: ulid(),
          name: 'Course Admin 3',
          email: 'courseadmin3@example.com',
          role: 'course_admin',
          enrolled_courses: JSON.stringify([]),
          assigned_courses: JSON.stringify(['3']),
        },
        {
          id: ulid(),
          name: 'Course Admin 4',
          email: 'courseadmin4@example.com',
          role: 'course_admin',
          enrolled_courses: JSON.stringify([]),
        },
        // Authors
        {
          id: ulid(),
          name: 'Author 1',
          email: 'author1@example.com',
          role: 'author',
          enrolled_courses: JSON.stringify([]),
          assigned_courses: JSON.stringify(['1']),
        },
        {
          id: ulid(),
          name: 'Author 2',
          email: 'author2@example.com',
          role: 'author',
          enrolled_courses: JSON.stringify([]),
          assigned_courses: JSON.stringify(['2']),
        },
        {
          id: ulid(),
          name: 'Author 3',
          email: 'author3@example.com',
          role: 'author',
          enrolled_courses: JSON.stringify([]),
          assigned_courses: JSON.stringify(['3']),
        },
        {
          id: ulid(),
          name: 'Author 4',
          email: 'author4@example.com',
          role: 'author',
          enrolled_courses: JSON.stringify([]),
          assigned_courses: JSON.stringify(['2', '3']),
        },
      ]

      const usersWithDates = usersData.map(user => {
        const { createdDate, updatedDate } = randomDateGenerator({
          start: 365,
          end: 14,
          includeUpdated: true,
          chanceOfUpdate: 0.5,
        })

        return {
          ...user,
          created_at: createdDate,
          updated_at: updatedDate || undefined,
        }
      })

      await db.insert(Users).values(usersWithDates)

      console.log('Users seeded')

      // ====================================================================

      // Seed Feedback
      console.log('Seeding Feedback...')
      const statuses = ['submitted', 'assigned', 'in_progress', 'pending_publication', 'resolved', 'no_action_required']
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

      const allUsers = await getAllUsers()
      const studentUsers = allUsers.filter(user => user.role === 'student')
      const adminUsers = allUsers.filter(user => ['app_admin', 'course_admin', 'author'].includes(user.role))

      if (studentUsers.length === 0 || adminUsers.length === 0) {
        console.warn(`Not enough users to seed feedback. Skipping feedback seeding.`)
      } else {
        for (const status of statuses) {
          for (const category of categories) {
            for (const rating of ratings) {
              const studentUser = getRandomElement(studentUsers)!
              const adminUser = getRandomElement(adminUsers)!

              const { createdDate, updatedDate } = randomDateGenerator({
                start: studentUser?.created_at,
                end: new Date(),
                includeUpdated: true,
                chanceOfUpdate: 0.7,
              })

              feedbackData.push({
                id: ulid(),
                student_id: studentUser.id,
                section_id: String(Math.floor(Math.random() * 27) + 1), // Random section (1-27)
                assigned_to_id: ['assigned', 'in_progress', 'pending_publication', 'resolved'].includes(status)
                  ? adminUser?.id
                  : null,
                feedback_text: JSON.stringify({
                  content: `This is ${status} ${category} feedback with a rating of ${rating}.`,
                  created_at: createdDate,
                }),
                rating: rating,
                status: status,
                category: category,
                github_issue_link: ['in_progress', 'pending_publication', 'resolved'].includes(status)
                  ? `https://github.com/example/repo/issues/${feedbackId}`
                  : null,
                created_at: createdDate,
                updated_at: updatedDate || undefined,
              })
            }
          }
        }
      }

      await db.insert(Feedback).values(feedbackData)
      console.log('Feedback seeded')

      // ====================================================================

      // Seed Notes
      console.log('Seeding Notes...')
      let noteId = 1

      const courseTopics = [
        ['variables', 'functions', 'objects', 'arrays', 'async programming'],
        ['components', 'props', 'state', 'hooks', 'context'],
        ['data types', 'functions', 'modules', 'classes', 'file I/O'],
      ]

      for (let userId = 1; userId <= 8; userId++) {
        // Determine the number of notes for this user
        const numberOfNotes = entriesGenerator(3, 8)

        for (let i = 0; i < numberOfNotes; i++) {
          const courseId = entriesGenerator(1, 3)
          const chapterId = entriesGenerator((courseId - 1) * 2 + 1, courseId * 2)
          const sectionId = entriesGenerator((chapterId - 1) * 3 + 1, chapterId * 3)
          // const topic = getRandomElement(courseTopics[courseId - 1]!)
          const topic = () => {
            const randomElement = getRandomElement(courseTopics[courseId - 1]!)
            if (randomElement === undefined) {
              return 'Generic Course'
            }
          }

          const noteType = entriesGenerator(1, 3) // 1: note_text only, 2: highlighted_text only, 3: both

          let noteData = {
            id: ulid(),
            student_id: String(userId),
            section_id: String(sectionId),
            note_text: null as string | null,
            highlighted_text: null as string | null,
          }

          if (noteType === 1 || noteType === 3) {
            noteData.note_text = JSON.stringify({
              content: `This section on ${topic} in ${['JavaScript', 'React', 'Python'][courseId - 1]} was very informative. I learned that ${topic} is crucial for ${['building interactive web applications', 'creating reusable UI components', 'developing efficient and readable code'][courseId - 1]}. Need to practice more with ${topic} to fully grasp the concept.`,
              tags: [topic, 'important', 'review'],
              created_at: new Date(),
            })
          }

          if (noteType === 2 || noteType === 3) {
            noteData.highlighted_text = JSON.stringify({
              content: `${topic} in ${['JavaScript', 'React', 'Python'][courseId - 1]} allows developers to ${['write more efficient and maintainable code', 'create dynamic and responsive user interfaces', 'handle complex data structures and algorithms'][courseId - 1]}.`,
              color: getRandomElement(['yellow', 'green', 'blue', 'red']),
              created_at: new Date(),
            })
          }

          await db.insert(Notes).values(noteData)
        }
      }

      console.log('Notes seeded')

      // ====================================================================

      // Seed User_Exercise_Progress
      console.log('Seeding User Exercise Progress...')
      const studentExerciseProgressData: {
        id: string
        student_id: string
        exercise_id: string
        score: number
        completed: boolean
        attempts: number
        last_attempt_at: Date
      }[] = []

      let progressId = 1

      // For each user
      for (let userId = 1; userId <= 7; userId++) {
        const user = await db
          .select()
          .from(Users)
          .where(eq(Users.id, String(userId)))
          .get()
        const enrolledCourses = JSON.parse(user?.enrolled_courses as string)

        // For each enrolled course
        for (const courseId of enrolledCourses) {
          const exercises = await db
            .select()
            .from(Exercises)
            .innerJoin(Sections, eq(Exercises.section_id, Sections.id))
            .where(eq(Sections.course_id, courseId))
            .all()

          // For each exercise in the course
          for (const exercise of exercises) {
            const completed = Math.random() > 0.3 // 70% chance of completion
            const score = completed ? Math.floor(Math.random() * 41) + 60 : Math.floor(Math.random() * 60) // 60-100 if completed, 0-59 if not
            const attempts = completed ? Math.floor(Math.random() * 3) + 1 : Math.floor(Math.random() * 2) + 1

            const { createdDate } = randomDateGenerator({
              start: 30,
              end: 0,
            })

            studentExerciseProgressData.push({
              id: ulid(),
              student_id: String(userId),
              exercise_id: exercise.Exercises.id,
              score,
              completed,
              attempts,
              last_attempt_at: createdDate,
            })
          }
        }
      }

      await db.insert(Student_Exercise_Progress).values(studentExerciseProgressData)
      console.log('User Exercise Progress seeded')

      // ====================================================================

      // Seed User_Progress
      console.log('Seeding User Progress...')
      const userProgressData: any[] = []

      // For each user (excluding user 8 who is not enrolled in any course)
      for (let userId = 1; userId <= 7; userId++) {
        const user = await db
          .select()
          .from(Users)
          .where(eq(Users.id, String(userId)))
          .get()
        if (!user) continue

        const enrolledCourses = JSON.parse(user?.enrolled_courses as string) as string[]

        // For each enrolled course
        for (const courseId of enrolledCourses) {
          const course = await db.select().from(Courses).where(eq(Courses.id, courseId)).get()
          if (!course) continue

          const sections = await db
            .select({ id: Sections.id })
            .from(Sections)
            .where(eq(Sections.course_id, courseId))
            .all()
          const totalSections = sections.length
          const completedCount = entriesGenerator(0, totalSections)
          const completedSections = getRandomSections(courseId, completedCount)
          const currentSection = sections[completedCount % totalSections]
          const currentSectionId = currentSection ? currentSection.id : (sections[0]?.id ?? null)

          const { createdDate: enrollmentDate } = randomDateGenerator({
            start: 90,
            end: 0,
          })
          let purchaseDate = null
          let expirationDate = null

          if (course.price !== null && course.price > 0) {
            const { createdDate: purchaseCreatedDate } = randomDateGenerator({
              start: enrollmentDate,
              end: new Date(),
            })
            purchaseDate = purchaseCreatedDate

            if (course.purchase_active_length) {
              expirationDate = new Date(purchaseDate.getTime() + course.purchase_active_length * 24 * 60 * 60 * 1000)
            }
          }

          const { createdDate: lastAccessedDate } = randomDateGenerator({
            start: 7,
            end: 0,
          })

          const { createdDate, updatedDate } = randomDateGenerator({
            start: enrollmentDate,
            end: new Date(),
            includeUpdated: true,
            chanceOfUpdate: 0.7,
          })

          userProgressData.push({
            id: ulid(),
            user_id: String(userId),
            course_id: courseId,
            current_section_id: currentSectionId,
            completed_sections: JSON.stringify(completedSections),
            enrollment_date: enrollmentDate,
            purchase_date: purchaseDate,
            expiration_date: expirationDate,
            last_accessed_at: lastAccessedDate,
            created_at: createdDate,
            updated_at: updatedDate,
          })
        }
      }

      await db.insert(Student_Progress).values(userProgressData)
      console.log('User Progress seeded')

      console.log('Seed process completed successfully')
    }
  } catch (error) {
    console.error('Error during seeding:', error)
  }
}
```

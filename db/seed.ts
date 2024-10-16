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
    await db.insert(Courses).values({
      title: 'Javascript Fundamentals',
      description: 'Learn the fundamentals of JavaScript programming',
      slug: 'javascript-fundamentals',
      subject_area: 'Programming',
      level: 'beginner',
      tags: JSON.stringify(['javascript', 'web development', 'programming', 'ES14', 'ECMAScript 2023']),
      price: 49.99,
      purchase_active_length: 1825, // course is available for 5 years
    })

    await db.insert(Courses).values({
      title: 'Advanced React Development',
      description: 'Master React and build complex applications',
      slug: 'advanced-react',
      subject_area: 'Web Development',
      level: 'advanced',
      tags: JSON.stringify(['react', 'javascript', 'frontend', 'typescript', 'react18', 'react19']),
      price: 79.99,
      purchase_active_length: null, // course is available to student indefinitely
    })

    await db.insert(Courses).values({
      title: 'Python Fundamentals',
      description: 'Master Python and build complex applications',
      slug: 'python-fundamentals',
      subject_area: 'Python Development',
      level: 'advanced',
      tags: JSON.stringify(['python', 'backend']),
      price: 69.99,
      purchase_active_length: null, // course is available to student indefinitely
    })

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
    ])
    console.log('Chapters seeded')
    // Seed Sections
    console.log('Seeding Sections...')
    const sections = [
      { id: '1', course_id: '1', chapter_id: '1', title: 'Lesson 1', content_type: 'lesson', order_number: 1 },
      { id: '2', course_id: '1', chapter_id: '1', title: 'Exercise 1', content_type: 'exercise', order_number: 2 },
      { id: '3', course_id: '1', chapter_id: '1', title: 'Recap 1', content_type: 'recap', order_number: 3 },
      { id: '4', course_id: '1', chapter_id: '2', title: 'Lesson 2', content_type: 'lesson', order_number: 1 },
      { id: '5', course_id: '1', chapter_id: '2', title: 'Exercise 2', content_type: 'exercise', order_number: 2 },
      { id: '6', course_id: '1', chapter_id: '2', title: 'Recap 2', content_type: 'recap', order_number: 3 },
      { id: '7', course_id: '2', chapter_id: '3', title: 'Lesson 3', content_type: 'lesson', order_number: 1 },
      { id: '8', course_id: '2', chapter_id: '3', title: 'Exercise 3', content_type: 'exercise', order_number: 2 },
      { id: '9', course_id: '2', chapter_id: '3', title: 'Recap 3', content_type: 'recap', order_number: 3 },
      { id: '10', course_id: '2', chapter_id: '4', title: 'Lesson 4', content_type: 'lesson', order_number: 1 },
      { id: '11', course_id: '2', chapter_id: '4', title: 'Exercise 4', content_type: 'exercise', order_number: 2 },
      { id: '12', course_id: '2', chapter_id: '4', title: 'Recap 4', content_type: 'recap', order_number: 3 },
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
      { id: '1', section_id: '2', difficulty: 'easy', estimated_time_minutes: 10 },
      { id: '2', section_id: '5', difficulty: 'medium', estimated_time_minutes: 15 },
      { id: '3', section_id: '8', difficulty: 'medium', estimated_time_minutes: 20 },
      { id: '4', section_id: '11', difficulty: 'hard', estimated_time_minutes: 25 },
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
    await db.insert(Users).values([
      {
        id: '1',
        name: 'Student 1',
        email: 'student1@example.com',
        role: 'student',
        enrolled_courses: JSON.stringify(['1']),
      },
      {
        id: '2',
        name: 'Student 2',
        email: 'student2@example.com',
        role: 'student',
        enrolled_courses: JSON.stringify(['2']),
      },
      {
        id: '3',
        name: 'Student 3',
        email: 'student3@example.com',
        role: 'student',
        enrolled_courses: JSON.stringify(['1', '2']),
      },
      {
        id: '4',
        name: 'Student 4',
        email: 'student4@example.com',
        role: 'student',
        enrolled_courses: JSON.stringify(['2']),
      },
      {
        id: '5',
        name: 'App Admin',
        email: 'admin@example.com',
        role: 'app_admin',
        enrolled_courses: JSON.stringify([]),
      },
      {
        id: '6',
        name: 'Course Admin 1',
        email: 'courseadmin1@example.com',
        role: 'course_admin',
        enrolled_courses: JSON.stringify(['1']),
      },
      {
        id: '7',
        name: 'Course Admin 2',
        email: 'courseadmin2@example.com',
        role: 'course_admin',
        enrolled_courses: JSON.stringify(['2']),
      },
      {
        id: '8',
        name: 'Author 1',
        email: 'author1@example.com',
        role: 'author',
        enrolled_courses: JSON.stringify(['1']),
      },
      {
        id: '9',
        name: 'Author 2',
        email: 'author2@example.com',
        role: 'author',
        enrolled_courses: JSON.stringify(['2']),
      },
    ])
    console.log('Users seeded')

    // Seed Feedback
    console.log('Seeding Feedback...')
    await db.insert(Feedback).values([
      {
        id: '1',
        user_id: '1',
        section_id: '1',
        feedback_text: 'Great explanation of variables!',
        rating: 5,
        status: 'approved',
      },
      {
        id: '2',
        user_id: '2',
        section_id: '7',
        feedback_text: 'The React component explanation could be clearer.',
        rating: 3,
        status: 'pending',
      },
    ])
    console.log('Feedback seeded')

    // Seed Notes
    console.log('Seeding Notes...')
    let noteId = 1
    for (let courseId = 1; courseId <= 2; courseId++) {
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
      {
        id: '1',
        user_id: '1',
        exercise_id: '1',
        score: 100,
        completed: true,
        attempts: 1,
        last_attempt_at: new Date(),
      },
      { id: '2', user_id: '2', exercise_id: '1', score: 0, completed: false, attempts: 0, last_attempt_at: new Date() },
      { id: '3', user_id: '1', exercise_id: '2', score: 0, completed: false, attempts: 3, last_attempt_at: new Date() },
      { id: '4', user_id: '2', exercise_id: '2', score: 0, completed: false, attempts: 0, last_attempt_at: new Date() },
      {
        id: '5',
        user_id: '1',
        exercise_id: '3',
        score: 100,
        completed: true,
        attempts: 3,
        last_attempt_at: new Date(),
      },
      {
        id: '6',
        user_id: '2',
        exercise_id: '3',
        score: 100,
        completed: true,
        attempts: 1,
        last_attempt_at: new Date(),
      },
      { id: '7', user_id: '3', exercise_id: '3', score: 0, completed: false, attempts: 0, last_attempt_at: new Date() },
      {
        id: '8',
        user_id: '1',
        exercise_id: '4',
        score: 100,
        completed: true,
        attempts: 3,
        last_attempt_at: new Date(),
      },
      {
        id: '9',
        user_id: '2',
        exercise_id: '4',
        score: 100,
        completed: true,
        attempts: 1,
        last_attempt_at: new Date(),
      },
      {
        id: '10',
        user_id: '3',
        exercise_id: '4',
        score: 0,
        completed: false,
        attempts: 0,
        last_attempt_at: new Date(),
      },
    ])
    console.log('User Exercise Progress seeded')

    // Seed User_Progress
    console.log('Seeding User Progress...')
    await db.insert(User_Progress).values([
      {
        id: '1',
        user_id: '1',
        course_id: '1',
        current_section_id: '3',
        completed_sections: JSON.stringify(['1', '2']),
        last_accessed_at: new Date(),
      },
      {
        id: '2',
        user_id: '2',
        course_id: '2',
        current_section_id: '9',
        completed_sections: JSON.stringify(['7', '8']),
        last_accessed_at: new Date(),
      },
      {
        id: '3',
        user_id: '3',
        course_id: '1',
        current_section_id: '2',
        completed_sections: JSON.stringify(['1']),
        last_accessed_at: new Date(),
      },
      {
        id: '4',
        user_id: '3',
        course_id: '2',
        current_section_id: '8',
        completed_sections: JSON.stringify(['7']),
        last_accessed_at: new Date(),
      },
      {
        id: '5',
        user_id: '4',
        course_id: '2',
        current_section_id: '7',
        completed_sections: JSON.stringify([]),
        last_accessed_at: new Date(),
      },
    ])
    console.log('User Progress seeded')

    console.log('Seed process completed successfully')
  } catch (error) {
    console.error('Error during seeding:', error)
  }
}

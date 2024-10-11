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

export default async function () {
  function capitalize(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1)
  }

  // Seed Courses
  await db.insert(Courses).values([
    {
      id: '1',
      title: 'Introduction to JavaScript',
      description: 'Learn the basics of JavaScript programming',
      slug: 'intro-to-javascript',
      subject_area: 'Programming',
      level: 'beginner',
      tags: JSON.stringify(['javascript', 'web development', 'programming']),
      price: 49.99,
    },
    {
      id: '2',
      title: 'Advanced React Development',
      description: 'Master React and build complex applications',
      slug: 'advanced-react',
      subject_area: 'Web Development',
      level: 'advanced',
      tags: JSON.stringify(['react', 'javascript', 'frontend']),
      price: 79.99,
    },
  ])

  // Seed Chapters
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

  // Seed Sections
  async function seedSections() {
    const sectionTypes = ['lesson', 'exercise', 'recap']
    let globalSectionId = 1

    for (let courseId = 1; courseId <= 2; courseId++) {
      for (let chapterNumber = 1; chapterNumber <= 2; chapterNumber++) {
        const chapterId = (courseId - 1) * 2 + chapterNumber

        for (let sectionType of sectionTypes) {
          await db.insert(Sections).values({
            id: String(globalSectionId),
            course_id: String(courseId),
            chapter_id: String(chapterId),
            title: `${capitalize(sectionType)} ${globalSectionId}`,
            description: `Description for ${sectionType} ${globalSectionId}`,
            order_number: globalSectionId,
            content_type: sectionType,
            content: JSON.stringify({ text: `Content for ${sectionType} ${globalSectionId}` }),
            exercise_id: sectionType === 'exercise' ? String(courseId) : null,
          })

          globalSectionId++
        }
      }
    }
  }

  // Seed Exercises
  await db.insert(Exercises).values([
    {
      id: '1',
      section_id: '2', // Assuming section 2 is the exercise section for course 1
      instructions: 'Create a variable and assign it a value',
      browser_html: JSON.stringify({ html: '<div id="app"></div>' }),
      code_files: JSON.stringify({
        'script.js': '// Your code here',
        'styles.css': '/* Your styles here */',
      }),
      tests: JSON.stringify([
        { test: 'assert(typeof variable !== "undefined");' },
        { test: 'assert(variable === 42);' },
      ]),
      hints: JSON.stringify(['Remember to use let or const to declare a variable', 'The value should be a number']),
      difficulty: 'easy',
      default_solution: JSON.stringify({ 'script.js': 'let myVariable = 42;' }),
      user_solution: JSON.stringify({}),
      estimated_time_minutes: 5,
    },
    {
      id: '2',
      section_id: '8', // Assuming section 8 is the exercise section for course 2
      instructions: 'Create a React component',
      browser_html: JSON.stringify({ html: '<div id="root"></div>' }),
      code_files: JSON.stringify({
        'App.js': '// Your React component here',
        'styles.css': '/* Your styles here */',
      }),
      tests: JSON.stringify([
        { test: 'assert(typeof App === "function");' },
        { test: 'assert(App.prototype instanceof React.Component);' },
      ]),
      hints: JSON.stringify(['Use the class syntax to create a component', 'Remember to extend React.Component']),
      difficulty: 'medium',
      default_solution: JSON.stringify({
        'App.js': 'class App extends React.Component { render() { return <div>Hello World</div>; } }',
      }),
      user_solution: JSON.stringify({}),
      estimated_time_minutes: 10,
    },
  ])

  // Seed Users
  await db.insert(Users).values([
    {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      role: 'student',
      enrolled_courses: JSON.stringify(['1']),
    },
    {
      id: '2',
      name: 'Jane Smith',
      email: 'jane@example.com',
      role: 'student',
      enrolled_courses: JSON.stringify(['2']),
    },
    {
      id: '3',
      name: 'Alice Johnson',
      email: 'alice@example.com',
      role: 'student',
      enrolled_courses: JSON.stringify(['1', '2']),
    },
    {
      id: '4',
      name: 'Bob Williams',
      email: 'bob@example.com',
      role: 'student',
      enrolled_courses: JSON.stringify([]),
    },
    {
      id: '5',
      name: 'Admin User',
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

  // Seed Feedback
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

  // Seed Notes
  for (let courseId = 1; courseId <= 2; courseId++) {
    for (let chapterId = (courseId - 1) * 2 + 1; chapterId <= courseId * 2; chapterId++) {
      for (let sectionId = (chapterId - 1) * 3 + 1; sectionId <= chapterId * 3; sectionId++) {
        await db.insert(Notes).values([
          {
            id: `${courseId}${chapterId}${sectionId}1`,
            user_id: '1',
            section_id: String(sectionId),
            note_text: `Note for section ${sectionId}`,
            highlighted_text: `Highlight for section ${sectionId}`,
          },
          {
            id: `${courseId}${chapterId}${sectionId}2`,
            user_id: '1',
            section_id: String(sectionId),
            note_text: `Another note for section ${sectionId}`,
            highlighted_text: null,
          },
          {
            id: `${courseId}${chapterId}${sectionId}3`,
            user_id: '1',
            section_id: String(sectionId),
            note_text: null,
            highlighted_text: `Another highlight for section ${sectionId}`,
          },
        ])
      }
    }
  }

  // Seed User_Exercise_Progress
  await db.insert(User_Exercise_Progress).values([
    {
      id: '1',
      user_id: '1',
      exercise_id: '1',
      score: 100,
      completed: true,
      attempts: 1,
      last_attempt_at: new Date().toISOString(),
    },
    {
      id: '2',
      user_id: '1',
      exercise_id: '2',
      score: 0,
      completed: false,
      attempts: 3,
      last_attempt_at: new Date().toISOString(),
    },
    {
      id: '3',
      user_id: '2',
      exercise_id: '1',
      score: 100,
      completed: true,
      attempts: 1,
      last_attempt_at: new Date().toISOString(),
    },
    {
      id: '4',
      user_id: '2',
      exercise_id: '2',
      score: 0,
      completed: false,
      attempts: 3,
      last_attempt_at: new Date().toISOString(),
    },
  ])

  // Seed User_Progress
  await db.insert(User_Progress).values([
    {
      id: '1',
      user_id: '1',
      course_id: '1',
      current_section_id: '3',
      completed_sections: JSON.stringify(['1', '2']),
      last_accessed_at: new Date().toISOString(),
    },
    {
      id: '2',
      user_id: '2',
      course_id: '2',
      current_section_id: '9',
      completed_sections: JSON.stringify(['7', '8']),
      last_accessed_at: new Date().toISOString(),
    },
    {
      id: '3',
      user_id: '3',
      course_id: '1',
      current_section_id: '2',
      completed_sections: JSON.stringify(['1']),
      last_accessed_at: new Date().toISOString(),
    },
    {
      id: '4',
      user_id: '3',
      course_id: '2',
      current_section_id: '8',
      completed_sections: JSON.stringify(['7']),
      last_accessed_at: new Date().toISOString(),
    },
  ])
}

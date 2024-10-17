import { defineDb, defineTable, column, NOW } from 'astro:db'

const Courses = defineTable({
  columns: {
    id: column.text({ primaryKey: true }),
    title: column.text(),
    description: column.text(),
    slug: column.text({ unique: true }),
    subject_area: column.text(),
    level: column.text(),
    tags: column.json(),
    price: column.number({ optional: true, precision: 10, scale: 2 }),
    purchase_active_length: column.number({ optional: true }),
    created_at: column.date({ default: NOW }),
    updated_at: column.date({ default: NOW }),
  },
})

const Chapters = defineTable({
  columns: {
    id: column.text({ primaryKey: true }),
    course_id: column.text({ references: () => Courses.columns.id }),
    title: column.text(),
    description: column.text(),
    order_number: column.number(),
    estimated_time: column.text(),
    created_at: column.date({ default: NOW }),
    updated_at: column.date({ default: NOW }),
  },
  indexes: [{ on: ['course_id'] }],
})

const Exercises = defineTable({
  columns: {
    id: column.text({ primaryKey: true }),
    section_id: column.text({ references: () => Sections.columns.id }),
    instructions: column.text(),
    browser_html: column.json(),
    code_files: column.json(),
    tests: column.json(),
    hints: column.json(),
    difficulty: column.text(),
    default_solution: column.json(),
    user_solution: column.json(),
    estimated_time_minutes: column.number(),
    created_at: column.date({ default: NOW }),
    updated_at: column.date({ default: NOW }),
  },
  indexes: [{ on: ['section_id'] }],
})

const Feedback = defineTable({
  columns: {
    id: column.text({ primaryKey: true }),
    user_id: column.text({ references: () => Users.columns.id }),
    section_id: column.text({ references: () => Sections.columns.id }),
    feedback_text: column.text(),
    rating: column.number({ optional: true }),
    status: column.text({ default: 'pending' }),
    category: column.text({ optional: true }),
    admin_notes: column.text({ optional: true }),
    github_issue_link: column.text({ optional: true }),
    created_at: column.date({ default: NOW }),
    updated_at: column.date({ default: NOW }),
  },
  indexes: [{ on: ['section_id'] }, { on: ['user_id'] }],
})

const Notes = defineTable({
  columns: {
    id: column.text({ primaryKey: true }),
    user_id: column.text({ references: () => Users.columns.id }),
    section_id: column.text({ references: () => Sections.columns.id }),
    note_text: column.json({ optional: true, default: {} }),
    highlighted_text: column.json({ optional: true, default: {} }),
    created_at: column.date({ default: NOW }),
    updated_at: column.date({ default: NOW }),
  },
  indexes: [{ on: ['section_id'] }, { on: ['user_id'] }],
})

const Sections = defineTable({
  columns: {
    id: column.text({ primaryKey: true }),
    course_id: column.text({ references: () => Courses.columns.id }),
    chapter_id: column.text({ references: () => Chapters.columns.id }),
    exercise_id: column.text({ optional: true, references: () => Exercises.columns.id }),
    title: column.text(),
    description: column.text(),
    order_number: column.number(),
    content_type: column.text(),
    content: column.json({ optional: true }),
    access_level: column.text({ default: 'purchased' }),
    created_at: column.date({ default: NOW }),
    updated_at: column.date({ default: NOW }),
  },
  indexes: [{ on: ['chapter_id'] }, { on: ['course_id'] }, { on: ['exercise_id'] }],
})

const User_Exercise_Progress = defineTable({
  columns: {
    id: column.text({ primaryKey: true }),
    user_id: column.text({ references: () => Users.columns.id }),
    exercise_id: column.text({ references: () => Exercises.columns.id }),
    score: column.number({ optional: true, default: 0 }),
    completed: column.boolean({ default: false }),
    attempts: column.number({ default: 0 }),
    last_attempt_at: column.date({ optional: true }),
    created_at: column.date({ default: NOW }),
    updated_at: column.date({ default: NOW }),
  },
  indexes: [{ on: ['exercise_id'] }, { on: ['user_id'] }],
})

const User_Progress = defineTable({
  columns: {
    id: column.text({ primaryKey: true }),
    user_id: column.text({ references: () => Users.columns.id }),
    course_id: column.text({ references: () => Courses.columns.id }),
    current_section_id: column.text({ references: () => Sections.columns.id }),
    completed_sections: column.json({ default: {} }),
    last_accessed_at: column.date({ optional: true }),
    enrollment_date: column.date(),
    purchase_date: column.date({ optional: true }),
    expiration_date: column.date({ optional: true }),
    created_at: column.date({ default: NOW }),
    updated_at: column.date({ default: NOW }),
  },
  indexes: [{ on: ['user_id'] }, { on: ['course_id'] }, { on: ['current_section_id'] }],
})

const Users = defineTable({
  columns: {
    id: column.text({ primaryKey: true }),
    name: column.text(),
    email: column.text({ unique: true }),
    avatar_url: column.text({ optional: true }),
    role: column.text({ default: 'student' }),
    enrolled_courses: column.json({ optional: true, default: [] }), // students
    assigned_courses: column.json({ optional: true, default: [] }), // course_admin and author
    auth_provider: column.text({ optional: true }),
    auth_provider_id: column.text({ optional: true }),
    github_username: column.text({ optional: true }),
    google_id: column.text({ optional: true }),
    gitlab_username: column.text({ optional: true }),
    bitbucket_username: column.text({ optional: true }),
    last_sign_in: column.date({ optional: true }),
    created_at: column.date({ default: NOW }),
    updated_at: column.date({ default: NOW }),
  },
})

export default defineDb({
  tables: {
    Courses,
    Chapters,
    Exercises,
    Sections,
    Users,
    Feedback,
    Notes,
    User_Exercise_Progress,
    User_Progress,
  },
})

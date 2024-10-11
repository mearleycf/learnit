import {
  db,
  Courses,
  Chapters,
  Exercises,
  Sections,
  Feedback,
  Notes,
  Users,
  User_Exercise_Progress,
  User_Progress,
} from 'astro:db'

// https://astro.build/db/seed
export default async function seed() {
  await db.insert(Courses).values([
    {
      id: 1,
      title: 'Learn Javascript',
      description: 'Learn some javascript',
      slug: 'javascript',
      subject_area: 'javascript',
      level: 'beginner',
      tags: JSON.stringify(['javascript', 'web development', 'programming']),
      price: 80.0,
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
    {
      id: '3',
      title: 'Python for Data Science',
      description: 'Use Python for data analysis and machine learning',
      slug: 'python-data-science',
      subject_area: 'Data Science',
      level: 'intermediate',
      tags: JSON.stringify(['python', 'data science', 'machine learning']),
      price: 69.99,
    },
  ])
}

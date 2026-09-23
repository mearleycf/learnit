import type { ChapterConfig, CourseConfig, ExerciseConfig, SectionConfig } from '@db/seed_config/types/seed-types'
import { arraysLesson, arraysRecap, lessonListExercise } from '../content/js-arrays'
import { introToJavascriptLesson, jsBasicsRecap, variablesExercise } from '../content/js-basics'
import { functionsLesson, functionsRecap, progressExercise } from '../content/js-functions'
import { courseDateOptions } from '../date-options'
import { createExerciseData } from '../utils'

export const javascriptFundamentals: CourseConfig = {
  // course 1
  seedSequence: 1,
  title: 'JavaScript Fundamentals',
  description: 'Learn the fundamentals of JavaScript programming',
  slug: 'javascript-fundamentals',
  subject_area: 'Programming',
  level: 'beginner',
  tags: ['javascript', 'web development', 'programming', 'ES14', 'ECMAScript 2023'],
  price: 49.99,
  purchase_active_length: 1825, // 5 years
  chapters: [
    {
      // course 1, chapter 1
      title: 'Javascript Basics',
      description: 'Learn the basics of JavaScript',
      seedSequence: 1,
      chapter_display_number: 1,
      estimated_time: '1 hour',
      sections: [
        {
          // course 1, chapter 1, section 1
          seedSequence: 1,
          title: 'Introduction to JavaScript',
          description: 'What JavaScript is, where it runs, and how a program is structured',
          content_type: 'lesson',
          content: { content_type: 'lesson', lesson: introToJavascriptLesson },
          section_display_number: 1,
          access_level: 'free',
        } as SectionConfig,
        {
          // course 1, chapter 1, section 2
          seedSequence: 2,
          title: 'Variables and Data Types',
          description: 'Store values with const and let, and meet the primitive types',
          content_type: 'exercise',
          content: { content_type: 'exercise' },
          section_display_number: 2,
          access_level: 'free',
          exercise: variablesExercise,
        } as SectionConfig,
        {
          // course 1, chapter 1, section 3
          seedSequence: 3,
          title: 'JavaScript Basics Recap',
          description: 'What to take away from JavaScript Basics',
          content_type: 'recap',
          content: { content_type: 'recap', recap: jsBasicsRecap },
          section_display_number: 3,
          access_level: 'free',
        } as SectionConfig,
      ],
      // end of course 1, chapter 1
    } as ChapterConfig,
    {
      // course 1, chapter 2
      title: 'Javascript Functions',
      description: 'Learn how to write functions in JavaScript',
      seedSequence: 2,
      chapter_display_number: 2,
      estimated_time: '3 hours',
      sections: [
        {
          // course 1, chapter 2, section 1
          seedSequence: 4,
          title: 'Functions in JavaScript',
          description: 'Name a job, return a value, and split code across files',
          content_type: 'lesson',
          content: { content_type: 'lesson', lesson: functionsLesson },
          section_display_number: 4,
          access_level: 'purchased',
        } as SectionConfig,
        {
          // course 1, chapter 2, section 2
          seedSequence: 5,
          title: 'Object-Oriented JavaScript',
          description: 'Build a progress summary across two modules',
          content_type: 'exercise',
          content: { content_type: 'exercise' },
          section_display_number: 5,
          access_level: 'purchased',
          exercise: progressExercise,
        } as SectionConfig,
        {
          // course 1, chapter 2, section 3
          seedSequence: 6,
          title: 'Functions and Objects Recap',
          description: 'What to take away from functions and objects',
          content_type: 'recap',
          content: { content_type: 'recap', recap: functionsRecap },
          section_display_number: 6,
          access_level: 'purchased',
        } as SectionConfig,
      ],
      // end of course 1, chapter 2
    } as ChapterConfig,
    {
      // course 1, chapter 3
      seedSequence: 3,
      title: 'Javascript Arrays',
      description: 'Learn how to work with arrays in JavaScript',
      chapter_display_number: 3,
      estimated_time: '3 hours',
      sections: [
        {
          // course 1, chapter 3, section 1
          seedSequence: 7,
          title: 'Introduction to Arrays',
          description: 'Ordered lists, and the three methods you will use constantly',
          content_type: 'lesson',
          content: { content_type: 'lesson', lesson: arraysLesson },
          section_display_number: 1,
          access_level: 'purchased',
        } as SectionConfig,
        {
          // course 1, chapter 3, section 2
          seedSequence: 8,
          title: 'Array Methods',
          description: 'Explore commonly used array methods in JavaScript',
          content_type: 'lesson',
          content: {},
          section_display_number: 2,
          access_level: 'purchased',
        } as SectionConfig,
        {
          // course 1, chapter 3, section 3
          seedSequence: 9,
          title: 'Basic Array Manipulation',
          description: 'Render a course outline into the page',
          content_type: 'exercise',
          content: { content_type: 'exercise' },
          section_display_number: 3,
          access_level: 'purchased',
          exercise: lessonListExercise,
        } as SectionConfig,
        {
          // course 1, chapter 3, section 4
          seedSequence: 10,
          title: 'Array Methods Practice',
          description: 'Practice using array methods in JavaScript',
          content_type: 'exercise',
          content: {},
          section_display_number: 4,
          exercise: createExerciseData(
            1,
            1,
            'Use array methods (map, filter, reduce) to transform an array of user objects. Calculate total user score, filter active users, and create a new array with formatted user names.',
            'course 1, chapter 3, section 4 exercise 2 of 3',
          ) as ExerciseConfig,
          access_level: 'purchased',
        } as SectionConfig,
        {
          // course 1, chapter 3, section 5
          seedSequence: 11,
          title: 'Array Methods Practice 2',
          description: 'Practice using array methods in JavaScript',
          content_type: 'exercise',
          content: {},
          section_display_number: 5,
          exercise: createExerciseData(
            1,
            1,
            'Implement advanced array operations: sort an array of objects by multiple criteria, remove duplicates from an array, and flatten a nested array structure.',
            'course 1, chapter 3, section 5 exercise 3 of 3',
          ) as ExerciseConfig,
          access_level: 'purchased',
        } as SectionConfig,
        {
          // course 1, chapter 3, section 6
          seedSequence: 12,
          title: 'Array Recap',
          description: 'What to take away from arrays',
          content_type: 'recap',
          content: { content_type: 'recap', recap: arraysRecap },
          section_display_number: 6,
          access_level: 'purchased',
        } as SectionConfig,
      ],
      // end of course 1, chapter 3
    } as ChapterConfig,
  ],
  dateConfig: courseDateOptions.courses,
  // end of course 1
}

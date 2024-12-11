import type { CourseConfig, SectionConfig, ExerciseConfig, ChapterConfig } from '@db/seed_config/types/seed-types'
import { courseDateOptions } from '../date-options'
import { createExerciseData } from '../utils'
import { ulid } from 'ulidx'

export const javascriptFundamentals: CourseConfig = {
  // course 1
  id: ulid(),
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
      id: ulid(),
      title: 'Javascript Basics',
      description: 'Learn the basics of JavaScript',
      seedSequence: 1,
      chapter_display_number: 1,
      estimated_time: '1 hour',
      sections: [
        {
          // course 1, chapter 1, section 1
          id: ulid(),
          seedSequence: 1,
          title: 'Introduction to JavaScript',
          description: 'Learn the basics of JavaScript',
          content_type: 'lesson',
          content: {},
          section_display_number: 1,
          access_level: 'free',
        } as SectionConfig,
        {
          // course 1, chapter 1, section 2
          id: ulid(),
          seedSequence: 2,
          title: 'Variables and Data Types',
          description: 'Learn about variables and data types in JavaScript',
          content_type: 'exercise',
          content: {},
          section_display_number: 2,
          access_level: 'free',
          exercise: createExerciseData(
            1,
            1,
            'Fill in the blank',
            'course 1, chapter 1, section 2 exercise 1 of 1',
          ) as ExerciseConfig,
        } as SectionConfig,
        {
          // course 1, chapter 1, section 3
          id: ulid(),
          seedSequence: 3,
          title: 'JavaScript Basics Recap',
          description: 'Learn about variables and data types in JavaScript',
          content_type: 'recap',
          content: {},
          section_display_number: 3,
          access_level: 'free',
        } as SectionConfig,
      ],
      // end of course 1, chapter 1
    } as ChapterConfig,
    {
      // course 1, chapter 2
      id: ulid(),
      title: 'Javascript Functions',
      description: 'Learn how to write functions in JavaScript',
      seedSequence: 2,
      chapter_display_number: 2,
      estimated_time: '3 hours',
      sections: [
        {
          // course 1, chapter 2, section 1
          id: ulid(),
          seedSequence: 4,
          title: 'Functions in JavaScript',
          description: 'Learn about functions in JavaScript',
          content_type: 'lesson',
          content: {},
          section_display_number: 4,
          access_level: 'purchased',
        } as SectionConfig,
        {
          // course 1, chapter 2, section 2
          id: ulid(),
          seedSequence: 5,
          title: 'Object-Oriented JavaScript',
          description: 'Explore object-oriented programming in JavaScript',
          content_type: 'exercise',
          content: {},
          section_display_number: 5,
          access_level: 'purchased',
          exercise: createExerciseData(
            2,
            1,
            'Create a function called greetUser that accepts a name parameter and returns a greeting string. Then create an object called user with properties for name and age, and create a method that returns a description of the user.',
            'course 1, chapter 2, section 2 exercise 1 of 1',
          ) as ExerciseConfig,
        } as SectionConfig,
        {
          // course 1, chapter 2, section 3
          id: ulid(),
          seedSequence: 6,
          title: 'Functions and Objects Recap',
          description: 'Review functions and object-oriented concepts in JavaScript',
          content_type: 'recap',
          content: {},
          section_display_number: 6,
          access_level: 'purchased',
        } as SectionConfig,
      ],
      // end of course 1, chapter 2
    } as ChapterConfig,
    {
      // course 1, chapter 3
      id: ulid(),
      seedSequence: 3,
      title: 'Javascript Arrays',
      description: 'Learn how to work with arrays in JavaScript',
      chapter_display_number: 3,
      estimated_time: '3 hours',
      sections: [
        {
          // course 1, chapter 3, section 1
          id: ulid(),
          seedSequence: 7,
          title: 'Introduction to Arrays',
          description: 'Learn the basics of arrays in JavaScript',
          content_type: 'lesson',
          content: {},
          section_display_number: 1,
          access_level: 'purchased',
        } as SectionConfig,
        {
          // course 1, chapter 3, section 2
          id: ulid(),
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
          id: ulid(),
          seedSequence: 9,
          title: 'Basic Array Manipulation',
          description: 'Practice basic array manipulation',
          content_type: 'exercise',
          content: {},
          section_display_number: 3,
          access_level: 'purchased',
          exercise: createExerciseData(
            1,
            1,
            'Create an array of numbers and implement functions to find the largest number, calculate the average, and filter out negative numbers.',
            'course 1, chapter 3, section 3 exercise 1 of 3',
          ) as ExerciseConfig,
        } as SectionConfig,
        {
          // course 1, chapter 3, section 4
          id: ulid(),
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
          id: ulid(),
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
          id: ulid(),
          seedSequence: 12,
          title: 'Array Recap',
          description: 'Review array concepts in JavaScript',
          content_type: 'recap',
          content: {},
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

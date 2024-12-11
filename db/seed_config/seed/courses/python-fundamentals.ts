import type { CourseConfig, SectionConfig, ExerciseConfig, ChapterConfig } from '@db/seed_config/types/seed-types'
import { courseDateOptions } from '../date-options'
import { createExerciseData } from '../utils'
import { ulid } from 'ulidx'

export const pythonFundamentals: CourseConfig = {
  // course 3
  id: ulid(),
  seedSequence: 3,
  title: 'Python Fundamentals',
  description: 'Master Python and build complex applications',
  slug: 'python-fundamentals',
  subject_area: 'Python Development',
  level: 'beginner',
  tags: ['python', 'backend'],
  price: 0,
  purchase_active_length: null,
  chapters: [
    {
      // course 3, chapter 1
      id: ulid(),
      title: 'Python Basics',
      description: 'Learn the fundamentals of Python syntax and basic programming concepts',
      seedSequence: 7,
      chapter_display_number: 1,
      estimated_time: '3 hours',
      sections: [
        {
          // course 3, chapter 1, section 1
          id: ulid(),
          seedSequence: 25,
          title: 'Introduction to Python',
          description: 'Getting started with Python programming',
          content_type: 'lesson',
          content: {},
          section_display_number: 1,
          access_level: 'free',
        } as SectionConfig,
        {
          // course 3, chapter 1, section 2
          id: ulid(),
          seedSequence: 26,
          title: 'Python Syntax Basics',
          description: 'Understanding Python syntax and basic programming concepts',
          content_type: 'exercise',
          content: {},
          section_display_number: 2,
          access_level: 'free',
          // course 3, chapter 1, section 2, exercise 1 of 3
          exercise: createExerciseData(
            11,
            1,
            'Write Python code that demonstrates basic syntax: create variables of different types, use conditional statements, and implement a simple loop structure.',
            'course 3, chapter 1, section 2, exercise 1 of 3',
          ) as ExerciseConfig,
        } as SectionConfig,
        {
          // course 3, chapter 1, section 3
          id: ulid(),
          seedSequence: 27,
          title: 'Variables and Data Types',
          description: 'Learn about Python variables and fundamental data types',
          content_type: 'lesson',
          content: {},
          section_display_number: 3,
          access_level: 'free',
        } as SectionConfig,
        {
          // course 3, chapter 1, section 4
          id: ulid(),
          seedSequence: 28,
          title: 'Working with Numbers',
          description: 'Practice working with numerical data in Python',
          content_type: 'exercise',
          content: {},
          section_display_number: 4,
          access_level: 'free',
          // course 3, chapter 1, section 4, exercise 2 of 3
          exercise: createExerciseData(
            12,
            2,
            'Create functions to perform basic mathematical operations, work with number types, and handle numerical errors.',
            'course 3, chapter 1, section 4, exercise 2 of 3',
          ) as ExerciseConfig,
        } as SectionConfig,
        {
          // course 3, chapter 1, section 5
          id: ulid(),
          seedSequence: 29,
          title: 'String Operations',
          description: 'Practice working with strings in Python',
          content_type: 'exercise',
          content: {},
          section_display_number: 5,
          access_level: 'free',
          // course 3, chapter 1, section 5, exercise 3 of 3
          exercise: createExerciseData(
            13,
            3,
            'Implement string manipulation functions: reverse a string, check for palindromes, and count word frequencies in a text.',
            'course 3, chapter 1, section 5, exercise 3 of 3',
          ) as ExerciseConfig,
        } as SectionConfig,
        {
          // course 3, chapter 1, section 6
          id: ulid(),
          seedSequence: 30,
          title: 'Python Basics Recap',
          description: 'Review fundamental Python concepts and practices',
          content_type: 'recap',
          content: {},
          section_display_number: 6,
          access_level: 'free',
        } as SectionConfig,
      ],
    } as ChapterConfig,
    {
      // course 3, chapter 2
      id: ulid(),
      title: 'Data Structures in Python',
      description: 'Understanding Python built-in data structures and their applications',
      seedSequence: 8,
      chapter_display_number: 2,
      estimated_time: '4 hours',
      sections: [
        {
          // course 3, chapter 2, section 1
          id: ulid(),
          seedSequence: 31,
          title: 'Lists and Tuples',
          description: 'Understanding Python sequences: lists and tuples',
          content_type: 'lesson',
          content: {},
          section_display_number: 1,
          access_level: 'free',
        } as SectionConfig,
        {
          // course 3, chapter 2, section 2
          id: ulid(),
          seedSequence: 32,
          title: 'List Operations',
          description: 'Working with Python lists',
          content_type: 'exercise',
          content: {},
          section_display_number: 2,
          access_level: 'free',
          // course 3, chapter 2, section 2, exercise 1 of 1
          exercise: createExerciseData(
            14,
            1,
            'Implement common list operations: sorting with custom keys, list comprehensions, and efficient list manipulations.',
            'course 3, chapter 2, section 2, exercise 1 of 1',
          ) as ExerciseConfig,
        } as SectionConfig,
        {
          // course 3, chapter 2, section 3
          id: ulid(),
          seedSequence: 33,
          title: 'Data Structures Recap',
          description: 'Review of Python data structures concepts',
          content_type: 'recap',
          content: {},
          section_display_number: 3,
          access_level: 'free',
        } as SectionConfig,
      ],
    } as ChapterConfig,
    {
      // course 3, chapter 3
      id: ulid(),
      title: 'Functions and Modules',
      description: 'Mastering Python functions and modular programming',
      seedSequence: 9,
      chapter_display_number: 3,
      estimated_time: '4 hours',
      sections: [
        {
          // course 3, chapter 3, section 1
          id: ulid(),
          seedSequence: 34,
          title: 'Function Basics',
          description: 'Introduction to Python functions',
          content_type: 'lesson',
          content: {},
          section_display_number: 1,
          access_level: 'free',
        } as SectionConfig,
        {
          // course 3, chapter 3, section 2
          id: ulid(),
          seedSequence: 35,
          title: 'Advanced Functions',
          description: 'Understanding advanced function concepts',
          content_type: 'lesson',
          content: {},
          section_display_number: 2,
          access_level: 'free',
        } as SectionConfig,
        {
          // course 3, chapter 3, section 3
          id: ulid(),
          seedSequence: 36,
          title: 'Basic Function Practice',
          description: 'Practice writing Python functions',
          content_type: 'exercise',
          content: {},
          section_display_number: 3,
          access_level: 'free',
          // course 3, chapter 3, section 3, exercise 1 of 3
          exercise: createExerciseData(
            15,
            1,
            'Create functions implementing basic algorithms: factorial calculation, Fibonacci sequence, and prime number checking.',
            'course 3, chapter 3, section 3, exercise 1 of 3',
          ) as ExerciseConfig,
        } as SectionConfig,
        {
          // course 3, chapter 3, section 4
          id: ulid(),
          seedSequence: 37,
          title: 'Advanced Function Practice',
          description: 'Practice with advanced function concepts',
          content_type: 'exercise',
          content: {},
          section_display_number: 4,
          access_level: 'free',
          // course 3, chapter 3, section 4, exercise 2 of 3
          exercise: createExerciseData(
            16,
            2,
            'Implement decorator functions for logging, timing, and memoization. Create generator functions for efficient data processing.',
            'course 3, chapter 3, section 4, exercise 2 of 3',
          ) as ExerciseConfig,
        } as SectionConfig,
        {
          // course 3, chapter 3, section 5
          id: ulid(),
          seedSequence: 38,
          title: 'Module Development',
          description: 'Practice creating Python modules',
          content_type: 'exercise',
          content: {},
          section_display_number: 5,
          access_level: 'free',
          // course 3, chapter 3, section 5, exercise 3 of 3
          exercise: createExerciseData(
            17,
            3,
            'Create a Python module that implements a simple text processing library with functions for analyzing, formatting, and transforming text.',
            'course 3, chapter 3, section 5, exercise 3 of 3',
          ) as ExerciseConfig,
        } as SectionConfig,
        {
          // course 3, chapter 3, section 6
          id: ulid(),
          seedSequence: 39,
          title: 'Functions and Modules Recap',
          description: 'Review of functions and modules concepts',
          content_type: 'recap',
          content: {},
          section_display_number: 6,
          access_level: 'free',
        } as SectionConfig,
      ],
    } as ChapterConfig,
  ],
  dateConfig: courseDateOptions.courses,
  // end of course 3
}

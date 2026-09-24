import type { ChapterConfig, CourseConfig, SectionConfig } from '@db/seed_config/types/seed-types'
import {
  dataStructuresRecap,
  introToPythonLesson,
  listsLesson,
  pythonBasicsRecap,
  variablesLesson,
} from '../content/python-basics'
import {
  decoratorsExercise,
  functionsExercise,
  listsExercise,
  modulesExercise,
  numbersExercise,
  stringsExercise,
  syntaxExercise,
} from '../content/python-exercises'
import { advancedFunctionsLesson, functionBasicsLesson, functionsRecap } from '../content/python-functions'
import { courseDateOptions } from '../date-options'

export const pythonFundamentals: CourseConfig = {
  // course 3
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
      title: 'Python Basics',
      description: 'Learn the fundamentals of Python syntax and basic programming concepts',
      seedSequence: 7,
      chapter_display_number: 1,
      estimated_time: '3 hours',
      sections: [
        {
          // course 3, chapter 1, section 1
          seedSequence: 25,
          title: 'Introduction to Python',
          description: 'Getting started with Python programming',
          content_type: 'lesson',
          content: { content_type: 'lesson', lesson: introToPythonLesson },
          section_display_number: 1,
          access_level: 'free',
        } as SectionConfig,
        {
          // course 3, chapter 1, section 2
          seedSequence: 26,
          title: 'Python Syntax Basics',
          description: 'Understanding Python syntax and basic programming concepts',
          content_type: 'exercise',
          content: { content_type: 'exercise' },
          section_display_number: 2,
          access_level: 'free',
          // course 3, chapter 1, section 2, exercise 1 of 3
          exercise: syntaxExercise,
        } as SectionConfig,
        {
          // course 3, chapter 1, section 3
          seedSequence: 27,
          title: 'Variables and Data Types',
          description: 'Learn about Python variables and fundamental data types',
          content_type: 'lesson',
          content: { content_type: 'lesson', lesson: variablesLesson },
          section_display_number: 3,
          access_level: 'free',
        } as SectionConfig,
        {
          // course 3, chapter 1, section 4
          seedSequence: 28,
          title: 'Working with Numbers',
          description: 'Practice working with numerical data in Python',
          content_type: 'exercise',
          content: { content_type: 'exercise' },
          section_display_number: 4,
          access_level: 'free',
          // course 3, chapter 1, section 4, exercise 2 of 3
          exercise: numbersExercise,
        } as SectionConfig,
        {
          // course 3, chapter 1, section 5
          seedSequence: 29,
          title: 'String Operations',
          description: 'Practice working with strings in Python',
          content_type: 'exercise',
          content: { content_type: 'exercise' },
          section_display_number: 5,
          access_level: 'free',
          // course 3, chapter 1, section 5, exercise 3 of 3
          exercise: stringsExercise,
        } as SectionConfig,
        {
          // course 3, chapter 1, section 6
          seedSequence: 30,
          title: 'Python Basics Recap',
          description: 'Review fundamental Python concepts and practices',
          content_type: 'recap',
          content: { content_type: 'recap', recap: pythonBasicsRecap },
          section_display_number: 6,
          access_level: 'free',
        } as SectionConfig,
      ],
    } as ChapterConfig,
    {
      // course 3, chapter 2
      title: 'Data Structures in Python',
      description: 'Understanding Python built-in data structures and their applications',
      seedSequence: 8,
      chapter_display_number: 2,
      estimated_time: '4 hours',
      sections: [
        {
          // course 3, chapter 2, section 1
          seedSequence: 31,
          title: 'Lists and Tuples',
          description: 'Understanding Python sequences: lists and tuples',
          content_type: 'lesson',
          content: { content_type: 'lesson', lesson: listsLesson },
          section_display_number: 1,
          access_level: 'free',
        } as SectionConfig,
        {
          // course 3, chapter 2, section 2
          seedSequence: 32,
          title: 'List Operations',
          description: 'Working with Python lists',
          content_type: 'exercise',
          content: { content_type: 'exercise' },
          section_display_number: 2,
          access_level: 'free',
          // course 3, chapter 2, section 2, exercise 1 of 1
          exercise: listsExercise,
        } as SectionConfig,
        {
          // course 3, chapter 2, section 3
          seedSequence: 33,
          title: 'Data Structures Recap',
          description: 'Review of Python data structures concepts',
          content_type: 'recap',
          content: { content_type: 'recap', recap: dataStructuresRecap },
          section_display_number: 3,
          access_level: 'free',
        } as SectionConfig,
      ],
    } as ChapterConfig,
    {
      // course 3, chapter 3
      title: 'Functions and Modules',
      description: 'Mastering Python functions and modular programming',
      seedSequence: 9,
      chapter_display_number: 3,
      estimated_time: '4 hours',
      sections: [
        {
          // course 3, chapter 3, section 1
          seedSequence: 34,
          title: 'Function Basics',
          description: 'Introduction to Python functions',
          content_type: 'lesson',
          content: { content_type: 'lesson', lesson: functionBasicsLesson },
          section_display_number: 1,
          access_level: 'free',
        } as SectionConfig,
        {
          // course 3, chapter 3, section 2
          seedSequence: 35,
          title: 'Advanced Functions',
          description: 'Understanding advanced function concepts',
          content_type: 'lesson',
          content: { content_type: 'lesson', lesson: advancedFunctionsLesson },
          section_display_number: 2,
          access_level: 'free',
        } as SectionConfig,
        {
          // course 3, chapter 3, section 3
          seedSequence: 36,
          title: 'Basic Function Practice',
          description: 'Practice writing Python functions',
          content_type: 'exercise',
          content: { content_type: 'exercise' },
          section_display_number: 3,
          access_level: 'free',
          // course 3, chapter 3, section 3, exercise 1 of 3
          exercise: functionsExercise,
        } as SectionConfig,
        {
          // course 3, chapter 3, section 4
          seedSequence: 37,
          title: 'Advanced Function Practice',
          description: 'Practice with advanced function concepts',
          content_type: 'exercise',
          content: { content_type: 'exercise' },
          section_display_number: 4,
          access_level: 'free',
          // course 3, chapter 3, section 4, exercise 2 of 3
          exercise: decoratorsExercise,
        } as SectionConfig,
        {
          // course 3, chapter 3, section 5
          seedSequence: 38,
          title: 'Module Development',
          description: 'Practice creating Python modules',
          content_type: 'exercise',
          content: { content_type: 'exercise' },
          section_display_number: 5,
          access_level: 'free',
          // course 3, chapter 3, section 5, exercise 3 of 3
          exercise: modulesExercise,
        } as SectionConfig,
        {
          // course 3, chapter 3, section 6
          seedSequence: 39,
          title: 'Functions and Modules Recap',
          description: 'Review of functions and modules concepts',
          content_type: 'recap',
          content: { content_type: 'recap', recap: functionsRecap },
          section_display_number: 6,
          access_level: 'free',
        } as SectionConfig,
      ],
    } as ChapterConfig,
  ],
  dateConfig: courseDateOptions.courses,
  // end of course 3
}

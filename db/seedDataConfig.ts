// @ts-nocheck

import { sort } from 'effect/Chunk'

export const courseData = {
  courses: [
    {
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
          sort_order: 1,
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
              sort_order: 1,
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
              sort_order: 2,
              access_level: 'free',
              exercise: {
                // course 1, chapter 1, section 2 exercise 1 of 1
                id: ulid(),
                seedSequence: 1,
                exercise_display_number: 1,
                sort_order: 1,
                instructions: 'Fill in the blank',
                browser_html: {},
                code_files: {},
                tests: {},
                hints: {},
                difficulty: '',
                default_solution: {},
                user_solution: {},
                estimated_time_minutes: 0,
              } as ExerciseConfig,
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
              sort_order: 3,
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
          sort_order: 2,
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
              sort_order: 1,
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
              sort_order: 2,
              access_level: 'purchased',
              exercise: {
                // course 1, chapter 2, section 2 exercise 1 of 1
                id: ulid(),
                seedSequence: 2,
                exercise_display_number: 1,
                sort_order: 1,
                instructions:
                  'Create a function called greetUser that accepts a name parameter and returns a greeting string. Then create an object called user with properties for name and age, and create a method that returns a description of the user.',
                browser_html: {},
                code_files: {},
                tests: {},
                hints: {},
                difficulty: '',
                default_solution: {},
                student_solution: {},
                estimated_time_minutes: 0,
              } as ExerciseConfig,
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
              sort_order: 3,
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
          seedSequence: 3,
          chapter_display_number: 3,
          sort_order: 3,
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
              sort_order: 1,
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
              sort_order: 2,
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
              sort_order: 3,
              access_level: 'purchased',
              exercise: {
                // course 1, chapter 3, section 3 exercise 1 of 3
                id: ulid(),
                seedSequence: 3,
                exercise_display_number: 1,
                sort_order: 1,
                instructions:
                  'Create an array of numbers and implement functions to find the largest number, calculate the average, and filter out negative numbers.',
                browser_html: {},
                code_files: {},
                tests: {},
                hints: {},
                difficulty: '',
                default_solution: {},
                student_solution: {},
                estimated_time_minutes: 0,
              } as ExerciseConfig,
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
              sort_order: 4,
              access_level: 'purchased',
              exercise: {
                // course 1, chapter 3, section 4 exercise 2 of 3
                seedSequence: 4,
                exercise_display_number: 2,
                sort_order: 1,
                instructions:
                  'Use array methods (map, filter, reduce) to transform an array of user objects. Calculate total user score, filter active users, and create a new array with formatted user names.',
                browser_html: {},
                code_files: {},
                tests: {},
                hints: {},
                difficulty: '',
                default_solution: {},
                student_solution: {},
                estimated_time_minutes: 0,
              } as ExerciseConfig,
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
              sort_order: 5,
              access_level: 'purchased',
              exercise: {
                // course 1, chapter 3, section 5 exercise 3 of 3
                id: ulid(),
                seedSequence: 5,
                exercise_display_number: 3,
                sort_order: 1,
                instructions:
                  'Implement advanced array operations: sort an array of objects by multiple criteria, remove duplicates from an array, and flatten a nested array structure.',
                browser_html: {},
                code_files: {},
                tests: {},
                hints: {},
                difficulty: '',
                default_solution: {},
                student_solution: {},
                estimated_time_minutes: 0,
              } as ExerciseConfig,
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
              sort_order: 6,
              access_level: 'purchased',
            } as SectionConfig,
          ],
          // end of course 1, chapter 3
        } as ChapterConfig,
      ],
      dateConfig: {
        // course 1 date config
        start: dateRanges.courses.start,
        end: 365,
        includeUpdated: true,
        chanceOfUpdate: 1,
      },
      // end of course 1
    },
    {
      // course 2
      id: ulid(),
      title: 'Advanced React Development',
      seedSequence: 2,
      description: 'Master React and build complex applications',
      slug: 'advanced-react',
      subject_area: 'Web Development',
      level: 'advanced',
      tags: ['react', 'javascript', 'frontend', 'typescript', 'react18', 'react19'],
      price: 79.99,
      purchase_active_length: null,
      chapters: [
        {
          // course 2, chapter 1
          id: ulid(),
          title: 'React Fundamentals',
          seedSequence: 4,
          description: 'Learn the fundamentals of React',
          chapter_display_number: 1,
          sort_order: 1,
          estimated_time: '1 hour',
          sections: [
            {
              // course 2, chapter 1, section 1
              id: ulid(),
              seedSequence: 13,
              title: 'React Components',
              description: 'Learn how to build React components',
              content_type: 'lesson',
              content: {},
              section_display_number: 1,
              sort_order: 1,
              access_level: 'free',
            } as SectionConfig,
            {
              // course 2, chapter 1, section 2
              id: ulid(),
              seedSequence: 14,
              title: 'React Props and State',
              description: 'Learn how to use React props and state',
              content_type: 'exercise',
              section_display_number: 2,
              sort_order: 2,
              access_level: 'free',
              exercise: {
                // course 2, chapter 1, section 2 exercise 1 of 1
                id: ulid(),
                seedSequence: 6,
                exercise_display_number: 1,
                sort_order: 1,
                instructions:
                  'Create a React component that manages a form state, handles user input, and displays the form data. Implement proper event handling and form validation.',
                browser_html: {},
                code_files: {},
                tests: {},
                hints: {},
                difficulty: '',
                default_solution: {},
                student_solution: {},
                estimated_time_minutes: 0,
              } as ExerciseConfig,
            } as SectionConfig,
            {
              // course 2, chapter 1, section 3
              id: ulid(),
              seedSequence: 15,
              title: 'React Fundamentals Recap',
              description: 'Review React fundamentals',
              content_type: 'recap',
              content: {},
              section_display_number: 3,
              sort_order: 3,
              access_level: 'free',
            } as SectionConfig,
          ],
        } as ChapterConfig,
        {
          // course 2, chapter 2
          id: ulid(),
          title: 'State Management',
          seedSequence: 5,
          description: 'Learn how to manage state in React',
          chapter_display_number: 2,
          sort_order: 2,
          estimated_time: '1 hour',
          sections: [
            {
              // course 2, chapter 2, section 1
              id: ulid(),
              seedSequence: 16,
              title: 'Redux Basics',
              description: 'Learn how to use Redux',
              content_type: 'lesson',
              content: {},
              section_display_number: 1,
              sort_order: 1,
              access_level: 'purchased',
            } as SectionConfig,
            {
              // course 2, chapter 2, section 2
              id: ulid(),
              seedSequence: 17,
              title: 'Advanced Redux Patterns',
              description: 'Learn how to use Redux',
              content_type: 'exercise',
              content: {},
              section_display_number: 2,
              sort_order: 2,
              access_level: 'purchased',
              exercise: {
                // course 2, chapter 2, section 2 exercise 1 of 1
                id: ulid(),
                seedSequence: 7,
                exercise_display_number: 1,
                sort_order: 1,
                instructions:
                  'Implement a Redux store for a todo list application. Create actions and reducers for adding, toggling, and deleting todos. Connect the Redux store to React components.',
                browser_html: {},
                code_files: {},
                tests: {},
                hints: {},
                difficulty: '',
                default_solution: {},
                student_solution: {},
                estimated_time_minutes: 0,
              } as ExerciseConfig,
            } as SectionConfig,
            {
              // course 2, chapter 2, section 3
              id: ulid(),
              seedSequence: 18,
              title: 'State Management Recap',
              description: 'Review state management in React',
              content_type: 'recap',
              content: {},
              section_display_number: 3,
              sort_order: 3,
              access_level: 'purchased',
            } as SectionConfig,
          ],
        } as ChapterConfig,
        {
          // course 2, chapter 3
          id: ulid(),
          title: 'React Hooks',
          seedSequence: 6,
          description: 'Learn how to use React hooks',
          chapter_display_number: 3,
          sort_order: 3,
          estimated_time: '3 hours',
          sections: [
            {
              // course 2, chapter 3, section 1
              id: ulid(),
              seedSequence: 18,
              title: 'Introduction to React Hooks',
              description: 'Learn how to use React hooks',
              content_type: 'lesson',
              content: {},
              section_display_number: 1,
              sort_order: 1,
              access_level: 'purchased',
            } as SectionConfig,
            {
              // course 2, chapter 3, section 2
              id: ulid(),
              seedSequence: 19,
              title: 'React Hooks',
              description: 'Learn how to use React hooks',
              content_type: 'lesson',
              content: {},
              section_display_number: 2,
              sort_order: 2,
              access_level: 'purchased',
            } as SectionConfig,
            {
              // course 2, chapter 3, section 3
              id: ulid(),
              seedSequence: 20,
              title: 'Practice React Hooks',
              description: 'Practice using React hooks',
              content_type: 'exercise',
              content: {},
              section_display_number: 3,
              sort_order: 3,
              access_level: 'purchased',
              exercise: {
                // course 2, chapter 3, section 3, exercise 1 of 3
                id: ulid(),
                seedSequence: 8,
                exercise_display_number: 1,
                sort_order: 1,
                instructions:
                  'Create a custom hook useLocalStorage that manages state in localStorage. Implement a component that uses this hook to persist user preferences.',
                browser_html: {},
                code_files: {},
                tests: {},
                hints: {},
                difficulty: '',
                default_solution: {},
                student_solution: {},
                estimated_time_minutes: 0,
              } as ExerciseConfig,
            } as SectionConfig,
            {
              // course 2, chapter 3, section 4
              id: ulid(),
              seedSequence: 21,
              title: 'Practice React Hooks',
              description: 'Practice using React hooks',
              content_type: 'exercise',
              content: {},
              section_display_number: 4,
              sort_order: 4,
              access_level: 'purchased',
              exercise: {
                // course 2, chapter 3, section 4, exercise 2 of 3
                id: ulid(),
                seedSequence: 9,
                exercise_display_number: 2,
                sort_order: 1,
                instructions:
                  'Build a data fetching hook useFetch that handles loading, error, and success states. Use the hook in a component that displays a list of items.',
                browser_html: {},
                code_files: {},
                tests: {},
                hints: {},
                difficulty: '',
                default_solution: {},
                student_solution: {},
                estimated_time_minutes: 0,
              } as ExerciseConfig,
            } as SectionConfig,
            {
              // course 2, chapter 3, section 5
              id: ulid(),
              seedSequence: 22,
              title: 'Practice React Hooks',
              description: 'Practice using React hooks',
              content_type: 'exercise',
              content: {},
              section_display_number: 5,
              sort_order: 5,
              access_level: 'purchased',
              exercise: {
                // course 2, chapter 3, section 5, exercise 3 of 3
                id: ulid(),
                seedSequence: 10,
                exercise_display_number: 3,
                sort_order: 1,
                instructions:
                  'Implement useReducer hook to manage complex component state. Create actions and reducers for a shopping cart feature with add, remove, and update quantity functionality.',
                browser_html: {},
                code_files: {},
                tests: {},
                hints: {},
                difficulty: '',
                default_solution: {},
                student_solution: {},
                estimated_time_minutes: 0,
              } as ExerciseConfig,
            } as SectionConfig,
            {
              // course 2, chapter 3, section 6
              id: ulid(),
              seedSequence: 23,
              title: 'React Hooks Recap',
              description: 'Review React hooks',
              content_type: 'recap',
              content: {},
              section_display_number: 6,
              sort_order: 6,
              access_level: 'purchased',
            } as SectionConfig,
          ],
          // end of chapter 3
        } as ChapterConfig,
      ],
      dateConfig: {
        // course 2 date config
        start: 720,
        end: 365,
        includeUpdated: true,
        chanceOfUpdate: 1,
      },
      // end of course 2
    },
    {
      // course 3
      id: ulid(),
      title: 'Python Fundamentals',
      seedSequence: 3,
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
          seedSequence: 7,
          description: 'Learn the basics of Python',
          chapter_display_number: 1,
          sort_order: 1,
          estimated_time: '2 hours',
          sections: [
            {
              // course 3, chapter 1, section 1
              id: ulid(),
              seedSequence: 24,
              title: 'Introduction to Python',
              description: 'Learn the basics of Python programming',
              content_type: 'lesson',
              content: {},
              section_display_number: 1,
              sort_order: 1,
              access_level: 'free',
            } as SectionConfig,
            {
              // course 3, chapter 1, section 2
              id: ulid(),
              seedSequence: 25,
              title: 'Python Syntax Basics',
              description: 'Understanding Python syntax and basic programming concepts',
              content_type: 'exercise',
              content: {},
              section_display_number: 2,
              sort_order: 2,
              access_level: 'free',
              exercise: {
                // course 3, chapter 1, section 2, exercise 1 of 3
                id: ulid(),
                seedSequence: 11,
                exercise_display_number: 1,
                sort_order: 1,
                instructions:
                  'Write Python code that demonstrates basic syntax: create variables of different types, use conditional statements, and implement a simple loop structure.',
                browser_html: {},
                code_files: {},
                tests: {},
                hints: {},
                difficulty: '',
                default_solution: {},
                student_solution: {},
                estimated_time_minutes: 0,
              } as ExerciseConfig,
            } as SectionConfig,
            {
              // course 3, chapter 1, section 3
              id: ulid(),
              seedSequence: 26,
              title: 'Variables and Data Types',
              description: 'Learn about Python variables and fundamental data types',
              content_type: 'lesson',
              content: {},
              section_display_number: 3,
              sort_order: 3,
              access_level: 'free',
            } as SectionConfig,
            {
              // course 3, chapter 1, section 4
              id: ulid(),
              seedSequence: 27,
              title: 'Working with Numbers',
              description: 'Practice working with numerical data in Python',
              content_type: 'exercise',
              content: {},
              section_display_number: 4,
              sort_order: 4,
              access_level: 'free',
              exercise: {
                // course 3, chapter 1, section 4, exercise 2 of 3
                id: ulid(),
                seedSequence: 11,
                exercise_display_number: 2,
                sort_order: 1,
                instructions:
                  'Write Python code that demonstrates basic syntax: create variables of different types, use conditional statements, and implement a simple loop structure.',
                browser_html: {},
                code_files: {},
                tests: {},
                hints: {},
                difficulty: '',
                default_solution: {},
                student_solution: {},
                estimated_time_minutes: 0,
              } as ExerciseConfig,
            } as SectionConfig,
            {
              // course 3, chapter 1, section 5
              id: ulid(),
              seedSequence: 28,
              title: 'String Operations',
              description: 'Practice working with strings in Python',
              content_type: 'exercise',
              content: {},
              section_display_number: 5,
              sort_order: 5,
              access_level: 'free',
              exercise: {
                // course 3, chapter 1, section 5, exercise 3 of 3
                id: ulid(),
                seedSequence: 13,
                exercise_display_number: 3,
                sort_order: 1,
                instructions:
                  'Implement string manipulation functions: reverse a string, check for palindromes, and count word frequencies in a text.',
                browser_html: {},
                code_files: {},
                tests: {},
                hints: {},
                difficulty: '',
                default_solution: {},
                student_solution: {},
                estimated_time_minutes: 0,
              } as ExerciseConfig,
            } as SectionConfig,
            {
              // course 3, chapter 1, section 6
              id: ulid(),
              seedSequence: 29,
              title: 'Python Basics Recap',
              description: 'Review fundamental Python concepts and practices',
              content_type: 'recap',
              content: {},
              section_display_number: 6,
              sort_order: 6,
              access_level: 'free',
            } as SectionConfig,
          ],
          // end of chapter 1
        } as ChapterConfig,
        {
          // course 3, chapter 2
          id: ulid(),
          title: 'Data Structures in Python',
          seedSequence: 8,
          description: 'Learn how to work with data structures in Python',
          chapter_display_number: 2,
          sort_order: 2,
          estimated_time: '2 hours',
          sections: [
            {
              // course 3, chapter 2, section 1
              id: ulid(),
              seedSequence: 30,
              title: 'Python Data Structures',
              description: 'Introduction to Python data structures',
              content_type: 'lesson',
              content: {},
              section_display_number: 1,
              sort_order: 1,
              access_level: 'free',
            } as SectionConfig,
            {
              // course 3, chapter 2, section 2
              id: ulid(),
              seedSequence: 31,
              title: 'Lists and Tuples',
              description: 'Practice working with Python lists and tuples',
              content_type: 'exercise',
              content: {},
              section_display_number: 2,
              sort_order: 2,
              access_level: 'free',
              exercise: {
                // course 3, chapter 2, section 2, exercise 1 of 1
                id: ulid(),
                seedSequence: 14,
                exercise_display_number: 1,
                sort_order: 1,
                instructions:
                  'Work with Python lists and tuples: implement sorting algorithms, find common elements between lists, and manipulate nested data structures.',
                browser_html: {},
                code_files: {},
                tests: {},
                hints: {},
                difficulty: '',
                default_solution: {},
                student_solution: {},
                estimated_time_minutes: 0,
              } as ExerciseConfig,
            } as SectionConfig,
            {
              // course 3, chapter 2, section 3
              id: ulid(),
              seedSequence: 32,
              title: 'Data Structures Recap',
              description: 'Review Python data structures concepts',
              content_type: 'recap',
              content: {},
              section_display_number: 3,
              sort_order: 3,
              access_level: 'free',
            } as SectionConfig,
          ],
          // end of chapter 2
        } as ChapterConfig,
        {
          // course 3, chapter 3
          id: ulid(),
          title: 'Python Functions and Modules',
          seedSequence: 9,
          description: 'Learn how to work with functions and modules in Python',
          chapter_display_number: 3,
          sort_order: 3,
          estimated_time: '4 hours',
          sections: [
            {
              // course 3, chapter 3, section 1
              id: ulid(),
              seedSequence: 33,
              title: 'Python Functions',
              description: 'Introduction to functions in Python',
              content_type: 'lesson',
              content: {},
              section_display_number: 1,
              sort_order: 1,
              access_level: 'free',
            } as SectionConfig,
            {
              // course 3, chapter 3, section 2
              id: ulid(),
              seedSequence: 34,
              title: 'Python Modules',
              description: 'Understanding Python modules and imports',
              content_type: 'lesson',
              content: {},
              section_display_number: 2,
              sort_order: 2,
              access_level: 'free',
            } as SectionConfig,
            {
              // course 3, chapter 3, section 3
              id: ulid(),
              seedSequence: 35,
              title: 'Basic Function Exercise',
              description: 'Practice creating and using basic Python functions',
              content_type: 'exercise',
              content: {},
              section_display_number: 3,
              sort_order: 3,
              access_level: 'free',
              exercise: {
                // course 3, chapter 3, section 3, exercise 1 of 3
                id: ulid(),
                seedSequence: 15,
                exercise_display_number: 1,
                sort_order: 1,
                instructions:
                  'Create basic Python functions: implement a function that calculates fibonacci numbers, another that generates a random password, and one that validates email addresses.',
                browser_html: {},
                code_files: {},
                tests: {},
                hints: {},
                difficulty: '',
                default_solution: {},
                student_solution: {},
                estimated_time_minutes: 0,
              } as ExerciseConfig,
            } as SectionConfig,
            {
              // course 3, chapter 3, section 4
              id: ulid(),
              seedSequence: 36,
              title: 'Intermediate Function Exercise',
              description: 'Practice with more complex Python functions',
              content_type: 'exercise',
              content: {},
              section_display_number: 4,
              sort_order: 4,
              access_level: 'free',
              exercise: {
                // course 3, chapter 3, section 4, exercise 2 of 3
                id: ulid(),
                seedSequence: 16,
                exercise_display_number: 2,
                sort_order: 1,
                instructions:
                  'Write functions using advanced concepts: implement decorators for timing function execution, create generators for number sequences, and use lambda functions with map/filter.',
                browser_html: {},
                code_files: {},
                tests: {},
                hints: {},
                difficulty: '',
                default_solution: {},
                student_solution: {},
                estimated_time_minutes: 0,
              } as ExerciseConfig,
            } as SectionConfig,
            {
              // course 3, chapter 3, section 5
              id: ulid(),
              seedSequence: 37,
              title: 'Advanced Module Exercise',
              description: 'Practice creating and using Python modules',
              content_type: 'exercise',
              content: {},
              section_display_number: 5,
              sort_order: 5,
              access_level: 'free',
              exercise: {
                // course 3, chapter 3, section 5, exercise 3 of 3
                id: ulid(),
                seedSequence: 17,
                exercise_display_number: 3,
                sort_order: 1,
                instructions:
                  'Create a Python module that implements a simple library management system. Include functions for adding books, checking out books, and generating reports.',
                browser_html: {},
                code_files: {},
                tests: {},
                hints: {},
                difficulty: '',
                default_solution: {},
                student_solution: {},
                estimated_time_minutes: 0,
              } as ExerciseConfig,
            } as SectionConfig,
            {
              // course 3, chapter 3, section 6
              id: ulid(),
              seedSequence: 38,
              title: 'Functions and Modules Recap',
              description: 'Review Python functions and modules concepts',
              content_type: 'recap',
              content: {},
              section_display_number: 6,
              sort_order: 6,
              access_level: 'free',
            } as SectionConfig,
          ],
          // end of chapter 3
        } as ChapterConfig,
      ],
      dateConfig: {
        // course 3 date config
        start: 720,
        end: 365,
        includeUpdated: true,
        chanceOfUpdate: 1,
      },
      // end of course 3
    },
  ] as CourseConfig[],
}

export default sampleDataConfig

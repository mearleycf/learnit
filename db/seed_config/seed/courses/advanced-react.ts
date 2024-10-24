import type { CourseConfig, SectionConfig, ExerciseConfig, ChapterConfig } from "@db/seed_config/types/seed-types";
import { courseDateOptions } from "../date-options";
import { createExerciseData } from "../utils";
import { ulid } from "ulidx";

export const advancedReact: CourseConfig = {
    // course 2
    id: ulid(),
    seedSequence: 2,
    title: 'Advanced React Development',
    description: 'Master React and build complex applications',
    slug: 'advanced-react',
    subject_area: 'Web Development',
    level: 'advanced',
    tags: ['react', 'javascript', 'frontend', 'typescript', 'react18', 'react19'],
    price: 79.99,
    purchase_active_length: null, // unlimited access
    chapters: [
        {
            // course 2, chapter 1
            id: ulid(),
            title: 'React Fundamentals Review',
            description: 'Quick review of React fundamentals before diving into advanced concepts',
            seedSequence: 4,
            chapter_display_number: 1,
            estimated_time: '2 hours',
            sections: [
                {
                    // course 2, chapter 1, section 1
                    id: ulid(),
                    seedSequence: 13,
                    title: 'Component Architecture',
                    description: 'Understanding React component architecture and patterns',
                    content_type: 'lesson',
                    content: {},
                    section_display_number: 1,
                    access_level: 'free'
                } as SectionConfig,
                {
                    // course 2, chapter 1, section 2
                    id: ulid(),
                    seedSequence: 14,
                    title: 'Component Architecture Practice',
                    description: 'Practice implementing React component patterns',
                    content_type: 'exercise',
                    content: {},
                    section_display_number: 2,
                    access_level: 'free',
                    // course 2, chapter 1, section 2, exercise 1 of 1
                    exercise: createExerciseData(
                        6,
                        1,
                        'Create a compound component system for a custom Form component that includes Form, Form.Input, Form.Select, and Form.Submit components with shared context.',
                        'course 2, chapter 1, section 2, exercise 1 of 1'
                    )
                } as SectionConfig,
                {
                    // course 2, chapter 1, section 3
                    id: ulid(),
                    seedSequence: 15,
                    title: 'React Fundamentals Recap',
                    description: 'Review of core React concepts',
                    content_type: 'recap',
                    content: {},
                    section_display_number: 3,
                    access_level: 'free'
                } as SectionConfig
            ]
        } as ChapterConfig,
        {
            // course 2, chapter 2
            id: ulid(),
            title: 'Advanced State Management',
            description: 'Deep dive into complex state management patterns',
            seedSequence: 5,
            chapter_display_number: 2,
            estimated_time: '4 hours',
            sections: [
                {
                    // course 2, chapter 2, section 1
                    id: ulid(),
                    seedSequence: 16,
                    title: 'Complex State Patterns',
                    description: 'Understanding advanced state management patterns',
                    content_type: 'lesson',
                    content: {},
                    section_display_number: 1,
                    access_level: 'purchased'
                } as SectionConfig,
                {
                    // course 2, chapter 2, section 2
                    id: ulid(),
                    seedSequence: 17,
                    title: 'useReducer Deep Dive',
                    description: 'Advanced usage of useReducer hook',
                    content_type: 'lesson',
                    content: {},
                    section_display_number: 2,
                    access_level: 'purchased'
                } as SectionConfig,
                {
                    // course 2, chapter 2, section 3
                    id: ulid(),
                    seedSequence: 18,
                    title: 'State Machine Implementation',
                    description: 'Implement a state machine using useReducer',
                    content_type: 'exercise',
                    content: {},
                    section_display_number: 3,
                    access_level: 'purchased',
                    // course 2, chapter 2, section 3, exercise 1 of 3
                    exercise: createExerciseData(
                        7,
                        1,
                        'Create a complex form wizard using useReducer to manage multiple steps, validation, and state transitions. Implement proper state machine patterns.',
                        'course 2, chapter 2, section 3, exercise 1 of 3'
                    )
                } as SectionConfig,
                {
                    // course 2, chapter 2, section 4
                    id: ulid(),
                    seedSequence: 19,
                    title: 'Custom State Manager',
                    description: 'Build a custom state management solution',
                    content_type: 'exercise',
                    content: {},
                    section_display_number: 4,
                    access_level: 'purchased',
                    // course 2, chapter 2, section 4, exercise 2 of 3
                    exercise: createExerciseData(
                        8,
                        2,
                        'Implement a custom state management solution using React Context and useReducer that includes middleware support and devtools integration.',
                        'course 2, chapter 2, section 4, exercise 2 of 3'
                    )
                } as SectionConfig,
                {
                    // course 2, chapter 2, section 5
                    id: ulid(),
                    seedSequence: 20,
                    title: 'State Synchronization',
                    description: 'Managing state across components',
                    content_type: 'exercise',
                    content: {},
                    section_display_number: 5,
                    access_level: 'purchased',
                    // course 2, chapter 2, section 5, exercise 3 of 3
                    exercise: createExerciseData(
                        9,
                        3,
                        'Create a system for synchronizing state across multiple components using custom hooks and context, handling race conditions and optimistic updates.',
                        'course 2, chapter 2, section 5, exercise 3 of 3'
                    )
                } as SectionConfig,
                {
                    // course 2, chapter 2, section 6
                    id: ulid(),
                    seedSequence: 21,
                    title: 'State Management Recap',
                    description: 'Review of advanced state management concepts',
                    content_type: 'recap',
                    content: {},
                    section_display_number: 6,
                    access_level: 'purchased'
                } as SectionConfig
            ]
        } as ChapterConfig,
        {
            // course 2, chapter 3
            id: ulid(),
            title: 'Performance Optimization',
            description: 'Advanced techniques for React performance optimization',
            seedSequence: 6,
            chapter_display_number: 3,
            estimated_time: '3 hours',
            sections: [
                {
                    // course 2, chapter 3, section 1
                    id: ulid(),
                    seedSequence: 22,
                    title: 'React Performance Fundamentals',
                    description: 'Understanding React performance and optimization techniques',
                    content_type: 'lesson',
                    content: {},
                    section_display_number: 1,
                    access_level: 'purchased'
                } as SectionConfig,
                {
                    // course 2, chapter 3, section 2
                    id: ulid(),
                    seedSequence: 23,
                    title: 'Memoization Patterns',
                    description: 'Advanced memoization techniques in React',
                    content_type: 'exercise',
                    content: {},
                    section_display_number: 2,
                    access_level: 'purchased',
                    // course 2, chapter 3, section 2, exercise 1 of 1
                    exercise: createExerciseData(
                        10,
                        1,
                        'Implement advanced memoization patterns using useMemo and useCallback in a complex data visualization component. Profile and optimize render performance.',
                        'course 2, chapter 3, section 2, exercise 1 of 1'
                    )
                } as SectionConfig,
                {
                    // course 2, chapter 3, section 3
                    id: ulid(),
                    seedSequence: 24,
                    title: 'Performance Optimization Recap',
                    description: 'Review of performance optimization techniques',
                    content_type: 'recap',
                    content: {},
                    section_display_number: 3,
                    access_level: 'purchased'
                } as SectionConfig
            ]
        } as ChapterConfig
    ],
    dateConfig: courseDateOptions.courses
    // end of course 2
};

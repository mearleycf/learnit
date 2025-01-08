# Learnit Project Tasks

Last Updated: Nov 09, 2024 at 08:07:22 AM EST

## Current Focus

1. Converting seeding process to state machine using Effect
2. Implementing remaining seeder files following courses.ts pattern
3. Improving error handling and logging system
4. Resolving Sentry integration issues

## In Progress

### Seeding & Database

- [ ] Complete seeder files for remaining tables:
  - [ ] Chapters
  - [ ] Sections
  - [ ] Exercises
  - [ ] Users
  - [ ] Feedback
  - [ ] Notes
  - [ ] Student Exercise Progress
  - [ ] Student Progress
- [ ] Create test suite for state machine implementation
- [ ] Review and migrate useful utilities from seederFiles directory
- [ ] Remove deprecated seederFiles directory after migration

### Error Handling & Logging

- [ ] Set up ErrorBoundary components for React Islands
- [ ] Implement global error handling strategy with Effect
- [ ] Configure Effect logging system for holistic application coverage
- [ ] Fix Sentry integration (errors not being sent)
- [ ] Add file export capability for logs

### Database Integration

- [ ] Implement error handling improvements
- [ ] Create database reset mechanism
- [ ] Add incremental seeding capability
- [ ] Add data validation checks before seed insertion

## Upcoming Tasks

### Database Schema Updates

- [ ] Add new fields to Courses table:
  - [ ] status (published/archived/draft)
  - [ ] last_edited_by (FK to users)
  - [ ] last_edited_on (date)
- [ ] Add same fields to:
  - [ ] Chapters table
  - [ ] Sections table
  - [ ] Exercises table

### Authentication

- [ ] Select and implement authentication solution
  - Currently considering:
    - Oslo
    - Auth.js
    - auth-astro
    - Custom solution

### Feature Development

- [ ] Create functions for date management:
  - [ ] enrollment_date updates
  - [ ] purchase_date updates
  - [ ] expiration_date updates
- [ ] Implement automatic course assignment to app_admin users
- [ ] Design solution for handling course version control/publishing workflow

### Documentation

- [ ] Flesh out user stories for:
  - [ ] Administration platform
  - [ ] Content Management Platform
  - [ ] Marketing Website
  - [ ] Learning Platform (existing stories need more detail)

## Technical Debt

- [ ] Resolve AstroDB error: `[ERROR] [astro:db] [vite] cannot find entry point module 'astro:db'`
- [ ] Implement Effect typescript library with OpenTelemetry

## Notes

- Decision needed on React vs Astro Actions for interactivity
- Authentication solution needs to be finalized
- Need to determine approach for course version control
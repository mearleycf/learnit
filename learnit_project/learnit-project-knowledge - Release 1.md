# Learnit Project Knowledge - Release 1

Last Updated: Oct 27, 2024 at 9:07:17 PM

## Notes to the AI

### What you need to know

> Last updated Oct 27, 2024 at 9:07:12 PM

1. We are doing the following, currently:
    1. ~~Moving to implement Effect's Console logging system~~
    2. ~~Logger testing page created at /logTesting~~
    3. ~~Need to fix typescript errors in runLog function params~~
    4. Sentry integration not working--logs not appearing in dashboard
    5. Need to verify logging levels are working as expected
    6. Need to implement better structured logging and add context
    7. In the process of creating the separate seeder files for the remaining tables (we've done courses; need to do the rest)
        1. [x] Courses
        2. [] Chapters
        3. [] Sections
        4. [] Exercises
        5. [] Users
        6. [] Feedback
        7. [] Notes
        8. [] Student Exercise Progress
        9. [] Student Progress
    8. We need to identify any remaining database integration tasks (schema validation, error handling, etc)
        1. [x] Initial AstroDB configuration
        2. [x] Schema definitions
        3. [] Schema validation using effect/Schema
        4. [] error handling improvements
        5. [] database reset mechanism
        6. [] incremental seeding capability
2. Immediate next steps:
    1. Fix typescript errors in logTesting.astro
        ```typescript
        const runLog = (level: keyof typeof LogLevel, message: string, context = {}) => {
          // ... rest of function
        }
        ```
    2. debug sentry integration - verify dsn and config
    3. complete the remaining seeder files following courses.ts pattern
    4. implement effect/Schema for validation
    5. I'd like to export the logs to a file in addition to exporting them to Sentry...
3. Please note the following (also noted later in the document here)
    1. We're using TypeScript 5.5+, meaning we no longer need the _ adapter to integrate Effect with generator functions
4. I need to know what changes we need to make to our Database sections of this document based on the current state of the seed.ts file and config.ts file. 
5. We need to use the effect/Schema library to set up schema validation

### General Hygiene Notes

> NOTE TO AI: **DO NOT** remove any unedited content from this document. Please ONLY make updates and additions. If you need to delete something, please check with me first. **DO NOT** replace any of the content with `[content remains unchanged]`
>
> NOTE TO AI: **DO NOT** try and print the full contents of this document into the chat response when I send it to you, it is **too long**. Just let me know you got it and we'll go from there.
>
> NOTE TO AI: I use fish shell, yarn and kitty terminal, I do not use bash, and I don't use NPM; most of the time there isn't an issue, especially when dealing with commands from a 3rd party cli interface--however, sometimes it matters. **Please remember this**
> 
> NOTE TO AI: Please stop apologizing every time I correct an issue with something you helped me with. It's fine. I make mistakes, you make mistakes. I don't need to see a paragraph of you apologizing every time. Just get to the corrections.

## Summary of Project

I want to build a learning platform for learning development languages and frameworks. A good example is https://learnjavascript.online

### Features

#### The Learning Platform

- So overall, a student would enroll in a course
    - a course would have a series of chapters
        - a chapter would have a series of sections (lessons, exercises, recap)
            - the first section would usually be a lesson section (markdown file explaining a concept)
                - links out to documentation for those language or framework features.
            - then the student would complete 1 or more exercises related to the lesson they just learned (so, the code editor stuff)
            - I want a code editor with a real-time console, syntax highlighting, and auto-completion.
                - The student should be able to run the code, which would both:
                    - run the code itself
                    - also execute tests to determine if the code meets requirements to pass the exercise.
            - the final section in a chapter would be a chapter recap section, which is also markdown
- The course would have a spaced repitition learning system--i.e. flashcards basically. 
    - The system would build notecards for the student as they learn, allowing them to use the notecards for refreshing their memory--spaced repetition learning, basically.

#### The Feedback System

* student submits feedback through learning platform (various ways to do this, which will in some instances set the category value)
* course_admin and app_admin are notified of feedback submission
* either of the admins updates the feedback--they need to determine if action needs to be taken; if action needs to be taken, they should take the action (mostly this is going to be updating a course section to correct content)...
   * they might need to create a github issue, in which case they should provide the github_issue_link value as well...
   * I think we need to update the possible statuses here, because if for example the app_admin looks at it, determines the author or course_admin needs to update content, then they should be able to (a) open an issue to notify the author or course_admin to make an update, set the status to 'assigned'
   * The author or course_admin or app_admin should be able to update it to 'in progress' if they're working on it but it's not done
   * When they're done, they should set it to 'pending', because most likely the change still needs to be published by an admin
   * once the change is completed, they should update status to resolved and close the github issue (but leave the link)
* If action doesn't need to be taken, for whatever reason (maybe the feedback is just "Hey, I love the app!"), then we shouldn't use the 'ignored' status, but I'm not sure 'resolved' is the right status either...what other status could we use in this scenario? 
 
### Definition of terms

- Learning Platform: This is the application that a registered user who has registered for a course will use to engage in learning the course's content
    - Dashboard: The main page where a registered student can see their enrolled courses, payment status, progress, and achievements. 
    - Course: A course is a group of concepts all related to learning a programming language or framework (or really, any group of related concepts), typically organized from most basic concept at the beginning, through to most complicated concepts at the end. The goal is that the user has functionally complete understanding of a course's concepts upon completion
    - Course Interface: This is the interface in the application that the user will see when they are inside a section of a course
        - Course Outline: A comprehensive view of all chapters and sections in a course.
        - Knowledge Map: A visual representation of the course structure and concept relationships.
        - Course Achievements: Rewards or recognition for completing certain milestones or tasks. 
        - Course Chapter: This is one of one or more blocks of course sections, grouped by a specific concept within that programming language or framework (e.g. Objects, Arrays, etc)
            - Chapter Notes: Enables students to add personal annotations and highlight portions of text in the course content.
                - Highlight: this is a block of text within a content section or recap section that the user has highlighted, and selected to save to their notes (without a comment)
                - Highlight and Comment: same as a highlight, but the user has entered comments related to the highlighted text.
                - Comment: just a comment a user has added to their notes, that is not attached to highlighted text. 
            - Chapter Section: This is one of one or more types of chapter learning materials
                - Section Type - Content: This is a type of section that contains explanatory text, code blocks, images, and links about a specific subset of a concept (e.g. Array destructuring)
                - Section Type - Exercise: This is a type of section that contains a challenge for the user to complete, in order to test their knowledge of the previous content section; a content section will typically have one or more exercise sections that accompany it; an exercise is a live code editor and testing interface
                    - Exercise Instructions: the task or problem description for an exercise.
                    - Exercise Code Editor: The interface where students write and edit code.
                    - Exercise Console: The area where code output and errors are displayed.
                    - Exercise Tests: Automated checks to verify if the student's code meets the exercise requirements.
                - Section Type - Chapter Recap: This is a type of section that reviews the material and concepts learned within the just-completed chapter
                - Bookmarks: Allows students to mark specific sections for easy reference.
        - Course Navigation: This is the interface the user will see that allows them to navigate between sections
        - Spaced Repitition: This is a learning concept/methodology in which a user is presented with questions regarding concepts they have recently learned, presented after a certain duration, which encourages long term memory formation through repetition of the concepts.
            - Flashcards: Part of the spaced repitition system, these are quick questions or prompts related to completed course content.
- Content Management Platform: This is the application that a content creator will use to create courses and their related concepts, chapters, and sections.
    - Course Builder: The interface for creating and structuring courses.
    - Section Editor: Tools for creating and editing different types of sections (content, exercises, recaps)
    - Asset Manager: System for organizing and managing course-related media and files.
- Administration Platform: This is the application that an administrator will use to manage users, payments, and courses, and to view analytics, error reporting, etc.
    - Student: A student is a registered user who engages with course content.
    - Content Creator: A user who creates and manages course content, and responds to inquiries and feedback.
    - Administrator: A user who manages the learning platform and content management platform, the related users and courses.
    - User Management Tools: tools for managing user accounts and permissions.
    - Analytics Dashboard: interface for viewing course and user statistics
- Marketing Website: This is the website/application that will contain all information related to all courses, pricing, and other details necessary to guide users into using the learning platform and purchasing courses.
    - Guest: A guest is a visitor to the marketing website who is a potential future user or content creator.
- Technical Terms
    - API: Application Programming Interface, used for integrating external services or data
    - Database: the system used to store course content, user data, and progress information
- Terms we are **not** using:
    - Lesson: instead we need to specifically refer to section content, section exercises, or chapter recaps

### Overall System Functionality summary

As the product owner, I want a core system that does all of the functionality itself:

- the backend creation of content
- storage of content
- serving content
- A front end that renders or serves the already-rendered content (e.g. the markdown pages are probably static, the exercises are definitely dynamic).
- Authentication
- payment system for purchasing content
- marketing/home page for advertising the product and allowing users to sign in and purchase, etc.

Then, as a product owner, I could sell the core system to other organizations, and they could create whatever content they want for it. So the core system is the shell--learning platform, content creation platform, administration platform--and the actual contents (i.e. courses) are then created by whoever owns that instance of the platform. 

### Content Creation and Management

- at a high level, the content creator (a type of user) would sign in to a content management system
- from there, they would create the course--chapters, sections, content for those sections, etc.
- they would have a status for the course, like 'draft' and 'finished'
- a 'published' course could then be branched basically--i.e. start a version to make updates that don't go live until they are finished by the content creator
    - any updated sections would have their last updated timestamp updated as well--but only those sections

### Platform Administration

- this would be a signed in 'admin' user
- they would be able to see a list of courses, course details, course publication status, # of enrolled users, other analytical data that is appropriate
- a course would not be live on the site (and available to users) until an admin published it; they could only publish 'finished' courses and course updates; they could unpublish a course; they could archive a course (which does not delete its contents but removes it from content creator administration site)
- they would be able to manage things like the content of the marketing site, it's course landing pages, faqs, things like that
- they would be able to manage users--user details, purchase details, authentication details, tools to help with authentication, purchasing
- view any provided feedback, either directly or not directly related to course content
- view other administration related information--things like analytics, error reporting/logging things (sentry?), etc. 

## Current Architecture Overview

> Last updated Oct 27, 2024 at 12:24:58 PM
> 

1. Frontend (Astro + React)
   - Marketing Site
   - Learning Platform
   - Admin Dashboard
   - CMS Interface

2. Astro Content Collections
   - Courses Collection
   - Chapters Collection
   - Exercises Collection

3. Astro API Routes
   - Content Serving
   - User Management
   - Progress Tracking
   - Feedback System
   - Note Management

4. Backend Services
   - libsql database (by way of AstroDB)
   - Authentication through Oslo (including OAuth)
   - Real-time Subscriptions (service tbd)
   - Storage (service tbd)
   - Code Execution (for exercises) (service tbd)

5. External Services Integration
   - Stripe Payment
   - Vercel Deployment
   - Oslo authentication
   - Sentry analytics/monitoring

## Epics & Features

### Learning Platform

#### Courses Dashboard / User Landing Page
- [x] This is the page displayed after a user logs in successfully
- [x] View all registered/purchased courses
- [x] View status/progress of all courses
- [x] View detailed status of individual course progress
- [x] View all achievements
- [x] View all notes
- [x] Select course to continue progress/start progress

#### Course Functionality

##### course flashcards

- [x] - view course flashcards interface (open in separate tab?)
- [x]     - view weekly streak (answer x flashcards per day to earn streak credit)
- [x]     - view incomplete/outstanding flash cards count
- [x]     - start current flashcards run (i.e. complete flashcards flagged as new; each run is a block of 10 flashcards)
- [x]         - view flashcard question & possible answers
- [x]         - close flashcard run screen
- [x]         - select flashcard answer
- [x]         - provide answer feedback--correct or incorrect, plus explanation of correct/incorrect
- [x]         - navigate to next flashcard (only after answered)
- [x]         - complete run (indicate score out of 10 on current run; submit = done button; update new flashcards count)
- [x]         - incorrectly answered flashcards are kept in the new flashcards set until answered correctly
- [x]     - review all earned flashcards
- [x]         - review all completed flashcards
- [x]         - review by chapter
- [x]     - view flashcards onboarding/welcome slideshow
- [x]     - provide flashcard functionality feedback
- [x]     - view flashcards FAQ

##### user profile

- [x] - view profile menu
- [x]     - view user profile information (avatar, name, email)
- [x]     - view github discussions (link to github)
- [x]     - view purchases
- [x]         - view all purchases (course name, purchase date, expiration date)
- [x]         - navigate to other course (other courses listed under purchases are clickable links)
- [x]     - logout

##### course functionality

- [x] - begin random challenges
- [x] - hide popular highlights
- [x] - disable font ligatures
- [x] - mute sound effects
- [x] - switch theme (light/dark)
- [x] - show course knowledge map
- [x] - show features & faq
- [x] - view achievements
- [x] - indicate new achievement completed (displayed as notification)

##### course navigation

- [x] - view course outline (chapters, sections, chapter recap, completion status of sections)
- [x]     - navigate to different section (all chapters and sections are clickable to navigate to them)
- [x] - search lessons and challenges (dynamically filters chapters and sections to show only matches)
- [x]     - clear search input (reset outline to default)
- [x] - filter chapters and sections by bookmark
- [x] - view current chapter number and name (clicking opens course outline)
- [x] - navigate to previous section/lesson/exercise
- [x] - navigate to next section/lesson/exercise

##### help functionality

- [x] - view help modal
- [x]     - ask question directly related to current lesson
- [x]         - suggest improvement to lesson
- [x]         - contact course owner/administrator
- [x]     - ask question not directly related to current lesson
- [x]         - skip to a chapter
- [x]         - reset course progress
- [x]         - invoicing
- [x]             - VAT reverse charge invoice (EU only)
- [x]             - generate an invoice
- [x]             - other (contact site administrator)
- [x]         - payment issues or gift course
- [x]             - resolve payment issue
- [x]             - gift course to friend
- [x]             - other (contact site administrator)
- [x]         - restore purchase or update email
- [x]             - recover payment / restore purchase
- [x]             - update email address
- [x]             - extend pro account beyond 5 years
- [x]         - general feedback

#### Chapter Functionality

##### Notes

- [x] - view/edit/delete notes for chapter
- [x]     - view all notes and highlights for current chapter
- [x]     - delete note or note+highlight or just highlight
- [x]     - edit note
- [x]     - print notes for current chapter
- [x] - create note for chapter (combine highlight text and enter note)
- [x] - highlight text for chapter (no note)
- [x] - view notes for previous chapters
- [x] - save chapter recap content to notes (actually displayed on the chapter recap section of the chapter)

##### Current Section (content section)

- [x] - view current section
- [x] - view section last updated timestamp
- [x] - bookmark current section
- [x] - view section content
- [x] - view section recap
- [x] - rate section (helpful/unhelpful)
- [x]     - provide feedback on section

##### Current Section Exercise(s)

- [x] - view exercise code editor
- [x]     - navigate exercise files (if more than 1 file only)
- [x]     - view prepopulated exercise code
- [x]     - edit exercise code
- [x]         - view syntax highlighting for entered code
- [x]         - view autocompletion for entered code
- [x]         - view unused variables in current code
- [x]         - view unused parameters in current code
- [x]         - highlight invalid code
- [x]         - comment out code
- [x]         - uncomment code
- [x]         - display tip/hint for variable not found (e.g. user typed product, actual array name is products)
- [x]     - update exercise console based on entered code
- [x]     - maximize code editor
- [x]     - return code editor to original size (aka minimize, only after maximized)
- [x] - view exercise instructions
- [x]     - bookmark exercise
- [x]     - view exercise title
- [x]     - view exercise details
- [x] - view exercise browser
- [x]     - (note: only for exercises with an index.html file)
- [x]     - complete exercise form
- [x]     - submit exercise form
- [x] - view exercise test(s)
- [x]     - view individual test(s) details
- [x]     - view current test completion status (not started; successful; failed)
- [x]     - display failed test error message
- [x]     - minimize tests window
- [x] - view exercise console
- [x]     - dynamically display current code's console output
- [x]     - enable/disable clear console after run function
- [x]     - clear console manually
- [x]     - minimize console
- [x] - run exercise
- [x]     - update tests status
- [x]     - enable navigate to next section/exercise/recap button
- [x]     - display any flashy congratulations things?
- [x] - view exercise solution (modal)
- [x]     - view solution diffed against user answer
- [x]     - copy solution
- [x]     - view/edit solution unlock timer delay
- [x]     - save changed delay
- [x]     - close exercise solution modal
- [x] - get a hint(s) for exercise (modal)
- [x]     - view count of hints for current exercise (e.g. 1 of 4, 2 of 4, etc)
- [x]     - view currently displayed hint number (e.g. hint 1, hint 2, etc)
- [x]     - view current hint details
- [x]     - navigate to previous hint (only if user is navigated past first hint)
- [x]     - navigate to next hint (only if user is not on last hint)
- [x]     - close hint modal (i.e. let me try button)
- [x] - remind me to complete exercise later
- [x]     - display success notification
- [x] - navigate to next section (content, exercise, or chapter recap)

#### Current Chapter Recap
- [x] - display last updated timestamp
- [x] - bookmark chapter recap
- [x] - view chapter recap content
- [x] - rate chapter recap (thumbs up/thumbs down)

### Administration Dashboard

- stories need to be fleshed out in detail still

### Content Management Platform

- stories need to be fleshed out in detail still

### Marketing Website

#### Overall Learnit Landing page

- search site
    - What does it search? Search course names? Course chapters/sections? all course content? Other content (resources)? Help? 
- view all available courses (aka catalog)
    - view popular courses
    - view all courses
        - note: codecademy example is massive overkill for us; we're doing larger courses, and fewer of them to start--it would be more important later on, but not at the outset
    - view career paths (a grouping of courses)
- view learning platform functionality (e.g. flashcards, projects, exercises, sample lists of things you'll learn)
- view testimonials
- view companies using product
- view about the instructor/creator (i.e. me in the case of learnit)
- view call to action--why learn the selected course through this platform?
- view pricing information
    - view free trial information (general info--specific info would be unique to each course)
    - view pricing for every course (list?)
        - should we do recurring or one-time payment model?
        - Pricing different for individuals, students, and businesses/teams?
    - view pricing faqs
        - how much do the courses cost
        - what are the purchase options
        - can i get a refund
        - how long do i have access to the course
- select individual course (navigates to a course's dashboard if logged in, course landing page logged out)
- start individual course (what flow do I want here? they probably need to register first, then sign in, then it will start them)
- view footer
    - contact
        - link to any profiles--linkedin, youtube, twitter, instagram, facebook, tiktok, discord?
        - view discord link (follow discord prompts to authenticate, launch app, whatever applies)
    - privacy policy
    - cookie policy
    - terms and conditions
    - 'made by mike earley'
    - copyright date
    - `${programming_language} is a copyright of ${whatever corporation}. We are not endorsed by or affiliated with ${said corporation}.`
    - 
- view header (does the site need a header?)
    - I don't know if we need a header, and if we do, I don't know what should be in it
    - link to support or discord?
    - user profile if signed in?
    - call to sign in if signed out?
    - call to register?
- View resources
    - (note: this is a down the road feature for sure)
    - View documentation for programming languages taught on platform (e.g. MDN web docs for javascript)
    - View learning and practice tools
        - View articles
        - View cheatsheets
        - View code challenges (that aren't inside of the platform courses)
        - View projects
        - View videos
        - View workspaces (a place to build projects in the browser)
    - View career advice
        - View answers to coding career questions
        - View learning tips--where to start, how to stay motivated, etc.
        - View job readiness tracker (analyze compatibility with tech roles, using AI)
     
#### Individual Course Landing Page (guest user)

- basically the stuff that is above for learnit platform
- view pre-requisites
- view skills you'll gain after course completion
- view course summary
- view course syllabus/outline
    - view section details (accordion expander)
- view frequently asked javascript questions (accordion)
    - this is things like:
        - what does JS do
        - what kinds of jobs can i get
        - why is it so popular
        - what do i need to know before learning js
        - are java and js the same
- view related courses
    - for example, if I have a learn programming basics, or learn react, or learn html/css, it would go here
- view related paths
    - codecademy has a concept of paths, which is a block of courses all related to one thing (aka skill paths)
        - e.g. 'create a back end app with javascript'
        - skill path is identical landing page to course page, except its outline starts a level higher (path > courses > sections)
- start course
- view course controls tutorial
    - what are flashcards, how do i use them
    - what do i do if i get stuck
    - can i use the app on mobile, desktop, tablet?
    - course controls--all of the various things the user can click on and what they do
    - number of sections that are provided for free before user has to purchase course
- is there anything unique/different for a course? (sure, but is it just content, or are there different sections)
    - Codecademy has (not sure I want these):
        - star rating from previous learners, # of ratings
        - view ratings details
            - view # of ratings
            - view overall rating average
            - view ratings breakdown by stars (1, 2, 3, 4, 5 stars)
            - view testimonials about course
        - number of learners enrolled
        - view skill level
        - view time to complete
        - view # of projects (or challenges?)

#### Individual Course Landing Page (logged in user)

- see Course Functionality section

#### Support Landing Page (logged in user)

- not sure what all goes here…
    - faqs?
    - contact form?
    - discord link? 

#### Support Landing Page (guest user)

- not sure what content here is different from logged in user
    - no access to discord?

#### Learnit Platform registration
- register new user
    - oauth from github and google
    - view password requirements
- learnit terms of service and privacy policy links
- view login page instead of registration page

#### Learnit Platform Login
- log in user (email/password)
- log in user (oauth)
- reset password (email/password user only)
- view register page instead of login page

## Key Decisions and Notes

> Last updated Oct 27, 2024 at 12:19:09 PM
> 

1. Using Astro 5.x (currently in beta) for the frontend with React components.
2. Database decisions:
    1. Made decision to stop using supabase due to platform concerns and issues
    2. Made decision to use AstroDB for local development, with storage on either Turso or self-hosted as the online hosting service for the DB
    3. Implementing a strong/robust seed configuration and typing setup so that when we actually do the seed.ts file, we consistently build out a set of data that is as close to a production version of data as possible. 
    4. We are using ulidx as the library for generating and accessing our ULID ids on our tables
    5. We're going to use the effect library for a variety of concerns; one of those concerns is schema validation, using effect/Schema (instead of using zod for example)
    6. Note: Effect no longer requires the _ adapter functionality to interact with generator functions. As of version 5.5+ of typescript, it is no longer necessary. 
3. Error Handling, Logging, Metrics, Analytics
    1. Going to implement Sentry for this purpose, in terms of storing/monitoring
    2. Locally, will use Effect's system to log problems and pass information to Sentry also
4. Tailwind & Design decisions:
    1. Will use the inter-veriable font as the primary font
    2. Will use mononoki as the primary code/monospace font
    3. Installed the tailwind-merge package to simplify tailwind classes in production
    4. Installed the fluid-tailwind package to be able to use the 'clamp' feature of css in tailwind without a lot of overhead
5. Installed the date-fns package to utilize for various date related functionality
6. This means we need to fill some gaps!
    1. real time subscriptions
    2. code execution
    3. edge functions if needed (I think vercel provides this)
    4. storage if needed (there aren't a lot of images in the initial courses)
7. Made decision to switch from Hanko to Oslo for authentication

## Completed Steps/Tasks

> Last updated Oct 8, 2024 at 12:24:00 PM

1. Set up the project structure--installing and configuring all of the various tooling (see [Tooling](#tooling))
2. Initial facade definition of all learning platform user stories (see [Epics & Features > Learning Platform](#learning-platform))
3. Had to remove quite a bit of functionality due to build errors--removed mdx, starlight, and supabase and astroDb, due to build issues--will readd astroDb soon

## To-Do / Next Steps

> Last updated Oct 27, 2024 at 12:23:49 PM

1. Define remaining features:
    1. Administration: flesh out all features and turn into user stories, subject only
    2. Content Management Platform: flesh out all features and turn into user stories, subject only
    3. Marketing Website: take features already listed in this doc and turn into user stories, subject only
    4. Learning Platform: user stories created, need to be fleshed out for all stories
2. Implement error handling and logging--set up ErroyBoundary components for React Islands within Astro pages (still needed?); Implement a global error handling strategy; set up a logging system for better debugging and monitoring.
3. Resolve the following error: `21:20:29 [ERROR] [astro:db] [vite] cannot find entry point module 'astro:db'.` (appears in console when running `yarn astro dev`
4. Revisit authentication solution--should we use Hanko, or Auth.js, or auth-astro, or oslo and custom-written auth (akin to lucia auth, which is being sunset)
    1. I think we're going to go with Oslo
7. Once we've updated Notes and User Progress seeding to be more dynamic, we can do the following:
    1. implement error handling (use Effect for this, with Sentry integration)
    2. Create a mechanism to easily reset the database to its seeded state for testing purposes
    3. Implement a way to seed data incrementally or update existing seed data
    5. Add data validation checks before inserting seed data
8. need to write functions that update the enrollment_date, purchase_date, expiration_date columns appropriately
9. We need to write a function that automatically assigns newly created courses to any users of role 'app_admin', so it doesn't have to be done manually
10. Courses table needs new fields:
    1. course status column--"published", "archived", "draft"
    2. course last_edited_by column (it's a foreign key reference to users)
    3. course last_edited_on column (date)
11. I'm going to take a guess that we also need those exact same columns for "Chapters", "Sections", and "Exercises"...
12. I need to know how sqlite handles historical changes--i.e. if an 'author' makes changes to a course, and saves the course changes, the new version of the course is not 'published' until an app_admin or course_admin 'publishes' the course; so we would have to somehow maintain 2 versions of the course? Or handle draft changes to a published course in a different manner, so that when an admin changes it from 'draft' to 'published', we apply the changes to the existing course row? Or do we just create a new course row, new copies of all of its descendants including any changes made to them (chapters > sections & exercises), update all users, user_progress, user_exercise_progress? That option sounds like a nightmare. I'm open to whatever ideas you have here. 
13. Implement the Effect typescript library, including OpenTelemetry
    1. I don't know anything about either of these libraries, you're going to have to walk me through them
    2. Effect apparently has some advanced features beyond just error management:
        1. First, implementing the Effect type functionality, creating and running the effects
        2. Using Effect.gen, to create generators instead of async/await blocks
        3. pipelines
        4. Error management
        5. Services and Layers
        6. Scope and Patterns
        7. Observability
        8. Runtime
        9. Scheduling
        10. State Management
        11. Batching
        12. Caching
        13. Concurrency
        14. Streaming
        15. Testing
        16. Control Flow
        17. Code Style
        18. Schema
        19. Platform

## Open Questions / Concerns

1. How are we going to do the code execution? 
2. Specific requirements for the spaced repetition system.
3. Analytics requirements and implementation details.
4. Explain Astro middleware. Discuss how Astro middleware works; make sure we implemented it correctly.
5. Implement documentation: Astro for application docs, and README.md. README.md should explain the project, outline the tooling, outline the installation method, how to run dev, build, test, run the database, reseed the database, etc. Operate all tooling in other words. The application docs should document all of the APIs, other services, whatever would normally be documented so that someone else can use the application.
6. Outline accessibility functionality, including keyboard navigation
7. Are there any specific conventions or patterns being used in the project (e.g. naming conventions, file organization)? I can't think of anything, might come up later.
8. AI asked for a brief description of the authentication and authorization strategy I'm implementing--honestly, I have no strategy here, so we probably need to define a strategy. 
9. Open question as to how we're going to manage the separation of concerns regarding Course content data storage (database, content collection, something else) and Platform data storage (users, etc)
10. We previously created `middleware.ts`, `auth-middleware.ts`, `triggers.ts`, and `astrodb_utils.ts`, and I need to understand how these all interact with each other; I also need to complete all of them, because they're currently only stubbed out
11. We need to pull out Hanko authentication and implement authentication using Oslo instead [Oslo](https://oslojs.dev)

## Tooling

> Last updated Oct 27, 2024 at 12:23:34 PM
> 

This tooling setup ensures consistency across the development process and facilitates efficient collaboration.

### Backend / Database

* Database: AstroDB, which is a version of Turso's libsql basically
* ORM: AstroDB uses drizzle ORM
* TablePlus: I'm also using TablePlus to access the database locally (and, eventually, remotely)
* Authentication:
    * ~~Hanko as the third party authentication provider (not installed)~~
    * I think we're going to switch from Hanko to Oslo for authentication
    hCaptcha for frontend authentication security (not configured)
    * GitHub and Google planned for OAuth implementation (not configured)
* Payment Processing: Stripe (not installed/configured)

### Frontend

* Meta-Framework: Astro 5.0.0-beta (currently 5.0.0-beta.2)
  - Contains React islands for interactivity (or Astro Actions?)
  - Manages content collections for courses
  - Utilizes new content collections and content layer API functionality introduced in Astro 5.x
* CSS Framework: Tailwind CSS
* Installed Fonts
    * Inter Variable
    * Lilita One
    * Righteous
    * Mononoki (for code)
    * Note: I'm using the unfont package to manage the fonts
* Icon Sets
    * `@iconify-json/simple-icons`
    * `@iconify-json/solar`
    * `astro-icon`
* Frontend Framework: React with TypeScript for interactive islands, OR astro with astro actions?

### Unit, Integration, and e2e Testing

* Testing:
  - Vitest for unit testing
  - Playwright for integration and end-to-end testing

### Development Environment

* Package Management: yarn
* Code Quality:
  - ESLint for linting
  - Prettier for code formatting
* Version Management: `mise` application in the terminal for managing versions of node, python, and other tools
* Operating System: macOS
* Terminal Application: Kitty
* Shell: Fish
* Web Browser: Vivaldi
* Code Editor: Cursor

### Hosting / Production / DevOps

* Hosting: Vercel
* CI/CD: GitHub Actions
* Analytics/Monitoring: Sentry

### Project Management

* Issue Tracking: GitHub Issues (for features, stories, and bug tracking)
* Branch Management:
  - `main` as the production branch
  - `develop` as the staging branch
  - Using conventional commits and git flow for commit and branch management

## Database

### Courses Table

> Last updated at Oct 16, 2024 at 11:34:22 AM
> 

A course is the highest level of related blocks of content. Students register for courses and gain access to all content in a course once paid. Students can complete the first N sections of a course for free, the rest of the content is locked behind paywall. Students can register for multiple courses. Course paid access can potentially have an expiration date that is based on the purchase date plus a predefined period of time. 

* slug (unique): I don't know why you defined this as a column, honestly
* subject_area: basically, it's anything from 'javascript', 'react', '1st grade math', etc. 
* tags: well, for a course on React, it would be stuff like react18, typescript, javascript, react19 maybe depending on when it's written
* price (optional; precision 10, scale 2): the cost of the course after the free lessons are completed
    * we probably need to track which sections are free and which require the user to purchase the course to continue--that's not in the database yet
* purchase_active_length (number, optional): this is an amount of time defined at the course level, that, when added to a student's purchase date in a course, sets the trigger date; if empty/null, then course purchase does not expire

### Chapters Table

> Last updated at Oct 15, 2024 at 6:43:06 PM
> 

A chapter row is a subset of a course. 

* course_id (indexed): foreign key ref to Courses
* order_number: serial sequence of chapters
* estimated_time: approximate time to complete all sections of the chapter; this is time in minutes

### Sections Table

> Last updated at Oct 16, 2024 at 11:34:33 AM
> 

A section row is a subset of chapter, of type lesson, exercise, or recap. 

* course_id (indexed): foreign key to Courses
* chapter_id (indexed): foreign key to Chapters
* exercise_id (indexed, optional): if section type is exercise, foreign key to Exercises
* order_number: serial sequence of section within the course
* content_type: 'lesson', 'exercise', 'recap' are the types here; if 'exercise', needs an exercise_id also
* content (JSON, optional): the actual content for that lesson/recap; empty if type is exercise, that content is located on Exercises table
* access_level (default 'purchased'): either 'free' or 'purchased'; free indicates a student can access this material after enrolling/registering for a course, even if they have not purchased the course; 'purchased' indicates the student can only access the content if they have purchased the course (i.e. there is a purchase date value in the courses row for this course)

### Exercises Table

> Last updated at Oct 16, 2024 at 11:34:50 AM
> 

This table represents a breakout of sections that have a type of 'exercise'. This is because exercise content is much more complex than lesson or recap content, and also because progress through an exercise is tracked more fully.

* section_id (indexed): foreign key to Sections
* instructions (text): the instructional text displayed in the exercise for the user to understand how to complete the exercise
* browser_html (JSON): the HTML content of 1 or more HTML files that are rendered as the user completes the exercise; if the exercise doesn't use a browser (only a console), then this will just be something simple like "HTML content will appear here when the exercise requires it"
* code_files (JSON): this is the code content of 1 or more code files (javascript, typescript, python, html, css, whatever the case may be)
* tests (JSON): the test content of 1 or more tests that will pass the exercise solution
* hints (JSON): the hint content of 1 or more hints that will help the user complete the exercise
* difficulty: 'beginner', 'intermediate', 'advanced' are probably sufficient for now
* default_solution (JSON): this is the solution as defined by the course author. 
* user_solution (JSON): this is the solution the user wrote, which is updated as they continue to update the solution--so, every time we run the console code (which is basically live) we should also save the user solution
* estimated_time_minutes: estimated time, in minutes, to complete the course

### Feedback Table

> Last updated Oct 20, 2024 at 11:59:37 AM
> 

### Feedback Table

This table represents feedback submitted by students through the learning platform interface. 

* student_id (indexed): foreign key to Users, represents the student who submitted the feedback
* section_id (indexed): foreign key to Sections; it is the section from where the student submitted the feedback
* assigned_to_id (indexed, optional): foreign key to Users; represents the admin/author currently handling the feedback
* feedback_text (JSON): the feedback as the user wrote it and submitted it, stored as JSON to allow for rich text formatting and additional metadata
* rating (optional): the rating a user has provided to a section; uses a star rating system (0-5)
* status: the current status of the feedback, can be one of: 'submitted', 'assigned', 'in_progress', 'pending_publication', 'resolved', 'no_action_required'
* category (optional): classifies the type of feedback, e.g., 'incorrect_content', 'general_feedback', 'technical_issue', etc.
* admin_notes (optional): notes written by the course or app admin handling the feedback
* github_issue_link (optional): link to a GitHub issue if one has been created to track the feedback

### Notes Table

> Last updated at Oct 15, 2024 at 7:33:56 PM
> 

This table represents notes that the student takes during a course. Each row is an entry the user has written, or text they've highlighted, or both. A user can have 0 to many rows for each section. 

* user_id (indexed): foreign key to users
* section_id (indexed): foreign key to sections
* note_text (JSON, default {}, optional): any notes the user has added to a particular section
* highlighted_text (JSON, default {}, optional): any sections of text in the chapter recap or lesson content that the user has highlighted to add to their notes
    * note: there can be notes text without a highlight, and a highlight without notes text, and a combination of note text and highlights for a single row/entr6y

### User Exercise Progress Table

> Last updated at Oct 16, 2024 at 11:36:00 AM
> 

This table tracks a student's progress in one exercise per row. Each row is unique across user & exercise_id combined; a user can have multiple rows on the table but only one per exercise_id. 

* user_id (indexed): foreign key to users
* exercise_id (indexed): foreign key to exercises
* score (optional, default 0): score of exercise
* completed (boolean): status of exercise
* attempts (default 0): number of attempts--tbd whether this is # of times user has hit the 'run' button, or something else
* last_attempt_at (date, optional): the date the student last attempted the exercise in this row

### User Progress Table

> Last updated at Oct 16, 2024 at 11:36:28 AM
> 

This table track's a student's progress in one course. Each row represents one user/course unique combination. A user can have multiple rows, but only if they have multiple courses. If there is no entry on this table for a registered course for a student, then they have not started the course.

* user_id (indexed): foreign key to users
* course_id (indexed): foreign key to course
* current_section_id (indexed): foreign key to sections.id
* completed_sections (json, default {}): list of completed sections in current course
* last_accessed_at (optional): last time user accessed the course
* enrollment_date: this is the date the student registered for the course; a student that hasn't registered for a course does not have an enrollment date--and, probably, doesn't even have a row on this table. 
* purchase_date (optional): this is the date the student purchased the course content; if empty/null, student has not purchased course
* expiration_date (optional): date the student no longer has access to purchased sections of the course. Determined by adding purchase_active_length to purchase_date, using a trigger or function. If the expiration_date is empty/null, then either the student hasn't purchased the course, or the course does not have an expiration on its purchase. 

### Users Table

> Last updated at Oct 15, 2024 at 7:40:19 PM
> 

This table stores the users of the learning platform, administration platform, and content management platform.

* name: the user's full name
* email (unique): the user's email address
* avatar_url (optional): a link to a user's avatar if provided by an oauth app like github
* role (default 'student'): 'student', 'author', 'course_admin', 'app_admin'
* enrolled_courses (optional, JSON): a list of 0 or more enrolled courses
* auth_provider (optional): if oauth, who is the oauth provider
* auth_provider_id (optional): if oauth, id of user at auth_provider
* github_username (optional): if github oauth, username of user
* google_id (optional): if google oauth, id of user
* gitlab_username (optional): if gitlab oauth, username of user
* bitbucket_username (optional): if bitbucket, username of user
* last_sign_in (date, optional): last successful sign in of user


## Database Structure

> **note**: `astro db seed` is NOT an available command for the astro database. Valid commands are `astro db push`, `astro db verify`, `astro db execute <file-path>`, and `astro db shell --query <sql-string>`

### Data Seeding layout

> Last updated Oct 18, 2024 at 2:49:16 AM
>
> Note: For all tables, when a column type is JSON, the seed data should use JSON objects.

#### Courses

* 3 courses (Javascript Fundamentals, Advanced React Development, Python Fundamentals)

#### Chapters

* 7 chapters
    * 2 for course1 (JavaScript Fundamentals)
    * 2 for course2 (Advanced React Development)
    * 3 for course3 (Python Fundamentals)

#### Sections

* 27 sections
    * Course 1: JavaScript Fundamentals (6 sections)
        * Chapter 1: JavaScript Basics (3 sections: lesson, exercise, recap)
        * Chapter 2: Functions and Objects (3 sections: lesson, exercise, recap)
    * Course 2: Advanced React Development (6 sections)
        * Chapter 1: React Fundamentals (3 sections: lesson, exercise, recap)
        * Chapter 2: State Management (3 sections: lesson, exercise, recap)
    * Course 3: Python Fundamentals (15 sections)
        * Chapter 1: Python Basics (6 sections: lesson, exercise, lesson, exercise, exercise, recap)
        * Chapter 2: Data Structures in Python (3 sections: lesson, exercise, recap)
        * Chapter 3: Python Functions and Modules (6 sections: lesson, lesson, exercise, exercise, exercise, recap)

#### Exercises

* 11 exercises, mapped to the appropriate sections
* Each exercise includes:
  - A randomly generated number (1-4) of HTML files
  - A randomly generated number (1-4) of code files
  - A randomly generated number (1-4) of tests
  - A randomly generated number (1-4) of hints
* This randomization ensures variety in exercise complexity and content
* Each exercise also includes:
  - Instructions
  - Difficulty level
  - Estimated completion time
  - A default solution
  - A user solution (if the exercise has been completed by any user)

#### Users

* 17 users in total:
    * Students (8): 
        * user1: enrolled in course1
        * user2: enrolled in course2
        * user3: enrolled in course2
        * user4: enrolled in course3
        * user5: enrolled in course3
        * user6: enrolled in course1, course2
        * user7: enrolled in course1, course2, course3
        * user8: not enrolled in any course
    * App Admins (1): 
        * user9: assigned to all courses
    * Course Admins (4): 
        * user10: assigned to course1
        * user11: assigned to course2
        * user12: assigned to course3
        * user13: assigned to course2, course3
    * Authors (4): 
        * user14: assigned to course1
        * user15: assigned to course2
        * user16: assigned to course3
        * user17: assigned to course2, course3

#### Feedback

* Generate feedback entries for every combination of:
    * Statuses: submitted, assigned, in_progress, pending_publication, resolved, no_action_required
    * Categories: incorrect_content, general_feedback, technical_issue, feature_request, clarity_improvement, typo_or_grammar
    * Ratings: 0-5
* Each feedback entry should be randomly assigned to a student user (1-7) and a section
* For statuses 'assigned', 'in_progress', 'pending_publication', and 'resolved', randomly assign an admin user (app_admin, course_admin, or author)
* For statuses 'in_progress', 'pending_publication', and 'resolved', generate a mock GitHub issue link
* Ensure feedback dates are after the student's creation date
* Random distribution of created_at and updated_at dates

#### Notes

* Generate between 3 and 8 notes for each chapter for users 1-7
* Random distribution of note types:
    * note_text only
    * highlighted_text only
    * both note_text and highlighted_text
* Random distribution of created_at and updated_at dates
* Content should be relevant to the course and chapter topics

#### User Exercise Progress

* Progress entries for every exercise for users 1-7
* Include score, completion status, number of attempts, and last attempt date
* Randomize completion status and scores

#### User Progress

* Progress entries for users 1-7 on their enrolled courses
* Include:
    * current section
    * completed sections (randomized)
    * enrollment date (random date within the last 90 days)
    * purchase date (if applicable, random date after enrollment date)
    * expiration date (if applicable, based on course purchase_active_length)
    * last accessed date (random date within the last 7 days)

### Notes on SQLite, AstroDB, and Drizzle working together

> Last updated at Oct 16, 2024 at 11:44:34 AM
> 

* I'm going to refer to the combined functionality of astrodb, which uses drizzle and sqlite, collectively  as the platform database, or platform db
* The platform db uses:
```sql
await db.run(sql`
...sql to execute here
`);
```

* this is instead of using `db.execute(sql...)`, which you keep using

### Courses Table

> updated Oct 11, 2024 at 2:26:37 AM

| field        | type                 | default          | required | notes  |
|--------------|----------------------|------------------|----------|--------|
| id           | text                 | n/a              | not null |        |
| title        | text                 | n/a              | not null |        |
| description  | text                 | n/a              | not null |        |
| slug         | text                 | n/a              | not null | unique |
| subject_area | text                 | n/a              | not null |        |
| level        | text                 | n/a              | not null |        |
| tags         | json                 | n/a              | not null |        |
| price        | number(10,2)        | n/a              | optional |        |
| created_at   | date                 | NOW              | not null |        |
| updated_at   | date                 | NOW              | not null |        |

### Chapters Table

> updated Oct 11, 2024 at 2:26:31 AM

| field          | type                  | default          | required |
|----------------|-----------------------|------------------|----------|
| id             | text                  | n/a              | not null |
| course_id      | foreign_key (courses) | n/a              | not null |
| title          | text                  | n/a              | not null |
| description    | text                  | n/a              | not null |
| order_number   | number               | n/a              | not null |
| estimated_time | text                  | n/a              | not null |
| created_at     | date  | NOW       | not null |
| updated_at     | date  | NOW       | not null |

### Exercises Table

> updated Oct 11, 2024 at 2:26:25 AM

1. The default solution is the solution the course author defines in the course management platform as the solution that is expected and which passes all tests
2. the user_solution is the solution the student writes when they perform the exercise; it will be stored when the student runs the code to test it

| field                  | type                   | default          | required | notes  |
|------------------------|------------------------|------------------|----------|--------|
| id                     | text                   | n/a | not null |        |
| section_id             | foreign_key (sections) | n/a              | not null |        |
| instructions           | text                   | n/a              | not null |        |
| browser_html           | json                  | n/a              | optional |        |
| code_files             | json                  | n/a              | not null |        |
| tests                  | json                  | n/a              | not null |        |
| hints                  | json                  | n/a              | not null |        |
| difficulty             | text                   | n/a              | not null |        |
| default_solution       | json                  | n/a              | not null | note 1 |
| user_solution          | json                  | n/a              | not null | note 2 |
| estimated_time_minutes | number                | n/a              | not null |        |
| created_at             | date   | NOW       | not null |        |
| updated_at             | date   | NOW       | not null |        |

### Feedback Table

> updated Oct 20, 2024 at 11:59:13 AM

| field             | type                   | default     | required | notes                                   |
|-------------------|------------------------|-------------|----------|------------------------------------------|
| id                | text                   | n/a         | not null | primary key                              |
| student_id        | text                   | n/a         | not null | foreign key (users)                      |
| section_id        | text                   | n/a         | not null | foreign key (sections)                   |
| assigned_to_id    | text                   | n/a         | optional | foreign key (users)                      |
| feedback_text     | json                   | n/a         | not null |                                          |
| rating            | number                 | n/a         | optional |                                          |
| status            | text                   | 'submitted' | not null | check constraint for valid status values |
| category          | text                   | n/a         | optional |                                          |
| admin_notes       | text                   | n/a         | optional |                                          |
| github_issue_link | text                   | n/a         | optional |                                          |
| created_at        | date                   | NOW         | not null |                                          |
| updated_at        | date                   | NOW         | not null |                                          |

### Notes Table

> updated Oct 11, 2024 at 2:26:12 AM

| field            | type                   | default          | required |
|------------------|------------------------|------------------|----------|
| id               | text                   | n/a | not null |
| user_id          | foreign_key (users)    | n/a              | not null |
| section_id       | foreign_key (sections) | n/a              | not null |
| note_text        | text                   | n/a              | optional |
| highlighted_text | text                   | n/a              | optional |
| created_at       | date   | NOW       | not null |
| updated_at       | date   | NOW       | not null |

### Sections Table

> updated Oct 11, 2024 at 2:26:06 AM

1. `check (content_type in ('lesson', 'exercise', 'recap'))`

| field        | type                    | default          | required | notes  |
|--------------|-------------------------|------------------|----------|--------|
| id           | text                    | n/a | not null |        |
| course_id    | foreign_key (courses)   | n/a              | not null |        |
| chapter_id   | foreign_key (chapters)  | n/a              | not null |        |
| title        | text                    | n/a              | not null |        |
| description  | text                    | n/a              | not null |        |
| order_number | number                 | n/a              | not null |        |
| content_type | text                    | n/a              | not null | note 1 |
| content      | number                   | n/a              | optional |        |
| exercise_id  | foreign_key (exercises) | n/a              | optional |        |
| created_at   | date    | NOW       | not null |        |
| updated_at   | date    | NOW       | not null |        |

### User_Exercise_Progress Table

> updated Oct 11, 2024 at 2:26:00 AM

1. `unique(user_id, exercise_id)`

| field           | type                    | default          | required | notes  |
|-----------------|-------------------------|------------------|----------|--------|
| id              | text                    | n/a | not null |        |
| user_id         | foreign_key (courses)   | n/a              | not null | note 1 |
| exercise_id     | foreign_key (exercises) | n/a              | not null | note 1 |
| score           | number                 | 0                | optional |        |
| completed       | boolean                 | false            | not null |        |
| attempts        | number                 | 0                | not null |        |
| last_attempt_at | date    | n/a              | optional |        |
| created_at      | date    | NOW       | not null |        |
| updated_at      | date    | NOW       | not null |        |

### User_Progress Table

> updated Oct 11, 2024 at 2:25:53 AM

1. `unique(user_id, course_id)`

| field              | type                   | default          | required | notes  |
|--------------------|------------------------|------------------|----------|--------|
| id                 | text                   | n/a | not null |        |
| user_id            | foreign_key (users)    | n/a              | not null | note 1 |
| course_id          | foreign_key (courses)  | n/a              | not null | note 1 |
| current_section_id | foreign_key (sections) | n/a              | not null |        |
| completed_sections | json                 | `'{}'`           | not null |        |
| last_accessed_at   | date   | n/a       | not null |        |
| created_at         | date   | NOW       | not null |        |
| updated_at         | date   | NOW       | not null |        |

### Users Table

> updated Oct 11, 2024 at 2:25:47 AM

1. `check (role in ('student', 'app_admin', 'course_admin', 'author'))`
2. `unique(auth_provider, auth_provider_id)`

| field              | type                 | default          | required | notes  |
|--------------------|----------------------|------------------|----------|--------|
| id                 | text                 | n/a | not null |        |
| name               | text                 | n/a              | not null |        |
| email              | text                 | n/a              | not null |  unique      |
| avatar_url         | text                 | n/a              | optional |        |
| role               | text                 | 'student'              | not null | note 1 |
| enrolled_courses   | json               | `[]`     | not null |        |
| auth_provider      | text                 | n/a              | optional | note 2 |
| auth_provider_id   | text                 | n/a              | optional | note 2 |
| github_username    | text                 | n/a              | optional |        |
| google_id          | text                 | n/a              | optional |        |
| gitlab_username    | text                 | n/a              | optional |        |
| bitbucket_username | text                 | n/a              | optional |        |
| last_sign_in       | date | n/a              | optional |        |
| created_at         | date | NOW         | not null |        |
| updated_at         | date | NOW         | not null |        |

### Indexes

> updated Oct 11, 2024 at 2:25:38 AM

1. Chapters table: `[{ on: ["course_id"] }]`
2. Exercises table: `[{ on: ["section_id"] }]`
3. Feedback table: `[{ on: ["user_id"] }]`
4. Feedback table: `[{ on: ["section_id"] }]`
5. Notes table: `[{ on: ["user_id"] }]`
6. Notes table: `[{ on: ["section_id"] }]`
7. Sections table: `[{ on: ["course_id"] }]`
8. Sections table: `[{ on: ["chapter_id"] }]`
9. Sections table: `[{ on: ["exercise_id"] }]`
10. User_Exercise_Progress table: `[{ on: ["user_id"] }]`
11. User_Exercise_Progress table: `[{ on: ["exercise_id"] }]`
12. User_Progress table: `[{ on: ["user_id"] }]`
13. User_Progress table: `[{ on: ["course_id"] }]`
14. User_Progress table: `[{ on: ["current_section_id"] }]` (`references: () => [Sections.id]`)

### Triggers

> updated Oct 11, 2024 at 2:24:24 AM
> 
> Need to identify a programmatic solution for triggers, libsql doesn't support them

1. updating the updated_at columns
    1. note: the language would need to change, since we're not using postgres anymore
```sql
create or replace function update_updated_at_column()
returns trigger as $$
begin
	new.updated_at = now();
    return new;
end;
$$ language 'plpgsql'; 
```
2. `create trigger update_users_updated_at before update on users for each row execute function update_updated_at_column();`
3. `create trigger update_courses_updated_at before update on courses for each row execute function update_updated_at_column();`
4. `create trigger update_chapters_updated_at before update on chapters for each row execute function update_updated_at_column();`
5. `create trigger update_sections_updated_at before update on sections for each row execute function update_updated_at_column();`
6. `create trigger update_exercises_updated_at before update on exercises for each row execute function update_updated_at_column();`
7. `create trigger update_feedback_updated_at before update on feedback for each row execute function update_updated_at_column();`
8. `create trigger update_notes_updated_at before update on notes for each row execute function update_updated_at_column();`
9. `create trigger update_user_progress_updated_at before update on user_progress for each row execute function update_updated_at_column();`
10. `create trigger update_user_exercise_progress_updated_at before update on user_exercise_progress for each row execute function update_updated_at_column();`

### Row level security

> updated Oct 11, 2024 at 2:24:35 AM
> 
> need to identify programmatic solution, libsql doesn't support this

```sql
alter table users enable row level security;
alter table courses enable row level security;
alter table chapters enable row level security;
alter table sections enable row level security;
alter table exercises enable row level security;
alter table feedback enable row level security;
alter table notes enable row level security;
alter table user_progress enable row level security;
alter table user_exercise_progress enable row level security;
```

### Policies

> updated Oct 11, 2024 at 2:24:59 AM
> 
> need to figure out programmatic solution, libsql doesn't support this 

1. Question: shouldn't there be a policy on users for admins to edit users?
```sql
create policy view_own_user_data on users for select using (auth.uid() = id);
create policy edit_own_user_data on users for update using (auth.uid() = id);
create policy admin_view_all_users on users for select to app_admin, course_admin using (true);
create policy view_courses on courses for select using (true);
create policy edit_courses on courses for all to app_admin course_admin author using (true);
create policy view_chapters on chapters for select using (true);
create policy edit_chapters on chapters for all to app_admin, course_admin, author using (true);
create policy view_sections on sections for select using (true);
create policy edit_sections on sections for all to app_admin, course_admin, author using (true);
create policy view_exercises on exercises for select using (true);
create policy edit_exercises on exercises for all to app_admin, course_admin, author using (true);
create policy manage_all_feedback on feedback for all to app_admin, course_admin using (true);
create policy view_own_feedback on feedback for select to student using (auth.uid() = user_id);
create policy create_feedback on feedback for insert to student with check (auth.id() = user_id);
create policy view all notes on notes for select to app_admin, course_admin using (true);
create policy manage_own_notes on notes for all to student using (auth.id() = user_id);
create policy view_all_user_progress on user_progress for select to app_admin, course_admin using (true);
create policy manage_own_progress on user_progress for all to student using (auth.id() = user_id);
create policy view_all_user_exercise_progress on user_exercise_progress for select to app_admin, course_admin using (true);
create policy manage_own_exercise_progress on user_exercise_progress for all to student using (auth.id() = user_id);
```

## Project Directory Structure (high level only)

> Last updated Oct 27, 2024 at 12:23:19 PM
> 
> Note: the following tree command was used, to prune unneeded directory/file info:
> `tree -a -L 4 -I 'node_modules|.astro|.git|.venv|.vercel|.vscode|.yarn|learnit-project'`

.
├── .DS_Store
├── .editorconfig
├── .env
├── .env.development
├── .env.production
├── .eslintrc.cjs
├── .gitattributes
├── .github
│   └── workflows
│       └── assign_me.yml
├── .gitignore
├── .mise.toml
├── .prettierignore
├── .prettierrc.cjs
├── .yarnrc.yml
├── LICENSE
├── README.md
├── astro.config.mjs
├── db
│   ├── config.ts
│   ├── seed.ts
│   ├── seedDataConfig.ts
│   ├── seed_config
│   │   ├── .DS_Store
│   │   ├── index.ts
│   │   ├── seed
│   │   │   ├── .DS_Store
│   │   │   ├── courses
│   │   │   │   ├── advanced-react.ts
│   │   │   │   ├── index.ts
│   │   │   │   ├── javascript-fundamentals.ts
│   │   │   │   └── python-fundamentals.ts
│   │   │   ├── date-options.ts
│   │   │   ├── exercise-content.ts
│   │   │   └── utils.ts
│   │   └── types
│   │       ├── seed-error-types.ts
│   │       ├── seed-success-types.ts
│   │       └── seed-types.ts
│   ├── seed_old.ts
│   ├── seederFiles
│   │   ├── chapters.ts
│   │   ├── courses.ts
│   │   ├── exercises.ts
│   │   ├── feedback.ts
│   │   ├── index.ts
│   │   ├── notes.ts
│   │   ├── sections.ts
│   │   ├── student-exercise-progress.ts
│   │   ├── student-progress.ts
│   │   └── users.ts
│   └── triggers.ts
├── db.d.ts
├── package.json
├── playwright-report
│   └── index.html
├── playwright.config.ts
├── public
│   └── favicon.svg
├── src
│   ├── .DS_Store
│   ├── content
│   │   └── config.ts
│   ├── env.d.ts
│   ├── layouts
│   │   ├── DocsLayout.astro
│   │   └── Layout.astro
│   ├── lib
│   │   └── auth-middleware.ts
│   ├── middleware.ts
│   ├── pages
│   │   ├── docs
│   │   │   ├── api-reference.md
│   │   │   ├── getting-started.md
│   │   │   └── index.md
│   │   └── index.astro
│   ├── scripts
│   │   └── runSeed.ts
│   ├── styles
│   │   └── global.css
│   └── utils
│       ├── astrodb_utils.ts
│       ├── general_utils.ts
│       └── temp_file_code.ts
├── tailwind.config.mjs
├── test-results
│   └── .last-run.json
├── tests
│   └── example.spec.ts
├── tests-examples
│   └── demo-todo-app.spec.ts
├── tsconfig.json
├── vitest.config.ts
└── yarn.lock

23 directories, 72 files

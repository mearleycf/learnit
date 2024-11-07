# Learnit Project Knowledge - Release 1

Last Updated: Nov 06, 2024 at 02:23:19 PM EST

## Notes to the AI

### What you need to know

> Last updated Oct 30, 2024 at 3:42:06 PM

1. We are doing the following, currently:
   1. ~~Moving to implement Effect's Console logging system~~
   2. ~~Logger testing page created at /logTesting~~
   3. ~~Need to fix typescript errors in runLog function params~~
   4. Convert current seeding process into a state machine using Effect
   5. Need to implement better structured logging and add context
   ~~6. Build out types for the generic Seeder state machine; types include:~~
      ~~1. [x] SeederState~~
      ~~2. [x] SeederEvent~~
      ~~3. [x] Transition~~
      ~~4. [x] Any other types that help to clean up or simplify the above states~~
   1. In the process of creating the separate seeder files for the remaining tables (we've done courses; need to do the rest)
      1. [] Courses
      2. [] Chapters
      3. [] Sections
      4. [] Exercises
      5. [] Users
      6. [] Feedback
      7. [] Notes
      8. [] Student Exercise Progress
      9. [] Student Progress
   1. We need to identify any remaining database integration tasks (schema validation, error handling, etc)
      1. [x] Initial AstroDB configuration
      2. [x] Schema definitions
      3. [x] Schema validation using zod
      4. [] error handling improvements
      5. [] database reset mechanism
      6. [] incremental seeding capability
1. Immediate next steps:
   1. Work on conversion of seeding to state machine
   2. complete the remaining seeder files following courses.ts pattern
   3. ~~implement zod for validation~~
   4. I'd like to export the logs to a file in addition to exporting them to Sentry...
1. Please note the following (also noted later in the document here)
   1. We're using TypeScript 5.5+, meaning we no longer need the \_ adapter to integrate Effect with generator functions
1. I need to know what changes we need to make to our Database sections of this document based on the current state of the seed.ts file and config.ts file.

5. We need to use the Zod library to set up schema validation

### General Hygiene Notes

> NOTE TO AI: **DO NOT** remove any unedited content from this document. Please ONLY make updates and additions. If you need to delete something, please check with me first. **DO NOT** replace any of the content with `[content remains unchanged]`
>
> NOTE TO AI: **DO NOT** try and print the full contents of this document into the chat response when I send it to you, it is **too long**. Just let me know you got it and we'll go from there.
>
> NOTE TO AI: I use fish shell, yarn and kitty terminal, I do not use bash, and I don't use NPM; most of the time there isn't an issue, especially when dealing with commands from a 3rd party cli interface--however, sometimes it matters. **Please remember this**
>
> NOTE TO AI: Please stop apologizing every time I correct an issue with something you helped me with. It's fine. I make mistakes, you make mistakes. I don't need to see a paragraph of you apologizing every time. Just get to the corrections.

## Summary of Project

> Last updated on Oct 30, 2024 at 3:43:14 PM
> 10/30: changed table names to student_progress, student_exercise_progress

I want to build a learning platform for learning development languages and frameworks. A good example is [Learn Javascript Online](https://learnjavascript.online)

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

- student submits feedback through learning platform (various ways to do this, which will in some instances set the category value)
- course_admin and app_admin are notified of feedback submission
- either of the admins updates the feedback--they need to determine if action needs to be taken; if action needs to be taken, they should take the action (mostly this is going to be updating a course section to correct content)...
  - they might need to create a github issue, in which case they should provide the github_issue_link value as well...
  - I think we need to update the possible statuses here, because if for example the app_admin looks at it, determines the author or course_admin needs to update content, then they should be able to (a) open an issue to notify the author or course_admin to make an update, set the status to 'assigned'
  - The author or course_admin or app_admin should be able to update it to 'in progress' if they're working on it but it's not done
  - When they're done, they should set it to 'pending', because most likely the change still needs to be published by an admin
  - once the change is completed, they should update status to resolved and close the github issue (but leave the link)
- If action doesn't need to be taken, for whatever reason (maybe the feedback is just "Hey, I love the app!"), then we shouldn't use the 'ignored' status, but I'm not sure 'resolved' is the right status either...what other status could we use in this scenario?

### Definition of terms

- Learning Platform: This is the application that a registered student who has registered for a course will use to engage in learning the course's content
  - Dashboard: The main page where a registered student can see their enrolled courses, payment status, progress, and achievements.
  - Course: A course is a group of concepts all related to learning a programming language or framework (or really, any group of related concepts), typically organized from most basic concept at the beginning, through to most complicated concepts at the end. The goal is that the user has functionally complete understanding of a course's concepts upon completion
  - Course Interface: This is the interface in the application that the student will see when they are inside a section of a course
    - Course Outline: A comprehensive view of all chapters and sections in a course.
    - Knowledge Map: A visual representation of the course structure and concept relationships.
    - Course Achievements: Rewards or recognition for completing certain milestones or tasks.
    - Course Chapter: This is one of one or more blocks of course sections, grouped by a specific concept within that programming language or framework (e.g. Objects, Arrays, etc)
      - Chapter Notes: Enables students to add personal annotations and highlight portions of text in the course content.
        - Highlight: this is a block of text within a content section or recap section that the student has highlighted, and selected to save to their notes (without a comment)
        - Highlight and Comment: same as a highlight, but the student has entered comments related to the highlighted text.
        - Comment: just a comment a student has added to their notes, that is not attached to highlighted text.
      - Chapter Section: This is one of one or more types of chapter learning materials
        - Section Type - Content: This is a type of section that contains explanatory text, code blocks, images, and links about a specific subset of a concept (e.g. Array destructuring)
        - Section Type - Exercise: This is a type of section that contains a challenge for the student to complete, in order to test their knowledge of the previous content section; a content section will typically have one or more exercise sections that accompany it; an exercise is a live code editor and testing interface
          - Exercise Instructions: the task or problem description for an exercise.
          - Exercise Code Editor: The interface where students write and edit code.
          - Exercise Console: The area where code output and errors are displayed.
          - Exercise Tests: Automated checks to verify if the student's code meets the exercise requirements.
        - Section Type - Chapter Recap: This is a type of section that reviews the material and concepts learned within the just-completed chapter
        - Bookmarks: Allows students to mark specific sections for easy reference.
    - Course Navigation: This is the interface the student will see that allows them to navigate between sections
    - Spaced Repitition: This is a learning concept/methodology in which a student is presented with questions regarding concepts they have recently learned, presented after a certain duration, which encourages long term memory formation through repetition of the concepts.
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
- Marketing Website: This is the website/application that will contain all information related to all courses, pricing, and other details necessary to guide student into using the learning platform and purchasing courses.
  - Guest: A guest is a visitor to the marketing website who is a potential future student or content creator.
- Technical Terms
  - API: Application Programming Interface, used for integrating external services or data
  - Database: the system used to store course content, user data, and progress information
- Terms we are **not** using:
  - none that I can think of at this time

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
- they would be able to see a list of courses, course details, course publication status, # of enrolled students, other analytical data that is appropriate
- a course would not be live on the site (and available to users) until an admin published it; they could only publish 'finished' courses and course updates; they could unpublish a course; they could archive a course (which does not delete its contents but removes it from content creator administration site)
- they would be able to manage things like the content of the marketing site, it's course landing pages, faqs, things like that
- they would be able to manage users--user details, purchase details, authentication details, tools to help with authentication, purchasing
- view any provided feedback, either directly or not directly related to course content
- view other administration related information--things like analytics, error reporting/logging things (sentry?), etc.

## Current Architecture Overview

> Last updated Oct 27, 2024 at 12:24:58 PM

1. Frontend (Astro + React(?))

   - Marketing Site
   - Learning Platform
   - Admin Dashboard
   - CMS Interface

1. Astro Content Collections

   - Needf to better understand how to integrate astro db with content collections and the content layer API introduced in Astro v5.x

1. Astro API Routes

   - Content Serving
   - User Management
   - Progress Tracking
   - Feedback System
   - Note Management
   - What else?

1. Backend Services

   - libsql database (by way of AstroDB)
   - Authentication through Oslo (including OAuth)
   - Real-time Subscriptions (service tbd)
   - Storage (service tbd)
   - Code Execution (for exercises) (service tbd)

1. External Services Integration
   - Stripe Payment
   - Vercel Deployment
   - Oslo authentication
   - Sentry analytics/monitoring

## Epics & Features

### Learning Platform

#### Courses Dashboard / Student Landing Page

- [x] This is the page displayed after a student logs in successfully
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

##### student profile

- [x] - view profile menu
- [x]     - view student profile information (avatar, name, email)
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
- [x]     - view solution diffed against student answer
- [x]     - copy solution
- [x]     - view/edit solution unlock timer delay
- [x]     - save changed delay
- [x]     - close exercise solution modal
- [x] - get a hint(s) for exercise (modal)
- [x]     - view count of hints for current exercise (e.g. 1 of 4, 2 of 4, etc)
- [x]     - view currently displayed hint number (e.g. hint 1, hint 2, etc)
- [x]     - view current hint details
- [x]     - navigate to previous hint (only if student is navigated past first hint)
- [x]     - navigate to next hint (only if student is not on last hint)
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

#### Individual Course Landing Page (logged in student)

- see Course Functionality section

#### Support Landing Page (logged in student)

- not sure what all goes here…
  - faqs?
  - contact form?
  - discord link?

#### Support Landing Page (guest user)

- not sure what content here is different from logged in user
  - no access to discord?

#### Learnit Platform registration

- register new student
  - oauth from github and google
  - view password requirements
- learnit terms of service and privacy policy links
- view login page instead of registration page

#### Learnit Platform Login

- log in student (email/password)
- log in student (oauth)
- reset password (email/password student only)
- view register page instead of login page

## Key Decisions and Notes

> Last updated Oct 27, 2024 at 12:19:09 PM

1. Using Astro 5.x (currently in beta) for the frontend with React components.
2. Database decisions:
   1. Made decision to stop using supabase due to platform concerns and issues
   2. Made decision to use AstroDB for local development, with storage on either Turso or self-hosted as the online hosting service for the DB
   3. Implementing a strong/robust seed configuration and typing setup so that when we actually do the seed.ts file, we consistently build out a set of data that is as close to a production version of data as possible.
   4. We are using ulidx as the library for generating and accessing our ULID ids on our tables
   5. We're going to use the effect library for a variety of concerns; one of those concerns is schema validation, using effect/Schema (instead of using zod for example)
   6. Note: Effect no longer requires the \_ adapter functionality to interact with generator functions. As of version 5.5+ of typescript, it is no longer necessary.
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

> Last updated Oct 30, 2024 at 3:51:47 PM
> 10/30: updated point about error handling to include sub-points and notes on effect logging system; added point about sentry integration not working.

1. Define remaining features:
   1. Administration: flesh out all features and turn into user stories, subject only
   2. Content Management Platform: flesh out all features and turn into user stories, subject only
   3. Marketing Website: take features already listed in this doc and turn into user stories, subject only
   4. Learning Platform: user stories created, need to be fleshed out for all stories
2. Implement error handling and logging
   1. set up ErroyBoundary components for React Islands within Astro pages (still needed?)
   2. Continue to implement a global error handling strategy using Effect
   3. Ensure the Effect logging system we've configured will work holistically for our application
   4. Sentry integration isn't sending errors to Sentry for some reason; resolve.
3. Resolve the following error: `21:20:29 [ERROR] [astro:db] [vite] cannot find entry point module 'astro:db'.` (appears in console when running `yarn astro dev`
4. Revisit authentication solution--should we use Hanko, or Auth.js, or auth-astro, or oslo and custom-written auth (akin to lucia auth, which is being sunset)
   1. I think we're going to go with Oslo
5. Once we've updated Notes and Student Progress seeding to be more dynamic, we can do the following:
   1. implement error handling (use Effect for this, with Sentry integration)
   2. Create a mechanism to easily reset the database to its seeded state for testing purposes
   3. Implement a way to seed data incrementally or update existing seed data
   4. Add data validation checks before inserting seed data
6. need to write functions that update the enrollment_date, purchase_date, expiration_date columns appropriately
7. We need to write a function that automatically assigns newly created courses to any users of role 'app_admin', so it doesn't have to be done manually
8. Courses table needs new fields:
   1. course status column--"published", "archived", "draft"
   2. course last_edited_by column (it's a foreign key reference to users)
   3. course last_edited_on column (date)
9. I'm going to take a guess that we also need those exact same columns for "Chapters", "Sections", and "Exercises"...
10. I need to know how sqlite handles historical changes--i.e. if an 'author' makes changes to a course, and saves the course changes, the new version of the course is not 'published' until an app_admin or course_admin 'publishes' the course; so we would have to somehow maintain 2 versions of the course? Or handle draft changes to a published course in a different manner, so that when an admin changes it from 'draft' to 'published', we apply the changes to the existing course row? Or do we just create a new course row, new copies of all of its descendants including any changes made to them (chapters > sections & exercises), update all users, student_progress, student_exercise_progress? That option sounds like a nightmare. I'm open to whatever ideas you have here.
11. Implement the Effect typescript library, including OpenTelemetry
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

This tooling setup ensures consistency across the development process and facilitates efficient collaboration.

### Backend / Database

- Database: AstroDB, which is a version of Turso's libsql basically
- ORM: AstroDB uses drizzle ORM
- TablePlus: I'm also using TablePlus to access the database locally (and, eventually, remotely)
- Authentication:
  - ~~Hanko as the third party authentication provider (not installed)~~
  - I think we're going to switch from Hanko to Oslo for authentication
    hCaptcha for frontend authentication security (not configured)
  - GitHub and Google planned for OAuth implementation (not configured)
- Payment Processing: Stripe (not installed/configured)

### Frontend

- Meta-Framework: Astro 5.0.0-beta (currently 5.0.0-beta.2)
  - Contains React islands for interactivity (or Astro Actions?)
  - Manages content collections for courses
  - Utilizes new content collections and content layer API functionality introduced in Astro 5.x
- CSS Framework: Tailwind CSS
- Installed Fonts
  - Inter Variable
  - Lilita One
  - Righteous
  - Mononoki (for code)
  - Note: I'm using the unfont package to manage the fonts
- Icon Sets
  - `@iconify-json/simple-icons`
  - `@iconify-json/solar`
  - `astro-icon`
- Frontend Framework: React with TypeScript for interactive islands, OR astro with astro actions?

### Unit, Integration, and e2e Testing

- Testing:
  - Vitest for unit testing
  - Playwright for integration and end-to-end testing

### Development Environment

- Package Management: yarn
- Code Quality:
  - ESLint for linting
  - Prettier for code formatting
- Version Management: `mise` application in the terminal for managing versions of node, python, and other tools
- Operating System: macOS
- Terminal Application: Kitty
- Shell: Fish
- Web Browser: Vivaldi
- Code Editor: Cursor

### Hosting / Production / DevOps

- Hosting: Vercel
- CI/CD: GitHub Actions
- Analytics/Monitoring: Sentry

### Project Management

- Issue Tracking: GitHub Issues (for features, stories, and bug tracking)
- Branch Management:
  - `main` as the production branch
  - `develop` as the staging branch
  - Using conventional commits and git flow for commit and branch management

## State Machine Functionality

> Last updated Nov 02, 2024 at 10:39:12 AM EDT
> 11/02: added this section

This section outlines how we'll use state machines in the application to help enforce consistent state management and transitions without impossible states, and with robust logging and error management.

### Definitions

- States: discriminated unions with metadata
- Events/Actions: aka transitions
- Guards: conditions for transitions
- State Machine class structure--overall definition of state machine functionality
- Schema Validation: using zod

### Implementation

- Initialize defined state machine
- Define transition logic
- Set up event handlers
- Implement guard conditions
- Create Effect.gen generator function

### Side Effects

- Logging system (using Effect, log to file, console, and Sentry)
- Error handling patterns
- Error recovery/rollback strategies (if applicable)
- Progress reporting
- Resource cleanup
- Telemetry/metrics

### Execution

- Effect.runPromise/runSync setup
- Concurrent operations configuration
- Entry point definition
- Error boundary establishment
- Performance monitoring

## Database

- Most tables have some form of the following fields, although not all of them:
  - id (or user_id, or student_id): this is a ULID-based text string uniquely identifying that table row, they're all primary keys, and they're all text columns
  - title: where applicable, it is a title of that row in whichever table it's in
  - description: where applicable, it is a summary description of that row in whichever table it's in
  - created_at: the timestamp of when that row in the table was initially created
  - updated_at: the timestamp of when that row in the table was last updated

> **note**: `astro db seed` is NOT an available command for the astro database. Valid commands are `astro db push`, `astro db verify`, `astro db execute <file-path>`, and `astro db shell --query <sql-string>`

### Notes on SQLite, AstroDB, and Drizzle working together

> Last updated at Oct 16, 2024 at 11:44:34 AM

- I'm going to refer to the combined functionality of astrodb, which uses drizzle and sqlite, collectively as the platform database, or platform db
- The platform db uses:

```sql
await db.run(sql`
...sql to execute here
`);
```

- this is instead of using `db.execute(sql...)`, which you keep using

### Courses Table

> updated Nov 04, 2024 at 07:14:49 PM EST
> 11/04: merged a section from another part of the doc into this section.

#### Courses Column Explanations

A course is the highest level of related blocks of content. Students register for courses and gain access to all content in a course once paid. Students can complete the first N sections of a course for free, the rest of the content is locked behind paywall. Students can register for multiple courses. Course paid access can potentially have an expiration date that is based on the purchase date plus a predefined period of time.

- subject_area: A descriptive field defining the broad area of study. Examples from the seed data include 'Programming', 'Web Development', and 'Python Development'.
- tags: A JSON array containing relevant keywords and version information. For example:
  - JavaScript course: `['javascript', 'web development', 'programming', 'ES14', 'ECMAScript 2023']`
  - React course: `['react', 'javascript', 'frontend', 'typescript', 'react18', 'react19']`
  - Python course: `['python', 'backend']`
- price: A decimal number with up to 10 digits and 2 decimal places.
- purchase_active_length: Number of days the course remains accessible after purchase.

Note: The AstroDB configuration uses the column.number type for price (with precision and scale options) and purchase_active_length, and column.json for tags.

#### Courses Table Structure

1. URL-friendly unique identifier
2. Values are beginner, intermediate, advanced
3. Precision 10, Scale 2

| field                  | type   | default | required | notes       |
| ---------------------- | ------ | ------- | -------- | ----------- |
| id                     | text   | n/a     | not null | primary_key |
| title                  | text   | n/a     | not null |             |
| description            | text   | n/a     | not null |             |
| slug                   | text   | n/a     | not null | note 1      |
| subject_area           | text   | n/a     | not null |             |
| level                  | text   | n/a     | not null | note 2      |
| tags                   | json   | '[]'    | not null |             |
| price                  | number | n/a     | optional | note 3      |
| purchase_active_length | number | n/a     | optional |             |
| created_at             | date   | NOW     | not null |             |
| updated_at             | date   | NOW     | not null |             |

#### Indexes for Courses Table

- none

### Chapters Table

> updated Nov 04, 2024 at 07:15:41 PM EST
> 11/04: merged a section from another part of the doc into this section.

#### Chapters Column Explanations

A chapter row is a subset of a course. A chapter consists of multiple sections.

- course_id: A foreign key reference to the Courses table. Each chapter must belong to a course.
- chapter_display_number: this value is used for user-facing display, and will proceed serially from 1-N within a course
- sort_order: this is for internal ordering within queries, indexes, UI sorting, etc.
- estimated_time_minutes: number representing estimated completion time in minutes; e.g. 45 for "45 minutes", 120 for "2 hours".

#### Chapters Table Structure

| field                  | type   | default | required | notes                    |
| ---------------------- | ------ | ------- | -------- | ------------------------ |
| id                     | text   | n/a     | not null | primary_key              |
| title                  | text   | n/a     | not null |                          |
| course_id              | text   | n/a     | not null | foreign_key (courses.id) |
| description            | text   | n/a     | not null |                          |
| chapter_display_number | number | n/a     | not null |                          |
| sort_order             | number | n/a     | not null |                          |
| estimated_time_minutes | number | n/a     | not null |                          |
| created_at             | date   | NOW     | not null |                          |
| updated_at             | date   | NOW     | not null |                          |

#### Indexes for Chapters Table

- `chapter_course_id_idx` on `course_id`
- `chapter_sort_order_idx` on `sort_order`

### Exercises Table

> updated Nov 04, 2024 at 07:19:31 PM EST
> 11/04: moved another section of doc into this section
> 10/30: changed name from user_solution to student_solution

This table represents a breakout of sections that have a type of 'exercise'. Exercise content is stored separately from lesson or recap content due to its complexity and the need to track student progress.

#### Exercises Column Explanations

- instructions: Markdown-formatted text explaining how to complete the exercise
- browser_html (JSON): An object containing HTML file content for exercises that require browser rendering
- code_files (JSON): An array of objects, each containing:
  - filename: name of the file
  - content: initial code content
  - language: programming language for syntax highlighting
- tests (JSON): An array of test cases, each containing:
  - description: what the test verifies
  - test_code: the actual test implementation
- hints (JSON): An array of progressive hints to help students
- difficulty: One of: 'beginner', 'intermediate', 'advanced'
- default_solution (JSON): The reference solution from the course author
- student_solution (JSON): The student's current implementation, updated on each code run

#### Exercises Table Structure

| field                   | type   | default | required | notes                     |
| ----------------------- | ------ | ------- | -------- | ------------------------- |
| id                      | text   | n/a     | not null | primary_key               |
| section_id              | text   | n/a     | not null | foreign_key (sections.id) |
| exercise_display_number | number | n/a     | not null |                           |
| sort_order              | number | n/a     | not null |                           |
| instructions            | text   | n/a     | not null |                           |
| browser_html            | json   | n/a     | not null |                           |
| code_files              | json   | n/a     | not null |                           |
| tests                   | json   | n/a     | not null |                           |
| hints                   | json   | n/a     | not null |                           |
| difficulty              | text   | n/a     | not null |                           |
| default_solution        | json   | n/a     | not null |                           |
| student_solution        | json   | n/a     | not null |                           |
| estimated_time_minutes  | number | n/a     | not null |                           |
| created_at              | date   | NOW     | not null |                           |
| updated_at              | date   | NOW     | not null |                           |

#### Indexes for Exercises Table

- `exercise_section_id_idx` on `section_id`
- `exercise_sort_order_idx` on `sort_order`

### Feedback Table

> updated Nov 04, 2024 at 07:20:47 PM EST
> 11/04: moved different section of doc to this section
> 10/30: changed user_id to student_id

#### Feedback Column Explanations

This table represents feedback submitted by students through the learning platform interface.

- student_id (indexed): foreign key to Users, represents the student who submitted the feedback
- section_id (indexed): foreign key to Sections; it is the section from where the student submitted the feedback
- assigned_to_id (indexed, optional): foreign key to Users; represents the admin/author currently handling the feedback
- feedback_text (JSON): the feedback as the user wrote it and submitted it, stored as JSON to allow for rich text formatting and additional metadata
- rating (optional): the rating a user has provided to a section; uses a star rating system (0-5)
- status (default 'submitted'): the current status of the feedback, can be one of: 'submitted', 'assigned', 'in_progress', 'pending_publication', 'resolved', 'no_action_required'
- category (optional): classifies the type of feedback, e.g., 'incorrect_content', 'general_feedback', 'technical_issue', etc.
- admin_notes (optional): notes written by the course or app admin handling the feedback

#### Feedback Table Structure

| field             | type   | default | required | notes                     |
| ----------------- | ------ | ------- | -------- | ------------------------- |
| id                | text   | n/a     | not null | primary_key               |
| student_id        | text   | n/a     | not null | foreign_key (users.id)    |
| section_id        | text   | n/a     | not null | foreign_key (sections.id) |
| assigned_to_id    | text   | n/a     | optional | foreign_key (users.id)    |
| feedback_text     | json   | n/a     | not null |                           |
| rating            | number | n/a     | optional |                           |
| status            | text   | n/a     | not null |                           |
| category          | text   | n/a     | optional |                           |
| admin_notes       | text   | n/a     | optional |                           |
| github_issue_link | text   | n/a     | optional |                           |
| created_at        | date   | NOW     | not null |                           |
| updated_at        | date   | NOW     | not null |                           |

#### Indexes for Feedback Table

- `feedback_section_id_idx` on `section_id`
- `feedback_student_id_idx` on `student_id`
- `feedback_assigned_to_id_idx` on `assigned_to_id`

### Notes Table

> updated Nov 04, 2024 at 07:22:05 PM EST
> 11/04: moved different section of doc into this section
> 10/30: changed user_id to student_id

#### Notes Column Explanations

This table represents notes that the student takes during a course. Each row is an entry the student has written, or text they've highlighted, or both. A student can have 0 to many rows for each section.

- note_text (JSON, optional, default {}): any notes the user has added to a particular section
- highlighted_text (JSON, optional, default {}): any sections of text in the chapter recap or lesson content that the user has highlighted to add to their notes
  - note: there can be notes text without a highlight, and a highlight without notes text, and a combination of note text and highlights for a single row/entry

#### Notes Table Structure

| field            | type | default | required | notes                     |
| ---------------- | ---- | ------- | -------- | ------------------------- |
| id               | text | n/a     | not null | primary_key               |
| student_id       | text | n/a     | not null | foreign_key (users.id)    |
| section_id       | text | n/a     | not null | foreign_key (sections.id) |
| note_text        | json | '{}'    | optional |                           |
| highlighted_text | json | '{}'    | optional |                           |
| created_at       | date | NOW     | not null |                           |
| updated_at       | date | NOW     | not null |                           |

#### Indexes for Notes Table

- `notes_section_id_idx` on `section_id`
- `notes_user_id_idx` on `student_id`

### Sections Table

> updated Nov 04, 2024 at 07:17:45 PM EST
> 11/04: merged section from other part of doc into this section.

#### Sections Column Explanations

A section represents a specific learning unit within a chapter. Each section can be one of three types: lesson, exercise, or recap.

- course_id: Foreign key reference to the Courses table, linking the section to its parent course
- chapter_id: Foreign key reference to the Chapters table, linking the section to its parent chapter
- section_display_number: A number indicating the section's position within the chapter; resets to 1 at the start of each chapter
- sort_order: An integer determining the section's sorting for the purposes of queries, indexes, UI sorting, etc.
- content_type: One of three types:
  - 'lesson': A teaching section with explanatory content
  - 'exercise': A practical section where students complete coding tasks
  - 'recap': A review section summarizing chapter content
- content: JSON field containing the section's content (optional, primarily used for lesson and recap types)
- access_level: Controls section accessibility:
  - 'free': Available after course enrollment without purchase
  - 'purchased' (default): Only available after course purchase

Note: For sections with content_type 'exercise', the actual exercise content is stored in the Exercises table, referenced by the section's id.

#### Sections Table Structure

| field                  | type   | default     | required | notes                     |
| ---------------------- | ------ | ----------- | -------- | ------------------------- |
| id                     | text   | n/a         | not null | primary_key               |
| course_id              | text   | n/a         | not null | foreign_key (courses.id)  |
| chapter_id             | text   | n/a         | not null | foreign_key (chapters.id) |
| title                  | text   | n/a         | not null |                           |
| description            | text   | n/a         | not null |                           |
| section_display_number | number | n/a         | not null |                           |
| sort_order             | number | n/a         | not null |                           |
| content_type           | text   | n/a         | not null |                           |
| content                | json   | n/a         | optional |                           |
| access_level           | text   | 'purchased' | not null |                           |
| created_at             | date   | NOW         | not null |                           |
| updated_at             | date   | NOW         | not null |                           |

#### Indexes for Sections Table

- `section_chapter_id_idx` on `chapter_id`
- `section_course_id_idx` on `course_id`
- `section_sort_order_idx` on `sort_order`

### Student_Exercise_Progress Table

> updated Nov 04, 2024 at 07:22:41 PM EST
> 11/04: moved different section of doc into this section
> 10/30: changed name to Student*... instead of User*...; changed user_id to student_id

#### Student Exercise Progress Column Explanations

This table tracks a student's progress in one exercise per row. Each row is unique across student & exercise_id combined; a student can have multiple rows on the table but only one per exercise_id.

- student_id: Foreign key reference to the Users table, represents the student attempting the exercise
- exercise_id: Foreign key reference to the Exercises table, represents the specific exercise being attempted
- score: Number representing the student's current score on the exercise (default 0)
- completed: Boolean indicating whether the student has successfully completed the exercise (default false)
- attempts: Number tracking how many times the student has attempted the exercise (default 0)
- last_attempt_at: Optional timestamp of when the student last attempted the exercise
- created_at: Timestamp of when the progress tracking began
- updated_at: Timestamp of the last update to the progress record

#### Student Exercise Progress Table Structure

| field           | type    | default | required | notes                      |
| --------------- | ------- | ------- | -------- | -------------------------- |
| id              | text    | n/a     | not null | primary_key                |
| student_id      | text    | n/a     | not null | foreign_key (users.id)     |
| exercise_id     | textz   | n/a     | not null | foreign_key (exercises.id) |
| score           | number  | 0       | optional |                            |
| completed       | boolean | false   | not null |                            |
| attempts        | number  | 0       | not null |                            |
| last_attempt_at | date    | n/a     | optional |                            |
| created_at      | date    | NOW     | not null |                            |
| updated_at      | date    | NOW     | not null |                            |

#### Indexes for Student Exercise Progress Table

- `student_exercise_progress_exercise_id_idx` on `exercise_id`
- `student_exercise_progress_student_id_idx` on `student_id`

### Student_Progress Table Structure

> updated Nov 04, 2024 at 07:23:45 PM EST
> 11/04: moved different section of doc into this section
> 10/30: changed name from User*... to Student*...; renamed user_id to student_id

#### Student Progress Column Explanations

This table tracks a student's progress in one course. Each row represents one student/course unique combination. A student can have multiple rows, but only if they are enrolled in multiple courses.

- student_id: Foreign key reference to the Users table, represents the student enrolled in the course
- course_id: Foreign key reference to the Courses table, represents the course the student is enrolled in
- current_section_id: Foreign key reference to the Sections table, tracks the student's current position in the course
- completed_sections: JSON array containing IDs of completed sections (default [])
- last_accessed_at (optional): Timestamp of when the student last accessed the course
- enrollment_date: Date when the student registered for the course
- purchase_date (optional): Date when the student purchased the course
- expiration_date (optional): Date when the student's access to purchased course content expires

#### Student Progress Table Structure

| field              | type | default | required | notes                      |
| ------------------ | ---- | ------- | -------- | -------------------------- |
| id                 | text | n/a     | not null | primary_key                |
| student_id         | text | n/a     | not null | foreign_key (users.id)     |
| course_id          | text | n/a     | not null | foreign_key (courses.id)   |
| current_section_id | text | n/a     | not null | foreign_key (sections.id)  |
| completed_sections | json | '[]'    | not null |                            |
| last_accessed_at   | date | n/a     | optional |                            |
| enrollment_date    | date | n/a     | not null |                            |
| purchase_date      | date | n/a     | optional |                            |
| expiration_date    | date | n/a     | optional |                            |
| created_at         | date | NOW     | not null |                            |
| updated_at         | date | NOW     | not null |                            |

#### Indexes for Student Progress Table

- `student_progress_student_id_idx` on `student_id`
- `student_progress_course_id_idx` on `course_id`
- `student_progress_current_section_id_idx` on `current_section_id`

### Users Table

> updated Nov 04, 2024 at 07:24:35 PM EST
> 11/04: moved different section of doc to this section

#### Users Column Explanations

This table stores all users of the learning platform, administration platform, and content management platform.

- first_name, last_name: The user's actual name, stored separately
- email (unique): The user's primary email address, used for authentication and communication
- avatar_url (optional): URL to user's profile picture, typically from OAuth provider
- role (default 'student'): Access level of the user. One of: 'student', 'author', 'course_admin', 'app_admin'
- enrolled_courses (JSON, optional): Array of course IDs the student is enrolled in
- assigned_courses (JSON, optional): Array of course IDs the admin/author is responsible for
- auth_provider (optional): The authentication provider used (e.g., 'github', 'google')
- auth_provider_id (optional): External identifier from the auth provider
- Provider-specific fields (all optional):
  - github_username
  - google_id
  - gitlab_username
  - bitbucket_username
- last_sign_in (optional): Timestamp of user's most recent sign in

#### Users Table Structure

| field              | type | default   | required | notes              |
| ------------------ | ---- | --------- | -------- | ------------------ |
| id                 | text | n/a       | not null | primary_key        |
| first_name         | text | n/a       | not null |                    |
| last_name          | text | n/a       | not null |                    |
| email              | text | n/a       | not null | unique             |
| avatar_url         | text | n/a       | optional |                    |
| role               | text | 'student' | not null |                    |
| enrolled_courses   | json | '[]'      | optional | For students       |
| assigned_courses   | json | '[]'      | optional | For admins/authors |
| auth_provider      | text | n/a       | optional |                    |
| auth_provider_id   | text | n/a       | optional |                    |
| github_username    | text | n/a       | optional |                    |
| google_id          | text | n/a       | optional |                    |
| gitlab_username    | text | n/a       | optional |                    |
| bitbucket_username | text | n/a       | optional |                    |
| last_sign_in       | date | n/a       | optional |                    |
| created_at         | date | NOW       | not null |                    |
| updated_at         | date | NOW       | not null |                    |

#### Indexes for Users Table

- none

### Triggers

> updated Oct 30, 2024 at 3:38:23 PM
> 10/30: changed references to student_progress and student_exercise_progress; changed references to user_id, where appropriate, to student_id
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
9. `create trigger update_student_progress_updated_at before update on student_progress for each row execute function update_updated_at_column();`
10. `create trigger update_student_exercise_progress_updated_at before update on student__exercise_progress for each row execute function update_updated_at_column();`

### Row level security

> updated Oct 30, 2024 at 3:39:45 PM
> 10/30: changed to student_progress and student_exercise_progress
> need to identify programmatic solution, libsql doesn't support this

```sql
alter table users enable row level security;
alter table courses enable row level security;
alter table chapters enable row level security;
alter table sections enable row level security;
alter table exercises enable row level security;
alter table feedback enable row level security;
alter table notes enable row level security;
alter table student_progress enable row level security;
alter table student_exercise_progress enable row level security;
```

### Policies

> updated Oct 30, 2024 at 3:40:11 PM
> 10/30: changed to student_progress, student_exercise_progress, student_id where appropriate
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
create policy view_own_feedback on feedback for select to student using (auth.uid() = student_id);
create policy create_feedback on feedback for insert to student with check (auth.id() = student_id);
create policy view all notes on notes for select to app_admin, course_admin using (true);
create policy manage_own_notes on notes for all to student using (auth.id() = student_id);
create policy view_all_student_progress on student_progress for select to app_admin, course_admin using (true);
create policy manage_own_progress on student_progress for all to student using (auth.id() = student_id);
create policy view_all_student_exercise_progress on student_exercise_progress for select to app_admin, course_admin using (true);
create policy manage_own_exercise_progress on student_exercise_progress for all to student using (auth.id() = student_id);
```

## Project Directory Structure (high level only)

> Last updated Oct 30, 2024 at 3:41:45 PM
>
> Note: the following tree command was used, to prune unneeded directory/file info:
> `tree -a -L 5 -I 'node_modules|.astro|.git|.venv|.vercel|.vscode|.yarn|learnit-project'`

.
├── .DS_Store
├── .editorconfig
├── .env
├── .env.development
├── .env.production
├── .eslintrc.cjs
├── .gitattributes
├── .github
│   ├── .DS_Store
│   ├── copilot-instructions.md
│   └── workflows
│   ├── assign_me.yml
│   └── version-release.yml
├── .gitignore
├── .mise.toml
├── .prettierignore
├── .prettierrc.cjs
├── .sentryclirc
├── .yarnrc.yml
├── LICENSE
├── README.md
├── astro.config.mjs
├── db
│   ├── .DS_Store
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
│   │   ├── seed-error-types.ts
│   │   ├── seed-success-types.ts
│   │   └── seed-types.ts
│   ├── seed_old.md
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
│   ├── env.d.ts
│   ├── layouts
│   │   ├── DocsLayout.astro
│   │   └── Layout.astro
│   ├── lib
│   ├── pages
│   │   ├── docs
│   │   │   ├── api-reference.md
│   │   │   ├── getting-started.md
│   │   │   └── index.md
│   │   ├── index.astro
│   │   └── logTesting.astro
│   ├── schemas
│   │   ├── chapters.schema.ts
│   │   ├── courses.schema.ts
│   │   ├── exercises.schema.ts
│   │   ├── feedback.schema.ts
│   │   ├── notes.schema.ts
│   │   ├── sections.schema.ts
│   │   ├── student_exercise_progress.schema.ts
│   │   ├── student_progress.schema.ts
│   │   └── users.schema.ts
│   ├── scripts
│   │   └── runSeed.ts
│   ├── styles
│   │   └── global.css
│   └── utils
│   ├── astrodb_utils.ts
│   ├── general_utils.ts
│   ├── logger.ts
│   ├── sentry.ts
│   └── temp_file_code.ts
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

23 directories, 86 files

# Learnit

## Summary of Project

I want to build a learning platform for learning development languages and frameworks. A good example is https://learnjavascript.online

## Features

- So overall, a user would enroll in a course
    - a course would have a series of chapters
        - a chapter would have a series of sections
            - the first section would usually be a content section (markdown file explaining a concept)
                - links out to documentation for those language or framework features.
            - then the user would take 1 or more challenges related to the content they just learned (so, the code editor stuff)
            - I want a code editor with a real-time console, syntax highlighting, and auto-completion.
                - The user should be able to run the code, which would both:
                    - run the code itself
                    - also execute tests to determine if the code meets requirements to pass the exercise.
            - the final section in a chapter would be a chapter recap section, which is also markdown
- The course would have a spaced repitition learning system--i.e. flashcards basically. 
    - The system would build notecards for the user as they learn, allowing them to use the notecards for refreshing their memory--spaced repetition learning, basically.

## Overall System Functionality summary

As the product owner, I want a core system that does all of the functionality itself:

- the backend creation of content
- storage of content
- serving content
- A front end that renders or serves the already-rendered content (e.g. the markdown pages are probably static, the exercises are definitely dynamic).
- Authentication
- payment system for purchasing content
- marketing/home page for advertising the product and allowing users to sign in and purchase, etc.

Then, as a product owner, I could sell the core system to other organizations, and they could create whatever content they want for it. So the core system is the shell--learning platform, content creation platform, administration platform--and the actual contents (i.e. courses) are then created by whoever owns that instance of the platform. 

## Content Creation and Management

- at a high level, the content creator (a type of user) would sign in to a content management system
- from there, they would create the course--chapters, sections, content for those sections, etc.
- they would have a status for the course, like 'draft' and 'finished'
- a 'published' course could then be branched basically--i.e. start a version to make updates that don't go live until they are finished by the content creator
    - any updated sections would have their last updated timestamp updated as well--but only those sections

## Platform Administration

- this would be a signed in 'admin' user
- they would be able to see a list of courses, course details, course publication status, # of enrolled users, other analytical data that is appropriate
- a course would not be live on the site (and available to users) until an admin published it; they could only publish 'finished' courses and course updates; they could unpublish a course; they could archive a course (which does not delete its contents but removes it from content creator administration site)
- they would be able to manage things like the content of the marketing site, it's course landing pages, faqs, things like that
- they would be able to manage users--user details, purchase details, authentication details, tools to help with authentication, purchasing
- view any provided feedback, either directly or not directly related to course content
- view other administration related information--things like analytics, error reporting/logging things (sentry?), etc. 

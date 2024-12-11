# Cursor Rules

## Code Style and Structure
### Project Organization

- Use feature-based directory structure
- Group related components and utilities together
- Keep components small and focused on a single responsibility
- Maintain clear separation between UI components and business logic
- Follow Astro's recommended project structure for pages, layouts, and components:
- 

```ts
db/ // for astroDb config, seed files
learnit_project/ // for reference documentation
public/
src/
  components/
    common/ // e.g. button, etc--good place for shadcn components
    features/
  layouts/
  lib/
  pages/
    docs/ // for documenting the application
  schemas/ // for table schemas
  scripts/ // for general scripts like running the seed, etc.
  styles/
  utils/
test-results/
tests/
tests-examples/
```

## Naming Conventions

- Use PascalCase for component names: `UserProfile.tsx` or `UserProfile.astro` (depending on component type)
- Use camelCase for functions, variables, and instances: `getUserData()`
- Use UPPER_SNAKE_CASE for constants: `MAX_RETRY_ATTEMPTS`
- Use kebab-case for file names (except components): `api-utils.ts`
- Use PascalCase for Types, Interfaces, and Classes: `SeederState<T>`, `class SeederStateMachine`
- Use meaningful, descriptive names that indicate purpose

## TypeScript Usage

- Use explicit return types for functions
- Avoid use of interfaces
- Use generics for reusable components and utilities
- Avoid `any` type - use `unknown` if type is truly uncertain
- Utilize union types for better type safety
- Use type guards for runtime type checking

## Syntax and Formatting

- Use 2 spaces for indentation
- Max line length: 80 characters
- Use template literals for strings and string interpolation
- Add trailing commas in arrays and objects
- Place opening braces on the same line
- Use arrow functions for callbacks
- Use destructuring for props and imports

```ts
// Good
const UserCard = ({ name, age }: UserProps) => {
  const formattedName = `User: ${name}`;
  return (
    <div className="p-4">
      {formattedName}
    </div>
  );
};

// Bad
function UserCard(props) {
  return <div className="p-4">{props.name}</div>;
}
```

## Error Handling and Validation

### Schema Validation
- Use Zod for all runtime type validation and schema definitions
- Define schemas in `./src/schemas` directory
- Export schema types using Zod's inference
- Validate all external data (API responses, form inputs) using Zod schemas
- Use Zod's built-in error handling for validation failures

```typescript
// schemas/courses.schema.ts
import { createPrecisionScaleRefinement, createPrecisionScaleMessage } from '@utils/general_utils'
import { z } from 'zod'

const CoursesSchema = z.object({
  id: z.string().ulid(),
  title: z.string().min(4),
  description: z.string(),
  slug: z.string(),
  subject_area: z.string(),
  level: z.enum(['beginner', 'intermediate', 'advanced']),
  tags: z.array(z.string()),
  price: z
    .number()
    .positive()
    .optional()
    .refine(createPrecisionScaleRefinement(10, 2), createPrecisionScaleMessage(10, 2)),
  purchase_active_length: z.number().positive().optional(),
  created_at: z.date(),
  updated_at: z.date(),
})

export type Course = z.infer<typeof CoursesSchema>;
```

### Effect General Rules

- Use `Effect.gen` for generator syntax when needed
- Never use try/catch or raw Promises directly
- Leverage Effect's pipe operator for clean composition
- As of Typescript 5.5x, Effect's `Effect.gen` functions no longer require the `_` adapter to interface with generator functions

```typescript
// GOOD: Effect.gen function example without the `_` adapter
return Effect.gen(function* () {
  // log transition start
  yield* logWithContext({
    component: self.component,
    message: `Transitioning from ${self.currentState.status} with event ${event.type}`,
    level: 'Info',
    context: { currentState: self.currentState, event },
  })
  
// BAD: Effect.gen function with the `_` adapter
return Effect.gen(function* (_) {
  // log transition start
  yield* logWithContext({
    component: self.component,
    message: `Transitioning from ${self.currentState.status} with event ${event.type}`,
    level: 'Info',
    context: { currentState: self.currentState, event },
  })
```

### Effect-based Error Handling

- Use Effect for all error handling and async operations
- Use Effect's built-in error channel for type-safe error handling
- Define custom error types using tagged unions

```typescript
// ./db/seed_config/types/seed-error-types.ts
export class SeedingError {
    readonly _tag = 'SeedingError'
    constructor(
        readonly error: unknown,
        readonly context: {
            table: 'courses' | 'chapters' | 'sections' | 'exercises' | 'users' | 'feedback' | 'notes' | 'student_progress' | 'student_exercise_progress',
            operation: 'insert' | 'update' | 'delete'
            id?: string
        }
    ) {}
}
```

```typescript
// types/errors.ts
export type ApiError = 
  | { _tag: 'NetworkError'; status: number }
  | { _tag: 'ValidationError'; errors: string[] }
  | { _tag: 'UnauthorizedError' };

// services/user.ts
import { Effect, pipe } from 'effect';

const fetchUser = (id: string) =>
  Effect.gen(function* () {
    const response = yield* (Effect.tryPromise({
      try: () => fetch(`/api/users/${id}`),
      catch: (e): ApiError => ({ _tag: 'NetworkError', status: 500 })
    }));

    const data = yield* (Effect.tryPromise({
      try: () => response.json(),
      catch: (e): ApiError => ({ _tag: 'NetworkError', status: 500 })
    }));

    return yield* (Effect.try({
      try: () => UserSchema.parse(data),
      catch: (e): ApiError => ({
        _tag: 'ValidationError',
        errors: e.errors.map(err => err.message)
      })
    }));
  });

// usage
const program = pipe(
  fetchUser('123'),
  Effect.map(user => /* handle success */),
  Effect.catchTag('NetworkError', error => 
    Effect.log(`Network error: ${error.status}`)),
  Effect.catchTag('ValidationError', error =>
    Effect.log(`Validation failed: ${error.errors.join(', ')}`))
);
```

### Error Logging and Monitoring

- Use Effect's built-in logging capabilities
- Create custom logging layers for different environments
- Add context to errors using Effect's annotations
- Implement structured logging for better observability
- Use tagged errors for better error handling flows

```typescript
// src/utils/logger.ts
import { Effect, Logger, LogLevel } from 'effect'
import * as Sentry from '@sentry/astro'

// Create a custom logger that includes Sentry for errors
export const customLogger = Logger.make(({ logLevel, message }) => {
  const timestamp = new Date().toISOString()

  // get metadata (component and any other context) from the message
  const metadata = typeof message === 'object' && message !== null ? message : { component: 'unknown' }

  // Format the message
  const formattedMessage = Array.isArray(message) ? message.join(' ') : String(message)

  // Base log entry
  const logEntry = {
    timestamp,
    level: logLevel.label,
    ...metadata,
    message: formattedMessage,
  }

  // Handle different log levels
  switch (logLevel) {
    case LogLevel.Fatal:
    case LogLevel.Error:
      Sentry.captureMessage(formattedMessage, {
        level: 'error',
        extra: logEntry,
      })
      console.error(logEntry)
      break
    case LogLevel.Warning:
      console.warn(logEntry)
      break
    case LogLevel.Info:
      console.info(logEntry)
      break
    case LogLevel.Debug:
      console.debug(logEntry)
      break
    default:
      console.log(logEntry)
  }
})

export type LogInfo = {
  component: string
  message: string
  level: keyof typeof LogLevel
  context: Record<string, unknown>
}

// Create the logger layer
export const LoggerLive = Logger.replace(Logger.defaultLogger, customLogger)

// Helper functions to create annotated effects
export const logWithContext = ({ component, message, level, context }: LogInfo) => {
  const effect =
    level === 'Error'
      ? Effect.logError(message)
      : level === 'Warning'
        ? Effect.logWarning(message)
        : level === 'Debug'
          ? Effect.logDebug(message)
          : Effect.logInfo(message)

  return effect.pipe(
    Effect.annotateLogs({
      component,
      ...context,
    }),
  )
}
```

### Best Practices

- Always define explicit error types for each operation
- Use tagged unions for error types to enable exhaustive matching
- Leverage Effect's composability for error recovery
- Add appropriate context to errors using annotations
- Use Effect's retry capabilities for transient failures
- Implement proper error boundaries in React components
- Handle all edge cases explicitly in the Effect chain
- Use optional chaining and nullish coalescing when working with nullable data

```typescript
// Example of comprehensive error handling
const getUserDetails = (id: string) =>
  pipe(
    fetchUser(id),
    Effect.retry({
      times: 3,
      delay: 1000,
      when: error => error._tag === 'NetworkError'
    }),
    Effect.annotate('userId', id),
    Effect.tapError(error => 
      Effect.log(`Failed to fetch user ${id}: ${JSON.stringify(error)}`)),
    Effect.provideLayer(ProductionLogger)
  );
```

## UI and Styling

- Use Tailwind utility classes following mobile-first approach
- Maintain consistent spacing using Tailwind's spacing scale
- Use shadcn/ui components as building blocks
- Create custom components for repeated patterns
- Follow Tailwind's color palette for consistency
- Use CSS modules for component-specific styles
- Implement responsive design using Tailwind breakpoints
- Use CSS variables for theme values

```typescript
// Good (React example)
const Button = ({ children }: { children: React.ReactNode }) => (
  <button className="px-4 py-2 text-sm font-medium text-white bg-blue-600 
    hover:bg-blue-700 rounded-md shadow-sm">
    {children}
  </button>
);

// Bad
const Button = ({ children }) => (
  <button style={{ padding: '8px 16px', backgroundColor: 'blue' }}>
    {children}
  </button>
);
```

## Key Conventions

- Use the Effect library when appropriate
- Use async/await over raw promises
- Implement proper prop validation
- Use environment variables for configuration
- Follow AstroJS routing conventions
- Implement proper loading states
- Handle authentication state consistently
- Use proper TypeScript path aliases

### Path Aliases

```ts
// path aliases
"paths": {
  "@assets/*": ["src/assets/*"],
  "@components/*": ["src/components/*"],
  "@endpoints/*": ["src/endpoints/*"],
  "@icons/*": ["src/icons/*"],
  "@layouts/*": ["src/layouts/*"],
  "@pages/*": ["src/pages/*"],
  "@scripts/*": ["src/scripts/*"],
  "@styles/*": ["src/styles/*"],
  "@utils/*": ["src/utils/*"],
  "@lib/*": ["src/lib/*"],
  "@db/*": ["db/*"]
}
```

## Performance Optimization

- Implement proper code splitting with Astro's built-in support
- Optimize images using Astro's image components
- Use proper caching strategies
- Implement lazy loading for routes and components
- Minimize bundle size using tree shaking
- Use proper key props in lists
- Optimize database queries in AstroDB
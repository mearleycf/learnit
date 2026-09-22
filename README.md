# learnit

A learning platform, content management platform, and administration platform for learning
programming languages and frameworks online.

## Stack

| Layer           | Choice                                            |
| --------------- | ------------------------------------------------- |
| Framework       | Astro 7 (server output, Vercel adapter)           |
| Runtime         | Node 24 (pinned in `.mise.toml`)                  |
| Package manager | Yarn 4 via Corepack                               |
| Database        | libSQL, accessed through Drizzle ORM              |
| Styling         | Tailwind 4, configured in `src/styles/global.css` |
| Validation      | Zod 4                                             |
| Errors          | Sentry (inert without a DSN)                      |
| Tests           | Vitest (unit), Playwright (end to end)            |
| Lint / format   | Biome (replaces ESLint and Prettier)              |

## Getting started

```bash
corepack enable
mise install        # installs the pinned Node version
yarn install
yarn db:migrate     # creates local.db from db/migrations
yarn db:seed        # loads the authored course data
yarn dev            # http://localhost:4321
```

## Database

The schema lives in [`db/schema.ts`](db/schema.ts) as Drizzle table definitions. Migrations are
generated from it, never written by hand:

```bash
yarn db:generate    # write a new migration after editing db/schema.ts
yarn db:migrate     # apply pending migrations
yarn db:studio      # browse the data
```

Connection is controlled by two environment variables. Both are optional in development, where the
default is a file-backed database at `./local.db`.

| Variable              | Purpose                                   |
| --------------------- | ----------------------------------------- |
| `DATABASE_URL`        | libSQL URL; defaults to `file:./local.db` |
| `DATABASE_AUTH_TOKEN` | Auth token for a hosted (Turso) database  |

Seed data is authored under `db/seed_config/seed/courses/`. The seeder derives foreign keys, sort
order and timestamps, so seed files only carry the content.

## Scripts

| Script               | Purpose                                     |
| -------------------- | ------------------------------------------- |
| `yarn dev`           | Dev server                                  |
| `yarn build`         | Type check, then production build           |
| `yarn build:release` | Build, then upload source maps to Sentry    |
| `yarn check`         | `astro check`                               |
| `yarn lint`       | Biome (lint, format and import sorting)     |
| `yarn format`     | Biome formatter, writes in place            |
| `yarn test`          | Vitest in watch mode                        |
| `yarn test:e2e`      | Playwright (`yarn playwright install` once) |

`yarn build` does not need Sentry credentials. Source map upload is a separate step, so a missing
auth token cannot fail the build.

## Optional environment

```
SENTRY_DSN=...
SENTRY_AUTH_TOKEN=...
```

Without these, Sentry stays inactive and the build still succeeds.

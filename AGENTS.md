# AGENTS.md

## How to talk to Mike

Mike has ADHD. Long blocks of text do not get read. Shape output so it can be acted on.

1. **Lead with the action or the result.** Never with context, a plan, or "I'll now…".
2. **No preamble, no recap, no closers.** Cut "Great question", "Let me…", "Hope this helps", "Let me know if…".
3. **Number multi-step work.** One bounded action per step. Cap lists at 5.
4. **State what now works, concretely.** "Dark mode works, run `yarn dev`" beats "I improved theming."
5. **End with one next action** under two minutes, or nothing.

Rules of thumb:

- Findings go in a table or a short list, never a paragraph of prose.
- Expectations of Mike get one line. If there is nothing for him to do, say nothing.
- Suppress tangents. Finish the thing, then offer the next as one question.
- Errors: state cause and fix. No "Uh oh".
- Break these when he says "explain" or "walk me through", or before a destructive action.

## Commands

| Command | Does |
| --- | --- |
| `yarn dev` | Dev server on 4321 |
| `yarn lint` | Biome check (lint + format + imports) |
| `yarn lint:fix` | Apply safe fixes |
| `yarn check` | `astro check`, type errors |
| `yarn test:run` | Vitest once |
| `yarn test:e2e` | Playwright |
| `yarn db:generate` | New migration after editing `db/schema.ts` |
| `yarn db:migrate` | Apply migrations |
| `yarn db:seed` | Reseed from scratch |
| `yarn build` | Type check then build |

Run `lint`, `check`, `test:run` before any commit.

## Stack

Astro 7 (server output, Vercel adapter) · Node 24 · Yarn 4 · Drizzle ORM on libSQL · Tailwind 4 · Zod 4 · Biome · Vitest · Playwright.

Not installed, deliberately: React, ESLint, Prettier, Effect, `@astrojs/db`. Do not reintroduce them.
`@astrojs/db` is deprecated upstream. TypeScript is held at 6 because `astro check` and typescript-eslint cap below 7.

## Project shape

| Path | Holds |
| --- | --- |
| `db/schema.ts` | Drizzle tables. Source of truth; migrations are generated, never hand-written |
| `db/client.ts` | libSQL connection, reads `DATABASE_URL` |
| `db/seed.ts` | Seeder. Derives IDs, FKs, sort order, display numbers, timestamps |
| `db/seed_config/seed/courses/` | Course structure, content only |
| `db/seed_config/seed/content/` | Long-form lesson copy |
| `src/schemas/` | Zod schemas mirroring the tables |
| `src/utils/courses.ts` | Data access for pages |
| `src/lib/exercise-runner/` | Runs student code. `run.ts`, `link.ts`, `capture.ts` and `dom-stub.ts` are pure and unit tested |
| `src/components/` | Astro components |
| `src/pages/` | Routes |

## Seeding rules

- **Deterministic.** IDs come from `seedUlid(naturalKey)`, dates from a fixed `SEED_EPOCH`. Two runs produce byte-identical rows. Never call `ulid()` or `Math.random()` in seed code.
- **Seed files carry content only.** Anything positional (IDs, foreign keys, sort order, display numbers) is derived in `db/seed.ts`.
- **Unauthored content is `NULL`, never `{}`.** The seeder prints how many sections are authored on each run.
- **Content is validated** against `sectionContentSchema` before insert. A bad payload aborts the seed and names the section.
- **Seed data grows incrementally**, one feature at a time. Do not try to fill all nine tables at once.

## Conventions

- Two-space indent, single quotes, no semicolons, 120 columns. Biome enforces it; do not argue with it.
- Path aliases: `@db/*`, `@schemas/*`, `@utils/*`, `@layouts/*`, `@pages/*`, `@styles/*`.
- Colours come from the semantic tokens in `src/styles/global.css`. Never hard-code a hex or a raw Tailwind grey in a page.
- Biome only parses `.astro` frontmatter, not the template. Unused-symbol rules are off for `.astro` because anything used only in markup reads as unused.
- Conventional commits. Breaking changes get `!` and a `BREAKING CHANGE:` footer.

## State

Local-only, single user. No auth, by decision.

All nine tables are seeded.

`getCurrentUser()` in `src/utils/progress.ts` returns the one seeded user. That is the seam to replace if auth ever arrives.
Authored content: JavaScript Fundamentals chapters 1 to 3, nine sections. The other 30 are structural.

Exercises run client-side in a Web Worker, JavaScript only. The Worker is a crash and
infinite-loop guard, not a security boundary; it does not need to be, since the only author
of that code is the person running it.

An exercise may span several files. `link.ts` orders them dependency-first and rewrites
relative specifiers to blob URLs, so student files can import each other. `code_files.defaultView`
names the entry: the file the checks import from and the tab the workspace opens on.
Console output is captured during a run and attributed to the check that produced it. Vite's
dev client logs inside the Worker, so `isToolingNoise` filters anything prefixed `[vite]`.

Two execution surfaces. Checks run in a Worker, which has no DOM, so `dom-stub.ts` installs a
stand-in document; without it an exercise that renders to the page dies at load. The live preview
runs in an iframe on `/exercise-preview`, a normal same-origin route rather than a sandboxed
`srcdoc`, so it can import the real linker instead of carrying a copy. It talks to the workspace
by postMessage and forwards console output and errors.

Only exercises that carry `browser_html` get a preview button. Pure-logic exercises omit it
rather than showing an empty frame.

Astro actions work from forms (`?_action=`), but the `/_actions/[...path]` RPC route is not
registered in this setup. Anything called from client script needs a plain API route under
`src/pages/api/` instead.

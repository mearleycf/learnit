import { expect, type Page, test } from '@playwright/test'

/**
 * Opens an exercise with a known starting point.
 *
 * The suite shares one database and saved work is durable, so a test that
 * needs the starter must reset rather than assume it. Clears the local draft,
 * then the server copy, and waits for the debounced save to land.
 */
const openExercise = async (page: Page, path: string) => {
  await page.goto(path)
  await page.evaluate(() => localStorage.clear())
  await page.reload()
  await page.getByRole('button', { name: 'Reset to starter' }).click()
  await page.waitForTimeout(1200)
}

test('the dashboard links through to a course', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('learnit')

  await page.getByRole('heading', { name: 'JavaScript Fundamentals' }).click()
  await expect(page).toHaveURL(/\/courses\/javascript-fundamentals$/)
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('JavaScript Fundamentals')
})

test('a lesson section renders its authored markdown', async ({ page }) => {
  await page.goto('/courses/javascript-fundamentals/1/1')
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Introduction to JavaScript')
  await expect(page.getByRole('heading', { name: 'What JavaScript is' })).toBeVisible()
  await expect(page.locator('pre code').first()).toBeVisible()
})

test('an exercise section renders instructions, a workspace and hints', async ({ page }) => {
  await page.goto('/courses/javascript-fundamentals/1/2')
  await expect(page.getByRole('heading', { name: 'Instructions' })).toBeVisible()
  await expect(page.locator('[data-role="editor"]')).toBeVisible()
  await expect(page.getByRole('button', { name: 'Run checks' })).toBeVisible()
  await expect(page.getByText('Hints (4)')).toBeVisible()
})

test('a recap section renders its key points', async ({ page }) => {
  await page.goto('/courses/javascript-fundamentals/1/3')
  await expect(page.getByRole('heading', { name: 'Key points' })).toBeVisible()
  await expect(page.locator('li')).not.toHaveCount(0)
})

test('previous and next move between sections', async ({ page }) => {
  await page.goto('/courses/javascript-fundamentals/1/2')
  await page.getByRole('link', { name: /Introduction to JavaScript/ }).click()
  await expect(page).toHaveURL(/\/1\/1$/)
})

test('an unknown course returns the not-found page', async ({ page }) => {
  const response = await page.goto('/courses/does-not-exist')
  expect(response?.status()).toBe(404)
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Not found')
})

test('the outline shows seeded progress', async ({ page }) => {
  await page.goto('/courses/javascript-fundamentals')
  await expect(page.getByText(/of 12 sections complete/)).toBeVisible()
  await expect(page.getByRole('link', { name: /^Resume:/ })).toBeVisible()
})

test('marking a section complete persists and updates the outline', async ({ page }) => {
  // Section 1.3 is not complete in the seed.
  await page.goto('/courses/javascript-fundamentals/1/3')
  const before = page.getByRole('button', { name: 'Mark complete' })
  await expect(before).toBeVisible()
  await before.click()

  const after = page.getByRole('button', { name: /Completed/ })
  await expect(after).toBeVisible()

  await page.goto('/courses/javascript-fundamentals')
  await expect(page.getByText('3 of 12 sections complete')).toBeVisible()

  // Put it back so the suite can run repeatedly.
  await page.goto('/courses/javascript-fundamentals/1/3')
  await page.getByRole('button', { name: /Completed/ }).click()
  await expect(page.getByRole('button', { name: 'Mark complete' })).toBeVisible()
})

test('seeded notes render with their anchored passage', async ({ page }) => {
  await page.goto('/courses/javascript-fundamentals/1/1')
  await expect(page.getByRole('heading', { name: /^Notes/ })).toBeVisible()
  await expect(page.getByText('nothing runs in parallel here')).toBeVisible()
  await expect(page.locator('blockquote')).toContainText('top to bottom')
})

test('a note can be added and deleted', async ({ page }) => {
  const body = `Note from the test run ${Date.now()}`

  await page.goto('/courses/javascript-fundamentals/1/1')
  await page.getByPlaceholder('What do you want to remember').fill(body)
  await page.getByRole('button', { name: 'Add note' }).click()
  await expect(page.getByText(body)).toBeVisible()

  const note = page.locator('li', { hasText: body })
  await note.getByRole('button', { name: 'Delete' }).click()
  await expect(page.getByText(body)).toHaveCount(0)
})

test('an empty note is rejected', async ({ page }) => {
  await page.goto('/courses/javascript-fundamentals/1/2')
  const textarea = page.getByPlaceholder('What do you want to remember')
  await expect(textarea).toHaveAttribute('required', '')
  await expect(page.getByText('No notes on this section yet.')).toBeVisible()
})

test('the feedback page lists every seeded status', async ({ page }) => {
  await page.goto('/feedback')
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Feedback')

  for (const label of ['Submitted', 'Assigned', 'In progress', 'Pending publication', 'Resolved']) {
    await expect(page.getByRole('link', { name: new RegExp(`^${label} \\(`) })).toBeVisible()
  }
})

test('filtering by status narrows the list', async ({ page }) => {
  await page.goto('/feedback?status=resolved')
  await expect(page.getByText('recap key points were rendering')).toBeVisible()
  await expect(page.getByText('It would help to see which check failed')).toHaveCount(0)
})

test('a report can be filed and then triaged', async ({ page }) => {
  const body = `Report from the test run ${Date.now()}`

  await page.goto('/courses/javascript-fundamentals/1/3')
  await page.getByText('Report a problem with this section').click()
  await page.getByLabel('Problem category').selectOption('technical_issue')
  await page.getByPlaceholder('What is wrong?').fill(body)
  await page.getByRole('button', { name: 'Send report' }).click()

  await page.goto('/feedback?status=submitted')
  const card = page.locator('li', { hasText: body })
  await expect(card).toBeVisible()

  await card.getByRole('combobox').selectOption('resolved')
  await card.getByRole('button', { name: 'Update' }).click()

  await expect(page.locator('li', { hasText: body })).toHaveCount(0)
  await page.goto('/feedback?status=resolved')
  await expect(page.locator('li', { hasText: body })).toBeVisible()
})

test('a correct solution passes every check and records an attempt', async ({ page }) => {
  await openExercise(page, '/courses/javascript-fundamentals/1/2')

  await page
    .locator('[data-role="editor"]')
    .fill(
      [
        "const courseName = 'JavaScript Fundamentals'",
        'let lessonsCompleted = 0',
        'const isEnrolled = true',
        'export function describeProgress(enrolled = isEnrolled) {',
        "  const label = enrolled ? 'enrolled' : 'not enrolled'",
        '  return `${courseName}: ${lessonsCompleted} lessons done (${label})`',
        '}',
        'export { courseName, lessonsCompleted, isEnrolled }',
      ].join('\n'),
    )
  await page.getByRole('button', { name: 'Run checks' }).click()

  await expect(page.locator('[data-role="summary"]')).toHaveText('5 of 5 checks passing')
  await expect(page.locator('[data-role="results"] li')).toHaveCount(5)
  await expect(page.locator('[data-role="attempts"]')).toContainText('best 100%')
})

test('a wrong solution reports which checks failed and why', async ({ page }) => {
  await openExercise(page, '/courses/javascript-fundamentals/1/2')

  await page.locator('[data-role="editor"]').fill(["const courseName = 'Wrong'", 'export { courseName }'].join('\n'))
  await page.getByRole('button', { name: 'Run checks' }).click()

  await expect(page.locator('[data-role="summary"]')).toContainText('of 5 checks passing')
  await expect(page.locator('[data-role="results"] li').first()).toContainText('Expected "JavaScript Fundamentals"')
})

test('an endless loop times out instead of hanging the page', async ({ page }) => {
  await openExercise(page, '/courses/javascript-fundamentals/1/2')

  await page.locator('[data-role="editor"]').fill('while (true) {}\nexport const courseName = "x"')
  await page.getByRole('button', { name: 'Run checks' }).click()

  await expect(page.locator('[data-role="summary"]')).toContainText('Timed out', { timeout: 15_000 })
  // The page is still interactive after the worker was killed.
  await expect(page.getByRole('button', { name: 'Run checks' })).toBeEnabled()
})

test('reset restores the starter code', async ({ page }) => {
  await openExercise(page, '/courses/javascript-fundamentals/1/2')

  const editor = page.locator('[data-role="editor"]')
  await editor.fill('throwaway')
  await page.getByRole('button', { name: 'Reset to starter' }).click()
  await expect(editor).toHaveValue(/A value that never changes/)
})

test('chapter 2 renders its authored lesson and recap', async ({ page }) => {
  await page.goto('/courses/javascript-fundamentals/2/1')
  await expect(page.getByRole('heading', { name: 'Functions give a name to a job' })).toBeVisible()

  await page.goto('/courses/javascript-fundamentals/2/3')
  await expect(page.getByRole('heading', { name: 'Key points' })).toBeVisible()
})

test('a multi-file exercise opens on the editable entry file', async ({ page }) => {
  await openExercise(page, '/courses/javascript-fundamentals/2/2')

  await expect(page.getByRole('button', { name: /format\.js/ })).toBeVisible()
  await expect(page.getByRole('button', { name: /progress\.js/ })).toBeVisible()

  // progress.js is the entry, so it opens even though format.js is listed first.
  const editor = page.locator('[data-role="editor"]')
  await expect(editor).toBeEnabled()
  await expect(editor).toHaveValue(/Import percent and pluralise/)
})

test('a read-only file can be viewed but not edited', async ({ page }) => {
  await openExercise(page, '/courses/javascript-fundamentals/2/2')

  await page.getByRole('button', { name: /format\.js/ }).click()
  const editor = page.locator('[data-role="editor"]')
  await expect(editor).toBeDisabled()
  await expect(editor).toHaveValue(/export const percent/)
})

test('a solution importing from a sibling file passes every check', async ({ page }) => {
  await openExercise(page, '/courses/javascript-fundamentals/2/2')

  await page
    .locator('[data-role="editor"]')
    .fill(
      [
        "import { percent, pluralise } from './format.js'",
        'export function summarise(completed, total) {',
        "  if (total === 0) return 'Nothing to do yet'",
        "  return `${completed} of ${total} ${pluralise(total, 'lesson')} complete (${percent(completed, total)}%)`",
        '}',
        'export function isFinished(completed, total) {',
        '  return total > 0 && completed >= total',
        '}',
      ].join('\n'),
    )
  await page.getByRole('button', { name: 'Run checks' }).click()

  await expect(page.locator('[data-role="summary"]')).toHaveText('5 of 5 checks passing')
})

test('an import with no matching file fails without crashing', async ({ page }) => {
  await openExercise(page, '/courses/javascript-fundamentals/2/2')

  await page.locator('[data-role="editor"]').fill("import { nope } from './missing.js'\nexport const a = 1")
  await page.getByRole('button', { name: 'Run checks' }).click()

  await expect(page.locator('[data-role="summary"]')).toContainText('missing')
  await expect(page.getByRole('button', { name: 'Run checks' })).toBeEnabled()
})

test('console output is captured and attributed to its check', async ({ page }) => {
  await openExercise(page, '/courses/javascript-fundamentals/1/2')

  await page
    .locator('[data-role="editor"]')
    .fill(
      [
        "console.log('loading now')",
        "const courseName = 'JavaScript Fundamentals'",
        'let lessonsCompleted = 0',
        'const isEnrolled = true',
        'export function describeProgress(enrolled = isEnrolled) {',
        "  console.warn('called')",
        "  const label = enrolled ? 'enrolled' : 'not enrolled'",
        "  return courseName + ': ' + lessonsCompleted + ' lessons done (' + label + ')'",
        '}',
        'export { courseName, lessonsCompleted, isEnrolled }',
      ].join('\n'),
    )
  await page.getByRole('button', { name: 'Run checks' }).click()

  const output = page.locator('[data-role="console"]')
  await expect(output).toContainText('[load] loading now')
  await expect(output).toContainText('[check 4] called')
})

test('the console pane stays hidden when nothing is printed', async ({ page }) => {
  await openExercise(page, '/courses/javascript-fundamentals/1/2')

  await page.getByRole('button', { name: 'Run checks' }).click()
  await expect(page.locator('[data-role="summary"]')).toContainText('checks passing')
  await expect(page.locator('[data-role="console-pane"]')).toBeHidden()
})

test('dev tooling chatter never reaches the console pane', async ({ page }) => {
  await openExercise(page, '/courses/javascript-fundamentals/1/2')

  await page.locator('[data-role="editor"]').fill("console.log('mine')\nexport const courseName = 'x'")
  await page.getByRole('button', { name: 'Run checks' }).click()

  const output = page.locator('[data-role="console"]')
  await expect(output).toContainText('mine')
  await expect(output).not.toContainText('[vite]')
})

const ARRAY_SOLUTION = [
  "import { lessons } from './data.js'",
  'export function totalMinutes(items) {',
  '  return items.reduce((sum, l) => sum + l.minutes, 0)',
  '}',
  'export function remaining(items) {',
  '  return items.filter(l => !l.done)',
  '}',
  'export function toListItems(items) {',
  "  return items.map(l => '<li>' + l.title + ' — ' + l.minutes + ' min</li>').join('')",
  '}',
  'export function render(items) {',
  "  document.querySelector('#lessons').innerHTML = toListItems(items)",
  '  const left = remaining(items).length',
  "  const word = left === 1 ? 'lesson' : 'lessons'",
  "  document.querySelector('#summary').textContent =",
  "    left + ' ' + word + ' left, ' + totalMinutes(items) + ' minutes total'",
  "  console.log('rendered', items.length, 'lessons')",
  '}',
  'render(lessons)',
].join('\n')

test('chapter 3 renders its authored lesson and recap', async ({ page }) => {
  await page.goto('/courses/javascript-fundamentals/3/1')
  await expect(page.getByRole('heading', { name: 'An array holds an ordered list' })).toBeVisible()

  await page.goto('/courses/javascript-fundamentals/3/6')
  await expect(page.getByRole('heading', { name: 'Key points' })).toBeVisible()
})

test('a DOM exercise is graded despite the worker having no document', async ({ page }) => {
  await openExercise(page, '/courses/javascript-fundamentals/3/3')

  await page.locator('[data-role="editor"]').fill(ARRAY_SOLUTION)
  await page.getByRole('button', { name: 'Run checks' }).click()

  await expect(page.locator('[data-role="summary"]')).toHaveText('5 of 5 checks passing')
})

test('the preview renders student output into a real document', async ({ page }) => {
  await openExercise(page, '/courses/javascript-fundamentals/3/3')

  await page.locator('[data-role="editor"]').fill(ARRAY_SOLUTION)
  await page.getByRole('button', { name: 'Run preview' }).click()

  const frame = page.frameLocator('[data-role="preview-frame"]')
  await expect(frame.locator('#lessons li')).toHaveCount(4)
  await expect(frame.locator('#lessons li').first()).toHaveText('Variables — 20 min')
  await expect(frame.locator('#summary')).toHaveText('3 lessons left, 115 minutes total')
})

test('console output from the preview reaches the workspace', async ({ page }) => {
  await openExercise(page, '/courses/javascript-fundamentals/3/3')

  await page.locator('[data-role="editor"]').fill(ARRAY_SOLUTION)
  await page.getByRole('button', { name: 'Run preview' }).click()

  await expect(page.locator('[data-role="console"]')).toContainText('[preview] rendered 4 lessons')
})

test('an error in the preview is reported, not swallowed', async ({ page }) => {
  await openExercise(page, '/courses/javascript-fundamentals/3/3')

  await page.locator('[data-role="editor"]').fill("throw new Error('preview blew up')\nexport const a = 1")
  await page.getByRole('button', { name: 'Run preview' }).click()

  await expect(page.locator('[data-role="console"]')).toContainText('preview blew up')
})

test('an exercise with no markup has no preview button', async ({ page }) => {
  await page.goto('/courses/javascript-fundamentals/2/2')
  await expect(page.getByRole('button', { name: 'Run checks' })).toBeVisible()
  await expect(page.getByRole('button', { name: 'Run preview' })).toHaveCount(0)
})

test('hints are locked or shown according to the attempt count', async ({ page }) => {
  await openExercise(page, '/courses/javascript-fundamentals/3/3')

  // Other tests share this database, so assert the rule rather than a fixed count.
  const attemptsText = (await page.locator('[data-role="attempts"]').textContent()) ?? ''
  const attempts = Number(/^(\d+)/.exec(attemptsText.trim())?.[1] ?? 0)

  const hints = page.locator('[data-role="hint"]')
  await expect(hints).toHaveCount(4)

  for (let i = 0; i < 4; i += 1) {
    const hint = hints.nth(i)
    const needed = Number(await hint.getAttribute('data-needed'))
    if (attempts >= needed) {
      await expect(hint).not.toContainText('Unlocks after')
    } else {
      await expect(hint).toContainText(`Unlocks after ${needed} attempt`)
    }
  }
})

test('running an exercise unlocks any hint the new count has earned', async ({ page }) => {
  await openExercise(page, '/courses/javascript-fundamentals/3/3')

  await page.getByRole('button', { name: 'Run checks' }).click()
  await expect(page.locator('[data-role="attempts"]')).toContainText('attempt')

  const attemptsText = (await page.locator('[data-role="attempts"]').textContent()) ?? ''
  const attempts = Number(/^(\d+)/.exec(attemptsText.trim())?.[1] ?? 0)

  const hints = page.locator('[data-role="hint"]')
  for (let i = 0; i < 4; i += 1) {
    const hint = hints.nth(i)
    if (attempts >= Number(await hint.getAttribute('data-needed'))) {
      await expect(hint).not.toContainText('Unlocks after')
    }
  }
})

test('work is restored from the server after local storage is cleared', async ({ page }) => {
  const marker = `// probe ${Date.now()}`

  await openExercise(page, '/courses/javascript-fundamentals/2/2')

  await page.locator('[data-role="editor"]').fill(`${marker}\nexport const a = 1`)
  // The save is debounced, so give it a moment to reach the server.
  await page.waitForTimeout(1500)

  await page.evaluate(() => localStorage.clear())
  await page.reload()

  await expect(page.locator('[data-role="editor"]')).toHaveValue(new RegExp(marker.replace(/\//g, '\\/')))

  // Put the exercise back, since the rest of the suite shares this database.
  await page.getByRole('button', { name: 'Reset to starter' }).click()
  await page.waitForTimeout(1200)
})

test('reset clears saved work on the server too', async ({ page }) => {
  // Uses 1/2 so it does not race the persistence test, which owns 2/2.
  await openExercise(page, '/courses/javascript-fundamentals/1/2')

  await page.locator('[data-role="editor"]').fill('// throwaway')
  await page.waitForTimeout(1200)
  await page.getByRole('button', { name: 'Reset to starter' }).click()
  await page.waitForTimeout(1200)

  await page.evaluate(() => localStorage.clear())
  await page.reload()
  await expect(page.locator('[data-role="editor"]')).toHaveValue(/A value that never changes/)
})

test('the notes page lists every note with a link back', async ({ page }) => {
  await page.goto('/notes')
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Notes')
  await expect(page.locator('[data-role="note"]')).toHaveCount(3)
  await expect(page.getByRole('link', { name: /Introduction to JavaScript/ }).first()).toBeVisible()
})

test('a note can be edited in place', async ({ page }) => {
  const edited = `Edited by the test run ${Date.now()}`

  await page.goto('/notes')
  const note = page.locator('[data-role="note"]').first()
  const original = (await note.locator('[data-role="note-text"]').textContent()) ?? ''

  await note.getByRole('button', { name: 'Edit' }).click()
  await note.locator('textarea').fill(edited)
  await note.getByRole('button', { name: 'Save' }).click()

  await expect(page.locator('[data-role="note-text"]').first()).toContainText(edited)

  // Survives a reload, so it reached the database.
  await page.reload()
  await expect(page.locator('[data-role="note-text"]').first()).toContainText(edited)

  // Put the seeded text back; later tests assert on it.
  const restored = page.locator('[data-role="note"]').first()
  await restored.getByRole('button', { name: 'Edit' }).click()
  await restored.locator('textarea').fill(original)
  await restored.getByRole('button', { name: 'Save' }).click()
  await expect(page.locator('[data-role="note-text"]').first()).toContainText(original.trim())
})

test('cancelling an edit leaves the note alone', async ({ page }) => {
  await page.goto('/notes')
  const note = page.locator('[data-role="note"]').first()
  const before = await note.locator('[data-role="note-text"]').textContent()

  await note.getByRole('button', { name: 'Edit' }).click()
  await note.locator('textarea').fill('discard me')
  await note.getByRole('button', { name: 'Cancel' }).click()

  await expect(note.locator('[data-role="note-text"]')).toContainText((before ?? '').trim())
})

test('notes can be filtered to one course', async ({ page }) => {
  await page.goto('/notes?course=python-fundamentals')
  await expect(page.getByText('No notes on that course.')).toBeVisible()
})

test('the dashboard offers somewhere to pick up', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('learnit')

  const pickUp = page.locator('[data-role="pick-up"]')
  await expect(pickUp).toBeVisible()
  await pickUp.click()
  await expect(page).toHaveURL(/\/courses\/javascript-fundamentals\/\d+\/\d+$/)
})

test('the dashboard shows progress and how much is written', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByText('12 of 12 sections written')).toBeVisible()
  // Every course has content now, so nothing reports as entirely unwritten.
  await expect(page.getByText('nothing to read yet')).toHaveCount(0)
})

test('the dashboard links to notes and open feedback', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('heading', { name: 'Recent notes' })).toBeVisible()
  await page.getByRole('link', { name: /^Feedback/ }).click()
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Feedback')
})

test('search finds lesson prose and links to the section', async ({ page }) => {
  await page.goto('/search?q=reduce')
  await expect(page.getByText(/results for/)).toBeVisible()

  const hits = page.locator('[data-role="hit"]')
  await expect(hits.first()).toBeVisible()
  await hits.first().click()
  await expect(page).toHaveURL(/\/courses\//)
})

test('search finds the student own notes', async ({ page }) => {
  await page.goto('/search?q=parallel')
  await expect(page.getByText('Your note')).toBeVisible()
})

test('search reports when nothing matched', async ({ page }) => {
  await page.goto('/search?q=zzzznotathing')
  await expect(page.getByText('Nothing matched.')).toBeVisible()
})

test('search asks for a longer term when given one character', async ({ page }) => {
  await page.goto('/search?q=a')
  await expect(page.getByText('Type at least two characters.')).toBeVisible()
})

test('note markdown is rendered, not shown literally', async ({ page }) => {
  await page.goto('/notes')
  // A seeded note contains `console.log` in backticks.
  await expect(page.locator('[data-role="note-text"] code').first()).toBeVisible()
  await expect(page.locator('[data-role="note-text"]').first()).not.toContainText('`')
})

test('lesson markdown still renders after sharing the processor', async ({ page }) => {
  await page.goto('/courses/javascript-fundamentals/1/1')
  await expect(page.getByRole('heading', { name: 'What JavaScript is' })).toBeVisible()
  await expect(page.locator('pre code').first()).toBeVisible()
})

test('exercise instructions render as markdown', async ({ page }) => {
  await page.goto('/courses/javascript-fundamentals/3/3')
  const instructions = page.locator('[data-role="instructions"]')
  await expect(instructions.locator('code').first()).toBeVisible()
  await expect(instructions.locator('ol li')).not.toHaveCount(0)
  await expect(instructions).not.toContainText('**')
})

test('pages use the width well at the sizes Mike actually browses at', async ({ page }) => {
  // A browser window around 1150px, and a 14" laptop at 1512px logical.
  // Nothing targets a phone or a full-width ultrawide; neither gets used.
  for (const width of [1150, 1512]) {
    await page.setViewportSize({ width, height: 900 })

    for (const path of ['/', '/notes', '/feedback', '/search?q=reduce', '/courses/javascript-fundamentals/3/3']) {
      await page.goto(path)

      const { overflows, main } = await page.evaluate(() => ({
        overflows: document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
        main: Math.round(document.querySelector('#main')?.getBoundingClientRect().width ?? 0),
      }))

      expect(overflows, `${path} at ${width} scrolls sideways`).toBe(false)
      // The shell should fill the window rather than sitting in a narrow column.
      expect(main, `${path} at ${width} wastes width`).toBeGreaterThan(Math.min(width - 64, 1000))
    }
  }
})

test('lesson prose keeps a readable line length', async ({ page }) => {
  await page.setViewportSize({ width: 1512, height: 900 })
  await page.goto('/courses/javascript-fundamentals/3/1')

  const proseWidth = await page.evaluate(() => document.querySelector('article p')?.getBoundingClientRect().width ?? 0)
  // Capped at 75ch, so a wider window widens the shell but not the text.
  expect(proseWidth).toBeGreaterThan(600)
  expect(proseWidth).toBeLessThan(800)
})

test('every page offers a skip link to its content', async ({ page }) => {
  for (const path of ['/', '/notes', '/feedback', '/search', '/courses/javascript-fundamentals']) {
    await page.goto(path)
    const skip = page.getByRole('link', { name: 'Skip to content' })
    await expect(skip, `${path} has no skip link`).toBeAttached()
    await expect(page.locator('#main'), `${path} has no skip target`).toBeAttached()
  }
})

test('the skip link becomes visible on focus', async ({ page }) => {
  await page.goto('/')
  const skip = page.getByRole('link', { name: 'Skip to content' })
  await expect(skip).not.toBeInViewport()
  await skip.focus()
  await expect(skip).toBeInViewport()
})

test('every interactive control has an accessible name', async ({ page }) => {
  for (const path of ['/', '/notes', '/feedback', '/search?q=reduce', '/courses/javascript-fundamentals/3/3']) {
    await page.goto(path)
    const unlabelled = await page.evaluate(() =>
      [...document.querySelectorAll('button, a, input, textarea, select')]
        .filter(
          el =>
            !el.textContent?.trim() &&
            !el.getAttribute('aria-label') &&
            !el.getAttribute('title') &&
            (el as HTMLInputElement).type !== 'hidden',
        )
        .map(el => `${el.tagName}[${el.getAttribute('placeholder') ?? (el as HTMLInputElement).type ?? ''}]`),
    )
    expect(unlabelled, `${path} has unlabelled controls`).toEqual([])
  }
})

test('the code editor is named after the file it shows', async ({ page }) => {
  await page.goto('/courses/javascript-fundamentals/3/3')
  const editor = page.locator('[data-role="editor"]')
  await expect(editor).toHaveAttribute('aria-label', /render\.js/)

  await page.getByRole('button', { name: /data\.js/ }).click()
  await expect(editor).toHaveAttribute('aria-label', /data\.js, read only/)
})

test('an unwritten exercise says so instead of showing instructions alone', async ({ page }) => {
  // Every Python exercise is written now. The React one is the last that is not,
  // and it stays that way until the runner can execute React.
  await page.goto('/courses/advanced-react/1/2')
  await expect(page.getByText('This exercise has not been written yet.')).toBeVisible()
  await expect(page.getByRole('button', { name: 'Run checks' })).toHaveCount(0)
  // The misleading instructions block is gone with it.
  await expect(page.getByRole('heading', { name: 'Instructions' })).toHaveCount(0)
})

test('a written exercise is unaffected', async ({ page }) => {
  await page.goto('/courses/javascript-fundamentals/3/3')
  await expect(page.getByRole('heading', { name: 'Instructions' })).toBeVisible()
  await expect(page.getByRole('button', { name: 'Run checks' })).toBeVisible()
  await expect(page.getByText('This exercise has not been written yet.')).toHaveCount(0)
})

test('Advanced React chapters 1 and 3 are authored', async ({ page }) => {
  await page.goto('/courses/advanced-react/1/1')
  await expect(page.getByRole('heading', { name: 'What a component is for' })).toBeVisible()

  await page.goto('/courses/advanced-react/3/1')
  await expect(page.getByRole('heading', { name: 'Why a component re-renders' })).toBeVisible()

  await page.goto('/courses/advanced-react/3/2')
  await expect(page.getByRole('button', { name: 'Run checks' })).toBeVisible()
})

test('Python lessons and recaps are authored', async ({ page }) => {
  await page.goto('/courses/python-fundamentals/1/1')
  await expect(page.getByRole('heading', { name: 'What is actually different' })).toBeVisible()

  await page.goto('/courses/python-fundamentals/2/1')
  await expect(page.getByRole('heading', { name: 'Comprehensions replace map and filter' })).toBeVisible()

  await page.goto('/courses/python-fundamentals/3/6')
  await expect(page.getByRole('heading', { name: 'Key points' })).toBeVisible()
})

test('a Python exercise runs and grades in the browser', async ({ page }) => {
  test.setTimeout(120_000)

  await page.goto('/courses/python-fundamentals/1/2')
  await page.evaluate(() => localStorage.clear())
  await page.reload()

  await expect(page.getByRole('button', { name: /solution\.py/ })).toBeVisible()

  await page
    .locator('[data-role="editor"]')
    .fill(
      [
        'def describe(name, lessons):',
        '    word = "lesson" if lessons == 1 else "lessons"',
        '    return f"{name} has {lessons} {word}"',
        '',
        'def whole_days(minutes):',
        '    print("computing", minutes)',
        '    return minutes // 60',
        '',
        'def initials(full_name):',
        '    return "".join(word[0].upper() for word in full_name.split())',
        '',
        'def safe_int(text, fallback=0):',
        '    try:',
        '        return int(text)',
        '    except ValueError:',
        '        return fallback',
      ].join('\n'),
    )
  await page.getByRole('button', { name: 'Run checks' }).click()

  // The first run also starts Pyodide, which takes a few seconds.
  await expect(page.locator('[data-role="summary"]')).toHaveText('8 of 8 checks passing', { timeout: 90_000 })
  await expect(page.locator('[data-role="console"]')).toContainText('computing 150')
})

test('a wrong Python solution reports which checks failed', async ({ page }) => {
  test.setTimeout(120_000)

  await page.goto('/courses/python-fundamentals/1/2')
  await page.evaluate(() => localStorage.clear())
  await page.reload()

  await page.getByRole('button', { name: 'Run checks' }).click()
  await expect(page.locator('[data-role="summary"]')).toContainText('of 8 checks passing', { timeout: 90_000 })
  await expect(page.locator('[data-role="results"] li').first()).toContainText('describe builds the sentence')
})

test('a multi-file Python exercise resolves imports between modules', async ({ page }) => {
  test.setTimeout(120_000)

  await page.goto('/courses/python-fundamentals/3/5')
  await page.evaluate(() => localStorage.clear())
  await page.reload()

  // Two read-only helpers plus the student's module.
  await expect(page.getByRole('button', { name: /formatting\.py/ })).toBeVisible()
  await expect(page.getByRole('button', { name: /timing\.py/ })).toBeVisible()
  await expect(page.getByRole('button', { name: /report\.py/ })).toBeVisible()

  await page
    .locator('[data-role="editor"]')
    .fill(
      [
        'from formatting import pluralise, titlecase',
        'from timing import humanise',
        '',
        'MODULE_NAME = __name__',
        '',
        'def line(lesson):',
        "    return f\"{titlecase(lesson['title'])} \\u2014 {humanise(lesson['minutes'])}\"",
        '',
        'def report(lessons):',
        '    lines = [line(lesson) for lesson in lessons]',
        '    total = sum(lesson["minutes"] for lesson in lessons)',
        '    count = len(lessons)',
        '    lines.append(f"{count} {pluralise(count, \'lesson\')}, {humanise(total)} total")',
        '    return "\\n".join(lines)',
      ].join('\n'),
    )
  await page.getByRole('button', { name: 'Run checks' }).click()

  await expect(page.locator('[data-role="summary"]')).toHaveText('7 of 7 checks passing', { timeout: 90_000 })
})

import { expect, test } from '@playwright/test'

test('the courses list links through to a course', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Courses')

  await page.getByRole('link', { name: /JavaScript Fundamentals/ }).click()
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

test('a section with no authored content shows an empty state', async ({ page }) => {
  await page.goto('/courses/javascript-fundamentals/3/6')
  await expect(page.getByText('This section has no content yet.')).toBeVisible()
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
  await page.goto('/courses/javascript-fundamentals/1/2')
  await page.evaluate(() => localStorage.clear())
  await page.reload()

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
  await page.goto('/courses/javascript-fundamentals/1/2')
  await page.evaluate(() => localStorage.clear())
  await page.reload()

  await page.locator('[data-role="editor"]').fill(["const courseName = 'Wrong'", 'export { courseName }'].join('\n'))
  await page.getByRole('button', { name: 'Run checks' }).click()

  await expect(page.locator('[data-role="summary"]')).toContainText('of 5 checks passing')
  await expect(page.locator('[data-role="results"] li').first()).toContainText('Expected "JavaScript Fundamentals"')
})

test('an endless loop times out instead of hanging the page', async ({ page }) => {
  await page.goto('/courses/javascript-fundamentals/1/2')
  await page.evaluate(() => localStorage.clear())
  await page.reload()

  await page.locator('[data-role="editor"]').fill('while (true) {}\nexport const courseName = "x"')
  await page.getByRole('button', { name: 'Run checks' }).click()

  await expect(page.locator('[data-role="summary"]')).toContainText('Timed out', { timeout: 15_000 })
  // The page is still interactive after the worker was killed.
  await expect(page.getByRole('button', { name: 'Run checks' })).toBeEnabled()
})

test('reset restores the starter code', async ({ page }) => {
  await page.goto('/courses/javascript-fundamentals/1/2')
  await page.evaluate(() => localStorage.clear())
  await page.reload()

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
  await page.goto('/courses/javascript-fundamentals/2/2')
  await page.evaluate(() => localStorage.clear())
  await page.reload()

  await expect(page.getByRole('button', { name: /format\.js/ })).toBeVisible()
  await expect(page.getByRole('button', { name: /progress\.js/ })).toBeVisible()

  // progress.js is the entry, so it opens even though format.js is listed first.
  const editor = page.locator('[data-role="editor"]')
  await expect(editor).toBeEnabled()
  await expect(editor).toHaveValue(/Import percent and pluralise/)
})

test('a read-only file can be viewed but not edited', async ({ page }) => {
  await page.goto('/courses/javascript-fundamentals/2/2')
  await page.evaluate(() => localStorage.clear())
  await page.reload()

  await page.getByRole('button', { name: /format\.js/ }).click()
  const editor = page.locator('[data-role="editor"]')
  await expect(editor).toBeDisabled()
  await expect(editor).toHaveValue(/export const percent/)
})

test('a solution importing from a sibling file passes every check', async ({ page }) => {
  await page.goto('/courses/javascript-fundamentals/2/2')
  await page.evaluate(() => localStorage.clear())
  await page.reload()

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
  await page.goto('/courses/javascript-fundamentals/2/2')
  await page.evaluate(() => localStorage.clear())
  await page.reload()

  await page.locator('[data-role="editor"]').fill("import { nope } from './missing.js'\nexport const a = 1")
  await page.getByRole('button', { name: 'Run checks' }).click()

  await expect(page.locator('[data-role="summary"]')).toContainText('missing')
  await expect(page.getByRole('button', { name: 'Run checks' })).toBeEnabled()
})

test('console output is captured and attributed to its check', async ({ page }) => {
  await page.goto('/courses/javascript-fundamentals/1/2')
  await page.evaluate(() => localStorage.clear())
  await page.reload()

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
  await page.goto('/courses/javascript-fundamentals/1/2')
  await page.evaluate(() => localStorage.clear())
  await page.reload()

  await page.getByRole('button', { name: 'Run checks' }).click()
  await expect(page.locator('[data-role="summary"]')).toContainText('checks passing')
  await expect(page.locator('[data-role="console-pane"]')).toBeHidden()
})

test('dev tooling chatter never reaches the console pane', async ({ page }) => {
  await page.goto('/courses/javascript-fundamentals/1/2')
  await page.evaluate(() => localStorage.clear())
  await page.reload()

  await page.locator('[data-role="editor"]').fill("console.log('mine')\nexport const courseName = 'x'")
  await page.getByRole('button', { name: 'Run checks' }).click()

  const output = page.locator('[data-role="console"]')
  await expect(output).toContainText('mine')
  await expect(output).not.toContainText('[vite]')
})

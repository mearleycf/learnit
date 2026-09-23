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

test('an exercise section renders instructions, checks and hints', async ({ page }) => {
  await page.goto('/courses/javascript-fundamentals/1/2')
  await expect(page.getByRole('heading', { name: 'Instructions' })).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Checks (5)' })).toBeVisible()
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

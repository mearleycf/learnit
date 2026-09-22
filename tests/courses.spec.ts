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

import { test, expect } from '@playwright/test'
import { mockTmdb } from './mock-tmdb.js'

test.beforeEach(async ({ page }) => {
  await mockTmdb(page)
})

test('the home page leads with its promise and one action', async ({ page }) => {
  await page.goto('/')
  await expect(page).toHaveTitle(/Movie App/)
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(/Find your\s*next film/)
  await page.getByRole('link', { name: 'Browse films' }).click()
  await expect(page).toHaveURL(/\/movies$/)
  await expect(page.getByRole('heading', { name: 'Discover' })).toBeVisible()
})

test('the live demo on the home page finds a film as you type', async ({ page }) => {
  await page.goto('/')
  const input = page.getByLabel('Type any film')
  await input.fill('heat')
  await expect(page.locator('[data-ui]').getByText('Heat', { exact: true })).toBeVisible()
})

test('search opens from the keyboard and goes to the film', async ({ page, isMobile }) => {
  test.skip(isMobile, 'Keyboard shortcut is a desktop affordance')
  await page.goto('/movies')
  await page.keyboard.press('ControlOrMeta+k')
  const search = page.getByRole('combobox')
  await expect(search).toBeFocused()
  await search.fill('blade')
  await page.getByRole('option', { name: /Blade Runner/ }).click()
  await expect(page).toHaveURL(/\/movies\/title\/78$/)
  await expect(page.getByRole('heading', { level: 1, name: 'Blade Runner' })).toBeVisible()

  // The palette remembers what was opened
  await page.keyboard.press('ControlOrMeta+k')
  await expect(page.getByRole('option', { name: /Blade Runner/ })).toBeVisible()
})

test('search opens from the header button on any device', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('button', { name: /Search/ }).first().click()
  await page.getByRole('combobox').fill('keanu')
  await page.getByRole('option', { name: /Keanu Reeves/ }).click()
  await expect(page).toHaveURL(/\/people\/6384$/)
  await expect(page.getByRole('heading', { level: 1, name: 'Keanu Reeves' })).toBeVisible()
})

test('filters live in the URL and the back button undoes them', async ({ page }) => {
  await page.goto('/movies')
  await page.getByRole('button', { name: 'Drama' }).click()
  await expect(page).toHaveURL(/genre=18/)
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Drama films')
  await expect(page.getByRole('link', { name: 'Heat' }).first()).toBeVisible()
  await expect(page.getByRole('link', { name: 'Dune' })).toHaveCount(0)

  await page.goBack()
  await expect(page).not.toHaveURL(/genre=/)
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Discover')

  // Old genre links redirect into the new filter
  await page.goto('/movies/genres/878')
  await expect(page).toHaveURL(/\/movies\?genre=878/)
})

test('a film page plays its trailer in place', async ({ page }) => {
  await page.goto('/movies/title/603')
  await expect(page.getByRole('heading', { level: 1, name: 'The Matrix' })).toBeVisible()
  await expect(page.getByText('Lana Wachowski')).toBeVisible()
  await expect(page).toHaveTitle('The Matrix (1999) · Movie App')

  await page.getByRole('button', { name: 'Play trailer' }).click()
  const player = page.getByRole('dialog').locator('iframe')
  await expect(player).toBeVisible()
  await expect(player).toHaveAttribute('src', /youtube-nocookie\.com\/embed\/vKQi3bBA1y8/)
  await page.keyboard.press('Escape')
  await expect(player).toBeHidden()
})

test('the watchlist works without an account and survives a reload', async ({ page }) => {
  await page.goto('/movies/title/603')
  await page.getByRole('button', { name: 'Add to watchlist' }).click()
  await expect(page.getByRole('button', { name: 'On your watchlist' })).toHaveAttribute('aria-pressed', 'true')

  await page.goto('/watchlist')
  await page.reload()
  const main = page.getByRole('main')
  await expect(main.getByText('1 film, saved in this browser.')).toBeVisible()
  await expect(main.getByRole('heading', { name: 'The Matrix' })).toBeVisible()

  await page.getByRole('button', { name: 'Clear all' }).click()
  await expect(page.getByText('Watchlist cleared.')).toBeVisible()
  await page.getByRole('button', { name: 'Undo' }).click()
  await expect(main.getByRole('heading', { name: 'The Matrix' })).toBeVisible()
})

test('missing films and pages fail gracefully', async ({ page }) => {
  await page.goto('/movies/title/404404')
  await expect(page.getByRole('alert')).toContainText('TMDb has no record for this one.')

  await page.goto('/this/does/not/exist')
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(/This reel\s*is missing/)
})

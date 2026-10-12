/// <reference lib="dom" />
import { expect, test, type Page } from '@playwright/test'
import { readFile } from 'node:fs/promises'

declare global {
  interface Window {
    relayLayoutShifts: number[]
  }
}

async function headingMetrics(page: Page) {
  return page.locator('h1').evaluate((heading) => {
    const range = document.createRange()
    range.selectNodeContents(heading)
    return {
      textWidth: range.getBoundingClientRect().width,
      height: heading.getBoundingClientRect().height,
      fontSize: getComputedStyle(heading).fontSize,
    }
  })
}

async function afterPaint(page: Page) {
  await expect
    .poll(() => page.evaluate(() => performance.getEntriesByName('first-contentful-paint').length))
    .toBeGreaterThan(0)
}

for (const width of [320, 390, 1440]) {
  test(`fonts stay stable during cold load and reload at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 950 })
    let releaseFonts = () => {}
    const fontsHeld = new Promise<void>((resolve) => {
      releaseFonts = resolve
    })
    await page.route(/\.woff2(?:\?|$)/, async (route) => {
      if (route.request().resourceType() === 'font') await fontsHeld
      await route.continue()
    })
    await page.addInitScript(() => {
      window.relayLayoutShifts = []
      new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          const shift = entry as PerformanceEntry & { hadRecentInput: boolean; value: number }
          if (!shift.hadRecentInput) window.relayLayoutShifts.push(shift.value)
        }
      }).observe({ type: 'layout-shift', buffered: true })
    })
    try {
      await page.goto('/', { waitUntil: 'domcontentloaded' })
      await afterPaint(page)
      const before = await headingMetrics(page)
      releaseFonts()
      await page.evaluate(() => document.fonts.ready)
      await page.evaluate(
        () =>
          new Promise<void>((resolve) =>
            requestAnimationFrame(() => requestAnimationFrame(() => resolve())),
          ),
      )
      expect(await headingMetrics(page)).toEqual(before)
      expect(
        await page.evaluate(() => window.relayLayoutShifts.reduce((sum, value) => sum + value, 0)),
      ).toBe(0)
      expect(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth)).toBe(
        false,
      )

      await page.reload({ waitUntil: 'domcontentloaded' })
      await afterPaint(page)
      const reloaded = await headingMetrics(page)
      await page.evaluate(() => document.fonts.ready)
      expect(await headingMetrics(page)).toEqual(reloaded)
    } finally {
      releaseFonts()
    }
  })
}

test('keyboard skip link and mobile menu preserve focus', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/')
  const skip = page.getByRole('link', { name: 'Skip to content' })
  expect(await skip.evaluate((link) => link.getBoundingClientRect().width)).toBeLessThan(2)
  await page.keyboard.press('Tab')
  await expect(skip).toBeFocused()
  expect(await skip.evaluate((link) => link.getBoundingClientRect().width)).toBeGreaterThan(100)
  await page.keyboard.press('Enter')
  await expect(page.locator('#main')).toBeFocused()
  await page.keyboard.press('Tab')
  await expect(page.getByRole('link', { name: 'See Relay in action' })).toBeFocused()

  const menu = page.getByRole('button', { name: 'Open navigation' })
  await menu.click()
  await expect(page.getByRole('navigation', { name: 'Mobile navigation' })).toBeVisible()
  await page.keyboard.press('Escape')
  await expect(menu).toBeFocused()
  await expect(menu).toHaveAttribute('aria-expanded', 'false')
})

test('approval pauses the workflow until a human decision', async ({ page }) => {
  await page.goto('/')
  const demo = page.locator('#workflows')
  await demo.getByRole('tab', { name: 'Team approvals' }).click()
  await demo.getByRole('button', { name: 'Run this workflow' }).click()
  await expect(demo.getByRole('button', { name: 'Approve request' })).toBeVisible()
  await demo.getByRole('button', { name: 'Send back' }).click()
  await expect(demo.getByRole('status')).toContainText('Request sent back')
  await demo.getByRole('button', { name: 'Run again' }).click()
  await demo.getByRole('button', { name: 'Approve request' }).click()
  await expect(demo.getByRole('status')).toContainText('Complete.')
})

test('plan download matches the calculator and closing restores focus', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('button', { name: 'Monthly', exact: true }).click()
  await expect(page.getByTestId('calculator-total')).toHaveText('$79')
  const save = page.getByRole('button', { name: 'Save this plan', exact: true })
  await save.click()
  await expect(page.getByRole('dialog')).toBeVisible()
  const downloadPending = page.waitForEvent('download')
  await page.getByRole('button', { name: 'Download plan brief' }).click()
  const download = await downloadPending
  const file = await download.path()
  expect(file).not.toBeNull()
  const brief = JSON.parse(await readFile(file!, 'utf8'))
  expect(brief).toMatchObject({
    plan: 'Team',
    monthlyCents: 7900,
    billedCents: 7900,
    seats: 15,
    runs: 3000,
    estimateOnly: true,
  })
  await page.keyboard.press('Escape')
  await expect(page.getByRole('dialog')).not.toBeVisible()
  await expect(save).toBeFocused()
})

test('missing URLs return a branded 404 and recover to the landing', async ({ page }) => {
  const errors: string[] = []
  page.on('pageerror', (error) => errors.push(error.message))
  const response = await page.goto('/missing-relay-page')
  expect(response?.status()).toBe(404)
  await expect(page.getByRole('heading', { name: 'A little off track.' })).toBeVisible()
  await expect(page).toHaveURL(/\/missing-relay-page$/)
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'noindex, nofollow')
  await page.getByRole('link', { name: 'Back to Relay', exact: true }).click()
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Good work.')
  await expect(page.locator('meta[name="robots"]')).toHaveCount(0)
  expect(errors).toEqual([])
})

test('the 404 and return link work without JavaScript on a small screen', async ({ browser }) => {
  const context = await browser.newContext({
    javaScriptEnabled: false,
    viewport: { width: 320, height: 844 },
  })
  try {
    const page = await context.newPage()
    const response = await page.goto('http://127.0.0.1:4173/missing-without-js')
    expect(response?.status()).toBe(404)
    await expect(page.getByRole('heading', { name: 'A little off track.' })).toBeVisible()
    expect(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth)).toBe(false)
    await page.getByRole('link', { name: 'Back to Relay', exact: true }).click()
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Good work.')
  } finally {
    await context.close()
  }
})

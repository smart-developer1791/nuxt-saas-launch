import { chromium } from '@playwright/test'
import { mkdir } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'

const origin = new URL(process.argv[2] || 'http://localhost:3000').origin
const docs = fileURLToPath(new URL('../docs/', import.meta.url))
const browser = await chromium.launch()
await mkdir(docs, { recursive: true })

async function openPage(width, height, path = '/') {
  const page = await browser.newPage({
    viewport: { width, height },
    deviceScaleFactor: 1,
    reducedMotion: 'reduce',
  })
  await page.goto(`${origin}${path}`, { waitUntil: 'networkidle' })
  await page.evaluate(() => document.fonts.ready)
  return page
}

try {
  const desktop = await openPage(1440, 1050)
  await desktop.screenshot({ path: `${docs}/preview-desktop.png` })
  await desktop.close()

  const mobile = await openPage(390, 844)
  await mobile.screenshot({ path: `${docs}/preview-mobile.png` })
  await mobile.close()

  const pricing = await openPage(1440, 1800)
  const section = pricing.locator('#pricing')
  const sectionHeight = await section.evaluate((element) => element.getBoundingClientRect().height)
  const headerHeight = await pricing
    .locator('header')
    .evaluate((element) => element.getBoundingClientRect().height)
  await pricing.setViewportSize({
    width: 1440,
    height: Math.ceil(sectionHeight + headerHeight + 24),
  })
  // Keep the entire section below the sticky header and inside the viewport.
  await section.evaluate(
    (element, height) =>
      window.scrollTo({
        top: scrollY + element.getBoundingClientRect().top - height,
        behavior: 'instant',
      }),
    headerHeight,
  )
  await section.screenshot({ path: `${docs}/preview-pricing.png` })
  await pricing.close()

  const error = await openPage(1440, 1050, '/missing-preview-page')
  await error.screenshot({ path: `${docs}/preview-404.png` })
  await error.close()
  console.log('Updated desktop, mobile, pricing, and 404 previews in docs/.')
} finally {
  await browser.close()
}

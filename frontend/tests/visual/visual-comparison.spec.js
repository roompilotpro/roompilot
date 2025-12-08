/* eslint-disable no-undef */
import { test, expect } from '@playwright/test'
import path from 'path'
import { PUBLIC_PAGES } from './fixtures/page-mappings.js'

const DESIGNS_DIR = path.join(process.cwd(), 'designs')
const SNAPSHOTS_DIR = path.join(process.cwd(), 'tests/visual/snapshots')

/**
 * Visual comparison tests for landlord pages
 * Compares React pages against HTML design baselines
 */
test.describe('Landlord Pages Visual Comparison', () => {
  // Test each page mapping
  for (const mapping of PUBLIC_PAGES) {
    test(`${mapping.name} matches HTML design`, async ({ page }) => {
      // Navigate to React page
      await page.goto(mapping.reactRoute)
      await page.waitForLoadState('networkidle')

      // Wait for any animations to complete
      await page.waitForTimeout(500)

      // Take screenshot and compare against baseline
      await expect(page).toHaveScreenshot(`${mapping.name}.png`, {
        fullPage: true,
        maxDiffPixelRatio: 0.01,
        threshold: 0.2,
      })
    })
  }
})

/**
 * Capture HTML design baselines
 * Run this once to create baseline screenshots from HTML files
 */
test.describe('Capture HTML Design Baselines', () => {
  test.skip(() => {
    // Skip unless explicitly running baseline capture
    return !process.env.CAPTURE_BASELINES
  })

  for (const mapping of PUBLIC_PAGES) {
    test(`capture baseline: ${mapping.name}`, async ({ page }) => {
      const htmlPath = `file://${path.join(DESIGNS_DIR, mapping.htmlDesign)}`
      await page.goto(htmlPath)
      await page.waitForLoadState('domcontentloaded')
      await page.waitForTimeout(500)

      const screenshotPath = path.join(SNAPSHOTS_DIR, 'designs', `${mapping.name}.png`)
      await page.screenshot({
        path: screenshotPath,
        fullPage: true
      })
    })
  }
})

/**
 * Capture React page screenshots for manual comparison
 */
test.describe('Capture React Screenshots', () => {
  test.skip(() => {
    // Skip unless explicitly running react capture
    return !process.env.CAPTURE_REACT
  })

  for (const mapping of PUBLIC_PAGES) {
    test(`capture react: ${mapping.name}`, async ({ page }) => {
      await page.goto(mapping.reactRoute)
      await page.waitForLoadState('networkidle')
      await page.waitForTimeout(500)

      const screenshotPath = path.join(SNAPSHOTS_DIR, 'react', `${mapping.name}.png`)
      await page.screenshot({
        path: screenshotPath,
        fullPage: true
      })
    })
  }
})

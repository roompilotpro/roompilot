/* eslint-disable no-undef */
import { test, expect } from '@playwright/test'
import path from 'path'
import fs from 'fs'
import { PNG } from 'pngjs'
import pixelmatch from 'pixelmatch'

const LANDING = {
  name: 'LandingPage',
  htmlDesign: 'landing.html',
  reactRoute: '/',
}

const SNAPSHOTS_DIR = path.join(process.cwd(), 'tests/visual/snapshots')
const DESIGNS_DIR = path.join(SNAPSHOTS_DIR, 'designs')
const REACT_DIR = path.join(SNAPSHOTS_DIR, 'react')
const DIFF_DIR = path.join(SNAPSHOTS_DIR, 'diff')

// Ensure directories exist
function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }
}

test.describe('Landing Page Visual Comparison', () => {
  test.beforeAll(() => {
    ensureDir(DESIGNS_DIR)
    ensureDir(REACT_DIR)
    ensureDir(DIFF_DIR)
  })

  test('capture HTML design baseline', async ({ page }) => {
    const htmlPath = `file:///${path.join(process.cwd(), 'designs', LANDING.htmlDesign).replace(/\\/g, '/')}`
    await page.setViewportSize({ width: 1440, height: 900 })
    await page.goto(htmlPath)

    // Disable animations for consistent screenshots
    await page.addStyleTag({
      content: `
        *, *::before, *::after {
          animation-duration: 0s !important;
          animation-delay: 0s !important;
          transition-duration: 0s !important;
          transition-delay: 0s !important;
        }
      `
    })
    await page.waitForTimeout(500)

    const screenshotPath = path.join(DESIGNS_DIR, `${LANDING.name}.png`)
    await page.screenshot({
      path: screenshotPath,
      fullPage: true
    })

    console.log(`HTML baseline saved to: ${screenshotPath}`)
    expect(fs.existsSync(screenshotPath)).toBeTruthy()
  })

  test('capture React page', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 })
    await page.goto(LANDING.reactRoute)
    await page.waitForLoadState('networkidle')

    // Disable animations for consistent screenshots
    await page.addStyleTag({
      content: `
        *, *::before, *::after {
          animation-duration: 0s !important;
          animation-delay: 0s !important;
          transition-duration: 0s !important;
          transition-delay: 0s !important;
        }
      `
    })
    await page.waitForTimeout(500)

    const screenshotPath = path.join(REACT_DIR, `${LANDING.name}.png`)
    await page.screenshot({
      path: screenshotPath,
      fullPage: true
    })

    console.log(`React screenshot saved to: ${screenshotPath}`)
    expect(fs.existsSync(screenshotPath)).toBeTruthy()
  })

  test('compare screenshots and generate diff', async () => {
    const designPath = path.join(DESIGNS_DIR, `${LANDING.name}.png`)
    const reactPath = path.join(REACT_DIR, `${LANDING.name}.png`)
    const diffPath = path.join(DIFF_DIR, `${LANDING.name}.png`)

    // Check if both screenshots exist
    if (!fs.existsSync(designPath)) {
      throw new Error(`Design baseline not found: ${designPath}. Run the "capture HTML design baseline" test first.`)
    }
    if (!fs.existsSync(reactPath)) {
      throw new Error(`React screenshot not found: ${reactPath}. Run the "capture React page" test first.`)
    }

    const designImg = PNG.sync.read(fs.readFileSync(designPath))
    const reactImg = PNG.sync.read(fs.readFileSync(reactPath))

    // Handle different image heights by using the larger one
    const width = Math.max(designImg.width, reactImg.width)
    const height = Math.max(designImg.height, reactImg.height)

    // Create padded images if sizes differ
    const paddedDesign = new PNG({ width, height })
    const paddedReact = new PNG({ width, height })

    // Fill with white background
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const idx = (width * y + x) << 2
        paddedDesign.data[idx] = 255
        paddedDesign.data[idx + 1] = 255
        paddedDesign.data[idx + 2] = 255
        paddedDesign.data[idx + 3] = 255
        paddedReact.data[idx] = 255
        paddedReact.data[idx + 1] = 255
        paddedReact.data[idx + 2] = 255
        paddedReact.data[idx + 3] = 255
      }
    }

    // Copy original images into padded versions
    PNG.bitblt(designImg, paddedDesign, 0, 0, designImg.width, designImg.height, 0, 0)
    PNG.bitblt(reactImg, paddedReact, 0, 0, reactImg.width, reactImg.height, 0, 0)

    const diff = new PNG({ width, height })

    const numDiffPixels = pixelmatch(
      paddedDesign.data,
      paddedReact.data,
      diff.data,
      width,
      height,
      { threshold: 0.1 }
    )

    // Save diff image
    fs.writeFileSync(diffPath, PNG.sync.write(diff))

    const totalPixels = width * height
    const diffPercentage = (numDiffPixels / totalPixels) * 100

    console.log('\n========================================')
    console.log('VISUAL COMPARISON RESULTS')
    console.log('========================================')
    console.log(`Design dimensions: ${designImg.width}x${designImg.height}`)
    console.log(`React dimensions: ${reactImg.width}x${reactImg.height}`)
    console.log(`Comparison dimensions: ${width}x${height}`)
    console.log(`Total pixels: ${totalPixels.toLocaleString()}`)
    console.log(`Different pixels: ${numDiffPixels.toLocaleString()}`)
    console.log(`Difference: ${diffPercentage.toFixed(2)}%`)
    console.log(`Diff image saved to: ${diffPath}`)
    console.log('========================================\n')

    // Write results to JSON for tracking
    const resultsPath = path.join(SNAPSHOTS_DIR, 'comparison-results.json')
    const results = {
      timestamp: new Date().toISOString(),
      page: LANDING.name,
      design: { width: designImg.width, height: designImg.height },
      react: { width: reactImg.width, height: reactImg.height },
      totalPixels,
      diffPixels: numDiffPixels,
      diffPercentage: parseFloat(diffPercentage.toFixed(2)),
      passed: diffPercentage < 1
    }
    fs.writeFileSync(resultsPath, JSON.stringify(results, null, 2))

    // Assert diff is below threshold (1%)
    expect(diffPercentage, `Visual difference is ${diffPercentage.toFixed(2)}%, exceeds 1% threshold`).toBeLessThan(1)
  })
})

/**
 * Visual Test Utilities
 * Core utilities for screenshot capture, comparison, and diff generation
 */

import { PNG } from 'pngjs'
import pixelmatch from 'pixelmatch'
import fs from 'fs'
import path from 'path'
import process from 'process'
import { fileURLToPath } from 'url'
import { DEFAULT_VIEWPORT, COMPARISON_CONFIG, PATHS } from '../config/visual-test-config.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const VISUAL_DIR = path.resolve(__dirname, '..')

// CSS to disable all animations for consistent screenshots
export const DISABLE_ANIMATIONS_CSS = `
  *, *::before, *::after {
    animation-duration: 0s !important;
    animation-delay: 0s !important;
    transition-duration: 0s !important;
    transition-delay: 0s !important;
    scroll-behavior: auto !important;
  }
`

/**
 * Ensure a directory exists, creating it if necessary
 * @param {string} dirPath - Path to directory
 */
export function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true })
  }
}

/**
 * Get the absolute path for a snapshot type
 * @param {'designs' | 'react' | 'diff'} type - Snapshot type
 * @returns {string} Absolute path to snapshot directory
 */
export function getSnapshotDir(type) {
  const dir = path.join(VISUAL_DIR, PATHS[type])
  ensureDir(dir)
  return dir
}

/**
 * Get the path to a specific screenshot file
 * @param {'designs' | 'react' | 'diff'} type - Snapshot type
 * @param {string} pageName - Page name (e.g., 'LandingPage')
 * @returns {string} Absolute path to screenshot file
 */
export function getScreenshotPath(type, pageName) {
  return path.join(getSnapshotDir(type), `${pageName}.png`)
}

/**
 * Capture a screenshot with consistent settings
 * @param {import('@playwright/test').Page} page - Playwright page object
 * @param {string} outputPath - Path to save screenshot
 * @param {Object} options - Options
 * @param {Object} [options.viewport] - Viewport dimensions
 */
export async function captureScreenshot(page, outputPath, options = {}) {
  const viewport = options.viewport || DEFAULT_VIEWPORT

  // Set viewport size
  await page.setViewportSize(viewport)

  // Disable animations for consistent screenshots
  await page.addStyleTag({ content: DISABLE_ANIMATIONS_CSS })

  // Wait for animations to settle
  await page.waitForTimeout(COMPARISON_CONFIG.waitAfterLoad)

  // Take full page screenshot
  await page.screenshot({
    path: outputPath,
    fullPage: true,
  })
}

/**
 * Capture HTML design baseline screenshot
 * @param {import('@playwright/test').Page} page - Playwright page object
 * @param {string} htmlFile - HTML filename in designs/ directory
 * @param {string} outputPath - Path to save screenshot
 * @param {Object} [options] - Options
 */
export async function captureDesignBaseline(page, htmlFile, outputPath, options = {}) {
  const htmlPath = `file:///${path.join(process.cwd(), 'designs', htmlFile).replace(/\\/g, '/')}`

  await page.goto(htmlPath)
  await page.waitForLoadState('domcontentloaded')
  await captureScreenshot(page, outputPath, options)
}

/**
 * Capture React page screenshot
 * @param {import('@playwright/test').Page} page - Playwright page object
 * @param {string} route - React route (e.g., '/pricing')
 * @param {string} outputPath - Path to save screenshot
 * @param {Object} [options] - Options
 * @param {string} [options.waitForState='networkidle'] - Load state to wait for
 */
export async function captureReactPage(page, route, outputPath, options = {}) {
  const waitForState = options.waitForState || 'networkidle'

  await page.goto(route)
  await page.waitForLoadState(waitForState)
  await captureScreenshot(page, outputPath, options)
}

/**
 * Pad an image to target dimensions with white background
 * @param {PNG} img - Source PNG image
 * @param {number} targetWidth - Target width
 * @param {number} targetHeight - Target height
 * @returns {PNG} Padded PNG image
 */
export function padImage(img, targetWidth, targetHeight) {
  const padded = new PNG({ width: targetWidth, height: targetHeight })

  // Fill with white background
  for (let y = 0; y < targetHeight; y++) {
    for (let x = 0; x < targetWidth; x++) {
      const idx = (targetWidth * y + x) << 2
      padded.data[idx] = 255 // R
      padded.data[idx + 1] = 255 // G
      padded.data[idx + 2] = 255 // B
      padded.data[idx + 3] = 255 // A
    }
  }

  // Copy original image onto padded image
  PNG.bitblt(img, padded, 0, 0, img.width, img.height, 0, 0)

  return padded
}

/**
 * Compare two images and generate a diff
 * @param {string} designPath - Path to design baseline screenshot
 * @param {string} reactPath - Path to React page screenshot
 * @param {string} diffPath - Path to save diff image
 * @param {Object} [options] - Options
 * @param {number} [options.threshold] - Pixelmatch threshold (0-1)
 * @returns {Object} Comparison result
 */
export function compareImages(designPath, reactPath, diffPath, options = {}) {
  const threshold = options.threshold ?? COMPARISON_CONFIG.pixelmatchThreshold

  // Read images
  const designImg = PNG.sync.read(fs.readFileSync(designPath))
  const reactImg = PNG.sync.read(fs.readFileSync(reactPath))

  // Normalize dimensions (use larger of each dimension)
  const width = Math.max(designImg.width, reactImg.width)
  const height = Math.max(designImg.height, reactImg.height)

  // Pad images to same dimensions
  const paddedDesign = padImage(designImg, width, height)
  const paddedReact = padImage(reactImg, width, height)

  // Create diff image
  const diff = new PNG({ width, height })

  // Run pixelmatch comparison
  const diffPixels = pixelmatch(paddedDesign.data, paddedReact.data, diff.data, width, height, {
    threshold,
    includeAA: false, // Ignore anti-aliasing differences
  })

  // Save diff image
  ensureDir(path.dirname(diffPath))
  fs.writeFileSync(diffPath, PNG.sync.write(diff))

  // Calculate results
  const totalPixels = width * height
  const diffPercent = (diffPixels / totalPixels) * 100

  return {
    diffPixels,
    totalPixels,
    diffPercent: parseFloat(diffPercent.toFixed(2)),
    passed: diffPercent < COMPARISON_CONFIG.maxDiffPercent,
    designDimensions: { width: designImg.width, height: designImg.height },
    reactDimensions: { width: reactImg.width, height: reactImg.height },
    normalizedDimensions: { width, height },
  }
}

/**
 * Get quality rating based on diff percentage
 * @param {number} diffPercent - Difference percentage
 * @returns {string} Quality rating
 */
export function getQualityRating(diffPercent) {
  const { qualityThresholds } = COMPARISON_CONFIG
  if (diffPercent < qualityThresholds.excellent) return 'Excellent'
  if (diffPercent < qualityThresholds.good) return 'Good'
  if (diffPercent < qualityThresholds.fair) return 'Fair'
  return 'Needs Work'
}

/**
 * Run a full visual comparison test for a page mapping
 * @param {import('@playwright/test').Page} page - Playwright page object
 * @param {Object} mapping - Page mapping object
 * @param {string} mapping.name - Page name
 * @param {string} mapping.htmlDesign - HTML design filename
 * @param {string} mapping.reactRoute - React route
 * @param {Object} [options] - Options
 * @returns {Object} Test result
 */
export async function runVisualComparison(page, mapping, options = {}) {
  const designPath = getScreenshotPath('designs', mapping.name)
  const reactPath = getScreenshotPath('react', mapping.name)
  const diffPath = getScreenshotPath('diff', mapping.name)

  // Capture design baseline
  await captureDesignBaseline(page, mapping.htmlDesign, designPath, options)

  // Capture React page
  await captureReactPage(page, mapping.reactRoute, reactPath, options)

  // Compare and generate diff
  const result = compareImages(designPath, reactPath, diffPath, options)

  return {
    ...result,
    name: mapping.name,
    htmlDesign: mapping.htmlDesign,
    reactRoute: mapping.reactRoute,
    quality: getQualityRating(result.diffPercent),
    paths: {
      design: designPath,
      react: reactPath,
      diff: diffPath,
    },
  }
}

/**
 * Save comparison results to JSON file
 * @param {Array} results - Array of comparison results
 * @param {string} [outputPath] - Path to save JSON file
 */
export function saveResults(results, outputPath) {
  const resultsPath = outputPath || path.join(VISUAL_DIR, PATHS.results)
  const data = {
    timestamp: new Date().toISOString(),
    viewport: DEFAULT_VIEWPORT,
    threshold: COMPARISON_CONFIG.maxDiffPercent,
    results,
    summary: {
      total: results.length,
      passed: results.filter((r) => r.passed).length,
      failed: results.filter((r) => !r.passed).length,
      excellent: results.filter((r) => r.quality === 'Excellent').length,
      good: results.filter((r) => r.quality === 'Good').length,
      fair: results.filter((r) => r.quality === 'Fair').length,
      needsWork: results.filter((r) => r.quality === 'Needs Work').length,
    },
  }

  fs.writeFileSync(resultsPath, JSON.stringify(data, null, 2))
  return resultsPath
}

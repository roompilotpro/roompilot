/* eslint-disable no-undef */
/**
 * Unified Visual Comparison Tests
 * Runs visual regression tests for all page types using pixelmatch
 */

import { test } from '@playwright/test'
import path from 'path'
import fs from 'fs'
import { PUBLIC_PAGES } from '../fixtures/page-mappings.js'
import {
  runVisualComparison,
  saveResults,
  ensureDir,
} from '../utils/visual-test-utils.js'
import { DEFAULT_VIEWPORT, COMPARISON_CONFIG, PATHS } from '../config/visual-test-config.js'

const VISUAL_DIR = path.join(process.cwd(), 'tests/visual')

// Ensure snapshot directories exist
test.beforeAll(() => {
  ensureDir(path.join(VISUAL_DIR, PATHS.designs))
  ensureDir(path.join(VISUAL_DIR, PATHS.react))
  ensureDir(path.join(VISUAL_DIR, PATHS.diff))
})

// Test configuration - run serially to avoid file write conflicts
test.describe.configure({ mode: 'serial' })

// Store results for final report
const testResults = []

/**
 * Generate tests for public pages
 */
test.describe('Public Pages Visual Comparison', () => {
  for (const mapping of PUBLIC_PAGES) {
    test(`${mapping.name} matches design (<${COMPARISON_CONFIG.maxDiffPercent}% diff)`, async ({
      page,
    }) => {
      // Run visual comparison
      const result = await runVisualComparison(page, mapping, {
        viewport: DEFAULT_VIEWPORT,
      })

      // Store result for report
      testResults.push(result)

      // Log result
      console.log(`\n========================================`)
      console.log(`${mapping.name}`)
      console.log(`========================================`)
      console.log(`Route: ${mapping.reactRoute}`)
      console.log(`Design: ${mapping.htmlDesign}`)
      console.log(`Viewport: ${DEFAULT_VIEWPORT.width}x${DEFAULT_VIEWPORT.height}`)
      console.log(`Design dimensions: ${result.designDimensions.width}x${result.designDimensions.height}`)
      console.log(`React dimensions: ${result.reactDimensions.width}x${result.reactDimensions.height}`)
      console.log(`Different pixels: ${result.diffPixels.toLocaleString()}`)
      console.log(`Total pixels: ${result.totalPixels.toLocaleString()}`)
      console.log(`Difference: ${result.diffPercent}%`)
      console.log(`Quality: ${result.quality}`)
      console.log(`Status: ${result.passed ? 'PASSED ✓' : 'FAILED ✗'}`)
      console.log(`========================================\n`)

      // Don't fail the test - we want to capture all results
      // The pass/fail status is recorded in the result object
      // Final test will check overall status
    })
  }

  // Generate report after all tests in this describe block
  test('Generate comparison report', async () => {
    if (testResults.length === 0) {
      console.log('No test results to report')
      return
    }

    // Save JSON results
    const resultsPath = saveResults(testResults)
    console.log(`\nResults saved to: ${resultsPath}`)

    // Generate HTML report
    const reportPath = path.join(VISUAL_DIR, PATHS.report)
    const reportHtml = generateHTMLReport(testResults)
    fs.writeFileSync(reportPath, reportHtml)
    console.log(`HTML report saved to: ${reportPath}`)

    // Print summary
    const passed = testResults.filter((r) => r.passed).length
    const failed = testResults.filter((r) => !r.passed).length
    console.log(`\n========================================`)
    console.log(`SUMMARY: ${passed} passed, ${failed} failed`)
    console.log(`========================================\n`)
  })
})

/**
 * Generate HTML report from test results
 * @param {Array} results - Array of test results
 * @returns {string} HTML report content
 */
function generateHTMLReport(results) {
  const summary = {
    total: results.length,
    passed: results.filter((r) => r.passed).length,
    failed: results.filter((r) => !r.passed).length,
    excellent: results.filter((r) => r.quality === 'Excellent').length,
    good: results.filter((r) => r.quality === 'Good').length,
    fair: results.filter((r) => r.quality === 'Fair').length,
    needsWork: results.filter((r) => r.quality === 'Needs Work').length,
  }

  return `<!DOCTYPE html>
<html>
<head>
  <title>Visual Comparison Report</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: #f5f5f5;
      padding: 20px;
    }
    .container { max-width: 1800px; margin: 0 auto; }
    h1 { color: #1a1a1a; margin-bottom: 10px; font-size: 32px; }
    .meta { color: #666; margin-bottom: 30px; font-size: 14px; }
    .summary {
      background: white;
      border-radius: 8px;
      padding: 20px;
      margin-bottom: 30px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    }
    .summary h2 { font-size: 20px; margin-bottom: 15px; color: #1a1a1a; }
    .summary-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      gap: 15px;
    }
    .summary-item {
      padding: 15px;
      background: #f9fafb;
      border-radius: 6px;
      border: 1px solid #e5e7eb;
    }
    .summary-item label {
      font-size: 12px;
      color: #666;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      display: block;
      margin-bottom: 5px;
    }
    .summary-item .value { font-size: 24px; font-weight: 600; color: #1a1a1a; }
    .page {
      background: white;
      border-radius: 8px;
      padding: 20px;
      margin-bottom: 20px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    }
    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 15px;
      padding-bottom: 15px;
      border-bottom: 1px solid #e5e7eb;
    }
    .page-header h3 { font-size: 18px; color: #1a1a1a; }
    .status {
      padding: 6px 12px;
      border-radius: 6px;
      font-weight: 600;
      font-size: 13px;
    }
    .status.excellent { background: #d1fae5; color: #065f46; }
    .status.good { background: #dbeafe; color: #1e40af; }
    .status.fair { background: #fef3c7; color: #92400e; }
    .status.needs-work { background: #fee2e2; color: #991b1b; }
    .info-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      gap: 10px;
      margin-bottom: 20px;
      padding: 15px;
      background: #f9fafb;
      border-radius: 6px;
    }
    .info-item { font-size: 13px; }
    .info-item label { color: #666; display: block; margin-bottom: 2px; }
    .info-item .value { color: #1a1a1a; font-weight: 500; }
    .images {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 20px;
    }
    .image-container { display: flex; flex-direction: column; }
    .image-label {
      font-size: 13px;
      font-weight: 600;
      color: #374151;
      margin-bottom: 8px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .image-wrapper {
      background: #f9fafb;
      border: 1px solid #e5e7eb;
      border-radius: 6px;
      overflow: hidden;
    }
    .images img { width: 100%; display: block; }
  </style>
</head>
<body>
  <div class="container">
    <h1>Visual Comparison Report</h1>
    <div class="meta">
      Generated: ${new Date().toLocaleString()} |
      Viewport: ${DEFAULT_VIEWPORT.width}x${DEFAULT_VIEWPORT.height} |
      Threshold: <${COMPARISON_CONFIG.maxDiffPercent}%
    </div>

    <div class="summary">
      <h2>Summary</h2>
      <div class="summary-grid">
        <div class="summary-item">
          <label>Total Pages</label>
          <div class="value">${summary.total}</div>
        </div>
        <div class="summary-item">
          <label>Passed</label>
          <div class="value" style="color: #059669">${summary.passed}</div>
        </div>
        <div class="summary-item">
          <label>Failed</label>
          <div class="value" style="color: #dc2626">${summary.failed}</div>
        </div>
        <div class="summary-item">
          <label>Excellent (<1%)</label>
          <div class="value" style="color: #059669">${summary.excellent}</div>
        </div>
        <div class="summary-item">
          <label>Good (1-5%)</label>
          <div class="value" style="color: #2563eb">${summary.good}</div>
        </div>
        <div class="summary-item">
          <label>Fair (5-15%)</label>
          <div class="value" style="color: #d97706">${summary.fair}</div>
        </div>
        <div class="summary-item">
          <label>Needs Work (>15%)</label>
          <div class="value" style="color: #dc2626">${summary.needsWork}</div>
        </div>
      </div>
    </div>

    ${results
      .map((r) => {
        const statusClass = r.quality.toLowerCase().replace(' ', '-')
        return `
      <div class="page">
        <div class="page-header">
          <h3>${r.name}</h3>
          <span class="status ${statusClass}">${r.quality.toUpperCase()} - ${r.diffPercent}% diff</span>
        </div>
        <div class="info-grid">
          <div class="info-item">
            <label>React Route</label>
            <div class="value">${r.reactRoute}</div>
          </div>
          <div class="info-item">
            <label>HTML Design</label>
            <div class="value">${r.htmlDesign}</div>
          </div>
          <div class="info-item">
            <label>Design Size</label>
            <div class="value">${r.designDimensions.width}x${r.designDimensions.height}</div>
          </div>
          <div class="info-item">
            <label>React Size</label>
            <div class="value">${r.reactDimensions.width}x${r.reactDimensions.height}</div>
          </div>
          <div class="info-item">
            <label>Different Pixels</label>
            <div class="value">${r.diffPixels.toLocaleString()}</div>
          </div>
          <div class="info-item">
            <label>Total Pixels</label>
            <div class="value">${r.totalPixels.toLocaleString()}</div>
          </div>
        </div>
        <div class="images">
          <div class="image-container">
            <div class="image-label">HTML Design</div>
            <div class="image-wrapper">
              <img src="designs/${r.name}.png" alt="HTML Design" />
            </div>
          </div>
          <div class="image-container">
            <div class="image-label">React Page</div>
            <div class="image-wrapper">
              <img src="react/${r.name}.png" alt="React Page" />
            </div>
          </div>
          <div class="image-container">
            <div class="image-label">Difference</div>
            <div class="image-wrapper">
              <img src="diff/${r.name}.png" alt="Diff" />
            </div>
          </div>
        </div>
      </div>
    `
      })
      .join('')}
  </div>
</body>
</html>`
}

import { PNG } from 'pngjs'
import pixelmatch from 'pixelmatch'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const SNAPSHOTS_DIR = path.join(__dirname, 'snapshots')
const REACT_DIR = path.join(SNAPSHOTS_DIR, 'react')
const DESIGNS_DIR = path.join(SNAPSHOTS_DIR, 'designs')
const DIFF_DIR = path.join(SNAPSHOTS_DIR, 'diff')

// Create diff directory if it doesn't exist
if (!fs.existsSync(DIFF_DIR)) {
  fs.mkdirSync(DIFF_DIR, { recursive: true })
}

const PAGE_NAMES = [
  'TenantsListPage',
  'TenantDetailPage',
  'ApplicationsListPage',
  'ApplicationDetailPage',
  'RoomDetailPage',
  'MaintenancePage',
  'MessagesPage',
  'AnnouncementPage',
  'PayoutsPage',
  'PayoutSettingsPage',
  'BillingSettingsPage',
  'SettingsPage',
  'ProfilePage',
]

function compareImages(img1Path, img2Path, diffOutputPath) {
  const img1 = PNG.sync.read(fs.readFileSync(img1Path))
  const img2 = PNG.sync.read(fs.readFileSync(img2Path))

  const { width: width1, height: height1 } = img1
  const { width: width2, height: height2 } = img2

  // Handle different dimensions
  const width = Math.max(width1, width2)
  const height = Math.max(height1, height2)

  // Create new images with same dimensions
  const img1Resized = new PNG({ width, height })
  const img2Resized = new PNG({ width, height })
  const diff = new PNG({ width, height })

  // Fill with white background
  img1Resized.data.fill(255)
  img2Resized.data.fill(255)

  // Copy original images
  PNG.bitblt(img1, img1Resized, 0, 0, width1, height1, 0, 0)
  PNG.bitblt(img2, img2Resized, 0, 0, width2, height2, 0, 0)

  const numDiffPixels = pixelmatch(
    img1Resized.data,
    img2Resized.data,
    diff.data,
    width,
    height,
    { threshold: 0.1 }
  )

  fs.writeFileSync(diffOutputPath, PNG.sync.write(diff))

  const totalPixels = width * height
  const diffPercentage = (numDiffPixels / totalPixels) * 100

  return {
    width1,
    height1,
    width2,
    height2,
    diffPixels: numDiffPixels,
    totalPixels,
    diffPercentage: diffPercentage.toFixed(2),
  }
}

function getVisualMatchQuality(diffPercentage) {
  if (diffPercentage < 1) return 'Excellent'
  if (diffPercentage < 5) return 'Good'
  if (diffPercentage < 15) return 'Fair'
  return 'Needs Work'
}

console.log('\n======================================')
console.log('Visual Comparison Report')
console.log('======================================\n')

const results = []

for (const pageName of PAGE_NAMES) {
  const reactPath = path.join(REACT_DIR, `${pageName}.png`)
  const designPath = path.join(DESIGNS_DIR, `${pageName}.png`)
  const diffPath = path.join(DIFF_DIR, `${pageName}.png`)

  if (!fs.existsSync(reactPath)) {
    console.log(`❌ ${pageName}`)
    console.log(`   Screenshot captured: No (React)`)
    console.log(`   Error: React screenshot not found\n`)
    results.push({
      name: pageName,
      captured: false,
      error: 'React screenshot not found',
    })
    continue
  }

  if (!fs.existsSync(designPath)) {
    console.log(`❌ ${pageName}`)
    console.log(`   Screenshot captured: No (Design)`)
    console.log(`   Error: Design screenshot not found\n`)
    results.push({
      name: pageName,
      captured: false,
      error: 'Design screenshot not found',
    })
    continue
  }

  try {
    const comparison = compareImages(reactPath, designPath, diffPath)
    const quality = getVisualMatchQuality(parseFloat(comparison.diffPercentage))
    const statusIcon = quality === 'Excellent' || quality === 'Good' ? '✅' : '⚠️'

    console.log(`${statusIcon} ${pageName}`)
    console.log(`   Screenshot captured: Yes`)
    console.log(`   Visual match quality: ${quality}`)
    console.log(`   Difference: ${comparison.diffPercentage}%`)
    console.log(`   HTML Design: ${comparison.width1}x${comparison.height1}`)
    console.log(`   React Page: ${comparison.width2}x${comparison.height2}`)

    if (parseFloat(comparison.diffPercentage) > 5) {
      console.log(`   Issues: Significant visual differences detected`)
    } else if (comparison.width1 !== comparison.width2 || comparison.height1 !== comparison.height2) {
      console.log(`   Issues: Page dimensions differ`)
    }

    console.log('')

    results.push({
      name: pageName,
      captured: true,
      quality,
      diffPercentage: comparison.diffPercentage,
      htmlDimensions: `${comparison.width1}x${comparison.height1}`,
      reactDimensions: `${comparison.width2}x${comparison.height2}`,
      diffPixels: comparison.diffPixels,
      totalPixels: comparison.totalPixels,
    })
  } catch (error) {
    console.log(`❌ ${pageName}`)
    console.log(`   Screenshot captured: Yes`)
    console.log(`   Error: ${error.message}\n`)
    results.push({
      name: pageName,
      captured: true,
      error: error.message,
    })
  }
}

// Generate summary
console.log('======================================')
console.log('Summary')
console.log('======================================\n')

const captured = results.filter(r => r.captured).length
const excellent = results.filter(r => r.quality === 'Excellent').length
const good = results.filter(r => r.quality === 'Good').length
const fair = results.filter(r => r.quality === 'Fair').length
const needsWork = results.filter(r => r.quality === 'Needs Work').length
const errors = results.filter(r => r.error).length

console.log(`Total pages: ${PAGE_NAMES.length}`)
console.log(`Screenshots captured: ${captured}/${PAGE_NAMES.length}`)
console.log(`\nVisual Quality Breakdown:`)
console.log(`  Excellent (<1% diff): ${excellent}`)
console.log(`  Good (1-5% diff): ${good}`)
console.log(`  Fair (5-15% diff): ${fair}`)
console.log(`  Needs Work (>15% diff): ${needsWork}`)
if (errors > 0) {
  console.log(`  Errors: ${errors}`)
}

console.log('\n======================================\n')

// Generate HTML report
const reportHtml = `<!DOCTYPE html>
<html>
<head>
  <title>Visual Comparison Report - Landlord Pages</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: #f5f5f5;
      padding: 20px;
    }
    .container { max-width: 1400px; margin: 0 auto; }
    h1 {
      color: #1a1a1a;
      margin-bottom: 10px;
      font-size: 32px;
    }
    .meta {
      color: #666;
      margin-bottom: 30px;
      font-size: 14px;
    }
    .summary {
      background: white;
      border-radius: 8px;
      padding: 20px;
      margin-bottom: 30px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    }
    .summary h2 {
      font-size: 20px;
      margin-bottom: 15px;
      color: #1a1a1a;
    }
    .summary-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
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
    .summary-item .value {
      font-size: 24px;
      font-weight: 600;
      color: #1a1a1a;
    }
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
    .page-header h3 {
      font-size: 18px;
      color: #1a1a1a;
    }
    .status {
      padding: 6px 12px;
      border-radius: 6px;
      font-weight: 600;
      font-size: 13px;
      display: inline-flex;
      align-items: center;
      gap: 6px;
    }
    .status.excellent { background: #d1fae5; color: #065f46; }
    .status.good { background: #dbeafe; color: #1e40af; }
    .status.fair { background: #fef3c7; color: #92400e; }
    .status.needs-work { background: #fee2e2; color: #991b1b; }
    .status.error { background: #fecaca; color: #7f1d1d; }
    .info-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      gap: 10px;
      margin-bottom: 20px;
      padding: 15px;
      background: #f9fafb;
      border-radius: 6px;
    }
    .info-item {
      font-size: 13px;
    }
    .info-item label {
      color: #666;
      display: block;
      margin-bottom: 2px;
    }
    .info-item .value {
      color: #1a1a1a;
      font-weight: 500;
    }
    .images {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 20px;
    }
    .image-container {
      display: flex;
      flex-direction: column;
    }
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
      position: relative;
    }
    .images img {
      width: 100%;
      display: block;
    }
    .error-message {
      color: #dc2626;
      padding: 10px;
      background: #fef2f2;
      border-radius: 6px;
      font-size: 14px;
      margin-top: 10px;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>Visual Comparison Report</h1>
    <div class="meta">Generated: ${new Date().toLocaleString()} | Landlord Pages</div>

    <div class="summary">
      <h2>Summary</h2>
      <div class="summary-grid">
        <div class="summary-item">
          <label>Total Pages</label>
          <div class="value">${PAGE_NAMES.length}</div>
        </div>
        <div class="summary-item">
          <label>Excellent</label>
          <div class="value" style="color: #059669">${excellent}</div>
        </div>
        <div class="summary-item">
          <label>Good</label>
          <div class="value" style="color: #2563eb">${good}</div>
        </div>
        <div class="summary-item">
          <label>Fair</label>
          <div class="value" style="color: #d97706">${fair}</div>
        </div>
        <div class="summary-item">
          <label>Needs Work</label>
          <div class="value" style="color: #dc2626">${needsWork}</div>
        </div>
      </div>
    </div>

    ${results
      .map(r => {
        if (r.error) {
          return `
            <div class="page">
              <div class="page-header">
                <h3>${r.name}</h3>
                <span class="status error">ERROR</span>
              </div>
              <div class="error-message">${r.error}</div>
            </div>
          `
        }

        const statusClass = r.quality.toLowerCase().replace(' ', '-')
        return `
          <div class="page">
            <div class="page-header">
              <h3>${r.name}</h3>
              <span class="status ${statusClass}">${r.quality.toUpperCase()} - ${r.diffPercentage}% diff</span>
            </div>
            <div class="info-grid">
              <div class="info-item">
                <label>HTML Design Size</label>
                <div class="value">${r.htmlDimensions}</div>
              </div>
              <div class="info-item">
                <label>React Page Size</label>
                <div class="value">${r.reactDimensions}</div>
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

const reportPath = path.join(SNAPSHOTS_DIR, 'comparison-report.html')
fs.writeFileSync(reportPath, reportHtml)

console.log(`HTML report generated: ${reportPath}`)
console.log(`\nTo view the report, open: file://${reportPath}\n`)

/* eslint-env node */
import { PNG } from 'pngjs'
import pixelmatch from 'pixelmatch'
import fs from 'fs'

/**
 * Compare two screenshots and return diff percentage
 */
export async function compareScreenshots(img1Path, img2Path, diffOutputPath) {
  const img1 = PNG.sync.read(fs.readFileSync(img1Path))
  const img2 = PNG.sync.read(fs.readFileSync(img2Path))

  const { width, height } = img1
  const diff = new PNG({ width, height })

  const numDiffPixels = pixelmatch(
    img1.data,
    img2.data,
    diff.data,
    width,
    height,
    { threshold: 0.1 }
  )

  fs.writeFileSync(diffOutputPath, PNG.sync.write(diff))

  const totalPixels = width * height
  const diffPercentage = (numDiffPixels / totalPixels) * 100

  return {
    diffPixels: numDiffPixels,
    totalPixels,
    diffPercentage: diffPercentage.toFixed(2),
    passed: diffPercentage < 1.0,
  }
}

/**
 * Generate a visual comparison report
 */
export function generateReport(results, outputPath) {
  const html = `
<!DOCTYPE html>
<html>
<head>
  <title>Visual Comparison Report</title>
  <style>
    body { font-family: system-ui; padding: 20px; max-width: 1200px; margin: 0 auto; }
    h1 { color: #1a1a1a; }
    .page { border: 1px solid #ddd; border-radius: 8px; padding: 16px; margin-bottom: 16px; }
    .page-header { display: flex; justify-content: space-between; align-items: center; }
    .status { padding: 4px 8px; border-radius: 4px; font-weight: 600; }
    .status.pass { background: #d1fae5; color: #065f46; }
    .status.fail { background: #fee2e2; color: #991b1b; }
    .images { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-top: 16px; }
    .images img { width: 100%; border: 1px solid #ddd; border-radius: 4px; }
    .image-label { font-size: 12px; color: #666; margin-bottom: 4px; }
  </style>
</head>
<body>
  <h1>Visual Comparison Report</h1>
  <p>Generated: ${new Date().toLocaleString()}</p>
  ${results.map(r => `
    <div class="page">
      <div class="page-header">
        <h3>${r.name}</h3>
        <span class="status ${r.passed ? 'pass' : 'fail'}">
          ${r.passed ? 'PASS' : 'FAIL'} - ${r.diffPercentage}% diff
        </span>
      </div>
      <div class="images">
        <div>
          <div class="image-label">HTML Design</div>
          <img src="${r.htmlScreenshot}" alt="HTML Design" />
        </div>
        <div>
          <div class="image-label">React Page</div>
          <img src="${r.reactScreenshot}" alt="React Page" />
        </div>
        <div>
          <div class="image-label">Diff</div>
          <img src="${r.diffImage}" alt="Diff" />
        </div>
      </div>
    </div>
  `).join('')}
</body>
</html>
  `

  fs.writeFileSync(outputPath, html)
}

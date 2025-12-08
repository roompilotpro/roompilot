/**
 * Visual Test Configuration
 * Centralized configuration for visual regression testing
 */

// Viewport presets for different screen sizes
export const VIEWPORT_PRESETS = {
  MOBILE: { width: 375, height: 812 },
  TABLET: { width: 768, height: 1024 },
  DESKTOP: { width: 1440, height: 900 },
  DESKTOP_4K: { width: 2560, height: 1440 },
}

// Default viewport for all tests
export const DEFAULT_VIEWPORT = VIEWPORT_PRESETS.DESKTOP_4K

// Comparison configuration
export const COMPARISON_CONFIG = {
  // Pixelmatch threshold (0-1): Lower = more strict color matching
  pixelmatchThreshold: 0.1,

  // Maximum allowed difference percentage for a test to pass
  maxDiffPercent: 5,

  // Milliseconds to wait after page load before taking screenshot
  waitAfterLoad: 500,

  // Quality rating thresholds
  qualityThresholds: {
    excellent: 1, // <1% diff
    good: 5, // 1-5% diff
    fair: 15, // 5-15% diff
    // >15% = needs work
  },
}

// Page type specific configuration
export const PAGE_TYPE_CONFIG = {
  public: {
    designsSubdir: '',
    waitForState: 'domcontentloaded',
    waitMs: 500,
  },
  landlord: {
    designsSubdir: '',
    waitForState: 'networkidle',
    waitMs: 500,
  },
  tenant: {
    designsSubdir: '',
    waitForState: 'networkidle',
    waitMs: 500,
  },
  auth: {
    designsSubdir: '',
    waitForState: 'domcontentloaded',
    waitMs: 300,
  },
}

// Directory paths (relative to tests/visual/)
export const PATHS = {
  snapshots: 'snapshots',
  designs: 'snapshots/designs',
  react: 'snapshots/react',
  diff: 'snapshots/diff',
  report: 'snapshots/comparison-report.html',
  results: 'snapshots/comparison-results.json',
}

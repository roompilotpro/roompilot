/**
 * Page Mappings for Visual Comparison Testing
 * Organized by page type for reusability and extensibility
 */

/**
 * Public pages - marketing, info, and unauthenticated pages
 */
export const PUBLIC_PAGES = [
  { name: 'LandingPage', htmlDesign: 'landing.html', reactRoute: '/' },
  { name: 'PricingPage', htmlDesign: 'public-pricing.html', reactRoute: '/pricing' },
  { name: 'FAQPage', htmlDesign: 'public-faq.html', reactRoute: '/faq' },
  {
    name: 'HowItWorksLandlordsPage',
    htmlDesign: 'public-how-it-works-landlords.html',
    reactRoute: '/how-it-works/landlords',
  },
  {
    name: 'HowItWorksRentersPage',
    htmlDesign: 'public-how-it-works-renters.html',
    reactRoute: '/how-it-works/renters',
  },
  { name: 'PrivacyPage', htmlDesign: 'public-privacy.html', reactRoute: '/privacy' },
  { name: 'TermsPage', htmlDesign: 'public-terms.html', reactRoute: '/terms' },
  { name: 'TrustSafetyPage', htmlDesign: 'public-trust-safety.html', reactRoute: '/trust-safety' },
]

/**
 * Landlord dashboard pages - authenticated landlord/host views
 */
export const LANDLORD_PAGES = [
  { name: 'LandlordDashboardPage', htmlDesign: 'landlord-dashboard.html', reactRoute: '/landlord/dashboard' },
  { name: 'TenantsListPage', htmlDesign: 'landlord-tenants.html', reactRoute: '/landlord/tenants' },
  { name: 'TenantDetailPage', htmlDesign: 'landlord-tenant-detail.html', reactRoute: '/landlord/tenants/1' },
  { name: 'ApplicationsListPage', htmlDesign: 'landlord-applications.html', reactRoute: '/landlord/applications' },
  {
    name: 'ApplicationDetailPage',
    htmlDesign: 'landlord-application-detail.html',
    reactRoute: '/landlord/applications/1',
  },
  { name: 'RoomDetailPage', htmlDesign: 'landlord-room-detail.html', reactRoute: '/landlord/rooms/1' },
  { name: 'MaintenancePage', htmlDesign: 'landlord-maintenance.html', reactRoute: '/landlord/maintenance' },
  { name: 'MessagesPage', htmlDesign: 'landlord-messages.html', reactRoute: '/landlord/messages' },
  { name: 'AnnouncementPage', htmlDesign: 'landlord-announcement.html', reactRoute: '/landlord/announcements' },
  { name: 'PayoutsPage', htmlDesign: 'landlord-payouts.html', reactRoute: '/landlord/payouts' },
  { name: 'PayoutSettingsPage', htmlDesign: 'landlord-payout-settings.html', reactRoute: '/landlord/payouts/settings' },
  { name: 'BillingSettingsPage', htmlDesign: 'landlord-billing-settings.html', reactRoute: '/landlord/billing' },
  { name: 'SettingsPage', htmlDesign: 'landlord-settings.html', reactRoute: '/landlord/settings' },
  { name: 'ProfilePage', htmlDesign: 'landlord-profile.html', reactRoute: '/landlord/profile' },
]

/**
 * Tenant dashboard pages - authenticated tenant/renter views
 * (Placeholder for future expansion)
 */
export const TENANT_PAGES = []

/**
 * Auth pages - login, signup, password reset, etc.
 * (Placeholder for future expansion)
 */
export const AUTH_PAGES = []

/**
 * All page mappings organized by type
 */
export const PAGE_MAPPINGS = {
  public: PUBLIC_PAGES,
  landlord: LANDLORD_PAGES,
  tenant: TENANT_PAGES,
  auth: AUTH_PAGES,
}

/**
 * Get page mappings for a specific page type
 * @param {string} pageType - 'public' | 'landlord' | 'tenant' | 'auth'
 * @returns {Array} Array of page mapping objects
 */
export function getPageMappings(pageType) {
  return PAGE_MAPPINGS[pageType] || []
}

/**
 * Get all page mappings across all types
 * @returns {Array} Flat array of all page mapping objects with pageType added
 */
export function getAllPageMappings() {
  const allMappings = []
  for (const [pageType, pages] of Object.entries(PAGE_MAPPINGS)) {
    for (const page of pages) {
      allMappings.push({ ...page, pageType })
    }
  }
  return allMappings
}

/**
 * Get page mappings for multiple types
 * @param {Array<string>} pageTypes - Array of page types to include
 * @returns {Array} Flat array of page mapping objects with pageType added
 */
export function getPageMappingsForTypes(pageTypes) {
  const mappings = []
  for (const pageType of pageTypes) {
    const pages = PAGE_MAPPINGS[pageType] || []
    for (const page of pages) {
      mappings.push({ ...page, pageType })
    }
  }
  return mappings
}

// Legacy export for backwards compatibility with existing tests
export { LANDLORD_PAGES as PAGE_MAPPINGS_LEGACY }

/**
 * Route path constants for the application
 * Centralizes all route definitions for easier maintenance
 */

export const ROUTES = {
  // Public pages
  HOME: '/',
  PRICING: '/pricing',
  FAQ: '/faq',
  HOW_IT_WORKS_LANDLORDS: '/how-it-works/landlords',
  HOW_IT_WORKS_RENTERS: '/how-it-works/renters',
  TRUST_SAFETY: '/trust-safety',
  PRIVACY: '/privacy',
  TERMS: '/terms',

  // Auth pages
  LOGIN: '/login',
  SIGNUP: '/signup',
  SIGNUP_FORM: '/signup/form',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',
  ONBOARDING_HOST: '/onboarding/host',
  ONBOARDING_RENTER: '/onboarding/renter',

  // Search & Listings
  SEARCH: '/search',
  ROOM_DETAILS: '/rooms/:id',

  // Landlord pages
  LANDLORD: {
    DASHBOARD: '/landlord/dashboard',
    PROPERTIES: '/landlord/properties',
    PROPERTY_DETAIL: '/landlord/properties/:id',
    PROPERTY_NEW: '/landlord/properties/new',
    ROOM_DETAIL: '/landlord/rooms/:id',
    ROOM_NEW: '/landlord/rooms/new',
    TENANTS: '/landlord/tenants',
    TENANT_DETAIL: '/landlord/tenants/:id',
    APPLICATIONS: '/landlord/applications',
    APPLICATION_DETAIL: '/landlord/applications/:id',
    MAINTENANCE: '/landlord/maintenance',
    MESSAGES: '/landlord/messages',
    PAYOUTS: '/landlord/payouts',
    PAYOUT_SETTINGS: '/landlord/payouts/settings',
    BILLING: '/landlord/billing',
    SETTINGS: '/landlord/settings',
    PROFILE: '/landlord/profile',
    ANNOUNCEMENTS: '/landlord/announcements',
  },

  // Renter pages
  RENTER: {
    DASHBOARD: '/renter/dashboard',
    APPLY: '/renter/apply/:roomId',
    PAYMENTS: '/renter/payments',
    MESSAGES: '/renter/messages',
    MAINTENANCE: '/renter/maintenance',
    PROFILE: '/renter/profile',
    SETTINGS: '/renter/settings',
  },

  // Shared pages
  NOTIFICATIONS: '/notifications',
  HELP: '/help',
  CONTACT: '/contact',

  // Error pages
  ERROR: '/error',
  MAINTENANCE: '/maintenance',
}

/**
 * Navigation links for the public navigation bar
 */
export const PUBLIC_NAV_LINKS = [
  { label: 'For Renters', href: ROUTES.HOW_IT_WORKS_RENTERS },
  { label: 'For Hosts', href: ROUTES.HOW_IT_WORKS_LANDLORDS },
  { label: 'Pricing', href: ROUTES.PRICING },
  { label: 'Trust & Safety', href: ROUTES.TRUST_SAFETY },
  { label: 'FAQ', href: ROUTES.FAQ },
]

/**
 * Footer link columns
 */
export const FOOTER_COLUMNS = [
  {
    title: 'RoomPilot',
    links: [
      { label: 'About Us', href: '#' },
      { label: 'Careers', href: '#' },
      { label: 'Press', href: '#' },
      { label: 'Blog', href: '#' },
    ],
  },
  {
    title: 'For Renters',
    links: [
      { label: 'How It Works', href: ROUTES.HOW_IT_WORKS_RENTERS },
      { label: 'Find a Room', href: ROUTES.SEARCH },
      { label: 'Trust & Safety', href: ROUTES.TRUST_SAFETY },
      { label: 'Renter Resources', href: '#' },
    ],
  },
  {
    title: 'For Hosts',
    links: [
      { label: 'Become a Host', href: ROUTES.HOW_IT_WORKS_LANDLORDS },
      { label: 'List Your Property', href: ROUTES.SIGNUP },
      { label: 'Pricing', href: ROUTES.PRICING },
      { label: 'Host Resources', href: '#' },
    ],
  },
  {
    title: 'Support',
    links: [
      { label: 'FAQ', href: ROUTES.FAQ },
      { label: 'Contact Us', href: ROUTES.CONTACT },
      { label: 'Terms of Service', href: ROUTES.TERMS },
      { label: 'Privacy Policy', href: ROUTES.PRIVACY },
    ],
  },
]

/**
 * Footer legal links
 */
export const FOOTER_LEGAL_LINKS = [
  { label: 'Privacy Policy', href: ROUTES.PRIVACY },
  { label: 'Terms of Service', href: ROUTES.TERMS },
]

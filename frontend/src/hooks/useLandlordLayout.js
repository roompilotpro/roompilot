import { useLocation } from 'react-router-dom'
import { ROUTES } from '../router/routes'

/**
 * Hook providing shared layout configuration for landlord pages
 * Includes navigation links, user data, and active route detection
 */
export function useLandlordLayout() {
  const location = useLocation()

  const navLinks = [
    {
      icon: '📊',
      label: 'Dashboard',
      href: ROUTES.LANDLORD.DASHBOARD,
    },
    {
      icon: '🏠',
      label: 'Properties',
      href: ROUTES.LANDLORD.PROPERTIES,
    },
    {
      icon: '👥',
      label: 'Tenants',
      href: ROUTES.LANDLORD.TENANTS,
    },
    {
      icon: '📝',
      label: 'Applications',
      href: ROUTES.LANDLORD.APPLICATIONS,
      badge: '2',
      badgeVariant: 'warning',
    },
    {
      icon: '🔧',
      label: 'Maintenance',
      href: ROUTES.LANDLORD.MAINTENANCE,
      badge: '1',
      badgeVariant: 'warning',
    },
    {
      icon: '💰',
      label: 'Finances',
      href: ROUTES.LANDLORD.PAYOUTS,
    },
    {
      icon: '💬',
      label: 'Inbox',
      href: ROUTES.LANDLORD.MESSAGES,
      badge: '3',
      badgeVariant: 'danger',
    },
    {
      icon: '⚙️',
      label: 'Settings',
      href: ROUTES.LANDLORD.SETTINGS,
    },
  ]

  // Mark active link based on current path
  const linksWithActive = navLinks.map((link) => ({
    ...link,
    active: location.pathname === link.href || location.pathname.startsWith(link.href + '/'),
  }))

  // Mock user data - in production this would come from auth context
  const user = {
    name: 'Marcus Johnson',
    email: 'marcus@email.com',
    avatarUrl: null,
  }

  return {
    navLinks: linksWithActive,
    user,
    logoBadge: 'Host',
  }
}

export default useLandlordLayout

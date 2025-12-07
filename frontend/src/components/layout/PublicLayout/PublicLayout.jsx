import { Outlet } from 'react-router-dom'
import { Link } from 'react-router-dom'
import PublicNavigation from '../PublicNavigation'
import Footer from '../Footer'
import { Button } from '../../primitives'
import {
  PUBLIC_NAV_LINKS,
  FOOTER_COLUMNS,
  FOOTER_LEGAL_LINKS,
  ROUTES,
} from '../../../router/routes'

/**
 * PublicLayout - Layout wrapper for public/marketing pages
 * Includes PublicNavigation header and Footer
 * Uses react-router Outlet for nested route content
 */
function PublicLayout() {
  // Convert nav links to use Link component
  const navLinks = PUBLIC_NAV_LINKS.map((link) => ({
    ...link,
    href: link.href,
  }))

  // Navigation action buttons
  const navActions = (
    <>
      <Link to={ROUTES.LOGIN}>
        <Button variant="secondary">Log In</Button>
      </Link>
      <Link to={ROUTES.SIGNUP}>
        <Button variant="primary">Sign Up</Button>
      </Link>
    </>
  )

  return (
    <div className="flex flex-col min-h-screen">
      <PublicNavigation links={navLinks} actions={navActions} variant="default" />

      <main className="flex-1">
        <Outlet />
      </main>

      <Footer columns={FOOTER_COLUMNS} legalLinks={FOOTER_LEGAL_LINKS} />
    </div>
  )
}

export default PublicLayout

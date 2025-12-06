import { Link } from 'react-router-dom'
import { Button } from '../../components/primitives'
import { ROUTES } from '../../router/routes'
import './ErrorPages.css'

/**
 * NotFoundPage - 404 error page
 * Displayed when a user navigates to a non-existent route
 */
function NotFoundPage() {
  return (
    <div className="error-page">
      <nav className="error-nav">
        <Link to={ROUTES.HOME} className="error-logo">
          <span className="error-logo-icon">R</span>
          RoomPilot
        </Link>
      </nav>

      <main className="error-main">
        <div className="error-container">
          <div className="error-illustration">&#128269;</div>
          <div className="error-number">404</div>
          <h1 className="error-heading">Oops! Page not found</h1>
          <p className="error-description">
            The page you're looking for doesn't exist or has been moved. Don't worry, we'll help you
            find your way back.
          </p>

          <div className="error-actions">
            <Link to={ROUTES.HOME}>
              <Button variant="primary" size="lg">
                Go Home
              </Button>
            </Link>
            <Link to={ROUTES.SEARCH}>
              <Button variant="outline" size="lg">
                Search Listings
              </Button>
            </Link>
          </div>

          <div className="error-help-box">
            <h3>Need Help?</h3>
            <ul className="error-help-links">
              <li>
                <span>&#128172;</span>
                <Link to={ROUTES.CONTACT}>Contact Support</Link>
              </li>
              <li>
                <span>&#128218;</span>
                <Link to={ROUTES.HELP}>Visit Help Center</Link>
              </li>
              <li>
                <span>&#10067;</span>
                <Link to={ROUTES.FAQ}>Browse FAQ</Link>
              </li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  )
}

export default NotFoundPage

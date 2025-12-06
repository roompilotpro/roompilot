import { Link } from 'react-router-dom'
import { Button } from '../../components/primitives'
import { ROUTES } from '../../router/routes'
import './ErrorPages.css'

/**
 * ServerErrorPage - 500 error page
 * Displayed when a server error occurs
 */
function ServerErrorPage() {
  const handleRefresh = () => {
    window.location.reload()
  }

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
          <div className="error-illustration">&#9888;&#65039;</div>
          <div className="error-number error-number--red">500</div>
          <h1 className="error-heading">Something went wrong</h1>
          <p className="error-description">
            We're experiencing technical difficulties. Our team has been notified and is working to
            fix the issue. Please try again in a few minutes.
          </p>

          <div className="error-actions">
            <Button variant="primary" size="lg" onClick={handleRefresh}>
              Try Again
            </Button>
            <Link to={ROUTES.HOME}>
              <Button variant="outline" size="lg">
                Go Home
              </Button>
            </Link>
          </div>

          <div className="error-help-box">
            <h3>Still having issues?</h3>
            <ul className="error-help-links">
              <li>
                <span>&#128172;</span>
                <Link to={ROUTES.CONTACT}>Contact Support</Link>
              </li>
              <li>
                <span>&#128231;</span>
                <a href="mailto:support@roompilot.com">Email us directly</a>
              </li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  )
}

export default ServerErrorPage

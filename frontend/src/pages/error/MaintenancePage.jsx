import { Link } from 'react-router-dom'
import { ROUTES } from '../../router/routes'
import './ErrorPages.css'

/**
 * MaintenancePage - Scheduled maintenance page
 * Displayed when the site is undergoing maintenance
 */
function MaintenancePage() {
  return (
    <div className="error-page error-page--maintenance">
      <nav className="error-nav">
        <Link to={ROUTES.HOME} className="error-logo">
          <span className="error-logo-icon">R</span>
          RoomPilot
        </Link>
      </nav>

      <main className="error-main">
        <div className="error-container">
          <div className="error-illustration">&#128736;&#65039;</div>
          <h1 className="error-heading">We'll be back soon!</h1>
          <p className="error-description">
            RoomPilot is currently undergoing scheduled maintenance to improve your experience. We
            apologize for any inconvenience.
          </p>

          <div className="maintenance-info">
            <div className="maintenance-item">
              <span className="maintenance-icon">&#128197;</span>
              <div>
                <strong>Expected Duration</strong>
                <p>2-4 hours</p>
              </div>
            </div>
            <div className="maintenance-item">
              <span className="maintenance-icon">&#9889;</span>
              <div>
                <strong>What's Happening</strong>
                <p>System upgrades and improvements</p>
              </div>
            </div>
          </div>

          <div className="error-help-box">
            <h3>Need urgent help?</h3>
            <ul className="error-help-links">
              <li>
                <span>&#128231;</span>
                <a href="mailto:support@roompilot.com">support@roompilot.com</a>
              </li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  )
}

export default MaintenancePage

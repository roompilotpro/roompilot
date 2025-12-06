import { Link } from 'react-router-dom'
import { classNames } from '../../../utils/classNames'
import { ROUTES } from '../../../router/routes'
import './AuthLayout.css'

/**
 * AuthLayout component - Layout wrapper for authentication pages
 *
 * @param {Object} props
 * @param {'split'|'centered'|'onboarding'} [props.variant='split'] - Layout variant
 * @param {React.ReactNode} props.children - Page content
 * @param {string} [props.panelIcon] - Emoji icon for split panel
 * @param {string} [props.panelTitle] - Title for split panel
 * @param {string} [props.panelDescription] - Description for split panel
 * @param {boolean} [props.showLogo=true] - Whether to show the logo
 * @param {string} [props.className] - Additional CSS classes
 */
function AuthLayout({
  variant = 'split',
  children,
  panelIcon = '🏠',
  panelTitle = 'Welcome back to RoomPilot',
  panelDescription = 'Your next perfect room is waiting. Sign in to continue your search or manage your listings.',
  showLogo = true,
  className,
}) {
  if (variant === 'onboarding') {
    return (
      <div className={classNames('auth-layout', 'auth-layout--onboarding', className)}>
        <header className="auth-layout__header">
          <div className="auth-layout__header-content">
            <Link to={ROUTES.HOME} className="auth-layout__logo">
              RoomPilot
            </Link>
          </div>
        </header>
        <main className="auth-layout__onboarding-content">{children}</main>
      </div>
    )
  }

  if (variant === 'centered') {
    return (
      <div className={classNames('auth-layout', 'auth-layout--centered', className)}>
        <div className="auth-layout__centered-container">
          {showLogo && (
            <Link to={ROUTES.HOME} className="auth-layout__logo auth-layout__logo--centered">
              RoomPilot
            </Link>
          )}
          {children}
        </div>
      </div>
    )
  }

  // Split layout (default)
  return (
    <div className={classNames('auth-layout', 'auth-layout--split', className)}>
      <div className="auth-layout__container">
        <div className="auth-layout__panel">
          <div className="auth-layout__panel-content">
            <span className="auth-layout__panel-icon">{panelIcon}</span>
            <h2 className="auth-layout__panel-title">{panelTitle}</h2>
            <p className="auth-layout__panel-description">{panelDescription}</p>
          </div>
        </div>
        <div className="auth-layout__form-section">
          {showLogo && (
            <Link to={ROUTES.HOME} className="auth-layout__logo auth-layout__logo--form">
              RoomPilot
            </Link>
          )}
          {children}
        </div>
      </div>
    </div>
  )
}

export default AuthLayout

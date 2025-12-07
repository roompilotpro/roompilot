import { Link } from 'react-router-dom'
import { classNames } from '../../../utils/classNames'
import { ROUTES } from '../../../router/routes'

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
  const logoClass = 'font-display text-[1.75rem] font-bold text-primary no-underline'

  if (variant === 'onboarding') {
    return (
      <div
        className={classNames(
          'font-body bg-gradient-to-br from-snow to-cloud min-h-screen text-midnight flex flex-col',
          className
        )}
      >
        <header className="bg-white py-6 px-8 sm:py-4 sm:px-4 shadow-[0_1px_3px_rgba(15,20,25,0.1)]">
          <div className="max-w-[800px] mx-auto flex justify-between items-center">
            <Link to={ROUTES.HOME} className={logoClass}>
              RoomPilot
            </Link>
          </div>
        </header>
        <main className="flex-1 max-w-[800px] mx-auto px-8 pb-12 sm:px-4 sm:pb-8 w-full">
          {children}
        </main>
      </div>
    )
  }

  if (variant === 'centered') {
    return (
      <div
        className={classNames(
          'font-body bg-gradient-to-br from-snow to-cloud min-h-screen text-midnight flex flex-col items-center justify-center p-8 sm:p-4',
          className
        )}
      >
        <div className="max-w-[480px] w-full">
          {showLogo && (
            <Link
              to={ROUTES.HOME}
              className={classNames(logoClass, 'block text-center text-[2rem] mb-8')}
            >
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
    <div
      className={classNames(
        'font-body bg-gradient-to-br from-snow to-cloud min-h-screen text-midnight flex items-center justify-center p-8 sm:p-4',
        className
      )}
    >
      <div className="grid grid-cols-2 md:grid-cols-1 max-w-[1100px] w-full bg-white rounded-[20px] overflow-hidden shadow-[0_20px_25px_-5px_rgba(15,20,25,0.1),0_10px_10px_-5px_rgba(15,20,25,0.04)]">
        <div className="bg-gradient-to-br from-primary to-primary-dark p-12 md:hidden flex flex-col justify-center items-center text-center text-white">
          <div className="max-w-[400px]">
            <span className="text-[4rem] mb-8 block">{panelIcon}</span>
            <h2 className="font-display text-[2rem] font-bold mb-4 leading-tight">{panelTitle}</h2>
            <p className="text-lg opacity-90 leading-relaxed m-0">{panelDescription}</p>
          </div>
        </div>
        <div className="p-12 md:p-10 sm:p-6 flex flex-col justify-center">
          {showLogo && (
            <Link to={ROUTES.HOME} className={classNames(logoClass, 'block text-center mb-8')}>
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

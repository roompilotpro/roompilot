import { forwardRef, useState, useCallback } from 'react'
import { classNames } from '../../../utils/classNames'
import Sidebar from '../Sidebar'
import Header from '../Header'
import './AppShell.css'

/**
 * AppShell - Main application layout with sidebar and header
 *
 * @param {Object} props
 * @param {Object} [props.sidebar] - Sidebar props (logo, logoText, links, user, etc.)
 * @param {Object} [props.header] - Header props (title, subtitle, actions, etc.)
 * @param {boolean} [props.sidebarCollapsed] - Controlled sidebar collapsed state
 * @param {Function} [props.onSidebarToggle] - Callback when sidebar toggle is clicked
 * @param {React.ReactNode} props.children - Main content
 * @param {string} [props.className] - Additional CSS classes
 */
const AppShell = forwardRef(function AppShell(
  {
    sidebar,
    header,
    sidebarCollapsed: controlledCollapsed,
    onSidebarToggle,
    children,
    className,
    ...props
  },
  ref
) {
  // Internal state for uncontrolled mode
  const [internalCollapsed, setInternalCollapsed] = useState(true)

  // Use controlled value if provided, otherwise internal state
  const isControlled = controlledCollapsed !== undefined
  const collapsed = isControlled ? controlledCollapsed : internalCollapsed

  const handleToggle = useCallback(() => {
    if (onSidebarToggle) {
      onSidebarToggle(!collapsed)
    }
    if (!isControlled) {
      setInternalCollapsed(!collapsed)
    }
  }, [collapsed, isControlled, onSidebarToggle])

  const handleClose = useCallback(() => {
    if (onSidebarToggle) {
      onSidebarToggle(true)
    }
    if (!isControlled) {
      setInternalCollapsed(true)
    }
  }, [isControlled, onSidebarToggle])

  return (
    <div ref={ref} className={classNames('app-shell', className)} {...props}>
      {/* Sidebar */}
      {sidebar && <Sidebar {...sidebar} collapsed={collapsed} onClose={handleClose} />}

      {/* Main content area */}
      <main className={classNames('app-shell__main', sidebar && 'app-shell__main--with-sidebar')}>
        {/* Header with hamburger toggle */}
        {header && (
          <Header
            {...header}
            leftContent={
              <div className="app-shell__header-left">
                {sidebar && (
                  <button
                    type="button"
                    className="app-shell__menu-btn"
                    onClick={handleToggle}
                    aria-label={collapsed ? 'Open menu' : 'Close menu'}
                    aria-expanded={!collapsed}
                  >
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <line x1="3" y1="12" x2="21" y2="12" />
                      <line x1="3" y1="6" x2="21" y2="6" />
                      <line x1="3" y1="18" x2="21" y2="18" />
                    </svg>
                  </button>
                )}
                {header.leftContent || (
                  <>
                    {header.title && <h1 className="header__title">{header.title}</h1>}
                    {header.subtitle && <span className="header__subtitle">{header.subtitle}</span>}
                  </>
                )}
              </div>
            }
          />
        )}

        {/* Page content */}
        <div className="app-shell__content">{children}</div>
      </main>
    </div>
  )
})

export default AppShell

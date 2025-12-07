import { forwardRef, useState, useCallback } from 'react'
import { classNames } from '../../../utils/classNames'
import Sidebar from '../Sidebar'
import Header from '../Header'

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
    <div ref={ref} className={classNames('flex min-h-screen bg-snow', className)} {...props}>
      {/* Sidebar */}
      {sidebar && <Sidebar {...sidebar} collapsed={collapsed} onClose={handleClose} />}

      {/* Main content area */}
      <main className={classNames('flex-1 flex flex-col min-h-screen', sidebar && 'lg:ml-[260px]')}>
        {/* Header with hamburger toggle */}
        {header && (
          <Header
            {...header}
            leftContent={
              <div className="flex items-center gap-4">
                {sidebar && (
                  <button
                    type="button"
                    className="hidden max-lg:flex items-center justify-center w-10 h-10 p-0 bg-transparent border-none rounded-md text-slate cursor-pointer transition-all duration-150 ease-out hover:bg-cloud hover:text-charcoal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
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
                    {header.title && (
                      <h1 className="font-display text-xl font-semibold text-midnight m-0">
                        {header.title}
                      </h1>
                    )}
                    {header.subtitle && (
                      <span className="text-sm text-mist">{header.subtitle}</span>
                    )}
                  </>
                )}
              </div>
            }
          />
        )}

        {/* Page content */}
        <div className="flex-1 md:p-0 p-4">{children}</div>
      </main>
    </div>
  )
})

export default AppShell

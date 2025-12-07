import { forwardRef } from 'react'
import { classNames } from '../../../utils/classNames'
import { Avatar, Badge } from '../../primitives'

// Badge variant styles for sidebar navigation
const badgeVariantStyles = {
  danger: '!bg-coral !text-white',
  warning: '!bg-warm !text-white',
}

/**
 * Sidebar - Main navigation sidebar for authenticated pages
 */
const Sidebar = forwardRef(function Sidebar(
  {
    logo = 'R',
    logoText = 'RoomPilot',
    logoBadge,
    links = [],
    user,
    collapsed = false,
    onClose,
    className,
    ...props
  },
  ref
) {
  return (
    <>
      {/* Overlay for mobile */}
      {!collapsed && (
        <div
          className="hidden max-lg:block fixed inset-0 bg-black/50 z-[99]"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        ref={ref}
        className={classNames(
          'fixed top-0 left-0 w-[260px] h-screen bg-white border-r border-cloud flex flex-col z-[100] transition-transform duration-200 ease-out',
          // Mobile: hidden by default (collapsed), shown when not collapsed
          'max-lg:-translate-x-full',
          !collapsed && 'max-lg:translate-x-0',
          // Desktop: always visible
          'lg:translate-x-0',
          className
        )}
        {...props}
      >
        {/* Logo */}
        <div className="py-5 px-6 border-b border-cloud">
          <a href="/" className="flex items-center gap-2.5 no-underline">
            <div className="w-9 h-9 bg-gradient-to-br from-primary to-primary-dark text-white rounded-[10px] flex items-center justify-center text-lg font-bold shadow-[0_2px_8px_rgba(37,99,235,0.3)]">
              {logo}
            </div>
            <span className="font-display text-xl font-semibold text-midnight">{logoText}</span>
            {logoBadge && (
              <Badge
                variant="primary"
                size="sm"
                className="!text-[10px] !font-bold !text-primary !bg-primary-bg !px-1.5 !py-0.5 !rounded ml-1 uppercase tracking-wide"
              >
                {logoBadge}
              </Badge>
            )}
          </a>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4 px-3 overflow-y-auto flex flex-col gap-1">
          {links.map((link, index) => (
            <a
              key={link.href || index}
              href={link.href}
              className={classNames(
                'flex items-center gap-3 p-3 rounded-md no-underline text-sm font-medium transition-all duration-150 ease-out',
                link.active
                  ? 'bg-primary-bg text-primary hover:bg-primary-bg'
                  : 'text-slate hover:bg-snow hover:text-charcoal'
              )}
              aria-current={link.active ? 'page' : undefined}
            >
              {link.icon && (
                <span
                  className="shrink-0 w-5 h-5 flex items-center justify-center text-lg"
                  aria-hidden="true"
                >
                  {link.icon}
                </span>
              )}
              <span className="flex-1">{link.label}</span>
              {link.badge !== undefined && (
                <Badge
                  variant={link.badgeVariant || 'danger'}
                  size="sm"
                  className={classNames(
                    'ml-auto !min-w-[20px] !h-5 !px-1.5 !rounded-full !text-[11px] !font-bold flex items-center justify-center',
                    badgeVariantStyles[link.badgeVariant || 'danger']
                  )}
                >
                  {link.badge}
                </Badge>
              )}
            </a>
          ))}
        </nav>

        {/* User Profile */}
        {user && (
          <div className="p-4 border-t border-cloud">
            <div className="flex items-center gap-3 p-3 rounded-md cursor-pointer transition-colors duration-150 ease-out hover:bg-snow">
              <Avatar src={user.avatarUrl} name={user.name} size="md" className="shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold text-charcoal truncate">{user.name}</div>
                <div className="text-xs text-mist truncate">{user.email}</div>
              </div>
            </div>
          </div>
        )}
      </aside>
    </>
  )
})

export default Sidebar

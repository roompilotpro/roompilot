import { forwardRef } from 'react'
import { classNames } from '../../../utils/classNames'
import { Avatar, Badge } from '../../primitives'
import './Sidebar.css'

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
      {!collapsed && <div className="sidebar__overlay" onClick={onClose} aria-hidden="true" />}

      <aside
        ref={ref}
        className={classNames('sidebar', collapsed && 'sidebar--collapsed', className)}
        {...props}
      >
        {/* Logo */}
        <div className="sidebar__header">
          <a href="/" className="sidebar__logo">
            <div className="sidebar__logo-icon">{logo}</div>
            <span className="sidebar__logo-text">{logoText}</span>
            {logoBadge && (
              <Badge variant="primary" size="sm" className="sidebar__logo-badge">
                {logoBadge}
              </Badge>
            )}
          </a>
        </div>

        {/* Navigation */}
        <nav className="sidebar__nav">
          {links.map((link, index) => (
            <a
              key={link.href || index}
              href={link.href}
              className={classNames('sidebar__link', link.active && 'sidebar__link--active')}
              aria-current={link.active ? 'page' : undefined}
            >
              {link.icon && (
                <span className="sidebar__link-icon" aria-hidden="true">
                  {link.icon}
                </span>
              )}
              <span className="sidebar__link-label">{link.label}</span>
              {link.badge !== undefined && (
                <Badge
                  variant={link.badgeVariant || 'danger'}
                  size="sm"
                  className="sidebar__link-badge"
                >
                  {link.badge}
                </Badge>
              )}
            </a>
          ))}
        </nav>

        {/* User Profile */}
        {user && (
          <div className="sidebar__footer">
            <div className="sidebar__user">
              <Avatar
                src={user.avatarUrl}
                name={user.name}
                size="md"
                className="sidebar__user-avatar"
              />
              <div className="sidebar__user-info">
                <div className="sidebar__user-name">{user.name}</div>
                <div className="sidebar__user-email">{user.email}</div>
              </div>
            </div>
          </div>
        )}
      </aside>
    </>
  )
})

export default Sidebar

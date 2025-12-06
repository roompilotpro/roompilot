import { forwardRef, useId } from 'react'
import classNames from '../../../utils/classNames'
import './Tabs.css'

/**
 * Tabs - Horizontal tab navigation component
 *
 * @param {Array} tabs - Array of tab objects { id, label, icon?, badge?, disabled? }
 * @param {string} activeTab - ID of the currently active tab
 * @param {Function} onChange - Callback when tab changes, receives tab id
 * @param {string} [variant='underline'] - Visual style: 'underline' | 'pills' | 'default'
 * @param {string} [size='md'] - Tab size: 'sm' | 'md' | 'lg'
 * @param {boolean} [fullWidth=false] - Stretch tabs to fill container
 * @param {string} [className] - Additional CSS classes
 */
const Tabs = forwardRef(function Tabs(
  {
    tabs = [],
    activeTab,
    onChange,
    variant = 'underline',
    size = 'md',
    fullWidth = false,
    className,
    ...props
  },
  ref
) {
  const baseId = useId()

  const handleTabClick = (tabId, disabled) => {
    if (!disabled) {
      onChange?.(tabId)
    }
  }

  const handleKeyDown = (e, index) => {
    const enabledTabs = tabs.filter((t) => !t.disabled)
    const currentIndex = enabledTabs.findIndex((t) => t.id === tabs[index].id)

    let newIndex = currentIndex
    if (e.key === 'ArrowRight') {
      newIndex = (currentIndex + 1) % enabledTabs.length
    } else if (e.key === 'ArrowLeft') {
      newIndex = (currentIndex - 1 + enabledTabs.length) % enabledTabs.length
    } else if (e.key === 'Home') {
      newIndex = 0
    } else if (e.key === 'End') {
      newIndex = enabledTabs.length - 1
    } else {
      return
    }

    e.preventDefault()
    const newTab = enabledTabs[newIndex]
    onChange?.(newTab.id)

    // Focus the new tab
    const tabElement = document.getElementById(`${baseId}-tab-${newTab.id}`)
    tabElement?.focus()
  }

  return (
    <div
      ref={ref}
      className={classNames(
        'tabs',
        `tabs--${variant}`,
        `tabs--${size}`,
        fullWidth && 'tabs--full-width',
        className
      )}
      role="tablist"
      aria-orientation="horizontal"
      {...props}
    >
      {tabs.map((tab, index) => {
        const isActive = tab.id === activeTab
        const isDisabled = tab.disabled

        return (
          <button
            key={tab.id}
            id={`${baseId}-tab-${tab.id}`}
            type="button"
            role="tab"
            aria-selected={isActive}
            aria-controls={`${baseId}-panel-${tab.id}`}
            aria-disabled={isDisabled}
            tabIndex={isActive ? 0 : -1}
            className={classNames(
              'tabs__tab',
              isActive && 'tabs__tab--active',
              isDisabled && 'tabs__tab--disabled'
            )}
            onClick={() => handleTabClick(tab.id, isDisabled)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            disabled={isDisabled}
          >
            {tab.icon && (
              <span className="tabs__tab-icon" aria-hidden="true">
                {tab.icon}
              </span>
            )}
            <span className="tabs__tab-label">{tab.label}</span>
            {tab.badge !== undefined && <span className="tabs__tab-badge">{tab.badge}</span>}
          </button>
        )
      })}
    </div>
  )
})

export default Tabs

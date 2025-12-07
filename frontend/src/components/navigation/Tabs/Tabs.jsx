import { forwardRef, useId } from 'react'
import classNames from '../../../utils/classNames'

// Variant styles
const variantStyles = {
  underline: {
    container: 'border-b-2 border-cloud gap-1',
    tab: 'py-3 px-4 text-slate border-b-[3px] border-transparent -mb-0.5 hover:not-disabled:text-charcoal/80',
    active: 'text-primary border-b-primary',
  },
  pills: {
    container: 'bg-cloud p-1 rounded-md gap-1',
    tab: 'py-2 px-4 text-slate rounded-sm hover:not-disabled:not-active:text-charcoal/80',
    active: 'bg-white text-charcoal shadow-sm',
  },
  default: {
    container: 'gap-1',
    tab: 'py-2 px-4 text-slate rounded-md hover:not-disabled:not-active:bg-cloud hover:not-disabled:not-active:text-charcoal/80',
    active: 'bg-primary-bg text-primary/80',
  },
}

// Size styles
const sizeStyles = {
  sm: {
    tab: 'text-xs',
    padUnder: 'py-2 px-3',
    padOther: 'py-1.5 px-3',
    badge: 'min-w-4 h-4 text-[10px]',
  },
  md: { tab: 'text-sm', padUnder: '', padOther: '', badge: 'min-w-[18px] h-[18px] text-[11px]' },
  lg: {
    tab: 'text-base',
    padUnder: 'py-4 px-6',
    padOther: 'py-3 px-5',
    badge: 'min-w-5 h-5 text-xs',
  },
}

/**
 * Tabs - Horizontal tab navigation component
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
  const vStyles = variantStyles[variant]
  const sStyles = sizeStyles[size]

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

    const tabElement = document.getElementById(`${baseId}-tab-${newTab.id}`)
    tabElement?.focus()
  }

  return (
    <div
      ref={ref}
      className={classNames(
        'flex gap-2',
        vStyles.container,
        fullWidth && 'w-full [&>button]:flex-1 [&>button]:justify-center',
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
              'inline-flex items-center gap-2 bg-transparent border-none font-semibold cursor-pointer transition-all duration-150 whitespace-nowrap focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2',
              sStyles.tab,
              variant === 'underline' && sStyles.padUnder,
              variant !== 'underline' && sStyles.padOther,
              vStyles.tab,
              isActive && vStyles.active,
              isDisabled && 'opacity-50 cursor-not-allowed'
            )}
            onClick={() => handleTabClick(tab.id, isDisabled)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            disabled={isDisabled}
          >
            {tab.icon && (
              <span className="text-[1em] leading-none" aria-hidden="true">
                {tab.icon}
              </span>
            )}
            <span className="leading-tight">{tab.label}</span>
            {tab.badge !== undefined && (
              <span
                className={classNames(
                  'inline-flex items-center justify-center px-1.5 font-semibold leading-none rounded-full',
                  sStyles.badge,
                  isActive ? 'bg-primary-bg text-primary/80' : 'bg-cloud text-charcoal/80'
                )}
              >
                {tab.badge}
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
})

export default Tabs

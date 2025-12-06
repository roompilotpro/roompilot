import { useEffect, useRef } from 'react'

/**
 * Hook to trap focus within an element for accessibility
 * Used for modals, sidebars, and other overlay components
 *
 * @param {boolean} isActive - Whether the focus trap is active
 * @returns {React.RefObject} - Ref to attach to the container element
 */
export function useFocusTrap(isActive = true) {
  const containerRef = useRef(null)
  const previousActiveElement = useRef(null)

  useEffect(() => {
    if (!isActive || !containerRef.current) return

    // Store the currently focused element to restore later
    previousActiveElement.current = document.activeElement

    // Get all focusable elements within the container
    const getFocusableElements = () => {
      const focusableSelectors = [
        'button:not([disabled])',
        'a[href]',
        'input:not([disabled])',
        'select:not([disabled])',
        'textarea:not([disabled])',
        '[tabindex]:not([tabindex="-1"])',
      ].join(', ')

      return containerRef.current?.querySelectorAll(focusableSelectors) || []
    }

    // Focus the first focusable element
    const focusableElements = getFocusableElements()
    if (focusableElements.length > 0) {
      focusableElements[0].focus()
    }

    // Handle Tab key to trap focus
    const handleKeyDown = (event) => {
      if (event.key !== 'Tab') return

      const focusableElements = getFocusableElements()
      if (focusableElements.length === 0) return

      const firstElement = focusableElements[0]
      const lastElement = focusableElements[focusableElements.length - 1]

      // Shift + Tab on first element -> go to last
      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault()
        lastElement.focus()
      }
      // Tab on last element -> go to first
      else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault()
        firstElement.focus()
      }
    }

    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)

      // Restore focus to the previously focused element
      if (previousActiveElement.current && previousActiveElement.current.focus) {
        previousActiveElement.current.focus()
      }
    }
  }, [isActive])

  return containerRef
}

export default useFocusTrap

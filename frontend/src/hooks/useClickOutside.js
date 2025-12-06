import { useEffect, useRef } from 'react'

/**
 * Hook that detects clicks outside of the specified element
 *
 * @param {Function} handler - Callback function to run when clicking outside
 * @param {boolean} [enabled=true] - Whether the listener is active
 * @returns {React.RefObject} Ref to attach to the element
 *
 * @example
 * const ref = useClickOutside(() => setIsOpen(false))
 * return <div ref={ref}>...</div>
 */
export function useClickOutside(handler, enabled = true) {
  const ref = useRef(null)

  useEffect(() => {
    if (!enabled) return

    const listener = (event) => {
      const el = ref.current
      if (!el || el.contains(event.target)) {
        return
      }
      handler(event)
    }

    document.addEventListener('mousedown', listener)
    document.addEventListener('touchstart', listener)

    return () => {
      document.removeEventListener('mousedown', listener)
      document.removeEventListener('touchstart', listener)
    }
  }, [handler, enabled])

  return ref
}

export default useClickOutside

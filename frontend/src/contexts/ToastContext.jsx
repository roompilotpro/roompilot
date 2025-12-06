/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useCallback, useRef } from 'react'

const ToastContext = createContext(null)

/**
 * Toast Provider - Provides toast notification functionality to the app
 *
 * @example
 * <ToastProvider>
 *   <App />
 * </ToastProvider>
 *
 * // In a component:
 * const { showToast } = useToast()
 * showToast({ message: 'Success!', type: 'success' })
 */
export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])
  const toastIdCounter = useRef(0)

  const hideToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }, [])

  const showToast = useCallback(
    ({ message, type = 'info', duration = 3000, dismissible = true }) => {
      const id = `toast-${Date.now()}-${toastIdCounter.current++}`

      setToasts((prev) => [...prev, { id, message, type, dismissible }])

      if (duration > 0) {
        setTimeout(() => {
          hideToast(id)
        }, duration)
      }

      return id
    },
    [hideToast]
  )

  const clearToasts = useCallback(() => {
    setToasts([])
  }, [])

  return (
    <ToastContext.Provider value={{ toasts, showToast, hideToast, clearToasts }}>
      {children}
    </ToastContext.Provider>
  )
}

/**
 * Hook to access toast functionality
 *
 * @returns {{ toasts: Array, showToast: Function, hideToast: Function, clearToasts: Function }}
 *
 * @example
 * const { showToast } = useToast()
 * showToast({ message: 'Saved!', type: 'success' })
 */
export function useToast() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return context
}

export default ToastContext

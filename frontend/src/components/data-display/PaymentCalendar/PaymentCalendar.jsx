import { forwardRef, useMemo } from 'react'
import classNames from '../../../utils/classNames'

// Status styles
const statusStyles = {
  paid: 'bg-accent-bg text-accent',
  due: 'bg-primary-bg border-primary text-primary font-bold',
  pending: 'bg-primary-bg border-primary text-primary font-bold',
  overdue: 'bg-coral-bg border-coral text-coral font-bold',
}

/**
 * PaymentCalendar - Calendar view showing payment schedule
 *
 * @param {number} [year] - Year to display (defaults to current year)
 * @param {number} [month] - Month to display 0-11 (defaults to current month)
 * @param {Array} [payments] - Array of payment objects { date: Date|string, amount, status }
 * @param {Function} [onDateClick] - Callback when a date is clicked
 * @param {Function} [formatAmount] - Custom amount formatter
 * @param {string} [className] - Additional CSS classes
 */
const PaymentCalendar = forwardRef(function PaymentCalendar(
  {
    year,
    month,
    payments = [],
    onDateClick,
    formatAmount = (amount) => `$${amount}`,
    className,
    ...props
  },
  ref
) {
  // Default to current date if not specified
  const today = new Date()
  const displayYear = year ?? today.getFullYear()
  const displayMonth = month ?? today.getMonth()

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  // Generate calendar data
  const calendarData = useMemo(() => {
    const firstDay = new Date(displayYear, displayMonth, 1)
    const lastDay = new Date(displayYear, displayMonth + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startDayOfWeek = firstDay.getDay()

    // Create payment lookup map by date string (YYYY-MM-DD)
    const paymentMap = new Map()
    payments.forEach((payment) => {
      const date = payment.date instanceof Date ? payment.date : new Date(payment.date)
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
      paymentMap.set(key, payment)
    })

    const days = []

    // Empty cells before first day
    for (let i = 0; i < startDayOfWeek; i++) {
      days.push({ day: null, payment: null })
    }

    // Days of month
    for (let day = 1; day <= daysInMonth; day++) {
      const dateKey = `${displayYear}-${String(displayMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
      days.push({
        day,
        date: new Date(displayYear, displayMonth, day),
        payment: paymentMap.get(dateKey) || null,
      })
    }

    return days
  }, [displayYear, displayMonth, payments])

  // Format month name
  const monthName = new Date(displayYear, displayMonth).toLocaleString('en-US', {
    month: 'long',
    year: 'numeric',
  })

  const handleDateClick = (dayData) => {
    if (dayData.day && onDateClick) {
      onDateClick(dayData.date, dayData.payment)
    }
  }

  const getStatusStyles = (payment) => {
    if (!payment) return ''
    return statusStyles[payment.status] || ''
  }

  return (
    <div ref={ref} className={classNames('flex flex-col gap-4', className)} {...props}>
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-charcoal m-0">{monthName}</h3>
      </div>

      <div
        className="grid grid-cols-7 gap-2 sm:gap-1"
        role="grid"
        aria-label={`Payment calendar for ${monthName}`}
      >
        {/* Day name headers */}
        {dayNames.map((name) => (
          <div
            key={name}
            className="text-center bg-transparent text-xs sm:text-[10px] font-semibold text-slate uppercase tracking-wide p-2 sm:p-1"
            role="columnheader"
          >
            {name}
          </div>
        ))}

        {/* Calendar days */}
        {calendarData.map((dayData, index) => {
          if (dayData.day === null) {
            return (
              <div
                key={`empty-${index}`}
                className="aspect-square bg-transparent"
                role="gridcell"
              />
            )
          }

          const isToday =
            dayData.date.getDate() === today.getDate() &&
            dayData.date.getMonth() === today.getMonth() &&
            dayData.date.getFullYear() === today.getFullYear()

          const isPaid = dayData.payment?.status === 'paid'

          return (
            <button
              key={dayData.day}
              type="button"
              className={classNames(
                'aspect-square flex flex-col items-center justify-center bg-snow rounded-md text-sm sm:text-xs font-medium text-slate relative border-2 border-transparent p-0 cursor-default',
                getStatusStyles(dayData.payment),
                isToday && 'bg-cloud font-bold text-charcoal',
                onDateClick &&
                  'cursor-pointer transition-all duration-150 enabled:hover:bg-cloud enabled:hover:scale-105 focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2'
              )}
              onClick={() => handleDateClick(dayData)}
              disabled={!onDateClick}
              role="gridcell"
              aria-label={`${dayData.day}${dayData.payment ? `, ${dayData.payment.status}: ${formatAmount(dayData.payment.amount)}` : ''}`}
            >
              <span className="relative z-[1]">{dayData.day}</span>
              {dayData.payment && (
                <span
                  className="absolute bottom-1 w-1 h-1 rounded-full bg-current"
                  aria-hidden="true"
                />
              )}
              {isPaid && <span className="absolute top-0.5 right-1 text-xs text-accent">✓</span>}
            </button>
          )
        })}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 sm:gap-3 justify-center pt-2 border-t border-cloud">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-accent" />
          <span className="text-xs text-slate">Paid</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-primary" />
          <span className="text-xs text-slate">Due</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-coral" />
          <span className="text-xs text-slate">Overdue</span>
        </div>
      </div>
    </div>
  )
})

export default PaymentCalendar

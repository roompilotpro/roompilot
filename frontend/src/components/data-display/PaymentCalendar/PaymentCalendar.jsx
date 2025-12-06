import { forwardRef, useMemo } from 'react'
import classNames from '../../../utils/classNames'
import './PaymentCalendar.css'

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

  const getStatusClass = (payment) => {
    if (!payment) return ''
    switch (payment.status) {
      case 'paid':
        return 'payment-calendar__day--paid'
      case 'due':
      case 'pending':
        return 'payment-calendar__day--due'
      case 'overdue':
        return 'payment-calendar__day--overdue'
      default:
        return ''
    }
  }

  return (
    <div ref={ref} className={classNames('payment-calendar', className)} {...props}>
      <div className="payment-calendar__header">
        <h3 className="payment-calendar__title">{monthName}</h3>
      </div>

      <div
        className="payment-calendar__grid"
        role="grid"
        aria-label={`Payment calendar for ${monthName}`}
      >
        {/* Day name headers */}
        {dayNames.map((name) => (
          <div
            key={name}
            className="payment-calendar__day payment-calendar__day--header"
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
                className="payment-calendar__day payment-calendar__day--empty"
                role="gridcell"
              />
            )
          }

          const isToday =
            dayData.date.getDate() === today.getDate() &&
            dayData.date.getMonth() === today.getMonth() &&
            dayData.date.getFullYear() === today.getFullYear()

          return (
            <button
              key={dayData.day}
              type="button"
              className={classNames(
                'payment-calendar__day',
                getStatusClass(dayData.payment),
                isToday && 'payment-calendar__day--today',
                onDateClick && 'payment-calendar__day--clickable'
              )}
              onClick={() => handleDateClick(dayData)}
              disabled={!onDateClick}
              role="gridcell"
              aria-label={`${dayData.day}${dayData.payment ? `, ${dayData.payment.status}: ${formatAmount(dayData.payment.amount)}` : ''}`}
            >
              <span className="payment-calendar__day-number">{dayData.day}</span>
              {dayData.payment && (
                <span className="payment-calendar__indicator" aria-hidden="true" />
              )}
            </button>
          )
        })}
      </div>

      {/* Legend */}
      <div className="payment-calendar__legend">
        <div className="payment-calendar__legend-item">
          <span className="payment-calendar__legend-dot payment-calendar__legend-dot--paid" />
          <span className="payment-calendar__legend-label">Paid</span>
        </div>
        <div className="payment-calendar__legend-item">
          <span className="payment-calendar__legend-dot payment-calendar__legend-dot--due" />
          <span className="payment-calendar__legend-label">Due</span>
        </div>
        <div className="payment-calendar__legend-item">
          <span className="payment-calendar__legend-dot payment-calendar__legend-dot--overdue" />
          <span className="payment-calendar__legend-label">Overdue</span>
        </div>
      </div>
    </div>
  )
})

export default PaymentCalendar

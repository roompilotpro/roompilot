import { useState } from 'react'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { classNames } from '../../utils/classNames'

/**
 * Custom tooltip component matching the design system
 */
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-charcoal text-white py-2 px-3 rounded-lg shadow-lg">
        <p className="text-xs text-white/70 mb-0.5">{label}</p>
        <p className="font-display text-lg font-bold">${payload[0].value.toLocaleString()}</p>
      </div>
    )
  }
  return null
}

/**
 * Custom dot component for data points
 */
const CustomDot = ({ cx, cy, index, dataLength }) => {
  const isLast = index === dataLength - 1
  return (
    <circle
      cx={cx}
      cy={cy}
      r={isLast ? 6 : 4}
      fill={isLast ? '#10b981' : '#2563eb'}
      stroke="white"
      strokeWidth={2}
      className="drop-shadow-sm"
    />
  )
}

/**
 * Custom active dot for hover state
 */
const CustomActiveDot = ({ cx, cy, index, dataLength }) => {
  const isLast = index === dataLength - 1
  return (
    <g>
      {/* Outer glow */}
      <circle cx={cx} cy={cy} r={12} fill={isLast ? '#10b981' : '#2563eb'} opacity={0.2} />
      {/* Main dot */}
      <circle
        cx={cx}
        cy={cy}
        r={6}
        fill={isLast ? '#10b981' : '#2563eb'}
        stroke="white"
        strokeWidth={2}
        className="drop-shadow-md"
      />
    </g>
  )
}

/**
 * RevenueChart - Premium area chart for revenue overview
 *
 * @param {Object} props
 * @param {Array} props.data - Revenue data array [{month: string, amount: number}]
 * @param {string} [props.period='month'] - Selected period (week/month/year)
 * @param {Function} [props.onPeriodChange] - Callback when period changes
 * @param {string} [props.totalLabel='December total'] - Label for total display
 * @param {string} [props.className] - Additional CSS classes
 */
const RevenueChart = ({
  data = [],
  period = 'month',
  onPeriodChange,
  totalLabel = 'December total',
  className,
}) => {
  const [activePeriod, setActivePeriod] = useState(period)

  const handlePeriodChange = (newPeriod) => {
    setActivePeriod(newPeriod)
    onPeriodChange?.(newPeriod)
  }

  // Get the last value for current period highlight
  const currentValue = data[data.length - 1]?.amount ?? 0

  // Calculate Y-axis domain to show meaningful variation
  // Instead of starting at 0, we zoom in on the actual data range
  const amounts = data.map((d) => d.amount)
  const minValue = Math.min(...amounts)
  const maxValue = Math.max(...amounts)
  const range = maxValue - minValue

  // Add 20% padding below min and 10% above max for visual breathing room
  // Round to nice values (nearest 500)
  const yMin = Math.floor((minValue - range * 0.5) / 500) * 500
  const yMax = Math.ceil((maxValue + range * 0.3) / 500) * 500

  // Ensure we don't go below 0
  const yDomain = [Math.max(0, yMin), yMax]

  return (
    <div className={classNames('w-full', className)}>
      {/* Header with period selector and total */}
      <div className="flex items-center justify-between mb-6">
        {/* Period selector */}
        <div className="flex gap-1 bg-snow p-1 rounded-lg">
          {['week', 'month', 'year'].map((p) => (
            <button
              key={p}
              className={classNames(
                'py-2 px-4 rounded-md text-[13px] font-medium border-none cursor-pointer transition-all duration-200',
                activePeriod === p
                  ? 'bg-white text-charcoal shadow-sm'
                  : 'bg-transparent text-slate hover:text-charcoal'
              )}
              onClick={() => handlePeriodChange(p)}
            >
              {p.charAt(0).toUpperCase() + p.slice(1)}
            </button>
          ))}
        </div>

        {/* Total display */}
        <div className="text-right">
          <div className="text-xs text-slate mb-0.5">{totalLabel}</div>
          <div className="font-display text-2xl font-bold text-midnight">
            ${currentValue.toLocaleString()}
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="h-[180px] md:h-[220px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            {/* Gradient definitions */}
            <defs>
              <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#2563eb" stopOpacity={0.3} />
                <stop offset="50%" stopColor="#2563eb" stopOpacity={0.1} />
                <stop offset="100%" stopColor="#2563eb" stopOpacity={0.02} />
              </linearGradient>
              <linearGradient id="revenueStroke" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#2563eb" />
                <stop offset="100%" stopColor="#10b981" />
              </linearGradient>
            </defs>

            {/* Grid */}
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e8eaed" />

            {/* X Axis */}
            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#3d4f5f', fontSize: 12, fontWeight: 500 }}
              dy={10}
            />

            {/* Y Axis */}
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#94a3b8', fontSize: 11 }}
              tickFormatter={(value) => `$${(value / 1000).toFixed(1)}k`}
              domain={yDomain}
              width={50}
            />

            {/* Tooltip */}
            <Tooltip
              content={<CustomTooltip />}
              cursor={{
                stroke: '#2563eb',
                strokeWidth: 1,
                strokeDasharray: '4 4',
              }}
            />

            {/* Area */}
            <Area
              type="monotone"
              dataKey="amount"
              stroke="url(#revenueStroke)"
              strokeWidth={3}
              fill="url(#revenueGradient)"
              animationDuration={800}
              animationEasing="ease-out"
              dot={(props) => <CustomDot {...props} dataLength={data.length} />}
              activeDot={(props) => <CustomActiveDot {...props} dataLength={data.length} />}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Bottom stats row */}
      <div className="flex items-center justify-between mt-4 pt-4 border-t border-cloud">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-primary" />
          <span className="text-xs text-slate">Revenue trend</span>
        </div>
        <div className="flex items-center gap-1.5">
          <svg
            className="w-4 h-4 text-accent"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
            />
          </svg>
          <span className="text-xs font-semibold text-accent">+12% vs last period</span>
        </div>
      </div>
    </div>
  )
}

export default RevenueChart

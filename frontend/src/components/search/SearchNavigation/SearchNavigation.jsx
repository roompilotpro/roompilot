import { forwardRef } from 'react'
import { Link } from 'react-router-dom'
import { classNames } from '../../../utils/classNames'
import { Button } from '../../primitives'
import SearchBar from '../SearchBar'
import { ROUTES } from '../../../router/routes'

/**
 * SearchNavigation - Fixed navigation bar for the search page
 * Contains logo, search bar, and action buttons
 */
const SearchNavigation = forwardRef(function SearchNavigation(
  { location, date, onLocationChange, onDateChange, onSearch, className, ...props },
  ref
) {
  return (
    <nav
      ref={ref}
      className={classNames(
        'fixed top-0 left-0 right-0 z-50 h-[72px] px-6 md:px-4 flex items-center justify-between bg-white border-b border-cloud',
        className
      )}
      {...props}
    >
      <div className="flex items-center gap-8 md:gap-4 md:flex-1">
        <Link to={ROUTES.HOME} className="flex items-center gap-2.5 no-underline">
          <div className="w-9 h-9 bg-gradient-to-br from-primary to-primary-dark rounded-[10px] flex items-center justify-center text-white font-bold text-lg shadow-[0_2px_8px_rgba(37,99,235,0.3)]">
            R
          </div>
          <span className="font-display text-[22px] font-semibold text-midnight tracking-[-0.02em] md:hidden">
            RoomPilot
          </span>
        </Link>

        <SearchBar
          location={location}
          date={date}
          onLocationChange={onLocationChange}
          onDateChange={onDateChange}
          onSearch={onSearch}
          className="md:flex-1"
        />
      </div>

      <div className="flex items-center gap-2 md:gap-1">
        <Link
          to={ROUTES.SIGNUP}
          className="py-2.5 px-4 text-sm font-medium text-slate no-underline rounded-md transition-all duration-200 hover:bg-snow hover:text-charcoal lg:hidden"
        >
          List Your Property
        </Link>
        <Button as={Link} to={ROUTES.LOGIN} variant="ghost" size="sm">
          Log In
        </Button>
        <Button as={Link} to={ROUTES.SIGNUP} variant="primary" size="sm">
          Sign Up
        </Button>
      </div>
    </nav>
  )
})

export default SearchNavigation

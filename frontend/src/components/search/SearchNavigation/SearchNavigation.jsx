import { forwardRef } from 'react'
import { Link } from 'react-router-dom'
import { classNames } from '../../../utils/classNames'
import { Button } from '../../primitives'
import SearchBar from '../SearchBar'
import { ROUTES } from '../../../router/routes'
import './SearchNavigation.css'

/**
 * SearchNavigation - Fixed navigation bar for the search page
 * Contains logo, search bar, and action buttons
 */
const SearchNavigation = forwardRef(function SearchNavigation(
  { location, date, onLocationChange, onDateChange, onSearch, className, ...props },
  ref
) {
  return (
    <nav ref={ref} className={classNames('search-nav', className)} {...props}>
      <div className="search-nav__left">
        <Link to={ROUTES.HOME} className="search-nav__logo">
          <div className="search-nav__logo-icon">R</div>
          <span className="search-nav__logo-text">RoomPilot</span>
        </Link>

        <SearchBar
          location={location}
          date={date}
          onLocationChange={onLocationChange}
          onDateChange={onDateChange}
          onSearch={onSearch}
          className="search-nav__search-bar"
        />
      </div>

      <div className="search-nav__right">
        <Link to={ROUTES.SIGNUP} className="search-nav__link">
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

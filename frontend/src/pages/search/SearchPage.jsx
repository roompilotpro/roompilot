import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSearchFilters } from '../../hooks'
import { ROUTES } from '../../router/routes'
import { SearchNavigation, ListingsPanel, MapPanel, FilterDropdown } from '../../components/search'
import { FilterChip } from '../../components/navigation'

// Mock data for listings
const MOCK_LISTINGS = [
  {
    id: '1',
    images: [],
    badge: 'new',
    isFavorite: false,
    location: 'Midtown, Atlanta',
    rating: 4.9,
    title: 'Sunny private room with city views',
    details: 'Private room · Private bath · Furnished',
    amenities: ['WiFi', 'AC', 'Laundry'],
    weeklyPrice: '$175',
    monthlyPrice: '$700/mo',
    coordinates: { top: '25%', left: '35%' },
  },
  {
    id: '2',
    images: [],
    badge: 'verified',
    isFavorite: false,
    location: 'East Atlanta',
    rating: 4.7,
    title: 'Cozy room in renovated bungalow',
    details: 'Private room · Shared bath · Furnished',
    amenities: ['WiFi', 'Yard'],
    weeklyPrice: '$145',
    monthlyPrice: '$580/mo',
    coordinates: { top: '40%', left: '60%' },
  },
  {
    id: '3',
    images: [],
    badge: null,
    isFavorite: true,
    location: 'West End',
    rating: 4.8,
    title: 'Spacious master suite with ensuite',
    details: 'Private room · Private bath · Furnished',
    amenities: ['WiFi', 'Parking', 'Laundry'],
    weeklyPrice: '$195',
    monthlyPrice: '$780/mo',
    coordinates: { top: '55%', left: '30%' },
  },
  {
    id: '4',
    images: [],
    badge: 'available',
    isFavorite: false,
    location: 'Decatur',
    rating: 4.6,
    title: 'Quiet room near MARTA station',
    details: 'Private room · Shared bath · Unfurnished',
    amenities: ['WiFi', 'Transit'],
    weeklyPrice: '$125',
    monthlyPrice: '$500/mo',
    coordinates: { top: '30%', left: '70%' },
  },
  {
    id: '5',
    images: [],
    badge: null,
    isFavorite: false,
    location: 'Buckhead',
    rating: 5.0,
    title: 'Luxury room in upscale neighborhood',
    details: 'Private room · Private bath · Furnished',
    amenities: ['WiFi', 'Pool', 'Gym'],
    weeklyPrice: '$250',
    monthlyPrice: '$1,000/mo',
    coordinates: { top: '20%', left: '45%' },
  },
  {
    id: '6',
    images: [],
    badge: 'new',
    isFavorite: false,
    location: 'Grant Park',
    rating: 4.8,
    title: 'Charming room in Victorian home',
    details: 'Private room · Shared bath · Furnished',
    amenities: ['WiFi', 'Porch', 'Pets OK'],
    weeklyPrice: '$160',
    monthlyPrice: '$640/mo',
    coordinates: { top: '65%', left: '50%' },
  },
  {
    id: '7',
    images: [],
    badge: null,
    isFavorite: false,
    location: 'Old Fourth Ward',
    rating: 4.5,
    title: 'Modern room near BeltLine',
    details: 'Private room · Private bath · Furnished',
    amenities: ['WiFi', 'Bikes'],
    weeklyPrice: '$185',
    monthlyPrice: '$740/mo',
    coordinates: { top: '45%', left: '40%' },
  },
  {
    id: '8',
    images: [],
    badge: 'verified',
    isFavorite: false,
    location: 'Kirkwood',
    rating: 4.9,
    title: 'Bright basement suite with entrance',
    details: 'Private room · Private bath · Furnished',
    amenities: ['WiFi', 'Private', 'Parking'],
    weeklyPrice: '$200',
    monthlyPrice: '$800/mo',
    coordinates: { top: '50%', left: '65%' },
  },
]

const FILTER_DEFINITIONS = [
  { id: 'price', icon: '💰', label: 'Price', hasDropdown: true },
  { id: 'roomType', icon: '🛏️', label: 'Room Type', hasDropdown: true },
  { id: 'privateBath', icon: '🚿', label: 'Private Bath', hasDropdown: false },
  { id: 'amenities', icon: '📶', label: 'Amenities', hasDropdown: true },
  { id: 'availableNow', icon: '📅', label: 'Available Now', hasDropdown: false },
]

/**
 * SearchPage - Main search results page with listings and map
 */
function SearchPage() {
  const navigate = useNavigate()
  const { filters, setFilters, updateFilter, clearFilters, activeFilterCount } = useSearchFilters()

  const [activeFilter, setActiveFilter] = useState(null)
  const [hoveredListingId, setHoveredListingId] = useState(null)

  // Filter values for dropdowns
  const [filterValues, setFilterValues] = useState({
    price: { min: null, max: null },
    roomType: [],
    amenities: [],
  })

  // Handle search from nav
  const handleSearch = ({ location, date }) => {
    setFilters({ location, date, page: 1 })
  }

  // Handle filter chip click
  const handleFilterClick = (filterId) => {
    const filter = FILTER_DEFINITIONS.find((f) => f.id === filterId)
    if (filter?.hasDropdown) {
      setActiveFilter(activeFilter === filterId ? null : filterId)
    } else {
      // Toggle simple filters
      if (filterId === 'privateBath') {
        updateFilter('privateBath', !filters.privateBath)
      } else if (filterId === 'availableNow') {
        updateFilter('availableNow', !filters.availableNow)
      }
    }
  }

  // Handle filter dropdown apply
  const handleFilterApply = () => {
    if (activeFilter === 'price') {
      setFilters({
        priceMin: filterValues.price.min,
        priceMax: filterValues.price.max,
        page: 1,
      })
    } else if (activeFilter === 'roomType') {
      updateFilter('roomType', filterValues.roomType)
    } else if (activeFilter === 'amenities') {
      updateFilter('amenities', filterValues.amenities)
    }
    setActiveFilter(null)
  }

  // Handle filter clear
  const handleFilterClear = () => {
    if (activeFilter === 'price') {
      setFilterValues((v) => ({ ...v, price: { min: null, max: null } }))
      setFilters({ priceMin: null, priceMax: null, page: 1 })
    } else if (activeFilter === 'roomType') {
      setFilterValues((v) => ({ ...v, roomType: [] }))
      updateFilter('roomType', [])
    } else if (activeFilter === 'amenities') {
      setFilterValues((v) => ({ ...v, amenities: [] }))
      updateFilter('amenities', [])
    }
  }

  // Check if filter is active
  const isFilterActive = (filterId) => {
    switch (filterId) {
      case 'price':
        return filters.priceMin || filters.priceMax
      case 'roomType':
        return filters.roomType?.length > 0
      case 'privateBath':
        return filters.privateBath
      case 'amenities':
        return filters.amenities?.length > 0
      case 'availableNow':
        return filters.availableNow
      default:
        return false
    }
  }

  // Handle listing click
  const handleListingClick = (listing) => {
    navigate(ROUTES.ROOM_DETAILS.replace(':id', listing.id))
  }

  // Handle sort change
  const handleSortChange = (sortBy) => {
    setFilters({ sortBy, page: 1 })
  }

  // Handle page change
  const handlePageChange = (page) => {
    setFilters({ page })
  }

  // Create markers from listings
  const markers = useMemo(() => {
    return MOCK_LISTINGS.map((listing) => ({
      id: listing.id,
      price: listing.weeklyPrice,
      listing,
      top: listing.coordinates.top,
      left: listing.coordinates.left,
    }))
  }, [])

  // Handle marker hover
  const handleMarkerHover = (markerId) => {
    setHoveredListingId(markerId)
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <SearchNavigation
        location={filters.location}
        date={filters.date}
        onLocationChange={(value) => updateFilter('location', value)}
        onDateChange={(value) => updateFilter('date', value)}
        onSearch={handleSearch}
      />

      {/* Filter Bar */}
      <div className="fixed top-[var(--nav-height)] left-0 right-0 z-[999] h-16 px-6 flex items-center gap-3 bg-white border-b border-cloud md:overflow-x-auto md:scrollbar-hide">
        {FILTER_DEFINITIONS.map((filter) => (
          <div key={filter.id} className="relative">
            <FilterChip
              icon={filter.icon}
              label={filter.label}
              active={isFilterActive(filter.id)}
              hasDropdown={filter.hasDropdown}
              onClick={() => handleFilterClick(filter.id)}
            />
            {filter.hasDropdown && activeFilter === filter.id && (
              <FilterDropdown
                type={filter.id}
                value={filterValues[filter.id]}
                onChange={(value) => setFilterValues((v) => ({ ...v, [filter.id]: value }))}
                onApply={handleFilterApply}
                onClear={handleFilterClear}
                onClose={() => setActiveFilter(null)}
                isOpen={true}
              />
            )}
          </div>
        ))}

        <div className="w-px h-8 bg-cloud mx-1 md:hidden" />

        <FilterChip icon="🔍" label="More Filters" hasDropdown onClick={() => {}} />

        {activeFilterCount > 0 && (
          <button
            type="button"
            className="ml-auto py-2 px-4 bg-transparent border-none font-body text-sm font-medium text-primary cursor-pointer underline hover:text-[#1d4ed8] whitespace-nowrap"
            onClick={clearFilters}
          >
            Clear all ({activeFilterCount})
          </button>
        )}
      </div>

      {/* Main Content */}
      <main className="flex mt-[calc(var(--nav-height)+64px)] h-[calc(100vh-var(--nav-height)-64px)]">
        <ListingsPanel
          listings={MOCK_LISTINGS}
          totalCount={47}
          location={filters.location || 'Atlanta, GA'}
          sortBy={filters.sortBy}
          onSortChange={handleSortChange}
          page={filters.page}
          totalPages={6}
          onPageChange={handlePageChange}
          onListingClick={handleListingClick}
          onListingFavorite={(listing) => console.log('Favorite:', listing.id)}
          hoveredListingId={hoveredListingId}
        />

        <MapPanel
          markers={markers}
          activeMarkerId={hoveredListingId}
          onMarkerClick={(marker) => handleListingClick(marker.listing)}
          onMarkerHover={handleMarkerHover}
          onSearchArea={() => console.log('Search this area')}
        />
      </main>
    </div>
  )
}

export default SearchPage

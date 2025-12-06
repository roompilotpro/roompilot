import { useState, useCallback, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'

/**
 * useSearchFilters - Hook for managing search filter state with URL sync
 */
export function useSearchFilters() {
  const [searchParams, setSearchParams] = useSearchParams()

  // Parse filters from URL
  const initialFilters = useMemo(
    () => ({
      location: searchParams.get('location') || '',
      date: searchParams.get('date') || '',
      priceMin: searchParams.get('priceMin') ? Number(searchParams.get('priceMin')) : null,
      priceMax: searchParams.get('priceMax') ? Number(searchParams.get('priceMax')) : null,
      roomType: searchParams.get('roomType')?.split(',').filter(Boolean) || [],
      privateBath: searchParams.get('privateBath') === 'true',
      amenities: searchParams.get('amenities')?.split(',').filter(Boolean) || [],
      availableNow: searchParams.get('availableNow') === 'true',
      sortBy: searchParams.get('sortBy') || 'recommended',
      page: searchParams.get('page') ? Number(searchParams.get('page')) : 1,
    }),
    [searchParams]
  )

  const [filters, setFiltersState] = useState(initialFilters)

  // Update URL when filters change
  const setFilters = useCallback(
    (newFilters) => {
      const updatedFilters =
        typeof newFilters === 'function' ? newFilters(filters) : { ...filters, ...newFilters }

      setFiltersState(updatedFilters)

      // Build URL params
      const params = new URLSearchParams()
      if (updatedFilters.location) params.set('location', updatedFilters.location)
      if (updatedFilters.date) params.set('date', updatedFilters.date)
      if (updatedFilters.priceMin) params.set('priceMin', String(updatedFilters.priceMin))
      if (updatedFilters.priceMax) params.set('priceMax', String(updatedFilters.priceMax))
      if (updatedFilters.roomType?.length) params.set('roomType', updatedFilters.roomType.join(','))
      if (updatedFilters.privateBath) params.set('privateBath', 'true')
      if (updatedFilters.amenities?.length)
        params.set('amenities', updatedFilters.amenities.join(','))
      if (updatedFilters.availableNow) params.set('availableNow', 'true')
      if (updatedFilters.sortBy && updatedFilters.sortBy !== 'recommended') {
        params.set('sortBy', updatedFilters.sortBy)
      }
      if (updatedFilters.page && updatedFilters.page !== 1) {
        params.set('page', String(updatedFilters.page))
      }

      setSearchParams(params, { replace: true })
    },
    [filters, setSearchParams]
  )

  // Update a single filter
  const updateFilter = useCallback(
    (key, value) => {
      setFilters({ [key]: value, page: 1 }) // Reset page when filter changes
    },
    [setFilters]
  )

  // Clear all filters
  const clearFilters = useCallback(() => {
    setFilters({
      location: filters.location, // Keep location
      date: filters.date, // Keep date
      priceMin: null,
      priceMax: null,
      roomType: [],
      privateBath: false,
      amenities: [],
      availableNow: false,
      sortBy: 'recommended',
      page: 1,
    })
  }, [filters.location, filters.date, setFilters])

  // Count active filters
  const activeFilterCount = useMemo(() => {
    let count = 0
    if (filters.priceMin || filters.priceMax) count++
    if (filters.roomType?.length) count++
    if (filters.privateBath) count++
    if (filters.amenities?.length) count++
    if (filters.availableNow) count++
    return count
  }, [filters])

  // Check if any filters are active
  const hasActiveFilters = activeFilterCount > 0

  return {
    filters,
    setFilters,
    updateFilter,
    clearFilters,
    activeFilterCount,
    hasActiveFilters,
  }
}

export default useSearchFilters

import type { Router, RouteLocationNormalized } from 'vue-router'
import type { IFilters, IFiltersPartial } from "~/types/store";

export const useUrlFilters = (route: RouteLocationNormalized, router: Router) => {
  const getFiltersFromUrl = (): IFiltersPartial => {
    const query = route.query
    const filters: IFiltersPartial = {}

    if (query.rooms) {
      const rooms = parseInt(query.rooms as string)
      if (!isNaN(rooms) && rooms >= 1 && rooms <= 4) {
        filters.selectedRooms = rooms
      }
    }

    if (query.priceMin || query.priceMax) {
      const min = query.priceMin ? parseInt(query.priceMin as string) : undefined
      const max = query.priceMax ? parseInt(query.priceMax as string) : undefined

      if (min !== undefined || max !== undefined) {
        filters.priceRange = {
          ...(min !== undefined ? { min } : {}),
          ...(max !== undefined ? { max } : {})
        }
      }
    }

    if (query.areaMin || query.areaMax) {
      const min = query.areaMin ? parseInt(query.areaMin as string) : undefined
      const max = query.areaMax ? parseInt(query.areaMax as string) : undefined

      if (min !== undefined || max !== undefined) {
        filters.areaRange = {
          ...(min !== undefined ? { min } : {}),
          ...(max !== undefined ? { max } : {})
        }
      }
    }

    return filters
  }

  const updateUrlWithFilters = (filters: IFilters) => {
    const query: Record<string, string> = {}

    if (filters.selectedRooms != null) {
      query.rooms = filters.selectedRooms.toString()
    }

    if (filters.priceRange) {
      if (filters.priceRange.min !== filters.priceRange.minLimit) {
        query.priceMin = filters.priceRange.min.toString()
      }
      if (filters.priceRange.max !== filters.priceRange.maxLimit) {
        query.priceMax = filters.priceRange.max.toString()
      }
    }

    if (filters.areaRange) {
      if (filters.areaRange.min !== filters.areaRange.minLimit) {
        query.areaMin = filters.areaRange.min.toString()
      }
      if (filters.areaRange.max !== filters.areaRange.maxLimit) {
        query.areaMax = filters.areaRange.max.toString()
      }
    }

    router.push({ query })
  }

  const clearUrlFilters = () => {
    router.push({ query: {} })
  }

  return {
    getFiltersFromUrl,
    updateUrlWithFilters,
    clearUrlFilters
  }
}

import { defineStore } from 'pinia'
import { ref, computed, watch, nextTick } from "vue";
import type { IApartment, IFilters, IFiltersPartial } from "~/types/store";
import { useRoute, useRouter } from 'vue-router'

const defaultFilters = {
  selectedRooms: null,
  priceRange: { min: 0, max: 20000000, minLimit: 0, maxLimit: 20000000 },
  areaRange: { min: 0, max: 100, minLimit: 0, maxLimit: 100 }
}

export const useApartmentsStore = defineStore('apartments', () => {
  const route = useRoute()
  const router = useRouter()
  const apartments = ref<IApartment[]>([])
  const isLoading = ref(false)
  const filters = ref<IFilters>({ ...defaultFilters })
  const isUrlSyncEnabled = ref(false)
  const sortField = ref<'area' | 'floor' | 'price' | null>(null)
  const sortDirection = ref<'asc' | 'desc'>('asc')

  const setSort = (field: 'area' | 'floor' | 'price') => {
    if (sortField.value === field) {
      sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc'
    } else {
      sortField.value = field
      sortDirection.value = 'asc'
    }
  }

  const filteredApartments = computed(() => {
    let filtered = apartments.value

    if (filters.value.selectedRooms != null) {
      filtered = filtered.filter(apt => apt.rooms === filters.value.selectedRooms)
    }

    if (filters.value.priceRange) {
      filtered = filtered.filter(apt =>
        apt.price >= filters.value.priceRange.min && apt.price <= filters.value.priceRange.max
      )
    }

    if (filters.value.areaRange != null) {
      filtered = filtered.filter(apt =>
        apt.area >= filters.value.areaRange.min && apt.area <= filters.value.areaRange.max
      )
    }

    if (sortField.value) {
      filtered = [...filtered].sort((a, b) => {
        const field = sortField.value as 'area' | 'floor' | 'price'
        const aValue = a[field]
        const bValue = b[field]
        if (aValue === bValue) return 0
        if (sortDirection.value === 'asc') {
          return aValue > bValue ? 1 : -1
        } else {
          return aValue < bValue ? 1 : -1
        }
      })
    }
    return filtered
  })

  const setLimits = () => {
    const prices = apartments.value.map(el => el.price)
    const areas = apartments.value.map(el => el.area)

    const newPriceMinLimit = Math.min(...prices)
    const newPriceMaxLimit = Math.max(...prices)
    const newAreaMinLimit = Math.min(...areas)
    const newAreaMaxLimit = Math.max(...areas)

    filters.value.priceRange.minLimit = newPriceMinLimit
    filters.value.priceRange.maxLimit = newPriceMaxLimit
    filters.value.areaRange.minLimit = newAreaMinLimit
    filters.value.areaRange.maxLimit = newAreaMaxLimit

    if (filters.value.priceRange.min < newPriceMinLimit) {
      filters.value.priceRange.min = newPriceMinLimit
    }
    if (filters.value.priceRange.max > newPriceMaxLimit) {
      filters.value.priceRange.max = newPriceMaxLimit
    }
    if (filters.value.areaRange.min < newAreaMinLimit) {
      filters.value.areaRange.min = newAreaMinLimit
    }
    if (filters.value.areaRange.max > newAreaMaxLimit) {
      filters.value.areaRange.max = newAreaMaxLimit
    }
  }

  const resetFilters = () => {
    filters.value.selectedRooms = null

    if (!apartments.value.length) {
      filters.value = { ...defaultFilters }
    } else {
      setLimits()
      filters.value.priceRange.min = filters.value.priceRange.minLimit
      filters.value.priceRange.max = filters.value.priceRange.maxLimit
      filters.value.areaRange.min = filters.value.areaRange.minLimit
      filters.value.areaRange.max = filters.value.areaRange.maxLimit
    }
  }

  const applyFiltersFromUrl = (urlFilters: IFiltersPartial) => {
    isUpdatingFromUrl = true

    if (urlFilters.selectedRooms !== undefined) {
      filters.value.selectedRooms = urlFilters.selectedRooms
    }

    if (urlFilters.priceRange) {
      filters.value.priceRange = {
        ...filters.value.priceRange,
        ...urlFilters.priceRange
      }
    }

    if (urlFilters.areaRange) {
      filters.value.areaRange = {
        ...filters.value.areaRange,
        ...urlFilters.areaRange
      }
    }

    nextTick(() => {
      isUpdatingFromUrl = false
    })
  }

  let isUpdatingFromUrl = false

  watch(filters, (newFilters) => {
    if (!isUrlSyncEnabled.value || isUpdatingFromUrl) return

    if (process.client) {
      const { updateUrlWithFilters } = useUrlFilters(route, router)
      updateUrlWithFilters(newFilters)
    }
  }, { deep: true })

  const loadApartments = async () => {
    const mockData = await createMockData()

    try {
      isLoading.value = true

      const config = useRuntimeConfig()
      const xApiKey: string = String(config.public.jsonbinMasterKey || '')

      const createRes = await fetch('https://api.jsonbin.io/v3/b', {
        method: "POST",
        body: JSON.stringify(mockData),
        headers: { 'Content-Type': 'application/json', "X-Master-Key": xApiKey }
      }).then(res => res.json())

      const res = await fetch(`https://api.jsonbin.io/v3/b/${ createRes.metadata.id }/latest/`, {
        headers: { "X-Master-Key": xApiKey }
      }).then(res => res.json())

      if (!res?.record) throw new Error('Ошибка загрузки данных')

      const data = apartments.value.length ? await createMockData() : res.record;
      apartments.value = [...apartments.value, ...data]
    } catch (error) {
      apartments.value = [...apartments.value, ...mockData]
      console.error('Ошибка загрузки квартир:', error)
    } finally {
      await setLimits()
      isLoading.value = false
    }
  }

  const createMockData = async () => {
    const mockApartments: IApartment[] = []

    const currentMaxId = apartments.value.length
      ? Math.max(...apartments.value.map(a => a.id))
      : 0
    let nextId = currentMaxId + 1

    for (let rooms = 1; rooms <= 4; rooms++) {
      for (let floor = 1; floor <= 17; floor += 3) {
        const baseArea = rooms === 1 ? 33 : rooms === 2 ? 45 : rooms === 3 ? 65 : 85
        const areaVariation = Math.floor(Math.random() * 20) - 10
        const area = Math.max(baseArea + areaVariation, 30)

        const basePrice = rooms === 1 ? 5500000 : rooms === 2 ? 8500000 : rooms === 3 ? 12500000 : 18900000
        const priceVariation = Math.floor(Math.random() * 2000000) - 1000000
        const price = Math.max(basePrice + priceVariation, 5000000)

        mockApartments.push({
          id: nextId++,
          name: `${ rooms }-комнатная №${ 100 + apartments.value.length + mockApartments.length }`,
          rooms,
          area,
          floor,
          price,
          layoutImage: `/images/layout-${ rooms }k.png`
        })
      }
    }

    return mockApartments.slice(0, 20)
  }

  const enableUrlSync = () => {
    isUrlSyncEnabled.value = true
  }

  return {
    apartments,
    isLoading,
    filters,
    filteredApartments,
    sortField,
    sortDirection,
    setLimits,
    resetFilters,
    applyFiltersFromUrl,
    enableUrlSync,
    loadApartments,
    setSort
  }
})

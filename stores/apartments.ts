import { defineStore } from 'pinia'
import { computed } from "vue";
import type { IApartment, IFilters } from "~/types/store";

const defaultFilters = {
  priceRange: { min: 0, max: 10000000, minLimit: 0, maxLimit: 10000000 },
  areaRange: { min: 0, max: 100, minLimit: 0, maxLimit: 100 }
}

export const useApartmentsStore = defineStore('apartments', () => {
  const apartments = ref<IApartment[]>([])
  const isLoading = ref(false)
  const filters = ref<IFilters>({ ...defaultFilters })

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

    return filtered
  })

  const setLimits = () => {
    filters.value.priceRange.minLimit = Math.min(...apartments.value.map(el => el.price))
    filters.value.priceRange.min = filters.value.priceRange.minLimit
    filters.value.priceRange.maxLimit = Math.max(...apartments.value.map(el => el.price))
    filters.value.priceRange.max = filters.value.priceRange.maxLimit
    filters.value.areaRange.minLimit = Math.min(...apartments.value.map(el => el.area))
    filters.value.areaRange.min = filters.value.areaRange.minLimit
    filters.value.areaRange.maxLimit = Math.max(...apartments.value.map(el => el.area))
    filters.value.areaRange.max = filters.value.areaRange.maxLimit
  }

  const resetFilters = () => {
    filters.value = { ...defaultFilters }
  }

  const loadApartments = async () => {
    try {
      isLoading.value = true

      const response = await fetch('/api/apartments.json')
      if (!response.ok) throw new Error('Ошибка загрузки данных')

      const data = apartments.value.length ? await createMockData() : (await response.json()).apartments;
      apartments.value = [...apartments.value, ...data]
      setLimits()
    } catch (error) {
      console.error('Ошибка загрузки квартир:', error)
    } finally {
      isLoading.value = false
    }
  }

  const createMockData = async () => {
    const mockApartments: IApartment[] = []

    // Создаем тестовые данные для разных типов квартир
    for (let rooms = 1; rooms <= 4; rooms++) {
      for (let floor = 1; floor <= 10; floor++) {
        const baseArea = rooms === 1 ? 33 : rooms === 2 ? 45 : rooms === 3 ? 65 : 85
        const areaVariation = Math.floor(Math.random() * 20) - 10
        const area = Math.max(baseArea + areaVariation, 30)

        const basePrice = rooms === 1 ? 5500000 : rooms === 2 ? 8500000 : rooms === 3 ? 12500000 : 18900000
        const priceVariation = Math.floor(Math.random() * 2000000) - 1000000
        const price = Math.max(basePrice + priceVariation, 5000000)

        mockApartments.push({
          id: apartments.value.length + 1,
          name: `${rooms}-комнатная №${100 + apartments.value.length}`,
          rooms,
          area,
          floor,
          price,
          layoutImage: `/images/layout-${rooms}k.png`
        })
      }
    }

    return mockApartments
  }

  return {
    apartments,
    isLoading,
    filteredApartments,
    filters,
    loadApartments,
    resetFilters,
  }
})

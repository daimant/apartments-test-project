export interface IApartment {
  id: number
  name: string
  rooms: number
  area: number
  floor: number
  price: number
  layoutImage: string
}

export interface IFilters {
  selectedRooms?: number | null,
  priceRange: {
    min: number
    max: number
    minLimit: number
    maxLimit: number
  },
  areaRange: {
    min: number
    max: number
    minLimit: number
    maxLimit: number
  }
}
import type { IRange } from "~/types/filters";

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
  priceRange: IRange
  areaRange: IRange
}
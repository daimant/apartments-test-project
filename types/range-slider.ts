export interface IRangeValue {
  min: number
  max: number
}

export interface IRangeSliderProps {
  modelValue: IRangeValue
  min: number
  max: number
  step?: number
}
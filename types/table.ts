type SortField = 'area' | 'floor' | 'price'

export interface ISortThProps {
  text: string,
  field: SortField,
  activeField: SortField | null,
  direction: 'asc' | 'desc'
}
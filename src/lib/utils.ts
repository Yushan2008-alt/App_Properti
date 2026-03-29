import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(price: number): string {
  if (price >= 1_000_000_000) {
    const val = price / 1_000_000_000
    return `Rp ${val % 1 === 0 ? val.toFixed(0) : val.toFixed(1)} M`
  }
  if (price >= 1_000_000) {
    const val = price / 1_000_000
    return `Rp ${val % 1 === 0 ? val.toFixed(0) : val.toFixed(1)} Jt`
  }
  return `Rp ${price.toLocaleString('id-ID')}`
}

export function formatArea(area: number): string {
  return `${area.toLocaleString('id-ID')} m²`
}

export const PROPERTY_TYPES = [
  { value: 'rumah', label: 'Rumah' },
  { value: 'apartemen', label: 'Apartemen' },
  { value: 'ruko', label: 'Ruko' },
  { value: 'tanah', label: 'Tanah' },
  { value: 'villa', label: 'Villa' },
  { value: 'gudang', label: 'Gudang' },
  { value: 'kantor', label: 'Kantor' },
] as const

export const PROPERTY_STATUS = [
  { value: 'jual', label: 'Dijual' },
  { value: 'sewa', label: 'Disewakan' },
] as const

export type PropertyType = typeof PROPERTY_TYPES[number]['value']
export type PropertyStatus = typeof PROPERTY_STATUS[number]['value']

export type YarnColor = {
  id: string
  name: string
  hex: string
  inStock: boolean
}

/** Admin can edit stock in Admin → Yarn stock; defaults seed the picker. */
export const defaultYarnStock: YarnColor[] = [
  { id: 'lavender', name: 'Lavender Dream', hex: '#9B59B6', inStock: true },
  { id: 'sage', name: 'Sage Meadow', hex: '#6B8F71', inStock: true },
  { id: 'cream', name: 'Natural Cream', hex: '#F5F0E8', inStock: true },
  { id: 'terracotta', name: 'Terracotta Clay', hex: '#C97B4A', inStock: true },
  { id: 'plum', name: 'Deep Plum', hex: '#7E3091', inStock: true },
  { id: 'blush', name: 'Blush Pink', hex: '#E8B4B8', inStock: true },
  { id: 'charcoal', name: 'Charcoal', hex: '#4A4A4A', inStock: true },
  { id: 'sunset', name: 'Sunset Orange', hex: '#E67E22', inStock: false },
  { id: 'ocean', name: 'Ocean Teal', hex: '#1ABC9C', inStock: true },
  { id: 'mustard', name: 'Mustard Gold', hex: '#D4A017', inStock: true },
]

const STOCK_KEY = 'boka_yarn_stock'

export function getYarnStock(): YarnColor[] {
  try {
    const raw = localStorage.getItem(STOCK_KEY)
    if (raw) return JSON.parse(raw) as YarnColor[]
  } catch {
    /* use defaults */
  }
  return defaultYarnStock
}

export function saveYarnStock(stock: YarnColor[]) {
  localStorage.setItem(STOCK_KEY, JSON.stringify(stock))
}

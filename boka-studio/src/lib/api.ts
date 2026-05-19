import { API_BASE } from './config'

const TOKEN_KEY = 'boka_api_token'

export function getApiToken(): string | null {
  return localStorage.getItem(TOKEN_KEY)
}

export function setApiToken(token: string | null) {
  if (token) localStorage.setItem(TOKEN_KEY, token)
  else localStorage.removeItem(TOKEN_KEY)
}

const API_TIMEOUT_MS = 12_000

export async function apiFetch<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const token = getApiToken()
  const headers = new Headers(options.headers)
  headers.set('Content-Type', 'application/json')
  if (token) headers.set('Authorization', `Bearer ${token}`)

  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT_MS)

  let res: Response
  try {
    res = await fetch(`${API_BASE}/${path.replace(/^\//, '')}`, {
      ...options,
      headers,
      signal: controller.signal,
    })
  } catch (e) {
    if (e instanceof Error && e.name === 'AbortError') {
      throw new Error(
        'Store API timed out. The server may be waking up — try again, or run the API locally (see README).',
      )
    }
    throw e
  } finally {
    clearTimeout(timeoutId)
  }

  if (!res.ok) {
    const text = await res.text()
    throw new Error(text || `API error ${res.status}`)
  }

  if (res.status === 204) return undefined as T
  return res.json() as Promise<T>
}

export type ApiAuthResponse = {
  success: boolean
  token?: string
  message?: string
  user?: {
    id: number
    firstName: string
    lastName: string
    email: string
  }
}

export type ApiProduct = {
  id: number
  name: string
  description: string
  price: number
  inventoryCount: number
  imageUrl: string
  category: string
  isNewlyAdded: boolean
}

export type ApiCustomOrder = {
  id: string
  customerId: string
  customerEmail: string
  customerName: string
  builderJson: string
  liveSummary: string
  inspirationImageUrl?: string | null
  sketchDataUrl?: string | null
  customerNotes: string
  status: string
  quotedPrice?: number | null
  quoteMessage?: string | null
  quoteChannel?: string | null
  rejectionReason?: string | null
  estimatedReadyDate?: string | null
  estimatedDeliveryDate?: string | null
  productionNotes?: string | null
  whyTimelineLong?: string | null
  depositAmount?: number | null
  depositPaid?: boolean
  depositPaidAt?: string | null
  depositNonRefundableAfter?: string | null
  createdAt: string
  updatedAt: string
}

export type ApiOrder = {
  id: number
  orderNumber: string
  customerName: string
  customerEmail: string
  shippingAddress: string
  phone: string
  status: string
  orderDate: string
  totalAmount: number
  depositPaid: number
  isFullyPaid: boolean
  trackingNumber?: string | null
  courierName?: string | null
  items: { id?: number; productName: string; quantity: number; unitPrice: number }[]
}

export type ApiYarnColor = {
  id: number
  slug: string
  name: string
  hex: string
  inStock: boolean
}

import type {
  BuilderConfig,
  CustomOrderAdminPatch,
  CustomOrderRequest,
  OrderStatus,
} from '../types/customOrder'
import { apiFetch, type ApiCustomOrder, type ApiOrder } from '../lib/api'
import { getSupabase, isSupabaseConfigured } from '../lib/supabase'

const ORDERS_KEY = 'boka_custom_orders'

function mapFromApi(row: ApiCustomOrder): CustomOrderRequest {
  let builder: BuilderConfig
  try {
    builder = JSON.parse(row.builderJson) as BuilderConfig
  } catch {
    builder = {
      garmentType: '',
      stitchPattern: '',
      yarnColorId: '',
      yarnColorName: '',
      yarnHex: '',
      size: '',
      customMeasurements: '',
      addOns: [],
    }
  }
  return {
    id: row.id,
    customerId: row.customerId,
    customerEmail: row.customerEmail,
    customerName: row.customerName,
    builder,
    liveSummary: row.liveSummary,
    inspirationImageUrl: row.inspirationImageUrl ?? null,
    sketchDataUrl: row.sketchDataUrl ?? null,
    customerNotes: row.customerNotes,
    status: row.status as OrderStatus,
    quotedPrice: row.quotedPrice ?? null,
    quoteMessage: row.quoteMessage ?? null,
    quoteChannel: (row.quoteChannel as CustomOrderRequest['quoteChannel']) ?? null,
    rejectionReason: row.rejectionReason ?? null,
    estimatedReadyDate: row.estimatedReadyDate ?? null,
    estimatedDeliveryDate: row.estimatedDeliveryDate ?? null,
    productionNotes: row.productionNotes ?? null,
    whyTimelineLong: row.whyTimelineLong ?? null,
    depositAmount: row.depositAmount ?? null,
    depositPaid: row.depositPaid ?? false,
    depositPaidAt: row.depositPaidAt ?? null,
    depositNonRefundableAfter: row.depositNonRefundableAfter ?? null,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  }
}

function loadLocal(): CustomOrderRequest[] {
  try {
    const raw = localStorage.getItem(ORDERS_KEY)
    return raw ? (JSON.parse(raw) as CustomOrderRequest[]) : []
  } catch {
    return []
  }
}

function saveLocal(orders: CustomOrderRequest[]) {
  localStorage.setItem(ORDERS_KEY, JSON.stringify(orders))
}

export async function submitCustomOrder(
  order: Omit<
    CustomOrderRequest,
    | 'id'
    | 'status'
    | 'quotedPrice'
    | 'quoteMessage'
    | 'quoteChannel'
    | 'rejectionReason'
    | 'estimatedReadyDate'
    | 'estimatedDeliveryDate'
    | 'productionNotes'
    | 'whyTimelineLong'
    | 'depositAmount'
    | 'depositPaid'
    | 'depositPaidAt'
    | 'depositNonRefundableAfter'
    | 'createdAt'
    | 'updatedAt'
  >,
): Promise<CustomOrderRequest> {
  const payload = {
    customerId: order.customerId,
    customerEmail: order.customerEmail,
    customerName: order.customerName,
    builderJson: JSON.stringify(order.builder),
    liveSummary: order.liveSummary,
    inspirationImageUrl: order.inspirationImageUrl,
    sketchDataUrl: order.sketchDataUrl,
    customerNotes: order.customerNotes,
  }

  try {
    const created = await apiFetch<ApiCustomOrder>('api/customorders', {
      method: 'POST',
      body: JSON.stringify(payload),
    })
    return mapFromApi(created)
  } catch (e) {
    console.warn('API custom order failed, using fallback storage:', e)
  }

  const now = new Date().toISOString()
  const full: CustomOrderRequest = {
    ...order,
    id: crypto.randomUUID(),
    status: 'pending_review',
    quotedPrice: null,
    quoteMessage: null,
    quoteChannel: null,
    rejectionReason: null,
    estimatedReadyDate: null,
    estimatedDeliveryDate: null,
    productionNotes: null,
    whyTimelineLong: null,
    depositAmount: null,
    depositPaid: false,
    depositPaidAt: null,
    depositNonRefundableAfter: null,
    createdAt: now,
    updatedAt: now,
  }

  const supabase = getSupabase()
  if (supabase && isSupabaseConfigured) {
    const { data, error } = await supabase.from('custom_orders').insert({
      id: full.id,
      customer_id: full.customerId,
      customer_email: full.customerEmail,
      customer_name: full.customerName,
      builder: full.builder,
      live_summary: full.liveSummary,
      inspiration_image_url: full.inspirationImageUrl,
      sketch_data_url: full.sketchDataUrl,
      customer_notes: full.customerNotes,
      status: full.status,
    })
    if (!error && data) return full
  }

  const orders = loadLocal()
  orders.unshift(full)
  saveLocal(orders)
  return full
}

export async function getOrdersForCustomer(_customerId: string): Promise<CustomOrderRequest[]> {
  try {
    const data = await apiFetch<ApiCustomOrder[]>('api/customorders/my')
    return data.map(mapFromApi)
  } catch {
    /* fallback */
  }
  return loadLocal().filter((o) => o.customerId === _customerId)
}

export async function getAllOrders(): Promise<CustomOrderRequest[]> {
  try {
    const data = await apiFetch<ApiCustomOrder[]>('api/customorders')
    return data.map(mapFromApi)
  } catch {
    /* fallback */
  }
  return loadLocal().sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  )
}

export async function getAllShopOrders(): Promise<ApiOrder[]> {
  return apiFetch<ApiOrder[]>('api/orders')
}

export async function updateOrder(
  id: string,
  patch: CustomOrderAdminPatch,
): Promise<CustomOrderRequest | null> {
  try {
    const updated = await apiFetch<ApiCustomOrder>(`api/customorders/${id}`, {
      method: 'PUT',
      body: JSON.stringify(patch),
    })
    return mapFromApi(updated)
  } catch {
    /* fallback local */
  }

  const orders = loadLocal()
  const idx = orders.findIndex((o) => o.id === id)
  if (idx < 0) return null
  const row = orders[idx]
  if (patch.status === 'accepted_pending_deposit') {
    const price = patch.quotedPrice ?? row.quotedPrice
    if (price != null) row.depositAmount = Math.round(price * 0.3 * 100) / 100
  }
  orders[idx] = { ...row, ...patch, updatedAt: new Date().toISOString() }
  saveLocal(orders)
  return orders[idx]
}

export async function payDeposit(orderId: string): Promise<CustomOrderRequest | null> {
  try {
    const updated = await apiFetch<ApiCustomOrder>(`api/customorders/${orderId}/pay-deposit`, {
      method: 'POST',
      body: JSON.stringify({ paymentReference: 'simulated' }),
    })
    return mapFromApi(updated)
  } catch {
    const orders = loadLocal()
    const idx = orders.findIndex((o) => o.id === orderId)
    if (idx < 0) return null
    const now = new Date()
    const nonRefundable = new Date(now.getTime() + 48 * 60 * 60 * 1000)
    orders[idx] = {
      ...orders[idx],
      depositPaid: true,
      depositPaidAt: now.toISOString(),
      depositNonRefundableAfter: nonRefundable.toISOString(),
      status: 'deposit_paid',
      updatedAt: now.toISOString(),
    }
    saveLocal(orders)
    return orders[idx]
  }
}

export async function updateShopOrderStatus(id: number, status: string): Promise<void> {
  const existing = await apiFetch<ApiOrder>(`api/orders/${id}`)
  await apiFetch(`api/orders/${id}`, {
    method: 'PUT',
    body: JSON.stringify({ ...existing, status }),
  })
}

export async function convertToLiveOrder(id: string): Promise<void> {
  try {
    await apiFetch(`api/customorders/${id}/convert`, { method: 'POST' })
    return
  } catch {
    await updateOrder(id, { status: 'in_production' })
  }
}

export async function quoteOrder(
  id: string,
  quotedPrice: number,
  quoteMessage: string,
  quoteChannel: 'email' | 'whatsapp',
): Promise<CustomOrderRequest | null> {
  try {
    const updated = await apiFetch<ApiCustomOrder>(`api/customorders/${id}/quote`, {
      method: 'POST',
      body: JSON.stringify({ quotedPrice, quoteMessage, quoteChannel }),
    })
    return mapFromApi(updated)
  } catch {
    return updateOrder(id, { status: 'quoted', quotedPrice, quoteMessage, quoteChannel })
  }
}

export type AcceptOrderInput = {
  quotedPrice?: number
  quoteMessage?: string
  estimatedReadyDate: string
  estimatedDeliveryDate: string
  productionNotes: string
  whyTimelineLong: string
}

export async function acceptOrder(
  id: string,
  input: AcceptOrderInput,
): Promise<CustomOrderRequest | null> {
  try {
    const updated = await apiFetch<ApiCustomOrder>(`api/customorders/${id}/accept`, {
      method: 'POST',
      body: JSON.stringify(input),
    })
    return mapFromApi(updated)
  } catch {
    return updateOrder(id, {
      status: 'accepted_pending_deposit',
      quotedPrice: input.quotedPrice,
      quoteMessage: input.quoteMessage,
      estimatedReadyDate: input.estimatedReadyDate,
      estimatedDeliveryDate: input.estimatedDeliveryDate,
      productionNotes: input.productionNotes,
      whyTimelineLong: input.whyTimelineLong,
    })
  }
}

export async function declineOrder(
  id: string,
  rejectionReason: string,
): Promise<CustomOrderRequest | null> {
  try {
    const updated = await apiFetch<ApiCustomOrder>(`api/customorders/${id}/decline`, {
      method: 'POST',
      body: JSON.stringify({ rejectionReason }),
    })
    return mapFromApi(updated)
  } catch {
    return updateOrder(id, { status: 'declined', rejectionReason })
  }
}

export async function setOrderStatus(
  id: string,
  status: OrderStatus,
): Promise<CustomOrderRequest | null> {
  try {
    const updated = await apiFetch<ApiCustomOrder>(`api/customorders/${id}/status`, {
      method: 'POST',
      body: JSON.stringify(status),
    })
    return mapFromApi(updated)
  } catch {
    return updateOrder(id, { status })
  }
}

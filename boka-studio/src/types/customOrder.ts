export type OrderStatus =
  | 'pending_review'
  | 'quoted'
  | 'accepted_pending_deposit'
  | 'deposit_paid'
  | 'declined'
  | 'in_production'
  | 'ready'
  | 'shipped'
  | 'completed'

export type BuilderConfig = {
  garmentType: string
  stitchPattern: string
  yarnColorId: string
  yarnColorName: string
  yarnHex: string
  size: string
  customMeasurements: string
  addOns: string[]
}

export type CustomOrderRequest = {
  id: string
  customerId: string
  customerEmail: string
  customerName: string
  builder: BuilderConfig
  liveSummary: string
  inspirationImageUrl: string | null
  sketchDataUrl: string | null
  customerNotes: string
  status: OrderStatus
  quotedPrice: number | null
  quoteMessage: string | null
  quoteChannel: 'email' | 'whatsapp' | null
  rejectionReason: string | null
  estimatedReadyDate: string | null
  estimatedDeliveryDate: string | null
  productionNotes: string | null
  whyTimelineLong: string | null
  depositAmount: number | null
  depositPaid: boolean
  depositPaidAt: string | null
  depositNonRefundableAfter: string | null
  createdAt: string
  updatedAt: string
}

export type CustomOrderAdminPatch = Partial<{
  status: OrderStatus
  quotedPrice: number
  quoteMessage: string
  quoteChannel: 'email' | 'whatsapp'
  rejectionReason: string
  estimatedReadyDate: string
  estimatedDeliveryDate: string
  productionNotes: string
  whyTimelineLong: string
}>

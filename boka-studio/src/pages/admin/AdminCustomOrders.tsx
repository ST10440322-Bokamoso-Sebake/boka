import { useCallback, useEffect, useState } from 'react'
import type { ApiOrder } from '../../lib/api'
import {
  convertToLiveOrder,
  getAllOrders,
  getAllShopOrders,
  updateOrder,
  updateShopOrderStatus,
} from '../../services/orderService'
import type { CustomOrderRequest, OrderStatus } from '../../types/customOrder'

const statusLabels: Record<string, string> = {
  pending_review: 'Pending review',
  quoted: 'Quoted',
  accepted_pending_deposit: 'Awaiting deposit',
  deposit_paid: 'Deposit paid',
  declined: 'Declined',
  in_production: 'In production',
  ready: 'Ready',
  shipped: 'Shipped',
  completed: 'Completed',
}

const fulfillmentStatuses: OrderStatus[] = [
  'deposit_paid',
  'in_production',
  'ready',
  'shipped',
  'completed',
]

function quoteMailto(order: CustomOrderRequest, price: number, message: string) {
  const subject = encodeURIComponent(`Your Boka Studio custom quote — R${price}`)
  const body = encodeURIComponent(
    `Hi ${order.customerName},\n\nThank you for your custom design request!\n\n${message}\n\nQuoted price: R${price}\n\nSummary: ${order.liveSummary}\n\nWarmly,\nBoka Studio`,
  )
  return `mailto:${order.customerEmail}?subject=${subject}&body=${body}`
}

function quoteWhatsApp(order: CustomOrderRequest, price: number, message: string) {
  const text = encodeURIComponent(
    `Hi ${order.customerName}! Your Boka Studio quote is R${price}. ${message} — ${order.liveSummary}`,
  )
  return `https://wa.me/?text=${text}`
}

export function AdminCustomOrders() {
  const [orders, setOrders] = useState<CustomOrderRequest[]>([])
  const [shopOrders, setShopOrders] = useState<ApiOrder[]>([])
  const [selected, setSelected] = useState<CustomOrderRequest | null>(null)
  const [price, setPrice] = useState('')
  const [quoteMsg, setQuoteMsg] = useState('')
  const [channel, setChannel] = useState<'email' | 'whatsapp'>('email')
  const [readyDate, setReadyDate] = useState('')
  const [deliveryDate, setDeliveryDate] = useState('')
  const [whyLong, setWhyLong] = useState('')
  const [productionNotes, setProductionNotes] = useState('')
  const [rejectionReason, setRejectionReason] = useState('')

  const refresh = useCallback(() => {
    getAllOrders().then(setOrders)
    getAllShopOrders().then(setShopOrders).catch(() => setShopOrders([]))
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  function selectOrder(order: CustomOrderRequest) {
    setSelected(order)
    setPrice(order.quotedPrice?.toString() ?? '')
    setQuoteMsg(order.quoteMessage ?? '')
    setReadyDate(order.estimatedReadyDate?.slice(0, 10) ?? '')
    setDeliveryDate(order.estimatedDeliveryDate?.slice(0, 10) ?? '')
    setWhyLong(order.whyTimelineLong ?? '')
    setProductionNotes(order.productionNotes ?? '')
    setRejectionReason(order.rejectionReason ?? '')
  }

  async function sendQuote() {
    if (!selected || !price) return
    const num = Number(price)
    const updated = await updateOrder(selected.id, {
      status: 'quoted',
      quotedPrice: num,
      quoteMessage: quoteMsg,
      quoteChannel: channel,
    })
    if (updated) {
      const link =
        channel === 'email'
          ? quoteMailto(updated, num, quoteMsg)
          : quoteWhatsApp(updated, num, quoteMsg)
      window.open(link, '_blank')
      setSelected(updated)
      refresh()
    }
  }

  async function acceptOrder() {
    if (!selected || !readyDate || !deliveryDate || !whyLong) {
      alert('Fill ready date, delivery date, and timeline explanation.')
      return
    }
    const quoted = selected.quotedPrice ?? (price ? Number(price) : null)
    if (quoted == null) {
      alert('Set a quoted price before accepting.')
      return
    }
    const updated = await updateOrder(selected.id, {
      status: 'accepted_pending_deposit',
      quotedPrice: quoted,
      estimatedReadyDate: new Date(readyDate).toISOString(),
      estimatedDeliveryDate: new Date(deliveryDate).toISOString(),
      whyTimelineLong: whyLong,
      productionNotes: productionNotes || undefined,
    })
    if (updated) {
      setSelected(updated)
      refresh()
    }
  }

  async function declineOrder() {
    if (!selected || !rejectionReason.trim()) {
      alert('Rejection reason is required.')
      return
    }
    const updated = await updateOrder(selected.id, {
      status: 'declined',
      rejectionReason,
    })
    if (updated) {
      setSelected(updated)
      refresh()
    }
  }

  async function setStatus(id: string, status: OrderStatus) {
    const updated = await updateOrder(id, { status })
    refresh()
    if (updated && selected?.id === id) setSelected(updated)
  }

  return (
    <div className="admin-page">
      <h1>Orders</h1>
      <p className="admin-lead">
        Custom design requests and boutique checkout orders. Accept with timeline, track deposit, and
        update fulfillment.
      </p>

      {shopOrders.length > 0 && (
        <section className="admin-section">
          <h2>Boutique orders</h2>
          <ul className="shop-order-admin-list">
            {shopOrders.map((o) => (
              <li key={o.id}>
                <strong>{o.orderNumber}</strong> — {o.customerName} — R{o.totalAmount}
                <span className="status-badge">{o.status}</span>
                <select
                  value={o.status}
                  onChange={(e) => updateShopOrderStatus(o.id, e.target.value).then(refresh)}
                >
                  {['Pending', 'In Production', 'Ready', 'Shipped', 'Completed'].map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </li>
            ))}
          </ul>
        </section>
      )}

      <div className="admin-orders-layout">
        <ul className="admin-order-list">
          {orders.map((order) => (
            <li key={order.id}>
              <button
                type="button"
                className={selected?.id === order.id ? 'active' : undefined}
                onClick={() => selectOrder(order)}
              >
                <strong>{order.customerName}</strong>
                <span className={`status-badge status-${order.status}`}>
                  {statusLabels[order.status] ?? order.status}
                </span>
                <small>{order.liveSummary}</small>
                {order.depositPaid && <small className="deposit-tag">Deposit paid</small>}
              </button>
            </li>
          ))}
        </ul>

        {selected ? (
          <article className="admin-order-detail">
            <h2>{selected.customerName}</h2>
            <p>
              <a href={`mailto:${selected.customerEmail}`}>{selected.customerEmail}</a>
            </p>
            <p className="live-summary">{selected.liveSummary}</p>

            <div className="builder-detail">
              <p>
                <strong>Garment:</strong> {selected.builder.garmentType} ·{' '}
                <strong>Stitch:</strong> {selected.builder.stitchPattern}
              </p>
              <p>
                <strong>Yarn:</strong>{' '}
                <span className="color-dot" style={{ backgroundColor: selected.builder.yarnHex }} />{' '}
                {selected.builder.yarnColorName} · <strong>Size:</strong> {selected.builder.size}
              </p>
            </div>

            {selected.inspirationImageUrl && (
              <figure>
                <figcaption>Inspiration</figcaption>
                <img src={selected.inspirationImageUrl} alt="Inspiration" />
              </figure>
            )}
            {selected.sketchDataUrl && (
              <figure>
                <figcaption>Sketch</figcaption>
                <img src={selected.sketchDataUrl} alt="Sketch" />
              </figure>
            )}

            <div className="admin-actions">
              <h3>Quote</h3>
              <label>
                Price (ZAR)
                <input type="number" min={0} value={price} onChange={(e) => setPrice(e.target.value)} />
              </label>
              <label>
                Message
                <textarea rows={3} value={quoteMsg} onChange={(e) => setQuoteMsg(e.target.value)} />
              </label>
              <label>
                Notify via
                <select value={channel} onChange={(e) => setChannel(e.target.value as 'email' | 'whatsapp')}>
                  <option value="email">Email</option>
                  <option value="whatsapp">WhatsApp</option>
                </select>
              </label>
              <button type="button" className="btn btn-primary" onClick={sendQuote}>
                Save quote &amp; notify
              </button>
            </div>

            <div className="admin-actions accept-panel">
              <h3>Accept (30% deposit required)</h3>
              <p className="deposit-hint">
                Customer pays 30% after you confirm. Deposit is non-refundable 48 hours after payment.
              </p>
              <label>
                Estimated ready
                <input type="date" value={readyDate} onChange={(e) => setReadyDate(e.target.value)} />
              </label>
              <label>
                Estimated delivery
                <input type="date" value={deliveryDate} onChange={(e) => setDeliveryDate(e.target.value)} />
              </label>
              <label>
                Why this timeline?
                <textarea rows={2} value={whyLong} onChange={(e) => setWhyLong(e.target.value)} />
              </label>
              <label>
                Production notes
                <textarea
                  rows={2}
                  value={productionNotes}
                  onChange={(e) => setProductionNotes(e.target.value)}
                />
              </label>
              <button
                type="button"
                className="btn btn-secondary"
                disabled={selected.status === 'accepted_pending_deposit' || selected.depositPaid}
                onClick={acceptOrder}
              >
                Confirm &amp; request deposit
              </button>
              {selected.depositAmount != null && (
                <p>
                  Deposit due: <strong>R{selected.depositAmount.toLocaleString('en-ZA')}</strong>
                </p>
              )}
            </div>

            <div className="admin-actions">
              <h3>Decline</h3>
              <label>
                Rejection reason
                <textarea
                  rows={2}
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                />
              </label>
              <button type="button" className="btn btn-danger" onClick={declineOrder}>
                Decline
              </button>
            </div>

            <div className="admin-actions">
              <h3>Fulfillment</h3>
              <div className="status-buttons">
                {fulfillmentStatuses.map((s) => (
                  <button
                    key={s}
                    type="button"
                    className="btn btn-outline"
                    onClick={() => setStatus(selected.id, s)}
                  >
                    {statusLabels[s]}
                  </button>
                ))}
              </div>
              <button
                type="button"
                className="btn btn-primary"
                onClick={async () => {
                  await convertToLiveOrder(selected.id)
                  refresh()
                }}
              >
                Convert to shop order
              </button>
            </div>
          </article>
        ) : (
          <p className="admin-empty">Select a custom order to review.</p>
        )}
      </div>
    </div>
  )
}

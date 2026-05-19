import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { getOrdersForCustomer, payDeposit } from '../../services/orderService'
import type { CustomOrderRequest } from '../../types/customOrder'

const statusLabels: Record<string, string> = {
  pending_review: 'Awaiting review',
  quoted: 'Quote sent',
  accepted_pending_deposit: 'Confirmed — pay deposit',
  deposit_paid: 'Deposit paid',
  declined: 'Declined',
  in_production: 'In production',
  ready: 'Ready for pickup / dispatch',
  shipped: 'Shipped',
  completed: 'Completed',
}

function DepositNotice({ order }: { order: CustomOrderRequest }) {
  const [now, setNow] = useState(Date.now())

  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 60_000)
    return () => clearInterval(t)
  }, [])

  if (!order.depositNonRefundableAfter && order.status === 'accepted_pending_deposit') {
    return (
      <div className="deposit-warning">
        <strong>30% deposit required</strong>
        <p>
          Once Boka Studio confirms your piece will be made, a <strong>30% deposit</strong> secures your
          slot. After you pay, the deposit becomes <strong>non-refundable after 48 hours</strong>.
        </p>
      </div>
    )
  }

  if (!order.depositNonRefundableAfter) return null

  const deadline = new Date(order.depositNonRefundableAfter).getTime()
  const remaining = deadline - now
  const isPast = remaining <= 0
  const hours = Math.max(0, Math.floor(remaining / (1000 * 60 * 60)))
  const mins = Math.max(0, Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60)))

  return (
    <div className={`deposit-warning ${isPast ? 'deposit-locked' : ''}`}>
      <strong>{isPast ? 'Deposit is non-refundable' : 'Deposit refund window'}</strong>
      <p>
        {isPast
          ? 'Your 30% deposit can no longer be refunded per our studio policy.'
          : `You may request a deposit refund until ${new Date(order.depositNonRefundableAfter!).toLocaleString()}. Time left: ${hours}h ${mins}m.`}
      </p>
    </div>
  )
}

export function MyOrders() {
  const { user } = useAuth()
  const [orders, setOrders] = useState<CustomOrderRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [payingId, setPayingId] = useState<string | null>(null)

  useEffect(() => {
    if (!user) return
    getOrdersForCustomer(user.id).then((data) => {
      setOrders(data)
      setLoading(false)
    })
  }, [user])

  async function handlePayDeposit(orderId: string) {
    setPayingId(orderId)
    try {
      const updated = await payDeposit(orderId)
      if (updated) {
        setOrders((prev) => prev.map((o) => (o.id === orderId ? updated : o)))
      }
    } catch (e) {
      alert(e instanceof Error ? e.message : 'Payment failed')
    } finally {
      setPayingId(null)
    }
  }

  if (loading) return <p className="page-loading">Loading your orders…</p>

  return (
    <>
      <section className="page-hero">
        <p className="eyebrow">My orders</p>
        <h1>Custom design requests</h1>
        <p>Track quotes, pay your 30% deposit, and follow production.</p>
      </section>

      <section className="section">
        {orders.length === 0 ? (
          <div className="info-box">
            <p>You have not submitted any custom designs yet.</p>
            <Link to="/design" className="btn btn-primary">
              Design your own
            </Link>
          </div>
        ) : (
          <ul className="order-list">
            {orders.map((order) => (
              <li key={order.id} className="order-card">
                <div className="order-card-header">
                  <span className={`status-badge status-${order.status}`}>
                    {statusLabels[order.status] ?? order.status}
                  </span>
                  <time dateTime={order.createdAt}>
                    {new Date(order.createdAt).toLocaleDateString()}
                  </time>
                </div>
                <p className="live-summary">{order.liveSummary}</p>

                {order.quotedPrice != null && (
                  <p className="quote-box">
                    <strong>Quote: R{order.quotedPrice.toLocaleString('en-ZA')}</strong>
                    {order.quoteMessage && <span> — {order.quoteMessage}</span>}
                  </p>
                )}

                {order.status === 'accepted_pending_deposit' && order.estimatedReadyDate && (
                  <p className="timeline-box">
                    Ready about {new Date(order.estimatedReadyDate).toLocaleDateString()}
                    {order.estimatedDeliveryDate &&
                      ` · Delivery ${new Date(order.estimatedDeliveryDate).toLocaleDateString()}`}
                    {order.whyTimelineLong && <span> — {order.whyTimelineLong}</span>}
                  </p>
                )}

                {order.status === 'declined' && order.rejectionReason && (
                  <p className="rejection-box">Reason: {order.rejectionReason}</p>
                )}

                <DepositNotice order={order} />

                {order.status === 'accepted_pending_deposit' && order.depositAmount != null && (
                  <div className="deposit-pay">
                    <p>
                      Pay <strong>R{order.depositAmount.toLocaleString('en-ZA')}</strong> (30% deposit) to
                      start production.
                    </p>
                    <button
                      type="button"
                      className="btn btn-primary"
                      disabled={payingId === order.id}
                      onClick={() => handlePayDeposit(order.id)}
                    >
                      {payingId === order.id ? 'Processing…' : 'Pay 30% deposit (simulated)'}
                    </button>
                  </div>
                )}

                {order.depositPaid && order.depositPaidAt && (
                  <p className="deposit-paid-note">
                    Deposit paid {new Date(order.depositPaidAt).toLocaleString()}
                  </p>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>
    </>
  )
}

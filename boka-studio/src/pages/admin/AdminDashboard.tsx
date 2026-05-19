import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getAllOrders } from '../../services/orderService'
import type { CustomOrderRequest } from '../../types/customOrder'

export function AdminDashboard() {
  const [orders, setOrders] = useState<CustomOrderRequest[]>([])

  useEffect(() => {
    getAllOrders().then(setOrders)
  }, [])

  const pending = orders.filter((o) => o.status === 'pending_review').length
  const quoted = orders.filter((o) => o.status === 'quoted').length
  const active = orders.filter((o) =>
    ['accepted', 'in_production', 'shipped'].includes(o.status),
  ).length

  return (
    <div className="admin-page">
      <h1>Dashboard</h1>
      <p className="admin-lead">Custom order requests and studio overview.</p>

      <div className="admin-stats">
        <div className="stat-card">
          <span className="stat-num">{pending}</span>
          <span>Pending review</span>
        </div>
        <div className="stat-card">
          <span className="stat-num">{quoted}</span>
          <span>Awaiting customer</span>
        </div>
        <div className="stat-card">
          <span className="stat-num">{active}</span>
          <span>Active orders</span>
        </div>
        <div className="stat-card">
          <span className="stat-num">{orders.length}</span>
          <span>Total requests</span>
        </div>
      </div>

      <Link to="/admin/orders" className="btn btn-primary">
        View all custom orders →
      </Link>
    </div>
  )
}

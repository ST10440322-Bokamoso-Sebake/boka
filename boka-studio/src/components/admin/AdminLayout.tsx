import { Link, NavLink, Outlet } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const links = [
  { to: '/admin', label: 'Dashboard', end: true },
  { to: '/admin/products', label: 'Products' },
  { to: '/admin/orders', label: 'Orders' },
  { to: '/admin/products', label: 'Products' },
  { to: '/admin/yarn', label: 'Yarn stock' },
]

export function AdminLayout() {
  const { user, logout } = useAuth()

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <Link to="/" className="brand">
          Boka <span>Admin</span>
        </Link>
        <p className="admin-user">{user?.name}</p>
        <nav>
          {links.map(({ to, label, end }) => (
            <NavLink key={to} to={to} end={end} className={({ isActive }) => (isActive ? 'active' : undefined)}>
              {label}
            </NavLink>
          ))}
        </nav>
        <button type="button" className="btn btn-outline admin-logout" onClick={logout}>
          Log out
        </button>
        <Link to="/" className="admin-back">
          ← View public site
        </Link>
      </aside>
      <div className="admin-main">
        <Outlet />
      </div>
    </div>
  )
}

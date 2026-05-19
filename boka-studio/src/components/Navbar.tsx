import { Link, NavLink } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const publicLinks = [
  { to: '/', label: 'Home' },
  { to: '/boutique', label: 'Boutique' },
  { to: '/design', label: 'Design your own' },
  { to: '/photography', label: 'Photography' },
  { to: '/gallery', label: 'Gallery' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
]

export function Navbar() {
  const { user, logout } = useAuth()

  return (
    <header className="navbar">
      <Link to="/" className="brand">
        Boka <span>Studio</span>
      </Link>
      <nav className="nav-links" aria-label="Main">
        {publicLinks.map(({ to, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) => (isActive ? 'active' : undefined)}
          >
            {label}
          </NavLink>
        ))}
        {user?.role === 'customer' && (
          <NavLink to="/my-orders" className={({ isActive }) => (isActive ? 'active' : undefined)}>
            My orders
          </NavLink>
        )}
        {user?.role === 'admin' && (
          <NavLink to="/admin" className={({ isActive }) => (isActive ? 'active' : undefined)}>
            Admin
          </NavLink>
        )}
      </nav>
      <div className="nav-auth">
        {user ? (
          <>
            <span className="nav-user">Hi, {user.name.split(' ')[0]}</span>
            <button type="button" className="btn btn-outline btn-sm" onClick={logout}>
              Log out
            </button>
          </>
        ) : (
          <>
            <Link to="/auth/login" className="btn btn-outline btn-sm">
              Log in
            </Link>
            <Link to="/auth/register" className="btn btn-primary btn-sm">
              Register
            </Link>
          </>
        )}
      </div>
    </header>
  )
}

import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import type { UserRole } from '../../types/auth'

type Props = {
  children: React.ReactNode
  role?: UserRole
}

export function ProtectedRoute({ children, role }: Props) {
  const { user, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <p className="page-loading" role="status">
        Loading…
      </p>
    )
  }

  if (!user) {
    return <Navigate to="/auth/login" state={{ from: location.pathname }} replace />
  }

  if (role && user.role !== role) {
    return (
      <Navigate
        to={user.role === 'admin' ? '/admin' : '/my-orders'}
        replace
      />
    )
  }

  return children
}

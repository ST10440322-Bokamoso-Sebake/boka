import { useState, type FormEvent } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import type { UserRole } from '../../types/auth'

export function Register() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const initialRole = (location.state as { role?: UserRole })?.role ?? 'customer'

  const [role, setRole] = useState<UserRole>(initialRole)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [adminCode, setAdminCode] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    const result = await register(
      email,
      name,
      role,
      role === 'admin' ? adminCode : undefined,
    )
    setLoading(false)
    if (!result.ok) {
      setError(result.error ?? 'Registration failed.')
      return
    }
    navigate(role === 'admin' ? '/admin' : '/design', { replace: true })
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1>Create your account</h1>
        <p className="auth-sub">Sign up in one step — start designing or managing orders right away.</p>

        <div className="role-tabs" role="tablist">
          <button
            type="button"
            className={role === 'customer' ? 'active' : undefined}
            onClick={() => setRole('customer')}
          >
            Customer
          </button>
          <button
            type="button"
            className={role === 'admin' ? 'active' : undefined}
            onClick={() => setRole('admin')}
          >
            Admin / Studio
          </button>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <label>
            Full name
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
            />
          </label>
          <label>
            Email
            <input
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
            />
          </label>
          {role === 'admin' && (
            <label>
              Admin invite code
              <input
                type="password"
                required
                value={adminCode}
                onChange={(e) => setAdminCode(e.target.value)}
                placeholder="Provided by studio owner"
              />
            </label>
          )}
          {error && <p className="form-error">{error}</p>}
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Creating account…' : 'Create account & continue'}
          </button>
        </form>

        <p className="auth-footer">
          Already registered? <Link to="/auth/login">Log in</Link>
        </p>
      </div>
    </div>
  )
}

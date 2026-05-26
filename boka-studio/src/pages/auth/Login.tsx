import { useState, type FormEvent } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import type { UserRole } from '../../types/auth'

export function Login() {
  const { login, rememberedEmail } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = (location.state as { from?: string })?.from ?? '/'

  const [email, setEmail] = useState(rememberedEmail ?? '')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    const result = await login(email)
    setLoading(false)
    if (!result.ok) {
      setError(result.error ?? 'Could not sign in.')
      return
    }
    const isOwner = email.toLowerCase().trim() === 'bokasyarnmarket@gmail.com'
    const dest =
      isOwner
        ? '/admin'
        : from && from !== '/auth/login'
          ? from
          : '/design'
    navigate(dest, { replace: true })
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1>Welcome back</h1>
        <p className="auth-sub">Enter your email to continue — no verification code needed.</p>

        <form onSubmit={handleSubmit} className="auth-form">
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
          {error && <p className="form-error">{error}</p>}
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>

        <p className="auth-footer">
          First time here?{' '}
          <Link to="/auth/register">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  )
}

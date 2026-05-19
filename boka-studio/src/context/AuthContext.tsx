import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type { UserProfile, UserRole } from '../types/auth'
import * as authService from '../services/authService'

type AuthResult = {
  ok: boolean
  error?: string
  warning?: string
}

type AuthContextValue = {
  user: UserProfile | null
  loading: boolean
  rememberedEmail: string | null
  login: (email: string, role: UserRole) => Promise<AuthResult>
  register: (
    email: string,
    name: string,
    role: UserRole,
    adminInviteCode?: string,
  ) => Promise<AuthResult>
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [rememberedEmail, setRememberedEmail] = useState<string | null>(null)

  useEffect(() => {
    setUser(authService.getSession())
    setRememberedEmail(authService.getRememberedEmail())
    setLoading(false)
  }, [])

  const login = useCallback(async (email: string, role: UserRole) => {
    const result = await authService.loginDirect(email, role)
    if (result.ok && result.profile) {
      setUser(result.profile)
      setRememberedEmail(result.profile.email)
    }
    return { ok: result.ok, error: result.error, warning: result.warning }
  }, [])

  const register = useCallback(
    async (email: string, name: string, role: UserRole, adminInviteCode?: string) => {
      const result = await authService.registerDirect(email, name, role, adminInviteCode)
      if (result.ok && result.profile) {
        setUser(result.profile)
        setRememberedEmail(result.profile.email)
      }
      return { ok: result.ok, error: result.error, warning: result.warning }
    },
    [],
  )

  const logout = useCallback(() => {
    authService.logout()
    setUser(null)
  }, [])

  const value = useMemo(
    () => ({
      user,
      loading,
      rememberedEmail,
      login,
      register,
      logout,
    }),
    [user, loading, rememberedEmail, login, register, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}

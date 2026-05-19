import { apiFetch, setApiToken, type ApiAuthResponse } from '../lib/api'
import type { UserProfile, UserRole } from '../types/auth'

export async function syncWithBokaApi(
  email: string,
  name: string,
  role: UserRole,
): Promise<{ ok: boolean; profile?: UserProfile; error?: string }> {
  try {
    const res = await apiFetch<ApiAuthResponse>('api/auth/supabase-sync', {
      method: 'POST',
      body: JSON.stringify({
        email,
        name,
        role,
      }),
    })

    if (!res.success || !res.token || !res.user) {
      return { ok: false, error: res.message ?? 'Could not sync with BokaMarket API.' }
    }

    setApiToken(res.token)

    const profile: UserProfile = {
      id: String(res.user.id),
      email: res.user.email,
      name: `${res.user.firstName} ${res.user.lastName}`.trim() || name,
      role: role === 'admin' || res.user.email.includes('admin') ? 'admin' : 'customer',
      verified: true,
      createdAt: new Date().toISOString(),
    }

    return { ok: true, profile }
  } catch (e) {
    return {
      ok: false,
      error: e instanceof Error ? e.message : 'API connection failed.',
    }
  }
}

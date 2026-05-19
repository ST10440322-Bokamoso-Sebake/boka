import type { UserProfile, UserRole } from '../types/auth'
import { setApiToken } from '../lib/api'
import { syncWithBokaApi } from './apiAuth'

const PROFILES_KEY = 'boka_profiles'
const SESSION_KEY = 'boka_session'
const REMEMBER_KEY = 'boka_remembered_email'

function loadProfiles(): UserProfile[] {
  try {
    const raw = localStorage.getItem(PROFILES_KEY)
    return raw ? (JSON.parse(raw) as UserProfile[]) : []
  } catch {
    return []
  }
}

function saveProfiles(profiles: UserProfile[]) {
  localStorage.setItem(PROFILES_KEY, JSON.stringify(profiles))
}

export function getRememberedEmail(): string | null {
  return localStorage.getItem(REMEMBER_KEY)
}

export function rememberEmail(email: string) {
  localStorage.setItem(REMEMBER_KEY, email.toLowerCase())
}

export function getSession(): UserProfile | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY)
    return raw ? (JSON.parse(raw) as UserProfile) : null
  } catch {
    return null
  }
}

export function clearSession() {
  localStorage.removeItem(SESSION_KEY)
  setApiToken(null)
}

function setSession(profile: UserProfile) {
  localStorage.setItem(SESSION_KEY, JSON.stringify(profile))
  rememberEmail(profile.email)
}

export function findProfileByEmail(email: string): UserProfile | undefined {
  return loadProfiles().find((p) => p.email === email.toLowerCase())
}

async function completeSignIn(
  email: string,
  name: string,
  role: UserRole,
): Promise<{ ok: boolean; profile?: UserProfile; error?: string; warning?: string }> {
  const normalized = email.toLowerCase().trim()
  if (!normalized.includes('@')) {
    return { ok: false, error: 'Enter a valid email address.' }
  }

  const apiResult = await syncWithBokaApi(normalized, name, role)

  let profile: UserProfile

  if (apiResult.ok && apiResult.profile) {
    profile = apiResult.profile
  } else {
    profile = {
      id: crypto.randomUUID(),
      email: normalized,
      name: name.trim() || normalized.split('@')[0],
      role,
      verified: true,
      createdAt: new Date().toISOString(),
    }
    const profiles = loadProfiles().filter((p) => p.email !== normalized)
    profiles.push(profile)
    saveProfiles(profiles)
    setSession(profile)
    return {
      ok: true,
      profile,
      warning: apiResult.error
        ? 'Signed in locally — store API was slow or unavailable. You can still browse and design.'
        : undefined,
    }
  }

  const profiles = loadProfiles().filter((p) => p.email !== normalized)
  profiles.push(profile)
  saveProfiles(profiles)
  setSession(profile)
  return { ok: true, profile }
}

export async function registerDirect(
  email: string,
  name: string,
  role: UserRole,
  adminInviteCode?: string,
): Promise<{ ok: boolean; profile?: UserProfile; error?: string; warning?: string }> {
  const normalized = email.toLowerCase().trim()

  if (findProfileByEmail(normalized)) {
    return { ok: false, error: 'This email is already registered. Please log in instead.' }
  }

  if (role === 'admin') {
    const expected = import.meta.env.VITE_ADMIN_INVITE_CODE ?? 'boka-admin-2026'
    if (adminInviteCode !== expected) {
      return { ok: false, error: 'Invalid admin invite code.' }
    }
  }

  return completeSignIn(normalized, name, role)
}

export async function loginDirect(
  email: string,
  role: UserRole,
): Promise<{ ok: boolean; profile?: UserProfile; error?: string; warning?: string }> {
  const normalized = email.toLowerCase().trim()
  const existing = findProfileByEmail(normalized)

  if (existing && existing.role !== role) {
    return {
      ok: false,
      error:
        role === 'admin'
          ? 'This email is registered as a customer. Use customer login.'
          : 'This email is registered as admin. Use admin login.',
    }
  }

  const name = existing?.name ?? normalized.split('@')[0]
  return completeSignIn(normalized, name, role)
}

export function logout() {
  clearSession()
}

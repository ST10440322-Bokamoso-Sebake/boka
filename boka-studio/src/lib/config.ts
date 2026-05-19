export const API_BASE =
  (import.meta.env.VITE_API_URL as string | undefined)?.replace(/\/$/, '') ||
  'https://boka-market-backend.onrender.com'

export const SUPABASE_URL =
  (import.meta.env.VITE_SUPABASE_URL as string | undefined)?.replace(/\/$/, '') ||
  'https://qmzjdtkdzmkcrmtulwuv.supabase.co'

export function apiImageUrl(path: string | undefined | null): string {
  if (!path) return 'https://placehold.co/400x400/F7E8FA/7E3091?text=Boka'
  if (path.startsWith('http')) return path
  return `${API_BASE}/${path.replace(/^\//, '')}`
}

import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import { SUPABASE_URL } from './config'

const key = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined

export const isSupabaseConfigured = Boolean(SUPABASE_URL && key && key.length > 10)

let client: SupabaseClient | null = null

export function getSupabase(): SupabaseClient | null {
  if (!isSupabaseConfigured) return null
  if (!client) {
    client = createClient(SUPABASE_URL, key!)
  }
  return client
}

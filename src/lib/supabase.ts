import { createClient } from '@supabase/supabase-js'
import type { Database } from '@lib/database.types'

const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL
const supabaseAnonKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY
const supabaseServiceRoleKey = import.meta.env.SUPABASE_SERVICE_ROLE_KEY

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)

// For server-side only operations (e.g., in API routes)
export const supabaseAdmin = createClient<Database>(supabaseUrl, supabaseServiceRoleKey)

// helper function to check if we're on the server
export function isServer() {
  return typeof window === 'undefined'
}

/// function to get appropriate supabase client
export function getSupabase() {
  if (isServer()) {
    return supabaseAdmin
  }
  return supabase
}

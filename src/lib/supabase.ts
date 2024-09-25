import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL
const supabaseAnonKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// For server-side only operations (e.g., in API routes)
export const supabaseAdmin = createClient(
  supabaseUrl,
  import.meta.env.SUPABASE_SERVICE_ROLE_KEY,
)

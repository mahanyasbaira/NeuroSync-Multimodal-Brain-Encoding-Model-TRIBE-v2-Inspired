import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/lib/supabase/types'

/**
 * Browser-side Supabase client.
 * Uses the anon key — safe to expose to the client.
 * RLS policies enforce data isolation server-side.
 */
export function createBrowserClient() {
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

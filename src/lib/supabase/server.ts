import { createClient } from '@supabase/supabase-js'
import { auth } from '@clerk/nextjs/server'

/**
 * Server-side Supabase client with the current user's clerk_id in headers.
 * Must only be used in Server Components, Route Handlers, and Server Actions.
 */
export async function createServerClient() {
  const { userId } = await auth()

  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      global: {
        headers: {
          'x-clerk-id': userId ?? '',
        },
      },
    }
  )
}

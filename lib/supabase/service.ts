import { createClient as createSupabaseClient } from "@supabase/supabase-js"
import type { Database } from "@/src/types/supabase"
// @/src/types/supabase maps to src/types/supabase.ts — ensure tsconfig paths alias @/ to project root

// Service role client — bypasses RLS. Only use in trusted server-side contexts
// (Server Actions, API routes). Never expose to the browser.
export function createServiceClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url || !key) {
    throw new Error("[Supabase] NEXT_PUBLIC_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY são obrigatórios")
  }

  return createSupabaseClient<Database>(url, key, {
    auth: { persistSession: false },
  })
}

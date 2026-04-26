import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

// Handles the PKCE OAuth/magic-link callback from Supabase Auth.
// Supabase redirects here after email confirmation with a `code` param.
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get("code")
  const rawNext = searchParams.get("next") ?? "/dashboard"
  // Prevent open redirect: only allow relative paths that don't start with //
  const next = rawNext.startsWith("/") && !rawNext.startsWith("//") ? rawNext : "/dashboard"

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`)
    }
    console.error("[auth/callback] exchangeCodeForSession failed", {
      code: error.code,
      message: error.message,
    })
  }

  return NextResponse.redirect(`${origin}/login?error=auth_callback_failed`)
}

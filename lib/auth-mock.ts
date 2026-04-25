const DEMO_EMAIL = "demo@pipeflow.com"
const DEMO_PASSWORD = "demo123"
const DEMO_NAME = "Demo User"
const SESSION_KEY = "pf_demo_session"

// Reads at runtime on the server — NEXT_PUBLIC_ vars are inlined at build time on the client
export function isMockMode(): boolean {
  return (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    process.env.NEXT_PUBLIC_SUPABASE_URL.trim() === "" ||
    !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.trim() === ""
  )
}

export function mockSignIn(
  email: string,
  password: string
): { error: string | null } {
  if (email === DEMO_EMAIL && password === DEMO_PASSWORD) {
    if (typeof window !== "undefined") {
      localStorage.setItem(
        SESSION_KEY,
        JSON.stringify({ email, name: DEMO_NAME })
      )
    }
    return { error: null }
  }
  return { error: "E-mail ou senha incorretos. Use demo@pipeflow.com / demo123" }
}

export function mockSignUp(
  email: string,
  _password: string,
  name: string
): { error: string | null } {
  if (typeof window !== "undefined") {
    localStorage.setItem(SESSION_KEY, JSON.stringify({ email, name }))
  }
  return { error: null }
}

export function mockSignOut(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem(SESSION_KEY)
  }
}

export function mockGetSession(): { email: string; name: string } | null {
  if (typeof window === "undefined") return null
  try {
    const raw = localStorage.getItem(SESSION_KEY)
    return raw ? (JSON.parse(raw) as { email: string; name: string }) : null
  } catch {
    return null
  }
}

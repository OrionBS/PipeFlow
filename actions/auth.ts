"use server"

import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"

export type AuthResult = { error: string } | null

export async function login(email: string, password: string): Promise<AuthResult> {
  const supabase = await createClient()

  const { error } = await supabase.auth.signInWithPassword({ email, password })

  if (error) {
    return { error: "E-mail ou senha incorretos." }
  }

  redirect("/dashboard")
}

export async function register(
  name: string,
  email: string,
  password: string
): Promise<AuthResult> {
  const supabase = await createClient()

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: name },
      emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback?next=/onboarding`,
    },
  })

  if (error) {
    // "user_already_exists" is the stable Supabase error code for duplicate signups
    if (error.code === "user_already_exists" || error.status === 422) {
      return { error: "Este e-mail já está cadastrado." }
    }
    return { error: "Erro ao criar conta. Tente novamente." }
  }

  redirect("/onboarding")
}

export async function logout(): Promise<void> {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect("/login")
}

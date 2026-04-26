"use server"

import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"

export type AuthResult = { error: string } | { success: string } | null

export async function login(email: string, password: string): Promise<AuthResult> {
  const supabase = await createClient()

  const { error } = await supabase.auth.signInWithPassword({ email, password })

  if (error) {
    if (error.code === "email_not_confirmed") {
      return { error: "Confirme seu e-mail antes de entrar. Verifique sua caixa de entrada." }
    }
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

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: name },
      emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback?next=/onboarding`,
    },
  })

  if (error) {
    if (error.code === "user_already_exists" || error.status === 422) {
      return { error: "Este e-mail já está cadastrado." }
    }
    if (error.code === "over_email_send_rate_limit") {
      return { error: "Muitas tentativas de cadastro. Aguarde alguns minutos e tente novamente." }
    }
    return { error: "Erro ao criar conta. Tente novamente." }
  }

  // If email confirmation is disabled in Supabase, the session is created immediately
  // and we can redirect straight to onboarding. Otherwise, tell the user to check email.
  if (data.session) {
    redirect("/onboarding")
  }

  return { success: "Conta criada! Verifique seu e-mail para confirmar o cadastro antes de entrar." }
}

export async function logout(): Promise<void> {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect("/login")
}

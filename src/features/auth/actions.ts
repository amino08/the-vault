"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { bootstrapAdminRole, ensureUserProfile } from "@/lib/auth/bootstrap-admin";
import { createClient } from "@/lib/supabase/server";
import { routes } from "@/config/routes";

export type AuthActionResult = {
  error?: string;
};

export async function signIn(formData: FormData): Promise<AuthActionResult> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return { error: "Email and password are required." };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return { error: error.message };
  }

  if (data.user) {
    await ensureUserProfile(data.user.id, data.user.email ?? email);
    await bootstrapAdminRole(data.user.id, data.user.email ?? email);
  }

  revalidatePath("/account");
  const next = String(formData.get("next") ?? "").trim();
  const safeNext = next.startsWith("/") && !next.startsWith("//") ? next : routes.account;
  redirect(safeNext);
}

export async function signUp(formData: FormData): Promise<AuthActionResult> {
  const fullName = String(formData.get("full_name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return { error: "Email and password are required." };
  }

  if (password.length < 8) {
    return { error: "Password must be at least 8 characters." };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: fullName || undefined },
      emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"}${routes.auth.callback}`,
    },
  });

  if (error) {
    return { error: error.message };
  }

  if (data.user) {
    await ensureUserProfile(data.user.id, email, fullName);
    await bootstrapAdminRole(data.user.id, email);

    if (!data.session) {
      return {
        error: "Check your email to confirm your account before signing in.",
      };
    }
  }

  revalidatePath("/account");
  const next = String(formData.get("next") ?? "").trim();
  const safeNext = next.startsWith("/") && !next.startsWith("//") ? next : routes.account;
  redirect(safeNext);
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/account");
  redirect(routes.auth.login);
}

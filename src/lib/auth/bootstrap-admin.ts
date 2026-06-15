import { createAdminClient, hasAdminCredentials } from "@/lib/supabase/admin";
import type { UserRole } from "@/types";

function getAdminEmails(): string[] {
  const raw = process.env.VAULT_ADMIN_EMAILS ?? "";
  return raw
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
}

/**
 * Promote configured emails to admin on first auth.
 * Uses service role so it works before RLS grants admin update.
 */
export async function bootstrapAdminRole(userId: string, email: string): Promise<UserRole> {
  const adminEmails = getAdminEmails();
  const normalizedEmail = email.trim().toLowerCase();

  if (!adminEmails.includes(normalizedEmail)) {
    return "client";
  }

  if (!hasAdminCredentials()) {
    console.warn("[bootstrapAdminRole] SUPABASE_SERVICE_ROLE_KEY not set — skipping admin promotion");
    return "client";
  }

  const admin = createAdminClient();
  const { error } = await admin
    .from("users")
    .update({ role: "admin" })
    .eq("id", userId);

  if (error) {
    console.error("[bootstrapAdminRole] Failed to promote admin:", error.message);
    return "client";
  }

  return "admin";
}

export async function ensureUserProfile(userId: string, email: string, fullName?: string) {
  if (!hasAdminCredentials()) return;

  const admin = createAdminClient();
  const { data: existing } = await admin.from("users").select("id").eq("id", userId).maybeSingle();

  if (!existing) {
    await admin.from("users").insert({
      id: userId,
      email,
      full_name: fullName ?? null,
      role: "client",
    });
  }

  await bootstrapAdminRole(userId, email);
}

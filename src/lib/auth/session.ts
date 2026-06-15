import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { UserProfile, UserRole } from "@/types";

export async function getSessionUser() {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return null;
  }

  return user;
}

export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", userId)
    .maybeSingle();

  if (error || !data) {
    return null;
  }

  return data as UserProfile;
}

export async function getCurrentProfile(): Promise<UserProfile | null> {
  const user = await getSessionUser();
  if (!user) return null;
  return getUserProfile(user.id);
}

export function isStaffRole(role: UserRole): boolean {
  return role === "admin" || role === "staff";
}

export async function requireAuth(redirectTo = "/account/login") {
  const user = await getSessionUser();
  if (!user) {
    redirect(redirectTo);
  }
  return user;
}

export async function requireStaff() {
  const user = await requireAuth();
  const profile = await getUserProfile(user.id);

  if (!profile || !isStaffRole(profile.role)) {
    redirect("/account");
  }

  return { user, profile };
}

export async function requireAdmin() {
  const user = await requireAuth();
  const profile = await getUserProfile(user.id);

  if (!profile || profile.role !== "admin") {
    redirect("/account");
  }

  return { user, profile };
}

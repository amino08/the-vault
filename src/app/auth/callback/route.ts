import { NextResponse } from "next/server";
import { ensureUserProfile, bootstrapAdminRole } from "@/lib/auth/bootstrap-admin";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/account";

  if (code) {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error && data.user) {
      const email = data.user.email ?? "";
      await ensureUserProfile(data.user.id, email);
      await bootstrapAdminRole(data.user.id, email);
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  return NextResponse.redirect(`${origin}/account/login?error=auth`);
}

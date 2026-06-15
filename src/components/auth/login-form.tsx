"use client";

import { useActionState } from "react";
import Link from "next/link";
import { signIn, type AuthActionResult } from "@/features/auth/actions";
import { routes } from "@/config/routes";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const initialState: AuthActionResult = {};

interface LoginFormProps {
  nextPath?: string;
}

export function LoginForm({ nextPath }: LoginFormProps) {
  const [state, formAction, pending] = useActionState(
    async (_prev: AuthActionResult, formData: FormData) => signIn(formData),
    initialState,
  );

  return (
    <form action={formAction} className="surface-panel space-y-6 rounded-sm p-10">
      {nextPath && <input type="hidden" name="next" value={nextPath} />}

      {state.error && (
        <p className="rounded-sm border border-red-400/30 bg-red-950/30 px-4 py-3 text-sm text-red-300">
          {state.error}
        </p>
      )}

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" type="email" required placeholder="you@example.com" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input id="password" name="password" type="password" required autoComplete="current-password" />
      </div>

      <Button type="submit" className="w-full" disabled={pending}>
        {pending ? "Signing in..." : "Sign In"}
      </Button>

      <p className="text-center text-sm text-vault-muted">
        No account?{" "}
        <Link
          href={nextPath ? `${routes.auth.signup}?next=${encodeURIComponent(nextPath)}` : routes.auth.signup}
          className="text-vault-gold hover:underline"
        >
          Create one
        </Link>
      </p>
    </form>
  );
}

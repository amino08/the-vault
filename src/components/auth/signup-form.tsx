"use client";

import { useActionState } from "react";
import Link from "next/link";
import { signUp, type AuthActionResult } from "@/features/auth/actions";
import { routes } from "@/config/routes";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const initialState: AuthActionResult = {};

interface SignupFormProps {
  nextPath?: string;
}

export function SignupForm({ nextPath }: SignupFormProps) {
  const [state, formAction, pending] = useActionState(
    async (_prev: AuthActionResult, formData: FormData) => signUp(formData),
    initialState,
  );

  return (
    <form action={formAction} className="surface-panel space-y-6 rounded-sm p-10">
      {nextPath && <input type="hidden" name="next" value={nextPath} />}

      {state.error && (
        <p
          className={`rounded-sm border px-4 py-3 text-sm ${
            state.error.includes("Check your email")
              ? "border-vault-gold/30 bg-vault-gold/10 text-vault-gold"
              : "border-red-400/30 bg-red-950/30 text-red-300"
          }`}
        >
          {state.error}
        </p>
      )}

      <div className="space-y-2">
        <Label htmlFor="full_name">Full Name</Label>
        <Input id="full_name" name="full_name" placeholder="Your name" autoComplete="name" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" type="email" required placeholder="you@example.com" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          name="password"
          type="password"
          required
          minLength={8}
          autoComplete="new-password"
        />
      </div>

      <Button type="submit" className="w-full" disabled={pending}>
        {pending ? "Creating account..." : "Create Account"}
      </Button>

      <p className="text-center text-sm text-vault-muted">
        Already registered?{" "}
        <Link
          href={nextPath ? `${routes.auth.login}?next=${encodeURIComponent(nextPath)}` : routes.auth.login}
          className="text-vault-gold hover:underline"
        >
          Sign in
        </Link>
      </p>
    </form>
  );
}

"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { routes } from "@/config/routes";

interface SaveDraftAuthPromptProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SaveDraftAuthPrompt({ open, onOpenChange }: SaveDraftAuthPromptProps) {
  const returnTo = `${routes.create}?restore=1`;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <p className="text-[10px] uppercase tracking-[0.28em] text-vault-gold">Private Atelier</p>
          <DialogTitle>Save Your Design</DialogTitle>
          <DialogDescription>
            Create an account or sign in to save your design. Your current configuration will be
            restored when you return.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="sm:flex-col">
          <Button asChild className="w-full">
            <Link href={`${routes.auth.login}?next=${encodeURIComponent(returnTo)}`}>Sign In</Link>
          </Button>
          <Button asChild variant="outline" className="w-full">
            <Link href={`${routes.auth.signup}?next=${encodeURIComponent(returnTo)}`}>
              Create Account
            </Link>
          </Button>
          <Button type="button" variant="ghost" className="w-full" onClick={() => onOpenChange(false)}>
            Continue Designing
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

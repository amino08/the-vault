"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  createCommissionSchema,
  type CreateCommissionInput,
} from "@/features/commissions/schemas";
import { createCommission } from "@/features/commissions/actions";
import {
  PIECE_TYPES,
  PIECE_TYPE_LABELS,
  STORY_TYPES,
  STORY_TYPE_LABELS,
  type PieceType,
  type StoryType,
} from "@/config/commission-status";
import { routes } from "@/config/routes";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface CreateCommissionFormProps {
  isAuthenticated: boolean;
}

export function CreateCommissionForm({ isAuthenticated }: CreateCommissionFormProps) {
  const [pending, startTransition] = useTransition();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateCommissionInput>({
    resolver: zodResolver(createCommissionSchema),
    defaultValues: {
      story_type: "milestone",
      piece_type: "pendant",
    },
  });

  if (!isAuthenticated) {
    return (
      <div className="border border-white/5 bg-vault-charcoal p-10 text-center">
        <p className="text-vault-pearl/70">Sign in to submit a commission inquiry.</p>
        <div className="mt-6 flex justify-center gap-4">
          <Button asChild>
            <Link href={routes.auth.login}>Sign In</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href={routes.auth.signup}>Create Account</Link>
          </Button>
        </div>
      </div>
    );
  }

  const onSubmit = (data: CreateCommissionInput) => {
    setServerError(null);
    startTransition(async () => {
      const result = await createCommission(data);
      if (result?.error) {
        setServerError(result.error);
      }
    });
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-8 border border-white/5 bg-vault-charcoal p-10"
    >
      {serverError && (
        <p className="rounded-sm border border-red-400/30 bg-red-950/30 px-4 py-3 text-sm text-red-300">
          {serverError}
        </p>
      )}

      <div className="space-y-2">
        <Label htmlFor="title">Commission Title</Label>
        <Input id="title" placeholder="e.g. Legacy Signet for Family Crest" {...register("title")} />
        {errors.title && <p className="text-xs text-red-400">{errors.title.message}</p>}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="story_type">Story Type</Label>
          <select
            id="story_type"
            className="flex h-11 w-full rounded-sm border border-white/10 bg-vault-smoke px-4 text-sm capitalize"
            {...register("story_type")}
          >
            {STORY_TYPES.map((t) => (
              <option key={t} value={t}>
                {STORY_TYPE_LABELS[t as StoryType]}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="piece_type">Piece Type</Label>
          <select
            id="piece_type"
            className="flex h-11 w-full rounded-sm border border-white/10 bg-vault-smoke px-4 text-sm"
            {...register("piece_type")}
          >
            {PIECE_TYPES.map((t) => (
              <option key={t} value={t}>
                {PIECE_TYPE_LABELS[t as PieceType]}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="story_narrative">Your Story</Label>
        <textarea
          id="story_narrative"
          rows={6}
          className="flex w-full rounded-sm border border-white/10 bg-vault-smoke px-4 py-3 text-sm"
          placeholder="Share the meaning, milestone, or symbolism behind this commission..."
          {...register("story_narrative")}
        />
        {errors.story_narrative && (
          <p className="text-xs text-red-400">{errors.story_narrative.message}</p>
        )}
      </div>

      <Button type="submit" size="lg" disabled={pending}>
        {pending ? "Submitting..." : "Submit Inquiry"}
      </Button>
    </form>
  );
}

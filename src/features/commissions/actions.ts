"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getCurrentProfile, getSessionUser, isStaffRole } from "@/lib/auth/session";
import { createAdminClient, hasAdminCredentials } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { routes } from "@/config/routes";
import { createCommissionSchema, saveDesignDraftSchema, beginCommissionSchema, type CreateCommissionInput, type SaveDesignDraftInput, type BeginCommissionInput } from "@/features/commissions/schemas";
import { estimateRingInvestment } from "@/features/builder/pricing/investment-estimate";
import type { RingBuilderConfig } from "@/features/builder/types";
import { isRingBuilderConfig } from "@/features/builder/types";
import { resolveCommissionCheckoutUrl, DESIGN_DEPOSIT_CENTS } from "@/config/aevum-checkout";
import {
  buildDraftMetadata,
  buildSubmittedMetadata,
  getCommissionMetadata,
  isCommissionDraft,
} from "@/features/commissions/draft-metadata";
import { generateDraftTitle } from "@/features/commissions/draft-title";
import {
  sendAdminInquiryNotification,
  sendInquiryReceivedEmail,
} from "@/features/commissions/send-inquiry-email";
import { uploadBuilderSnapshot } from "@/features/commissions/snapshot-storage";
import type { Commission, CommissionStatus } from "@/types";

export type ActionResult<T = void> = {
  error?: string;
  data?: T;
};

function computeBudgetCents(builderConfig: RingBuilderConfig) {
  const estimate = estimateRingInvestment(builderConfig);
  return { budget_min_cents: estimate.lowCents, budget_max_cents: estimate.highCents };
}

async function getOwnedDraftCommission(
  supabase: Awaited<ReturnType<typeof createClient>>,
  userId: string,
  draftId: string,
): Promise<Commission | null> {
  const { data, error } = await supabase
    .from("commissions")
    .select("*")
    .eq("id", draftId)
    .eq("client_id", userId)
    .maybeSingle();

  if (error || !data) return null;

  const commission = data as Commission;
  if (!isCommissionDraft(commission)) return null;
  return commission;
}

async function recordInitialStatus(commissionId: string, status: CommissionStatus) {
  if (!hasAdminCredentials()) return;

  try {
    const admin = createAdminClient();
    await admin.from("commission_status_history").insert({
      commission_id: commissionId,
      from_status: null,
      to_status: status,
      notes: "Commission inquiry submitted",
    });
  } catch (error) {
    console.error("[recordInitialStatus]", error);
  }
}

export async function createCommission(
  input: CreateCommissionInput,
  snapshotFile?: File | null,
): Promise<ActionResult<Commission>> {
  const parsed = createCommissionSchema.safeParse(input);
  if (!parsed.success) {
    return { error: parsed.error.errors[0]?.message ?? "Invalid input" };
  }

  const user = await getSessionUser();
  if (!user) {
    return { error: "You must be signed in to submit a commission." };
  }

  const supabase = await createClient();

  let budget_min_cents: number | null = null;
  let budget_max_cents: number | null = null;

  if (
    parsed.data.piece_type === "ring" &&
    parsed.data.builder_config &&
    isRingBuilderConfig(parsed.data.builder_config)
  ) {
    const estimate = estimateRingInvestment(parsed.data.builder_config);
    budget_min_cents = estimate.lowCents;
    budget_max_cents = estimate.highCents;
  }

  const payload = {
    client_id: user.id,
    title: parsed.data.title,
    story_type: parsed.data.story_type,
    piece_type: parsed.data.piece_type,
    story_narrative: parsed.data.story_narrative,
    builder_config: parsed.data.builder_config ?? {},
    budget_min_cents,
    budget_max_cents,
    status: "inquiry" as const,
  };

  const { data, error } = await supabase
    .from("commissions")
    .insert(payload)
    .select("*")
    .single();

  if (error || !data) {
    return { error: error?.message ?? "Failed to create commission." };
  }

  const commission = data as Commission;
  await recordInitialStatus(commission.id, "inquiry");

  if (snapshotFile && snapshotFile.size > 0) {
    const uploadResult = await uploadBuilderSnapshot(supabase, {
      commissionId: commission.id,
      userId: user.id,
      snapshot: snapshotFile,
    });

    if ("error" in uploadResult) {
      console.error("[createCommission] builder snapshot upload failed:", uploadResult.error);
    }
  }

  const email = user.email ?? "";
  if (email) {
    await sendInquiryReceivedEmail(email, commission);
    await sendAdminInquiryNotification(commission, email);
  }

  revalidatePath(routes.account);
  revalidatePath(`${routes.admin}/commissions`);
  redirect(`${routes.account}/commissions/${commission.id}`);
}

export async function saveDesignDraft(input: SaveDesignDraftInput): Promise<ActionResult<Commission>> {
  const parsed = saveDesignDraftSchema.safeParse(input);
  if (!parsed.success) {
    return { error: parsed.error.errors[0]?.message ?? "Invalid draft configuration." };
  }

  const user = await getSessionUser();
  if (!user) {
    return { error: "You must be signed in to save a draft." };
  }

  const supabase = await createClient();
  const builderConfig = parsed.data.builder_config as RingBuilderConfig;
  const title =
    parsed.data.title?.trim() ||
    generateDraftTitle(builderConfig);
  const budget = computeBudgetCents(builderConfig);

  if (parsed.data.draft_id) {
    const existing = await getOwnedDraftCommission(supabase, user.id, parsed.data.draft_id);
    if (!existing) {
      return { error: "Draft not found or already submitted." };
    }

    const metadata = buildDraftMetadata(getCommissionMetadata(existing));
    const { data, error } = await supabase
      .from("commissions")
      .update({
        title,
        story_type: parsed.data.story_type ?? existing.story_type,
        story_narrative: parsed.data.story_narrative ?? existing.story_narrative ?? "",
        builder_config: builderConfig,
        ...budget,
        metadata,
      })
      .eq("id", existing.id)
      .select("*")
      .single();

    if (error || !data) {
      return { error: error?.message ?? "Failed to update draft." };
    }

    revalidatePath(routes.account);
    revalidatePath(routes.create);
    revalidatePath(`${routes.admin}/commissions`);
    return { data: data as Commission };
  }

  const payload = {
    client_id: user.id,
    title,
    story_type: parsed.data.story_type ?? "milestone",
    story_narrative: parsed.data.story_narrative ?? "",
    piece_type: "ring" as const,
    builder_config: builderConfig,
    ...budget,
    status: "inquiry" as const,
    metadata: buildDraftMetadata(),
  };

  const { data, error } = await supabase.from("commissions").insert(payload).select("*").single();

  if (error || !data) {
    return { error: error?.message ?? "Failed to save draft." };
  }

  revalidatePath(routes.account);
  revalidatePath(routes.create);
  revalidatePath(`${routes.admin}/commissions`);
  return { data: data as Commission };
}

export interface BeginCommissionResult {
  commission: Commission;
  checkoutUrl: string;
}

export async function beginCommissionInquiry(
  input: BeginCommissionInput,
  snapshotFile?: File | null,
): Promise<ActionResult<BeginCommissionResult>> {
  try {
    const parsed = beginCommissionSchema.safeParse(input);
    if (!parsed.success) {
      return { error: parsed.error.errors[0]?.message ?? "Invalid commission details." };
    }

    const user = await getSessionUser();
    if (!user) {
      return { error: "You must be signed in to begin a commission." };
    }

    const supabase = await createClient();
    const builderConfig = parsed.data.builder_config as RingBuilderConfig;
    const budget = computeBudgetCents(builderConfig);
    const email = user.email ?? "";

    let commission: Commission;

    if (parsed.data.draft_id) {
      const existing = await getOwnedDraftCommission(supabase, user.id, parsed.data.draft_id);
      if (!existing) {
        return { error: "Draft not found or already submitted." };
      }

      const metadata = buildSubmittedMetadata(
        resolveCommissionCheckoutUrl(existing, email),
        getCommissionMetadata(existing),
      );

      const { data, error } = await supabase
        .from("commissions")
        .update({
          title: parsed.data.title,
          story_type: parsed.data.story_type,
          story_narrative: parsed.data.story_narrative,
          builder_config: builderConfig,
          ...budget,
          metadata,
        })
        .eq("id", existing.id)
        .select("*")
        .single();

      if (error || !data) {
        return { error: error?.message ?? "Failed to submit commission." };
      }

      commission = data as Commission;
    } else {
      const insertPayload = {
        client_id: user.id,
        title: parsed.data.title,
        story_type: parsed.data.story_type,
        piece_type: "ring" as const,
        story_narrative: parsed.data.story_narrative,
        builder_config: builderConfig,
        ...budget,
        status: "inquiry" as const,
        metadata: {
          is_draft: false,
          submitted_at: new Date().toISOString(),
          deposit_amount_cents: DESIGN_DEPOSIT_CENTS,
        },
      };

      const { data, error } = await supabase.from("commissions").insert(insertPayload).select("*").single();

      if (error || !data) {
        return { error: error?.message ?? "Failed to create commission." };
      }

      commission = data as Commission;

      const checkoutUrl = resolveCommissionCheckoutUrl(commission, email);

      const { data: updated } = await supabase
        .from("commissions")
        .update({ metadata: buildSubmittedMetadata(checkoutUrl, getCommissionMetadata(commission)) })
        .eq("id", commission.id)
        .select("*")
        .single();

      if (updated) {
        commission = updated as Commission;
      }
    }

    await recordInitialStatus(commission.id, "inquiry");

    if (snapshotFile && snapshotFile.size > 0) {
      try {
        const uploadResult = await uploadBuilderSnapshot(supabase, {
          commissionId: commission.id,
          userId: user.id,
          snapshot: snapshotFile,
        });

        if ("error" in uploadResult) {
          console.error("[beginCommissionInquiry] builder snapshot upload failed:", uploadResult.error);
        }
      } catch (uploadError) {
        console.error("[beginCommissionInquiry] builder snapshot upload failed:", uploadError);
      }
    }

    if (email) {
      try {
        await sendInquiryReceivedEmail(email, commission);
        await sendAdminInquiryNotification(commission, email);
      } catch (emailError) {
        console.error("[beginCommissionInquiry] inquiry email failed:", emailError);
      }
    }

    const checkoutUrl = resolveCommissionCheckoutUrl(commission, email);

    revalidatePath(routes.account);
    revalidatePath(`${routes.admin}/commissions`);

    return {
      data: {
        commission,
        checkoutUrl,
      },
    };
  } catch (error) {
    console.error("[beginCommissionInquiry]", error);
    return {
      error: "Something went wrong while submitting your commission. Please try again.",
    };
  }
}

export async function getCommissionsForCurrentUser(): Promise<Commission[]> {
  const user = await getSessionUser();
  if (!user) return [];

  const profile = await getCurrentProfile();
  const supabase = await createClient();

  let query = supabase.from("commissions").select("*").order("created_at", { ascending: false });

  if (!profile || !isStaffRole(profile.role)) {
    query = query.eq("client_id", user.id);
  }

  const { data, error } = await query;

  if (error) {
    console.error("[getCommissionsForCurrentUser]", error.message);
    return [];
  }

  return (data ?? []) as Commission[];
}

export async function getCommissionById(id: string): Promise<Commission | null> {
  const user = await getSessionUser();
  if (!user) return null;

  const profile = await getCurrentProfile();
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("commissions")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error || !data) return null;

  const commission = data as Commission;

  if (!profile || !isStaffRole(profile.role)) {
    if (commission.client_id !== user.id) return null;
  }

  return commission;
}

export interface StatusHistoryEntry {
  id: string;
  from_status: CommissionStatus | null;
  to_status: CommissionStatus;
  notes: string | null;
  created_at: string;
}

export async function getCommissionStatusHistory(
  commissionId: string,
): Promise<StatusHistoryEntry[]> {
  const commission = await getCommissionById(commissionId);
  if (!commission) return [];

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("commission_status_history")
    .select("id, from_status, to_status, notes, created_at")
    .eq("commission_id", commissionId)
    .order("created_at", { ascending: true });

  if (error) {
    console.error("[getCommissionStatusHistory]", error.message);
    return [];
  }

  return (data ?? []) as StatusHistoryEntry[];
}

export async function getAllCommissionsAdmin(): Promise<Commission[]> {
  await getCurrentProfile(); // Ensures caller context; page uses requireStaff
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("commissions")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[getAllCommissionsAdmin]", error.message);
    return [];
  }

  return (data ?? []) as Commission[];
}

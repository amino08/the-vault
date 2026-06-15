import type { SupabaseClient } from "@supabase/supabase-js";
import type { Commission, CommissionMetadata } from "@/types";
import { COMMISSION_FILES_BUCKET } from "@/features/commissions/snapshot-storage";

const SIGNED_URL_TTL_SECONDS = 3600;

export function parseCommissionMetadata(metadata: unknown): CommissionMetadata {
  if (!metadata || typeof metadata !== "object") return {};
  return metadata as CommissionMetadata;
}

export async function resolveBuilderSnapshotPath(
  supabase: SupabaseClient,
  commission: Commission,
): Promise<string | null> {
  const meta = parseCommissionMetadata(commission.metadata);
  if (meta.builder_snapshot_path) {
    return meta.builder_snapshot_path;
  }

  const { data, error } = await supabase
    .from("commission_files")
    .select("storage_path")
    .eq("commission_id", commission.id)
    .eq("category", "render")
    .contains("metadata", { kind: "builder_snapshot" })
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error || !data?.storage_path) return null;
  return data.storage_path as string;
}

export async function getCommissionBuilderSnapshotUrl(
  supabase: SupabaseClient,
  commission: Commission,
): Promise<string | null> {
  const storagePath = await resolveBuilderSnapshotPath(supabase, commission);
  if (!storagePath) return null;

  const { data, error } = await supabase.storage
    .from(COMMISSION_FILES_BUCKET)
    .createSignedUrl(storagePath, SIGNED_URL_TTL_SECONDS);

  if (error || !data?.signedUrl) return null;
  return data.signedUrl;
}

import type { SupabaseClient } from "@supabase/supabase-js";

export const BUILDER_SNAPSHOT_FILE_NAME = "builder-snapshot.png";
export const COMMISSION_FILES_BUCKET = "commission-files";

export function builderSnapshotStoragePath(commissionId: string): string {
  return `${commissionId}/${BUILDER_SNAPSHOT_FILE_NAME}`;
}

export interface BuilderSnapshotUploadResult {
  storagePath: string;
  fileId: string;
}

export async function uploadBuilderSnapshot(
  supabase: SupabaseClient,
  params: {
    commissionId: string;
    userId: string;
    snapshot: File;
  },
): Promise<{ data: BuilderSnapshotUploadResult } | { error: string }> {
  const storagePath = builderSnapshotStoragePath(params.commissionId);

  const { error: uploadError } = await supabase.storage
    .from(COMMISSION_FILES_BUCKET)
    .upload(storagePath, params.snapshot, {
      contentType: "image/png",
      upsert: false,
    });

  if (uploadError) {
    return { error: uploadError.message };
  }

  const { data: fileRow, error: fileError } = await supabase
    .from("commission_files")
    .insert({
      commission_id: params.commissionId,
      uploaded_by: params.userId,
      category: "render",
      storage_path: storagePath,
      file_name: BUILDER_SNAPSHOT_FILE_NAME,
      mime_type: "image/png",
      file_size_bytes: params.snapshot.size,
      is_client_visible: true,
      description: "Configurator preview at submission",
      metadata: {
        kind: "builder_snapshot",
        source: "configurator",
      },
    })
    .select("id")
    .single();

  if (fileError || !fileRow) {
    return { error: fileError?.message ?? "Failed to record builder snapshot file." };
  }

  const { data: currentCommission } = await supabase
    .from("commissions")
    .select("metadata")
    .eq("id", params.commissionId)
    .single();

  const existingMetadata =
    currentCommission?.metadata &&
    typeof currentCommission.metadata === "object" &&
    !Array.isArray(currentCommission.metadata)
      ? (currentCommission.metadata as Record<string, unknown>)
      : {};

  const { error: updateError } = await supabase
    .from("commissions")
    .update({
      metadata: {
        ...existingMetadata,
        builder_snapshot_path: storagePath,
        builder_snapshot_file_id: fileRow.id,
      },
    })
    .eq("id", params.commissionId);

  if (updateError) {
    return { error: updateError.message };
  }

  return {
    data: {
      storagePath,
      fileId: fileRow.id as string,
    },
  };
}

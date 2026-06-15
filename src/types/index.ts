import type { CommissionStatus, PieceType, StoryType } from "@/config/commission-status";

export type { CommissionStatus };

export type UserRole = "client" | "admin" | "staff";

export interface UserProfile {
  id: string;
  email: string;
  full_name: string | null;
  phone: string | null;
  role: UserRole;
  avatar_url: string | null;
  company_name: string | null;
  created_at: string;
  updated_at: string;
}

export interface Commission {
  id: string;
  client_id: string;
  assigned_staff_id: string | null;
  reference_number: string;
  title: string;
  story_type: StoryType;
  story_narrative: string | null;
  piece_type: PieceType;
  status: CommissionStatus;
  budget_min_cents: number | null;
  budget_max_cents: number | null;
  currency: string;
  target_delivery_date: string | null;
  builder_config: Record<string, unknown>;
  metadata: Record<string, unknown>;
  client_visible_notes: string | null;
  created_at: string;
  updated_at: string;
  completed_at: string | null;
  cancelled_at: string | null;
}

export interface CommissionMetadata {
  builder_snapshot_path?: string;
  builder_snapshot_file_id?: string;
  is_draft?: boolean;
  draft_saved_at?: string;
  submitted_at?: string;
  checkout_handoff_url?: string;
  deposit_amount_cents?: number;
}

export type PaymentType =
  | "design_deposit"
  | "milestone"
  | "production_final"
  | "adjustment"
  | "refund";

export type PaymentStatus =
  | "pending"
  | "processing"
  | "succeeded"
  | "failed"
  | "refunded"
  | "partially_refunded"
  | "cancelled";

export interface CommissionPayment {
  id: string;
  commission_id: string;
  client_id: string;
  payment_type: PaymentType;
  status: PaymentStatus;
  amount_cents: number;
  currency: string;
  description: string | null;
  milestone_label: string | null;
  paid_at: string | null;
  created_at: string;
}

export interface CommissionMessage {
  id: string;
  commission_id: string;
  sender_id: string | null;
  sender_type: "client" | "staff" | "system";
  body: string;
  is_internal: boolean;
  created_at: string;
}

export interface CommissionFile {
  id: string;
  commission_id: string;
  category: string;
  storage_path: string;
  file_name: string;
  mime_type: string | null;
  is_client_visible: boolean;
  description: string | null;
  created_at: string;
}

export interface ProductionUpdate {
  id: string;
  commission_id: string;
  update_type: string;
  title: string;
  body: string | null;
  tracking_number: string | null;
  carrier: string | null;
  estimated_delivery_date: string | null;
  created_at: string;
}

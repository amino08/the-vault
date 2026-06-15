/**
 * Supabase database types.
 * Run: npm run db:types (after Supabase CLI is linked)
 */

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type UserRole = "client" | "admin" | "staff";
export type CommissionStatus =
  | "inquiry"
  | "intake"
  | "design_review"
  | "concept_creation"
  | "cad_development"
  | "render_approval"
  | "production"
  | "quality_control"
  | "shipped"
  | "completed"
  | "cancelled";

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          phone: string | null;
          role: UserRole;
          avatar_url: string | null;
          company_name: string | null;
          billing_address: Json;
          shipping_address: Json;
          metadata: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          phone?: string | null;
          role?: UserRole;
          avatar_url?: string | null;
          company_name?: string | null;
          billing_address?: Json;
          shipping_address?: Json;
          metadata?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string | null;
          phone?: string | null;
          role?: UserRole;
          avatar_url?: string | null;
          company_name?: string | null;
          billing_address?: Json;
          shipping_address?: Json;
          metadata?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      commissions: {
        Row: {
          id: string;
          client_id: string;
          assigned_staff_id: string | null;
          reference_number: string;
          title: string;
          story_type: string;
          story_narrative: string | null;
          piece_type: string;
          status: CommissionStatus;
          budget_min_cents: number | null;
          budget_max_cents: number | null;
          currency: string;
          target_delivery_date: string | null;
          builder_config: Json;
          internal_notes: string | null;
          client_visible_notes: string | null;
          metadata: Json;
          created_at: string;
          updated_at: string;
          completed_at: string | null;
          cancelled_at: string | null;
        };
        Insert: {
          id?: string;
          client_id: string;
          assigned_staff_id?: string | null;
          reference_number?: string;
          title: string;
          story_type?: string;
          story_narrative?: string | null;
          piece_type?: string;
          status?: CommissionStatus;
          budget_min_cents?: number | null;
          budget_max_cents?: number | null;
          currency?: string;
          target_delivery_date?: string | null;
          builder_config?: Json;
          internal_notes?: string | null;
          client_visible_notes?: string | null;
          metadata?: Json;
          created_at?: string;
          updated_at?: string;
          completed_at?: string | null;
          cancelled_at?: string | null;
        };
        Update: {
          id?: string;
          client_id?: string;
          assigned_staff_id?: string | null;
          reference_number?: string;
          title?: string;
          story_type?: string;
          story_narrative?: string | null;
          piece_type?: string;
          status?: CommissionStatus;
          budget_min_cents?: number | null;
          budget_max_cents?: number | null;
          currency?: string;
          target_delivery_date?: string | null;
          builder_config?: Json;
          internal_notes?: string | null;
          client_visible_notes?: string | null;
          metadata?: Json;
          created_at?: string;
          updated_at?: string;
          completed_at?: string | null;
          cancelled_at?: string | null;
        };
        Relationships: [];
      };
      commission_status_history: {
        Row: {
          id: string;
          commission_id: string;
          from_status: CommissionStatus | null;
          to_status: CommissionStatus;
          changed_by: string | null;
          notes: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          commission_id: string;
          from_status?: CommissionStatus | null;
          to_status: CommissionStatus;
          changed_by?: string | null;
          notes?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          commission_id?: string;
          from_status?: CommissionStatus | null;
          to_status?: CommissionStatus;
          changed_by?: string | null;
          notes?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      commission_status: CommissionStatus;
      user_role: UserRole;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}

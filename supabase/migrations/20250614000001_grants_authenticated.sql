-- =============================================================================
-- Migration 006: Table & function grants for authenticated role
-- Fixes: "permission denied for table commissions" (PostgreSQL 42501)
--
-- RLS policies were present but the authenticated role lacked table-level
-- SELECT/INSERT/UPDATE privileges. RLS alone does not grant access.
-- =============================================================================

-- Schema access
GRANT USAGE ON SCHEMA public TO authenticated, service_role;

-- Enum types (required for INSERT/SELECT on typed columns)
GRANT USAGE ON TYPE public.user_role TO authenticated, service_role;
GRANT USAGE ON TYPE public.commission_status TO authenticated, service_role;
GRANT USAGE ON TYPE public.piece_type TO authenticated, service_role;
GRANT USAGE ON TYPE public.commission_story_type TO authenticated, service_role;
GRANT USAGE ON TYPE public.commission_file_category TO authenticated, service_role;
GRANT USAGE ON TYPE public.message_sender_type TO authenticated, service_role;
GRANT USAGE ON TYPE public.payment_type TO authenticated, service_role;
GRANT USAGE ON TYPE public.payment_status TO authenticated, service_role;
GRANT USAGE ON TYPE public.design_concept_status TO authenticated, service_role;
GRANT USAGE ON TYPE public.cad_revision_status TO authenticated, service_role;
GRANT USAGE ON TYPE public.production_update_type TO authenticated, service_role;

-- RLS helper functions (used in policies; must be executable by authenticated)
GRANT EXECUTE ON FUNCTION public.is_staff() TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.handle_updated_at() TO authenticated, service_role;

-- Core tables (RLS restricts which rows)
GRANT SELECT, INSERT, UPDATE ON public.users TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.commissions TO authenticated;

GRANT SELECT, INSERT ON public.commission_files TO authenticated;
GRANT SELECT, INSERT ON public.commission_messages TO authenticated;
GRANT SELECT ON public.commission_status_history TO authenticated;
GRANT SELECT ON public.commission_payments TO authenticated;
GRANT SELECT, UPDATE ON public.design_concepts TO authenticated;
GRANT SELECT, UPDATE ON public.cad_revisions TO authenticated;
GRANT SELECT ON public.production_updates TO authenticated;

-- Staff INSERT on status history (policy restricts to staff)
GRANT INSERT ON public.commission_status_history TO authenticated;

-- Service role (server-side admin tasks; bypasses RLS when used)
GRANT ALL ON ALL TABLES IN SCHEMA public TO service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO service_role;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO service_role;

-- Future tables in this schema (hosted Supabase)
ALTER DEFAULT PRIVILEGES IN SCHEMA public
  GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO authenticated;

ALTER DEFAULT PRIVILEGES IN SCHEMA public
  GRANT ALL ON TABLES TO service_role;

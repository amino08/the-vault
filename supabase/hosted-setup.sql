-- =============================================================================
-- THE VAULT BY ENTER AEVUM — HOSTED SUPABASE SETUP
-- =============================================================================
--
-- WHERE TO RUN:
--   Supabase Dashboard → SQL Editor → New query → paste this entire file → Run
--
-- WHEN TO RUN:
--   ONLY after creating a hosted Supabase project at supabase.com/dashboard
--   Project must be Active before running.
--
-- DO NOT RUN:
--   - With local Supabase (supabase start)
--   - With Docker
--   - Against an already-migrated database (will error on duplicate objects)
--
-- ORDER (combined in this file):
--   1. 20250613000001_enums.sql
--   2. 20250613000002_users.sql
--   3. 20250613000003_commissions.sql
--   4. 20250613000004_commission_support.sql
--   5. 20250613000005_payments_design_production.sql
--   6. storage.sql
--
-- =============================================================================


-- >>> BEGIN: supabase/migrations/20250613000001_enums.sql
-- =============================================================================
-- The Vault by Enter Aevum — Migration 001: Enums & Extensions
-- =============================================================================

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Application user roles (extends Supabase auth.users)
CREATE TYPE public.user_role AS ENUM ('client', 'admin', 'staff');

-- Commission lifecycle
CREATE TYPE public.commission_status AS ENUM (
  'inquiry',
  'intake',
  'design_review',
  'concept_creation',
  'cad_development',
  'render_approval',
  'production',
  'quality_control',
  'shipped',
  'completed',
  'cancelled'
);

-- Jewelry piece categories
CREATE TYPE public.piece_type AS ENUM (
  'pendant',
  'ring',
  'bracelet',
  'necklace',
  'custom'
);

-- Commission story / milestone context
CREATE TYPE public.commission_story_type AS ENUM (
  'transformation',
  'achievement',
  'legacy',
  'relationship',
  'milestone',
  'symbolic',
  'other'
);

-- File categories for uploads
CREATE TYPE public.commission_file_category AS ENUM (
  'reference',
  'inspiration',
  'sketch',
  'cad',
  'render',
  'approval',
  'production',
  'qc',
  'shipping',
  'invoice',
  'other'
);

-- Message sender types
CREATE TYPE public.message_sender_type AS ENUM ('client', 'staff', 'system');

-- Payment types
CREATE TYPE public.payment_type AS ENUM (
  'design_deposit',
  'milestone',
  'production_final',
  'adjustment',
  'refund'
);

-- Payment status
CREATE TYPE public.payment_status AS ENUM (
  'pending',
  'processing',
  'succeeded',
  'failed',
  'refunded',
  'partially_refunded',
  'cancelled'
);

-- Design concept status
CREATE TYPE public.design_concept_status AS ENUM (
  'draft',
  'submitted',
  'revision_requested',
  'approved',
  'rejected'
);

-- CAD revision status
CREATE TYPE public.cad_revision_status AS ENUM (
  'draft',
  'submitted',
  'revision_requested',
  'approved',
  'rejected'
);

-- Production update types
CREATE TYPE public.production_update_type AS ENUM (
  'milestone',
  'note',
  'delay',
  'qc_pass',
  'qc_fail',
  'shipment'
);

-- <<< END: supabase/migrations/20250613000001_enums.sql

-- >>> BEGIN: supabase/migrations/20250613000002_users.sql
-- =============================================================================
-- Migration 002: Users (profiles linked to auth.users)
-- Supabase Auth owns identity; public.users stores application profile data.
-- =============================================================================

CREATE TABLE public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  phone TEXT,
  role public.user_role NOT NULL DEFAULT 'client',
  avatar_url TEXT,
  company_name TEXT,
  billing_address JSONB DEFAULT '{}'::jsonb,
  shipping_address JSONB DEFAULT '{}'::jsonb,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX users_email_idx ON public.users (email);
CREATE INDEX users_role_idx ON public.users (role);

CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER users_updated_at
  BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name'),
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Helper: check if current user is staff/admin
CREATE OR REPLACE FUNCTION public.is_staff()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.users
    WHERE id = auth.uid()
      AND role IN ('admin', 'staff')
  );
$$ LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public;

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.users
    WHERE id = auth.uid()
      AND role = 'admin'
  );
$$ LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public;

-- RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON public.users FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Staff can view all users"
  ON public.users FOR SELECT
  USING (public.is_staff());

CREATE POLICY "Users can update own profile"
  ON public.users FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id AND role = (SELECT role FROM public.users WHERE id = auth.uid()));

CREATE POLICY "Admins can update any user"
  ON public.users FOR UPDATE
  USING (public.is_admin());

CREATE POLICY "Admins can insert users"
  ON public.users FOR INSERT
  WITH CHECK (public.is_admin());

-- <<< END: supabase/migrations/20250613000002_users.sql

-- >>> BEGIN: supabase/migrations/20250613000003_commissions.sql
-- =============================================================================
-- Migration 003: Commissions (core entity — every piece is a story)
-- =============================================================================

CREATE TABLE public.commissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES public.users(id) ON DELETE RESTRICT,
  assigned_staff_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  reference_number TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  story_type public.commission_story_type NOT NULL DEFAULT 'other',
  story_narrative TEXT,
  piece_type public.piece_type NOT NULL DEFAULT 'custom',
  status public.commission_status NOT NULL DEFAULT 'inquiry',
  budget_min_cents INTEGER,
  budget_max_cents INTEGER,
  currency TEXT NOT NULL DEFAULT 'usd',
  target_delivery_date DATE,
  builder_config JSONB DEFAULT '{}'::jsonb,
  internal_notes TEXT,
  client_visible_notes TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  completed_at TIMESTAMPTZ,
  cancelled_at TIMESTAMPTZ
);

CREATE INDEX commissions_client_id_idx ON public.commissions (client_id);
CREATE INDEX commissions_status_idx ON public.commissions (status);
CREATE INDEX commissions_assigned_staff_idx ON public.commissions (assigned_staff_id);
CREATE INDEX commissions_created_at_idx ON public.commissions (created_at DESC);

CREATE TRIGGER commissions_updated_at
  BEFORE UPDATE ON public.commissions
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Auto-generate reference number
CREATE OR REPLACE FUNCTION public.generate_commission_reference()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.reference_number IS NULL OR NEW.reference_number = '' THEN
    NEW.reference_number := 'VLT-' || to_char(now(), 'YYYY') || '-' || upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 8));
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER commissions_reference_number
  BEFORE INSERT ON public.commissions
  FOR EACH ROW EXECUTE FUNCTION public.generate_commission_reference();

ALTER TABLE public.commissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Clients can view own commissions"
  ON public.commissions FOR SELECT
  USING (auth.uid() = client_id);

CREATE POLICY "Staff can view all commissions"
  ON public.commissions FOR SELECT
  USING (public.is_staff());

CREATE POLICY "Clients can create commissions"
  ON public.commissions FOR INSERT
  WITH CHECK (auth.uid() = client_id);

CREATE POLICY "Staff can create commissions"
  ON public.commissions FOR INSERT
  WITH CHECK (public.is_staff());

CREATE POLICY "Clients can update own commissions in early stages"
  ON public.commissions FOR UPDATE
  USING (
    auth.uid() = client_id
    AND status IN ('inquiry', 'intake')
  );

CREATE POLICY "Staff can update all commissions"
  ON public.commissions FOR UPDATE
  USING (public.is_staff());

CREATE POLICY "Admins can delete commissions"
  ON public.commissions FOR DELETE
  USING (public.is_admin());

-- <<< END: supabase/migrations/20250613000003_commissions.sql

-- >>> BEGIN: supabase/migrations/20250613000004_commission_support.sql
-- =============================================================================
-- Migration 004: Commission files, messages, status history
-- =============================================================================

CREATE TABLE public.commission_files (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  commission_id UUID NOT NULL REFERENCES public.commissions(id) ON DELETE CASCADE,
  uploaded_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
  category public.commission_file_category NOT NULL DEFAULT 'other',
  storage_path TEXT NOT NULL,
  file_name TEXT NOT NULL,
  mime_type TEXT,
  file_size_bytes BIGINT,
  is_client_visible BOOLEAN NOT NULL DEFAULT true,
  description TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX commission_files_commission_id_idx ON public.commission_files (commission_id);
CREATE INDEX commission_files_category_idx ON public.commission_files (category);

CREATE TABLE public.commission_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  commission_id UUID NOT NULL REFERENCES public.commissions(id) ON DELETE CASCADE,
  sender_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  sender_type public.message_sender_type NOT NULL DEFAULT 'client',
  body TEXT NOT NULL,
  is_internal BOOLEAN NOT NULL DEFAULT false,
  attachments JSONB DEFAULT '[]'::jsonb,
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX commission_messages_commission_id_idx ON public.commission_messages (commission_id);
CREATE INDEX commission_messages_created_at_idx ON public.commission_messages (created_at DESC);

CREATE TABLE public.commission_status_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  commission_id UUID NOT NULL REFERENCES public.commissions(id) ON DELETE CASCADE,
  from_status public.commission_status,
  to_status public.commission_status NOT NULL,
  changed_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX commission_status_history_commission_id_idx
  ON public.commission_status_history (commission_id);

-- Status change audit trigger
CREATE OR REPLACE FUNCTION public.log_commission_status_change()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.status IS DISTINCT FROM NEW.status THEN
    INSERT INTO public.commission_status_history (commission_id, from_status, to_status, changed_by)
    VALUES (NEW.id, OLD.status, NEW.status, auth.uid());
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER commissions_status_history
  AFTER UPDATE OF status ON public.commissions
  FOR EACH ROW EXECUTE FUNCTION public.log_commission_status_change();

-- RLS: commission_files
ALTER TABLE public.commission_files ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Clients view visible files on own commissions"
  ON public.commission_files FOR SELECT
  USING (
    is_client_visible = true
    AND EXISTS (
      SELECT 1 FROM public.commissions c
      WHERE c.id = commission_id AND c.client_id = auth.uid()
    )
  );

CREATE POLICY "Staff view all commission files"
  ON public.commission_files FOR SELECT
  USING (public.is_staff());

CREATE POLICY "Clients upload to own commissions"
  ON public.commission_files FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.commissions c
      WHERE c.id = commission_id AND c.client_id = auth.uid()
    )
  );

CREATE POLICY "Staff manage commission files"
  ON public.commission_files FOR ALL
  USING (public.is_staff());

-- RLS: commission_messages
ALTER TABLE public.commission_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Clients view non-internal messages on own commissions"
  ON public.commission_messages FOR SELECT
  USING (
    is_internal = false
    AND EXISTS (
      SELECT 1 FROM public.commissions c
      WHERE c.id = commission_id AND c.client_id = auth.uid()
    )
  );

CREATE POLICY "Staff view all messages"
  ON public.commission_messages FOR SELECT
  USING (public.is_staff());

CREATE POLICY "Clients send messages on own commissions"
  ON public.commission_messages FOR INSERT
  WITH CHECK (
    sender_id = auth.uid()
    AND is_internal = false
    AND EXISTS (
      SELECT 1 FROM public.commissions c
      WHERE c.id = commission_id AND c.client_id = auth.uid()
    )
  );

CREATE POLICY "Staff manage messages"
  ON public.commission_messages FOR ALL
  USING (public.is_staff());

-- RLS: commission_status_history
ALTER TABLE public.commission_status_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Clients view status history on own commissions"
  ON public.commission_status_history FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.commissions c
      WHERE c.id = commission_id AND c.client_id = auth.uid()
    )
  );

CREATE POLICY "Staff view all status history"
  ON public.commission_status_history FOR SELECT
  USING (public.is_staff());

CREATE POLICY "Staff insert status history"
  ON public.commission_status_history FOR INSERT
  WITH CHECK (public.is_staff());

-- <<< END: supabase/migrations/20250613000004_commission_support.sql

-- >>> BEGIN: supabase/migrations/20250613000005_payments_design_production.sql
-- =============================================================================
-- Migration 005: Payments, design concepts, CAD revisions, production updates
-- =============================================================================

CREATE TABLE public.commission_payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  commission_id UUID NOT NULL REFERENCES public.commissions(id) ON DELETE RESTRICT,
  client_id UUID NOT NULL REFERENCES public.users(id) ON DELETE RESTRICT,
  payment_type public.payment_type NOT NULL,
  status public.payment_status NOT NULL DEFAULT 'pending',
  amount_cents INTEGER NOT NULL CHECK (amount_cents >= 0),
  currency TEXT NOT NULL DEFAULT 'usd',
  stripe_checkout_session_id TEXT,
  stripe_payment_intent_id TEXT,
  stripe_invoice_id TEXT,
  description TEXT,
  milestone_label TEXT,
  paid_at TIMESTAMPTZ,
  refunded_at TIMESTAMPTZ,
  refund_amount_cents INTEGER DEFAULT 0,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX commission_payments_commission_id_idx ON public.commission_payments (commission_id);
CREATE INDEX commission_payments_client_id_idx ON public.commission_payments (client_id);
CREATE INDEX commission_payments_stripe_session_idx ON public.commission_payments (stripe_checkout_session_id);

CREATE TRIGGER commission_payments_updated_at
  BEFORE UPDATE ON public.commission_payments
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TABLE public.design_concepts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  commission_id UUID NOT NULL REFERENCES public.commissions(id) ON DELETE CASCADE,
  version_number INTEGER NOT NULL DEFAULT 1,
  title TEXT NOT NULL,
  description TEXT,
  status public.design_concept_status NOT NULL DEFAULT 'draft',
  created_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
  approved_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
  approved_at TIMESTAMPTZ,
  client_feedback TEXT,
  preview_file_id UUID REFERENCES public.commission_files(id) ON DELETE SET NULL,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (commission_id, version_number)
);

CREATE INDEX design_concepts_commission_id_idx ON public.design_concepts (commission_id);

CREATE TRIGGER design_concepts_updated_at
  BEFORE UPDATE ON public.design_concepts
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TABLE public.cad_revisions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  commission_id UUID NOT NULL REFERENCES public.commissions(id) ON DELETE CASCADE,
  design_concept_id UUID REFERENCES public.design_concepts(id) ON DELETE SET NULL,
  version_number INTEGER NOT NULL DEFAULT 1,
  title TEXT NOT NULL,
  status public.cad_revision_status NOT NULL DEFAULT 'draft',
  created_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
  approved_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
  approved_at TIMESTAMPTZ,
  client_feedback TEXT,
  cad_file_id UUID REFERENCES public.commission_files(id) ON DELETE SET NULL,
  render_file_id UUID REFERENCES public.commission_files(id) ON DELETE SET NULL,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (commission_id, version_number)
);

CREATE INDEX cad_revisions_commission_id_idx ON public.cad_revisions (commission_id);

CREATE TRIGGER cad_revisions_updated_at
  BEFORE UPDATE ON public.cad_revisions
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TABLE public.production_updates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  commission_id UUID NOT NULL REFERENCES public.commissions(id) ON DELETE CASCADE,
  update_type public.production_update_type NOT NULL DEFAULT 'milestone',
  title TEXT NOT NULL,
  body TEXT,
  is_client_visible BOOLEAN NOT NULL DEFAULT true,
  created_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
  tracking_number TEXT,
  carrier TEXT,
  estimated_delivery_date DATE,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX production_updates_commission_id_idx ON public.production_updates (commission_id);

-- RLS: commission_payments
ALTER TABLE public.commission_payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Clients view own payments"
  ON public.commission_payments FOR SELECT
  USING (auth.uid() = client_id);

CREATE POLICY "Staff view all payments"
  ON public.commission_payments FOR SELECT
  USING (public.is_staff());

CREATE POLICY "Staff manage payments"
  ON public.commission_payments FOR ALL
  USING (public.is_staff());

-- RLS: design_concepts
ALTER TABLE public.design_concepts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Clients view concepts on own commissions"
  ON public.design_concepts FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.commissions c
      WHERE c.id = commission_id AND c.client_id = auth.uid()
    )
  );

CREATE POLICY "Staff manage design concepts"
  ON public.design_concepts FOR ALL
  USING (public.is_staff());

CREATE POLICY "Clients update feedback on own concepts"
  ON public.design_concepts FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.commissions c
      WHERE c.id = commission_id AND c.client_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.commissions c
      WHERE c.id = commission_id AND c.client_id = auth.uid()
    )
  );

-- RLS: cad_revisions
ALTER TABLE public.cad_revisions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Clients view CAD on own commissions"
  ON public.cad_revisions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.commissions c
      WHERE c.id = commission_id AND c.client_id = auth.uid()
    )
  );

CREATE POLICY "Staff manage CAD revisions"
  ON public.cad_revisions FOR ALL
  USING (public.is_staff());

CREATE POLICY "Clients update feedback on own CAD"
  ON public.cad_revisions FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.commissions c
      WHERE c.id = commission_id AND c.client_id = auth.uid()
    )
  );

-- RLS: production_updates
ALTER TABLE public.production_updates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Clients view visible production updates"
  ON public.production_updates FOR SELECT
  USING (
    is_client_visible = true
    AND EXISTS (
      SELECT 1 FROM public.commissions c
      WHERE c.id = commission_id AND c.client_id = auth.uid()
    )
  );

CREATE POLICY "Staff manage production updates"
  ON public.production_updates FOR ALL
  USING (public.is_staff());

-- Storage bucket policies (run after creating bucket in Supabase dashboard or via CLI)
-- Bucket name: commission-files
-- See supabase/storage.sql for storage RLS templates

-- <<< END: supabase/migrations/20250613000005_payments_design_production.sql

-- >>> BEGIN: supabase/storage.sql
-- =============================================================================
-- Storage bucket setup for commission file uploads
-- Apply via Supabase SQL editor or: supabase db push (after bucket creation)
-- =============================================================================

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'commission-files',
  'commission-files',
  false,
  52428800,
  ARRAY[
    'image/jpeg', 'image/png', 'image/webp', 'image/heic',
    'application/pdf',
    'model/stl', 'model/obj',
    'application/octet-stream'
  ]
)
ON CONFLICT (id) DO NOTHING;

-- Clients can upload to their commission folder: {commission_id}/{filename}
CREATE POLICY "Clients upload to own commission folder"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'commission-files'
    AND auth.role() = 'authenticated'
    AND EXISTS (
      SELECT 1 FROM public.commissions c
      WHERE c.id::text = (storage.foldername(name))[1]
        AND c.client_id = auth.uid()
    )
  );

CREATE POLICY "Clients read own commission files"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'commission-files'
    AND auth.role() = 'authenticated'
    AND EXISTS (
      SELECT 1 FROM public.commissions c
      WHERE c.id::text = (storage.foldername(name))[1]
        AND c.client_id = auth.uid()
    )
  );

CREATE POLICY "Staff full access to commission files"
  ON storage.objects FOR ALL
  USING (
    bucket_id = 'commission-files'
    AND public.is_staff()
  );

-- <<< END: supabase/storage.sql

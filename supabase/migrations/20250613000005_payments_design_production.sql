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

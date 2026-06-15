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

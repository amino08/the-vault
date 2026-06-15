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

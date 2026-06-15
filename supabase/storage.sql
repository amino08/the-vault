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

-- =============================================================================
-- Builder snapshot storage verification (idempotent)
-- Run only if configurator snapshot uploads fail with storage policy errors.
-- Does NOT change Auth or commission RLS.
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
ON CONFLICT (id) DO UPDATE SET
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

DROP POLICY IF EXISTS "Clients upload to own commission folder" ON storage.objects;
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

DROP POLICY IF EXISTS "Clients read own commission files" ON storage.objects;
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

DROP POLICY IF EXISTS "Staff full access to commission files" ON storage.objects;
CREATE POLICY "Staff full access to commission files"
  ON storage.objects FOR ALL
  USING (
    bucket_id = 'commission-files'
    AND public.is_staff()
  );

-- =============================================================
-- MIGRATION: Supabase Storage bucket para imagenes de productos
-- =============================================================
-- Ejecutar en Supabase Dashboard > SQL Editor

-- 1. Crear bucket para imagenes de productos
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'products',
  'products',
  true,
  5242880,  -- 5MB
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO NOTHING;

-- 2. Politica: cualquiera puede leer imagenes (bucket publico)
DROP POLICY IF EXISTS "Public read products" ON storage.objects;
CREATE POLICY "Public read products" ON storage.objects
  FOR SELECT
  USING (bucket_id = 'products');

-- 3. Politica: solo authenticated users pueden subir imagenes
DROP POLICY IF EXISTS "Authenticated upload products" ON storage.objects;
CREATE POLICY "Authenticated upload products" ON storage.objects
  FOR INSERT
  WITH CHECK (
    bucket_id = 'products'
    AND auth.role() = 'authenticated'
  );

-- 4. Politica: solo authenticated users pueden actualizar imagenes
DROP POLICY IF EXISTS "Authenticated update products" ON storage.objects;
CREATE POLICY "Authenticated update products" ON storage.objects
  FOR UPDATE
  USING (
    bucket_id = 'products'
    AND auth.role() = 'authenticated'
  );

-- 5. Politica: solo authenticated users pueden eliminar imagenes
DROP POLICY IF EXISTS "Authenticated delete products" ON storage.objects;
CREATE POLICY "Authenticated delete products" ON storage.objects
  FOR DELETE
  USING (
    bucket_id = 'products'
    AND auth.role() = 'authenticated'
  );

-- 6. Politica: service_role tiene acceso total
DROP POLICY IF EXISTS "Service role manage products" ON storage.objects;
CREATE POLICY "Service role manage products" ON storage.objects
  FOR ALL
  USING (
    bucket_id = 'products'
    AND auth.role() = 'service_role'
  );

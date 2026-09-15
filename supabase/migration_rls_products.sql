-- =============================================================
-- MIGRATION: Habilitar RLS en products con políticas de admin
-- =============================================================
-- Ejecutar en Supabase Dashboard > SQL Editor

-- 1. Habilitar RLS en products (si no está habilitado)
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- 2. Política: cualquiera puede leer productos (catálogo público)
DROP POLICY IF EXISTS "Public read products" ON products;
CREATE POLICY "Public read products" ON products
  FOR SELECT USING (true);

-- 3. Política: solo service_role puede modificar productos (admin)
DROP POLICY IF EXISTS "Service role manage products" ON products;
CREATE POLICY "Service role manage products" ON products
  FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- 4. Habilitar RLS en product_variants si no está habilitado
ALTER TABLE product_variants ENABLE ROW LEVEL SECURITY;

-- 5. Política: cualquiera puede leer variantes
DROP POLICY IF EXISTS "Public read variants" ON product_variants;
CREATE POLICY "Public read variants" ON product_variants
  FOR SELECT USING (true);

-- 6. Política: solo service_role puede modificar variantes
DROP POLICY IF EXISTS "Service role manage variants" ON product_variants;
CREATE POLICY "Service role manage variants" ON product_variants
  FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- 7. Habilitar RLS en inventory_movements si no está habilitado
ALTER TABLE inventory_movements ENABLE ROW LEVEL SECURITY;

-- 8. Política: solo service_role puede leer/escribir movimientos
DROP POLICY IF EXISTS "Service role manage inventory" ON inventory_movements;
CREATE POLICY "Service role manage inventory" ON inventory_movements
  FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

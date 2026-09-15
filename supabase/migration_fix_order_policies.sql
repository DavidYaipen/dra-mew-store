-- =============================================================
-- Dra. Mew Store — Fix: las politicas de insercion publica de
-- orders/order_items/customers no estan funcionando en produccion
-- (INSERT con la anon key devuelve "row-level security policy"
-- pese a que migration_ecommerce.sql ya define WITH CHECK (true)).
-- Se re-crean de forma idempotente para garantizar que existan tal
-- cual estan documentadas.
-- Ejecuta en el SQL Editor de Supabase.
-- =============================================================

DROP POLICY IF EXISTS "Anyone can create orders" ON orders;
CREATE POLICY "Anyone can create orders" ON orders FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Anyone can create order items" ON order_items;
CREATE POLICY "Anyone can create order items" ON order_items FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Anyone can create customers" ON customers;
CREATE POLICY "Anyone can create customers" ON customers FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Public read customers" ON customers;
CREATE POLICY "Public read customers" ON customers FOR SELECT USING (true);

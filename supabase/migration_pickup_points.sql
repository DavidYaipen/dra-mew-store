-- =============================================================
-- Dra. Mew Store — Migración: puntos de recojo
-- Reemplaza el envío gratis por umbral (S/150) por recojo gratis
-- en puntos administrables desde el panel admin.
-- Ejecuta en el SQL Editor de Supabase DESPUÉS de migration_ecommerce.sql
-- =============================================================

CREATE TABLE IF NOT EXISTS pickup_points (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  schedule TEXT,
  notes TEXT,
  active BOOLEAN NOT NULL DEFAULT true,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_pickup_points_active_order
  ON pickup_points(active, display_order);

ALTER TABLE pickup_points ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read pickup_points" ON pickup_points
  FOR SELECT USING (true);
-- Escrituras solo vía service role (admin), que ignora RLS — mismo
-- patrón que `coupons`.

-- Vincula un pedido a un punto de recojo concreto (solo cuando
-- shipping_method = 'pickup'). Sin ON DELETE CASCADE/SET NULL a
-- propósito: un punto con pedidos asociados no debe poder borrarse
-- (bloqueado por FK, 409 amigable en la API), solo desactivarse.
ALTER TABLE orders ADD COLUMN IF NOT EXISTS pickup_point_id UUID REFERENCES pickup_points(id);

-- Seed: los 2 puntos que ya existían hardcodeados en el checkout,
-- más los 3 nuevos. Direcciones/horarios son placeholders razonables
-- — edítalos desde /admin/puntos-recojo antes de publicar.
INSERT INTO pickup_points (name, address, schedule, notes, active, display_order) VALUES
  ('Full Market', 'Dirección pendiente de confirmar', 'Lun-Sáb 10:00-20:00 (referencial)', 'Punto de recojo original de la tienda. Actualiza esta ficha con la dirección exacta.', true, 1),
  ('Expo Centro', 'Dirección pendiente de confirmar', 'Lun-Sáb 10:00-20:00 (referencial)', 'Punto de recojo original de la tienda. Actualiza esta ficha con la dirección exacta.', true, 2),
  ('San Miguel', 'San Miguel, Lima (dirección exacta pendiente)', 'Lun-Sáb 10:00-20:00 (referencial)', 'Confirma la dirección exacta antes de publicar.', true, 3),
  ('Kennedy', 'Cerca al Parque Kennedy, Miraflores, Lima (dirección exacta pendiente)', 'Lun-Sáb 10:00-20:00 (referencial)', 'Confirma la dirección exacta antes de publicar.', true, 4),
  ('Plaza Norte', 'C.C. Plaza Norte, Independencia, Lima (dirección exacta pendiente)', 'Lun-Dom 10:00-21:00 (referencial, según horario del centro comercial)', 'Confirma la dirección exacta antes de publicar.', true, 5);

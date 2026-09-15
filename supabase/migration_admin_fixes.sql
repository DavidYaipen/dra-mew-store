-- =============================================================
-- Dra. Mew Store — Migración: fixes del panel admin
-- Ejecuta en el SQL Editor de Supabase DESPUÉS de migration_ecommerce.sql
-- =============================================================

-- =============================================================
-- 1. Registrar movimiento de inventario + actualizar stock real
--    de forma atómica (mismo patrón que increment_coupon_usage
--    usado en /api/checkout).
-- =============================================================
CREATE OR REPLACE FUNCTION register_inventory_movement(
  p_product_id INTEGER,
  p_variant_id UUID,
  p_quantity   INTEGER,
  p_reason     TEXT,
  p_reference  TEXT
) RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF p_variant_id IS NOT NULL THEN
    UPDATE product_variants
    SET stock = stock + p_quantity
    WHERE id = p_variant_id;

    IF NOT FOUND THEN
      RAISE EXCEPTION 'Variante % no encontrada', p_variant_id;
    END IF;
  END IF;

  INSERT INTO inventory_movements (product_id, variant_id, quantity, reason, reference)
  VALUES (p_product_id, p_variant_id, p_quantity, p_reason, p_reference);
END;
$$;

-- Solo el backend admin (service_role) puede ejecutar esta función.
-- Sin esto, cualquier cliente anon/authenticated podría llamarla vía
-- PostgREST (/rest/v1/rpc/register_inventory_movement) y manipular stock
-- directamente, sin pasar por requireAdmin().
REVOKE ALL ON FUNCTION register_inventory_movement(INTEGER, UUID, INTEGER, TEXT, TEXT) FROM PUBLIC;
REVOKE ALL ON FUNCTION register_inventory_movement(INTEGER, UUID, INTEGER, TEXT, TEXT) FROM anon, authenticated;
GRANT EXECUTE ON FUNCTION register_inventory_movement(INTEGER, UUID, INTEGER, TEXT, TEXT) TO service_role;

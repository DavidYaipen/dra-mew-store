-- =============================================================
-- Dra. Mew Store — Migración: stock real de productos + cárdex
-- automático en confirmación/cancelación de pedidos.
-- Ejecuta en el SQL Editor de Supabase DESPUÉS de
-- migration_admin_fixes.sql
-- =============================================================

-- =============================================================
-- 1. Stock a nivel de producto (para productos sin variantes,
--    que hoy son la mayoría del catálogo). NULL = no rastreado
--    (comportamiento actual: "siempre disponible"); un número =
--    stock real controlado por el cárdex.
-- =============================================================
ALTER TABLE products ADD COLUMN IF NOT EXISTS stock INTEGER;

-- =============================================================
-- 2. Flag de idempotencia: evita descontar dos veces si un pedido
--    pasa por 'confirmed' más de una vez, y evita reponer dos
--    veces si se cancela/reembolsa más de una vez.
-- =============================================================
ALTER TABLE orders ADD COLUMN IF NOT EXISTS stock_applied BOOLEAN NOT NULL DEFAULT false;

-- =============================================================
-- 3. register_inventory_movement: se agrega guarda de stock
--    negativo y la rama que faltaba (actualizar products.stock
--    cuando el movimiento es a nivel de producto, no de variante).
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
DECLARE
  v_current_stock INTEGER;
BEGIN
  IF p_variant_id IS NOT NULL THEN
    UPDATE product_variants
    SET stock = stock + p_quantity
    WHERE id = p_variant_id
    RETURNING stock INTO v_current_stock;

    IF NOT FOUND THEN
      RAISE EXCEPTION 'Variante % no encontrada', p_variant_id;
    END IF;

    IF v_current_stock < 0 THEN
      RAISE EXCEPTION 'Stock insuficiente para la variante % (quedarían % unidades)', p_variant_id, v_current_stock;
    END IF;
  ELSE
    UPDATE products
    SET stock = stock + p_quantity
    WHERE id = p_product_id AND stock IS NOT NULL
    RETURNING stock INTO v_current_stock;

    IF FOUND AND v_current_stock < 0 THEN
      RAISE EXCEPTION 'Stock insuficiente para el producto % (quedarían % unidades)', p_product_id, v_current_stock;
    END IF;
    -- Si el producto no tiene stock rastreado (NULL) o no existe la fila
    -- afectada, no se fuerza un valor: el movimiento igual queda
    -- registrado abajo para auditoría.
  END IF;

  INSERT INTO inventory_movements (product_id, variant_id, quantity, reason, reference)
  VALUES (p_product_id, p_variant_id, p_quantity, p_reason, p_reference);
END;
$$;

REVOKE ALL ON FUNCTION register_inventory_movement(INTEGER, UUID, INTEGER, TEXT, TEXT) FROM PUBLIC;
REVOKE ALL ON FUNCTION register_inventory_movement(INTEGER, UUID, INTEGER, TEXT, TEXT) FROM anon, authenticated;
GRANT EXECUTE ON FUNCTION register_inventory_movement(INTEGER, UUID, INTEGER, TEXT, TEXT) TO service_role;

-- =============================================================
-- 4. apply_order_stock_change: aplica (o revierte) el descuento de
--    stock de TODOS los items de un pedido de forma atómica e
--    idempotente. p_direction = 'decrement' | 'restore'.
--
--    'decrement' se llama cuando un pedido pasa a 'confirmed'.
--    'restore' se llama cuando un pedido confirmado se cancela o
--    se reembolsa. Ambas son no-op seguras si ya se aplicaron
--    antes (gracias a orders.stock_applied).
-- =============================================================
CREATE OR REPLACE FUNCTION apply_order_stock_change(
  p_order_id UUID,
  p_direction TEXT
) RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_already_applied BOOLEAN;
  v_item RECORD;
  v_sign INTEGER;
  v_reason TEXT;
BEGIN
  IF p_direction NOT IN ('decrement', 'restore') THEN
    RAISE EXCEPTION 'Dirección inválida: %', p_direction;
  END IF;

  SELECT stock_applied INTO v_already_applied
  FROM orders
  WHERE id = p_order_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Pedido % no encontrado', p_order_id;
  END IF;

  IF p_direction = 'decrement' THEN
    IF v_already_applied THEN
      RETURN; -- ya se descontó, no hacer nada
    END IF;
    v_sign := -1;
    v_reason := 'sale';
  ELSE
    IF NOT v_already_applied THEN
      RETURN; -- nunca se descontó, no hay nada que reponer
    END IF;
    v_sign := 1;
    v_reason := 'return';
  END IF;

  FOR v_item IN
    SELECT product_id, variant_id, quantity
    FROM order_items
    WHERE order_id = p_order_id
  LOOP
    PERFORM register_inventory_movement(
      v_item.product_id,
      v_item.variant_id,
      v_sign * v_item.quantity,
      v_reason,
      p_order_id::text
    );
  END LOOP;

  UPDATE orders SET stock_applied = (p_direction = 'decrement') WHERE id = p_order_id;
END;
$$;

REVOKE ALL ON FUNCTION apply_order_stock_change(UUID, TEXT) FROM PUBLIC;
REVOKE ALL ON FUNCTION apply_order_stock_change(UUID, TEXT) FROM anon, authenticated;
GRANT EXECUTE ON FUNCTION apply_order_stock_change(UUID, TEXT) TO service_role;

-- =============================================================
-- 5. increment_coupon_usage: usada desde /api/checkout pero nunca
--    quedó documentada en una migración versionada. Se agrega aquí
--    con CREATE OR REPLACE para que el esquema sea reproducible
--    desde los archivos del repo, sin cambiar su comportamiento
--    actual en Supabase.
-- =============================================================
CREATE OR REPLACE FUNCTION increment_coupon_usage(
  coupon_id UUID
) RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE coupons SET used_count = used_count + 1 WHERE id = coupon_id;
END;
$$;

REVOKE ALL ON FUNCTION increment_coupon_usage(UUID) FROM PUBLIC;
REVOKE ALL ON FUNCTION increment_coupon_usage(UUID) FROM anon, authenticated;
GRANT EXECUTE ON FUNCTION increment_coupon_usage(UUID) TO service_role;

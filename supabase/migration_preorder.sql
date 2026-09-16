-- =============================================================
-- Dra. Mew Store — Migración: preventa / producto pendiente de
-- llegada.
-- Ejecuta en el SQL Editor de Supabase DESPUÉS de
-- migration_product_id_identity.sql
-- =============================================================

-- =============================================================
-- 1. Flag de preventa en el producto + nota opcional, y snapshot
--    del flag en cada order_item al momento del pedido (para que
--    un cambio futuro del flag no altere pedidos ya hechos).
-- =============================================================
ALTER TABLE products ADD COLUMN IF NOT EXISTS is_preorder BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE products ADD COLUMN IF NOT EXISTS preorder_note TEXT;
ALTER TABLE order_items ADD COLUMN IF NOT EXISTS is_preorder BOOLEAN NOT NULL DEFAULT false;

-- =============================================================
-- 2. apply_order_stock_change: los items marcados como preventa
--    no descuentan/reponen stock real (todavía no existe ese
--    inventario), solo dejan un movimiento de auditoría de
--    cantidad 0 en el cárdex. El stock real se carga después a
--    mano desde /admin/inventario (restock) cuando llega la
--    mercadería.
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
      RETURN;
    END IF;
    v_sign := -1;
    v_reason := 'sale';
  ELSE
    IF NOT v_already_applied THEN
      RETURN;
    END IF;
    v_sign := 1;
    v_reason := 'return';
  END IF;

  FOR v_item IN
    SELECT product_id, variant_id, quantity, is_preorder
    FROM order_items
    WHERE order_id = p_order_id
  LOOP
    IF v_item.is_preorder THEN
      INSERT INTO inventory_movements (product_id, variant_id, quantity, reason, reference)
      VALUES (
        v_item.product_id,
        v_item.variant_id,
        0,
        CASE WHEN p_direction = 'decrement' THEN 'preorder_sale' ELSE 'preorder_return' END,
        p_order_id::text
      );
    ELSE
      PERFORM register_inventory_movement(
        v_item.product_id,
        v_item.variant_id,
        v_sign * v_item.quantity,
        v_reason,
        p_order_id::text
      );
    END IF;
  END LOOP;

  UPDATE orders SET stock_applied = (p_direction = 'decrement') WHERE id = p_order_id;
END;
$$;

REVOKE ALL ON FUNCTION apply_order_stock_change(UUID, TEXT) FROM PUBLIC;
REVOKE ALL ON FUNCTION apply_order_stock_change(UUID, TEXT) FROM anon, authenticated;
GRANT EXECUTE ON FUNCTION apply_order_stock_change(UUID, TEXT) TO service_role;

-- =============================================================
-- Dra. Mew Store — Migración: la preventa de productos deja de ser
-- "stock infinito", el stock se descuenta al crear el pedido (no
-- al confirmarlo), y límite de cantidad por cliente.
-- Ejecuta en el SQL Editor de Supabase DESPUÉS de
-- migration_binder.sql
-- =============================================================

-- =============================================================
-- 1. Límite opcional de unidades por cliente. NULL = sin límite.
-- =============================================================
ALTER TABLE products ADD COLUMN IF NOT EXISTS max_qty_per_customer INTEGER;

-- =============================================================
-- 2. Vínculo del cliente con su cuenta real de Supabase Auth, para
--    poder aplicar el límite por cliente de forma confiable (antes
--    solo se emparejaba por el email escrito a mano en el checkout).
--    UNIQUE permite múltiples NULL, así que no afecta clientes
--    históricos/invitados sin cuenta.
-- =============================================================
ALTER TABLE customers ADD COLUMN IF NOT EXISTS user_id UUID UNIQUE REFERENCES auth.users(id);

-- =============================================================
-- 3. apply_order_stock_change: los productos en preventa YA NO
--    saltan el descuento/reposición de stock real (se tratan igual
--    que cualquier producto con stock limitado). El binder conserva
--    su comportamiento actual sin cambios (fuera de alcance de esta
--    migración).
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
    SELECT product_id, variant_id, binder_listing_id, quantity, is_preorder
    FROM order_items
    WHERE order_id = p_order_id
  LOOP
    IF v_item.binder_listing_id IS NOT NULL THEN
      -- Binder: sin cambios, la preventa de cartas sigue sin
      -- descontar stock real (fuera de alcance).
      IF v_item.is_preorder THEN
        INSERT INTO inventory_movements (product_id, variant_id, binder_listing_id, quantity, reason, reference)
        VALUES (
          v_item.product_id,
          v_item.variant_id,
          v_item.binder_listing_id,
          0,
          CASE WHEN p_direction = 'decrement' THEN 'preorder_sale' ELSE 'preorder_return' END,
          p_order_id::text
        );
      ELSE
        PERFORM register_binder_movement(
          v_item.binder_listing_id,
          v_sign * v_item.quantity,
          v_reason,
          p_order_id::text
        );
      END IF;
    ELSE
      -- Productos: la preventa ya no salta el descuento real; se
      -- trata igual que cualquier producto con stock limitado.
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

-- =============================================================
-- Dra. Mew Store — Migración: binder virtual (cartas sueltas),
-- catálogo separado de los productos sellados.
-- Ejecuta en el SQL Editor de Supabase DESPUÉS de
-- migration_preorder.sql
-- =============================================================

-- =============================================================
-- 1. Catálogo de cartas sueltas: la carta en sí (nombre, colección)
--    y sus listados vendibles (acabado + condición, cada uno con
--    su propio precio/stock).
-- =============================================================
CREATE TABLE IF NOT EXISTS binder_cards (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name        TEXT NOT NULL,            -- "Charizard ex"
  collection  TEXT NOT NULL,            -- "Obsidian Flames", "151", "Destined Rivals"...
  card_number TEXT,                     -- "054/197", opcional
  image       TEXT,
  created_at  TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_binder_cards_collection ON binder_cards(collection);

CREATE TABLE IF NOT EXISTS binder_listings (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  card_id     UUID REFERENCES binder_cards(id) ON DELETE CASCADE,
  finish      TEXT NOT NULL CHECK (finish IN ('comun', 'holo', 'reverse')),
  condition   TEXT NOT NULL CHECK (condition IN ('NM', 'LP', 'MP', 'HP', 'Damaged')),
  price       NUMERIC(10,2) NOT NULL,
  stock       INTEGER NOT NULL DEFAULT 0,
  sku         TEXT UNIQUE,
  is_preorder BOOLEAN NOT NULL DEFAULT false,
  created_at  TIMESTAMPTZ DEFAULT now(),
  UNIQUE (card_id, finish, condition)
);
CREATE INDEX IF NOT EXISTS idx_binder_listings_card ON binder_listings(card_id);

ALTER TABLE binder_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE binder_listings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read binder cards" ON binder_cards FOR SELECT USING (true);
CREATE POLICY "Public read binder listings" ON binder_listings FOR SELECT USING (true);

-- =============================================================
-- 2. El cárdex (inventory_movements) también registra movimientos
--    de binder listings, para que siga siendo un único libro de
--    inventario coherente.
-- =============================================================
ALTER TABLE inventory_movements ADD COLUMN IF NOT EXISTS binder_listing_id UUID REFERENCES binder_listings(id) ON DELETE SET NULL;

CREATE OR REPLACE FUNCTION register_binder_movement(
  p_listing_id UUID,
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
  UPDATE binder_listings
  SET stock = stock + p_quantity
  WHERE id = p_listing_id
  RETURNING stock INTO v_current_stock;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Listing de binder % no encontrado', p_listing_id;
  END IF;

  IF v_current_stock < 0 THEN
    RAISE EXCEPTION 'Stock insuficiente para el listing % (quedarían % unidades)', p_listing_id, v_current_stock;
  END IF;

  INSERT INTO inventory_movements (binder_listing_id, quantity, reason, reference)
  VALUES (p_listing_id, p_quantity, p_reason, p_reference);
END;
$$;

REVOKE ALL ON FUNCTION register_binder_movement(UUID, INTEGER, TEXT, TEXT) FROM PUBLIC;
REVOKE ALL ON FUNCTION register_binder_movement(UUID, INTEGER, TEXT, TEXT) FROM anon, authenticated;
GRANT EXECUTE ON FUNCTION register_binder_movement(UUID, INTEGER, TEXT, TEXT) TO service_role;

-- =============================================================
-- 3. order_items puede referenciar un producto sellado O un
--    binder listing (nunca ambos, nunca ninguno).
-- =============================================================
ALTER TABLE order_items ADD COLUMN IF NOT EXISTS binder_listing_id UUID REFERENCES binder_listings(id);

ALTER TABLE order_items DROP CONSTRAINT IF EXISTS order_items_item_ref_chk;
ALTER TABLE order_items ADD CONSTRAINT order_items_item_ref_chk CHECK (
  (product_id IS NOT NULL AND binder_listing_id IS NULL) OR
  (product_id IS NULL AND binder_listing_id IS NOT NULL)
);

-- =============================================================
-- 4. apply_order_stock_change: ahora despacha a register_inventory_movement
--    (productos/variantes) o register_binder_movement (binder listings)
--    según qué referencia tenga cada order_item.
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
    ELSIF v_item.binder_listing_id IS NOT NULL THEN
      PERFORM register_binder_movement(
        v_item.binder_listing_id,
        v_sign * v_item.quantity,
        v_reason,
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

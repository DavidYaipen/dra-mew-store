-- =============================================================
-- Dra. Mew Store — Migración completa: funcionalidades e-commerce
-- Ejecuta en el SQL Editor de Supabase DESPUÉS de seed.sql
-- y migration_add_featured.sql
-- =============================================================

-- =============================================================
-- 1. PRODUCT VARIANTS (tallas, colores, etc.)
-- =============================================================
CREATE TABLE product_variants (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id  INTEGER REFERENCES products(id) ON DELETE CASCADE,
  name        TEXT NOT NULL,           -- ej: "Rojo / M", "32GB / Negro"
  sku         TEXT UNIQUE,
  price_override NUMERIC(10,2),        -- NULL = usa precio base del producto
  stock       INTEGER NOT NULL DEFAULT 0,
  image       TEXT,                    -- imagen variante (opcional)
  created_at  TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_variants_product ON product_variants(product_id);

-- =============================================================
-- 2. INVENTORY (tracking de movimientos)
-- =============================================================
CREATE TABLE inventory_movements (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id  INTEGER REFERENCES products(id) ON DELETE CASCADE,
  variant_id  UUID REFERENCES product_variants(id) ON DELETE SET NULL,
  quantity    INTEGER NOT NULL,        -- positivo = entrada, negativo = salida
  reason      TEXT NOT NULL,           -- 'sale', 'restock', 'adjustment', 'return'
  reference   TEXT,                    -- order_id, etc.
  created_at  TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_inventory_product ON inventory_movements(product_id);
CREATE INDEX idx_inventory_variant ON inventory_movements(variant_id);

-- =============================================================
-- 3. COUPONS (cupones de descuento)
-- =============================================================
CREATE TABLE coupons (
  id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  code            TEXT UNIQUE NOT NULL,
  discount_type   TEXT NOT NULL CHECK (discount_type IN ('percentage', 'fixed')),
  discount_value  NUMERIC(10,2) NOT NULL,
  min_order       NUMERIC(10,2) DEFAULT 0,
  max_uses        INTEGER,            -- NULL = ilimitado
  used_count      INTEGER DEFAULT 0,
  valid_from      TIMESTAMPTZ DEFAULT now(),
  valid_until     TIMESTAMPTZ,
  active          BOOLEAN DEFAULT true,
  created_at      TIMESTAMPTZ DEFAULT now()
);

-- =============================================================
-- 4. CUSTOMERS
-- =============================================================
CREATE TABLE customers (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email       TEXT UNIQUE,
  name        TEXT NOT NULL,
  phone       TEXT,
  address     JSONB,                  -- { street, city, state, zip, country }
  created_at  TIMESTAMPTZ DEFAULT now()
);

-- =============================================================
-- 5. ORDERS (pedidos)
-- =============================================================
CREATE TYPE order_status AS ENUM (
  'pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'
);

CREATE TABLE orders (
  id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_number    SERIAL,
  customer_id     UUID REFERENCES customers(id),
  status          order_status DEFAULT 'pending',
  subtotal        NUMERIC(10,2) NOT NULL,
  discount        NUMERIC(10,2) DEFAULT 0,
  shipping_cost   NUMERIC(10,2) DEFAULT 0,
  total           NUMERIC(10,2) NOT NULL,
  coupon_id       UUID REFERENCES coupons(id),
  shipping_method TEXT,               -- 'standard', 'express'
  shipping_address JSONB,
  payment_method  TEXT,               -- 'card', 'paypal', 'whatsapp'
  payment_status  TEXT DEFAULT 'pending', -- 'pending', 'paid', 'failed', 'refunded'
  notes           TEXT,
  whatsapp_sent   BOOLEAN DEFAULT false,
  created_at      TIMESTAMPTZ DEFAULT now(),
  updated_at      TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_orders_customer ON orders(customer_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created ON orders(created_at DESC);

-- =============================================================
-- 6. ORDER ITEMS
-- =============================================================
CREATE TABLE order_items (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id    UUID REFERENCES orders(id) ON DELETE CASCADE,
  product_id  INTEGER REFERENCES products(id),
  variant_id  UUID REFERENCES product_variants(id),
  name        TEXT NOT NULL,           -- snapshot del nombre
  price       NUMERIC(10,2) NOT NULL, -- snapshot del precio
  quantity    INTEGER NOT NULL,
  image       TEXT,                    -- snapshot de la imagen
  created_at  TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_order_items_order ON order_items(order_id);

-- =============================================================
-- 7. PRODUCT RATINGS/REVIEWS (reemplaza el Reviews hardcoded)
-- =============================================================
CREATE TABLE reviews (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id  INTEGER REFERENCES products(id) ON DELETE CASCADE,
  customer_name TEXT NOT NULL,
  rating      INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment     TEXT,
  approved    BOOLEAN DEFAULT false,
  created_at  TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_reviews_product ON reviews(product_id);

-- =============================================================
-- 8. NEWSLETTER SUBSCRIBERS
-- =============================================================
CREATE TABLE subscribers (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email       TEXT UNIQUE NOT NULL,
  active      BOOLEAN DEFAULT true,
  created_at  TIMESTAMPTZ DEFAULT now()
);

-- =============================================================
-- 9. RLS POLICIES
-- =============================================================
ALTER TABLE product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory_movements ENABLE ROW LEVEL SECURITY;
ALTER TABLE coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscribers ENABLE ROW LEVEL SECURITY;

-- Lectura pública
CREATE POLICY "Public read variants" ON product_variants FOR SELECT USING (true);
CREATE POLICY "Public read coupons" ON coupons FOR SELECT USING (true);
CREATE POLICY "Public read reviews" ON reviews FOR SELECT USING (true);
CREATE POLICY "Public read customers" ON customers FOR SELECT USING (true);

-- Escritura autenticada (anon para pedidos sin login)
CREATE POLICY "Anyone can create orders" ON orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can create order items" ON order_items FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can create customers" ON customers FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can create reviews" ON reviews FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can create subscribers" ON subscribers FOR INSERT WITH CHECK (true);

-- Usuarios ven sus propios pedidos
CREATE POLICY "Users view own orders" ON orders FOR SELECT
  USING (customer_id IN (SELECT id FROM customers WHERE email = current_setting('request.jwt.claims', true)::json->>'email'));

-- =============================================================
-- 10. SEED: cupones de ejemplo
-- =============================================================
INSERT INTO coupons (code, discount_type, discount_value, min_order, max_uses, valid_until) VALUES
('BIENVENIDO10', 'percentage', 10, 20, 100, '2026-12-31'),
('MEW5', 'fixed', 5, 15, 50, '2026-12-31'),
('POKEMON20', 'percentage', 20, 50, 30, '2026-06-30');

-- =============================================================
-- 11. SEED: variantes de ejemplo para Peluche Mew
-- =============================================================
INSERT INTO product_variants (product_id, name, stock, price_override) VALUES
(1, '30cm (Estándar)', 25, NULL),
(1, '50cm (Grande)', 10, 15.00),
(2, 'Normal', 40, NULL),
(3, 'XL (60cm)', 8, 20.00),
(4, 'Escala 1/10', 15, NULL),
(4, 'Escala 1/6', 5, 30.00);

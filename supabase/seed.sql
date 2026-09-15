-- =============================================================
-- Dra. Mew Store — Schema + Seed para Supabase
-- Ejecuta este SQL en el SQL Editor de tu dashboard Supabase:
-- https://supabase.com/dashboard/project/_/sql/new
-- =============================================================

-- 1. Tipos
CREATE TYPE product_category AS ENUM ('Peluches', 'Figuras', 'Cartas', 'Ropa', 'Accesorios');

-- 2. Tabla products
CREATE TABLE products (
  id          INTEGER PRIMARY KEY,
  name        TEXT NOT NULL,
  cat         product_category NOT NULL,
  price       NUMERIC(10,2) NOT NULL,
  old_price   NUMERIC(10,2),
  rating      NUMERIC(2,1) NOT NULL CHECK (rating >= 0 AND rating <= 5),
  image       TEXT NOT NULL,
  tint        TEXT NOT NULL,
  badge       TEXT,
  created_at  TIMESTAMPTZ DEFAULT now()
);

-- 3. Índices
CREATE INDEX idx_products_cat ON products(cat);
CREATE INDEX idx_products_badge ON products(badge) WHERE badge IS NOT NULL;

-- 4. Seed: los 13 productos actuales
INSERT INTO products (id, name, cat, price, old_price, rating, image, tint, badge) VALUES
(1,  'Peluche Mew 30 cm',    'Peluches',   34.99, NULL,   4.9, '/assets/thiings/star.png',          'var(--pink-soft)',     'Nuevo'),
(2,  'Peluche Pikachu',      'Peluches',   29.99, 39.99,  4.8, '/assets/thiings/heart.png',         'var(--blue-50)',       NULL),
(3,  'Peluche Snorlax XL',   'Peluches',   49.99, NULL,   5.0, '/assets/thiings/golden-heart.png',  'var(--amber-100)',     'Nuevo'),
(4,  'Figura Charizard',      'Figuras',    59.99, NULL,   5.0, '/assets/thiings/lightning.png',     'var(--rose-100)',      'Nuevo'),
(5,  'Figura Bulbasaur',      'Figuras',    24.99, 32.99,  4.7, '/assets/thiings/peace.png',         'var(--green-100)',     NULL),
(6,  'Figura Gengar',         'Figuras',    39.99, NULL,   4.9, '/assets/thiings/purple-heart.png',  'var(--violet-100)',    'Nuevo'),
(7,  'Booster 151',           'Cartas',      6.99, NULL,   4.7, '/assets/thiings/five-star.png',     'var(--blue-50)',       'Últimas'),
(8,  'Caja Élite Trainer',    'Cartas',     49.99, NULL,   5.0, '/assets/thiings/medal.png',         'var(--amber-100)',     NULL),
(9,  'Carta Mew ex',          'Cartas',     89.99, NULL,   4.9, '/assets/thiings/award.png',         'var(--pink-soft)',     'Rara'),
(10, 'Camiseta Pokémon',      'Ropa',       24.99, 34.99,  4.6, '/assets/thiings/like.png',          'var(--blue-50)',       NULL),
(11, 'Gorra Pokéball',        'Ropa',       19.99, 27.99,  4.5, '/assets/thiings/love.png',          'var(--rose-100)',      NULL),
(12, 'Funda para consola',    'Accesorios', 14.99, NULL,   4.4, '/assets/thiings/console.png',       'var(--graphite-100)',  NULL),
(13, 'Llavero Pikachu',       'Accesorios',  9.99, NULL,   4.6, '/assets/thiings/eighth-note.png',   'var(--violet-100)',    NULL);

-- 5. Habilitar RLS (Row Level Security) — lectura pública
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read access" ON products
  FOR SELECT
  TO anon
  USING (true);

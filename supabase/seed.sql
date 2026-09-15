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
  is_featured BOOLEAN DEFAULT false,
  description TEXT,
  dimensions  TEXT,
  material    TEXT,
  origin      TEXT CHECK (origin IN ('official', 'generic')),
  created_at  TIMESTAMPTZ DEFAULT now()
);

-- 3. Índices
CREATE INDEX idx_products_cat ON products(cat);
CREATE INDEX idx_products_badge ON products(badge) WHERE badge IS NOT NULL;
CREATE INDEX idx_products_featured ON products(is_featured) WHERE is_featured = true;

-- 4. Seed: los 13 productos actuales
INSERT INTO products (id, name, cat, price, old_price, rating, image, tint, badge, is_featured, description, dimensions, material, origin) VALUES
(1,  'Peluche Mew 30 cm',    'Peluches',   34.99, NULL,   4.9, '/assets/thiings/star.png',          'var(--pink-soft)',     'Nuevo', true,  'Peluche coleccion oficial de Pokemon. Acabado premium con materiales de alta calidad.', '30 x 20 x 15 cm', 'Poliéster suave, relleno de algodón', 'official'),
(2,  'Peluche Pikachu',      'Peluches',   29.99, 39.99,  4.8, '/assets/thiings/heart.png',         'var(--blue-50)',       NULL,    false, 'Peluche clasico de Pikachu. Suave y abrazable, ideal para fans de todas las edades.', '25 x 15 x 12 cm', 'Poliéster suave', 'official'),
(3,  'Peluche Snorlax XL',   'Peluches',   49.99, NULL,   5.0, '/assets/thiings/golden-heart.png',  'var(--amber-100)',     'Nuevo', false, 'Peluche gigante de Snorlax. Perfecto para acurrucarse y dormir.', '50 x 40 x 30 cm', 'Poliéster suave, relleno premium', 'official'),
(4,  'Figura Charizard',      'Figuras',    59.99, NULL,   5.0, '/assets/thiings/lightning.png',     'var(--rose-100)',      'Nuevo', true,  'Figura coleccion de alto detalle. Edicion cuidada al detalle, perfecta para exhibir.', '18 x 15 x 10 cm', 'PVC de alta calidad', 'official'),
(5,  'Figura Bulbasaur',      'Figuras',    24.99, 32.99,  4.7, '/assets/thiings/peace.png',         'var(--green-100)',     NULL,    false, 'Figura detallada de Bulbasaur con su planta en la espalda.', '12 x 8 x 8 cm', 'PVC', 'official'),
(6,  'Figura Gengar',         'Figuras',    39.99, NULL,   4.9, '/assets/thiings/purple-heart.png',  'var(--violet-100)',    'Nuevo', false, 'Figura de Gengar con expresion espeluznante. Perfecta para coleccionistas.', '14 x 10 x 10 cm', 'PVC de alta calidad', 'official'),
(7,  'Booster 151',           'Cartas',      6.99, NULL,   4.7, '/assets/thiings/five-star.png',     'var(--blue-50)',       'Últimas', false, 'Sobre de cartas con 10 cartas aleatorias de la edicion 151.', '8.6 x 6.3 cm (por carta)', 'Cartulina laminada', 'official'),
(8,  'Caja Élite Trainer',    'Cartas',     49.99, NULL,   5.0, '/assets/thiings/medal.png',         'var(--amber-100)',     NULL,    false, 'Caja completa con sobres, dados, Tokens y accesorios para jugar.', '25 x 18 x 5 cm', 'Cartulina y plastico', 'official'),
(9,  'Carta Mew ex',          'Cartas',     89.99, NULL,   4.9, '/assets/thiings/award.png',         'var(--pink-soft)',     'Rara',  true,  'Carta holografica rara de Mew ex. Edicion limitada.', '8.6 x 6.3 cm', 'Cartulina holografica', 'official'),
(10, 'Camiseta Pokémon',      'Ropa',       24.99, 34.99,  4.6, '/assets/thiings/like.png',          'var(--blue-50)',       NULL,    false, 'Camiseta comoda con estampado de Pokemon. Diseno exclusivo.', 'Ver guia de tallas', 'Algodón 60% / Poliéster 40%', 'generic'),
(11, 'Gorra Pokéball',        'Ropa',       19.99, 27.99,  4.5, '/assets/thiings/love.png',          'var(--rose-100)',      NULL,    false, 'Gorra con diseno de Pokéball. Ajustable y comoda.', 'Ajustable', 'Algodón / Poliéster', 'generic'),
(12, 'Funda para consola',    'Accesorios', 14.99, NULL,   4.4, '/assets/thiings/console.png',       'var(--graphite-100)',  NULL,    false, 'Funda protectora para consola portatil con diseno Pokemon.', 'Compatible con Switch Lite', 'Neoprene', 'generic'),
(13, 'Llavero Pikachu',       'Accesorios',  9.99, NULL,   4.6, '/assets/thiings/eighth-note.png',   'var(--violet-100)',    NULL,    false, 'Llavero metalico con silueta de Pikachu. Resistente y elegante.', '5 x 3 x 0.5 cm', 'Metal aleacion', 'generic');

-- 5. Habilitar RLS (Row Level Security) — lectura pública
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read access" ON products
  FOR SELECT
  TO anon
  USING (true);

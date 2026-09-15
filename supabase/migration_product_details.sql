-- Migracion: Agregar campos de detalles a productos
-- description, dimensions, material, origin

ALTER TABLE products
  ADD COLUMN IF NOT EXISTS description TEXT,
  ADD COLUMN IF NOT EXISTS dimensions TEXT,
  ADD COLUMN IF NOT EXISTS material TEXT,
  ADD COLUMN IF NOT EXISTS origin TEXT CHECK (origin IN ('official', 'generic'));

-- Comentarios para las columnas
COMMENT ON COLUMN products.description IS 'Descripcion detallada del producto';
COMMENT ON COLUMN products.dimensions IS 'Dimensiones: alto x ancho x profundidad';
COMMENT ON COLUMN products.material IS 'Material del producto';
COMMENT ON COLUMN products.origin IS 'official = Pokemon Center, generic = generico';

-- Actualizar productos existentes con datos de ejemplo
UPDATE products SET
  description = 'Peluche coleccion oficial de Pokemon. Acabado premium con materiales de alta calidad, ideal para regalar o sumar a tu coleccion.',
  dimensions = '25 x 15 x 12 cm',
  material = 'Poliéster suave, relleno de algodón',
  origin = 'official'
WHERE cat = 'Peluches';

UPDATE products SET
  description = 'Figura coleccion de alto detalle. Edicion cuidada al detalle, perfecta para exhibir en tu escritorio o estanteria.',
  dimensions = '15 x 10 x 8 cm',
  material = 'PVC de alta calidad',
  origin = 'official'
WHERE cat = 'Figuras';

UPDATE products SET
  description = 'Carta coleccion de Pokemon. Edicion original con holografico especial. Ideal para coleccionistas y jugadores.',
  dimensions = '8.6 x 6.3 cm',
  material = 'Cartulina laminada',
  origin = 'official'
WHERE cat = 'Cartas';

UPDATE products SET
  description = 'Ropa coleccion Pokemon. Diseno exclusivo con estampado de alta calidad. Comoda y duradera.',
  dimensions = 'Ver guia de tallas',
  material = 'Algodón poliéster',
  origin = 'generic'
WHERE cat = 'Ropa';

UPDATE products SET
  description = 'Accesorio coleccion Pokemon. Util y estetico, perfecto para complementar tu outfit o escritorio.',
  dimensions = 'Variable segun producto',
  material = 'Material de alta calidad',
  origin = 'generic'
WHERE cat = 'Accesorios';

import type { Product, CategoryShortcut } from './types';

/**
 * Helper para generar URLs de Supabase Storage.
 * Las imagenes se almacenan en el bucket 'products' y son publicas.
 */
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://gqlsmnscpmvymxzrrorx.supabase.co';
const img = (file: string) => `${SUPABASE_URL}/storage/v1/object/public/products/${file}`;

/**
 * Catálogo de productos. Las imagenes vienen de Supabase Storage.
 * Para cambiar una imagen: sube la nueva en /admin/productos y actualiza el campo 'image'.
 */
export const CATALOG: Product[] = [
  { id: 1, name: 'Peluche Mew 30 cm', cat: 'Peluches', price: 34.99, rating: 4.9, image: img('star.png'), tint: 'var(--pink-soft)', badge: 'Nuevo', description: 'Peluche coleccion oficial de Pokemon. Acabado premium con materiales de alta calidad.', dimensions: '30 x 20 x 15 cm', material: 'Poliéster suave, relleno de algodón', origin: 'official' },
  { id: 2, name: 'Peluche Pikachu', cat: 'Peluches', price: 29.99, oldPrice: 39.99, rating: 4.8, image: img('heart.png'), tint: 'var(--blue-50)', description: 'Peluche clasico de Pikachu. Suave y abrazable, ideal para fans de todas las edades.', dimensions: '25 x 15 x 12 cm', material: 'Poliéster suave', origin: 'official' },
  { id: 3, name: 'Peluche Snorlax XL', cat: 'Peluches', price: 49.99, rating: 5.0, image: img('golden-heart.png'), tint: 'var(--amber-100)', badge: 'Nuevo', description: 'Peluche gigante de Snorlax. Perfecto para acurrucarse y dormir.', dimensions: '50 x 40 x 30 cm', material: 'Poliéster suave, relleno premium', origin: 'official' },
  { id: 4, name: 'Figura Charizard', cat: 'Figuras', price: 59.99, rating: 5.0, image: img('lightning.png'), tint: 'var(--rose-100)', badge: 'Nuevo', description: 'Figura coleccion de alto detalle. Edicion cuidada al detalle, perfecta para exhibir.', dimensions: '18 x 15 x 10 cm', material: 'PVC de alta calidad', origin: 'official' },
  { id: 5, name: 'Figura Bulbasaur', cat: 'Figuras', price: 24.99, oldPrice: 32.99, rating: 4.7, image: img('peace.png'), tint: 'var(--green-100)', description: 'Figura detallada de Bulbasaur con su planta en la espalda.', dimensions: '12 x 8 x 8 cm', material: 'PVC', origin: 'official' },
  { id: 6, name: 'Figura Gengar', cat: 'Figuras', price: 39.99, rating: 4.9, image: img('purple-heart.png'), tint: 'var(--violet-100)', badge: 'Nuevo', description: 'Figura de Gengar con expresion espeluznante. Perfecta para coleccionistas.', dimensions: '14 x 10 x 10 cm', material: 'PVC de alta calidad', origin: 'official' },
  { id: 7, name: 'Booster 151', cat: 'Cartas', price: 6.99, rating: 4.7, image: img('five-star.png'), tint: 'var(--blue-50)', badge: 'Últimas', description: 'Sobre de cartas con 10 cartas aleatorias de la edicion 151.', dimensions: '8.6 x 6.3 cm (por carta)', material: 'Cartulina laminada', origin: 'official' },
  { id: 8, name: 'Caja Élite Trainer', cat: 'Cartas', price: 49.99, rating: 5.0, image: img('medal.png'), tint: 'var(--amber-100)', description: 'Caja completa con sobres, dados,Tokens y accesorios para jugar.', dimensions: '25 x 18 x 5 cm', material: 'Cartulina y plastico', origin: 'official' },
  { id: 9, name: 'Carta Mew ex', cat: 'Cartas', price: 89.99, rating: 4.9, image: img('award.png'), tint: 'var(--pink-soft)', badge: 'Rara', description: 'Carta holografica rara de Mew ex. Edicion limitada.', dimensions: '8.6 x 6.3 cm', material: 'Cartulina holografica', origin: 'official' },
  { id: 10, name: 'Camiseta Pokémon', cat: 'Ropa', price: 24.99, oldPrice: 34.99, rating: 4.6, image: img('like.png'), tint: 'var(--blue-50)', description: 'Camiseta comoda con estampado de Pokemon. Diseno exclusivo.', dimensions: 'Ver guia de tallas', material: 'Algodón 60% / Poliéster 40%', origin: 'generic' },
  { id: 11, name: 'Gorra Pokéball', cat: 'Ropa', price: 19.99, oldPrice: 27.99, rating: 4.5, image: img('love.png'), tint: 'var(--rose-100)', description: 'Gorra con diseno de Pokéball. Ajustable y comoda.', dimensions: 'Ajustable', material: 'Algodón / Poliéster', origin: 'generic' },
  { id: 12, name: 'Funda para consola', cat: 'Accesorios', price: 14.99, rating: 4.4, image: img('console.png'), tint: 'var(--graphite-100)', description: 'Funda protectora para consola portatil con diseno Pokemon.', dimensions: 'Compatible con Switch Lite', material: 'Neoprene', origin: 'generic' },
  { id: 13, name: 'Llavero Pikachu', cat: 'Accesorios', price: 9.99, rating: 4.6, image: img('eighth-note.png'), tint: 'var(--violet-100)', description: 'Llavero metalico con silueta de Pikachu. Resistente y elegante.', dimensions: '5 x 3 x 0.5 cm', material: 'Metal aleacion', origin: 'generic' },
];

export function getProduct(id: number): Product | undefined {
  return CATALOG.find((p) => p.id === id);
}

/** Productos relacionados: misma categoría, completando hasta `limit` con otros. */
export function relatedProducts(product: Product, limit = 4): Product[] {
  let related = CATALOG.filter((p) => p.cat === product.cat && p.id !== product.id);
  if (related.length < limit) {
    related = related.concat(CATALOG.filter((p) => p.cat !== product.cat).slice(0, limit - related.length));
  }
  return related.slice(0, limit);
}

/** Atajos de categoría mostrados en la home (estilo image-forward). */
export const HOME_CATEGORIES: CategoryShortcut[] = [
  { name: 'Peluches', count: '120+ piezas', image: img('star.png'), tint: 'var(--pink-soft)' },
  { name: 'Figuras', count: '85+ piezas', image: img('lightning.png'), tint: 'var(--blue-100)' },
  { name: 'Cartas', count: '240+ piezas', image: img('five-star.png'), tint: 'var(--violet-100)' },
  { name: 'Ropa', count: '60+ piezas', image: img('like.png'), tint: 'var(--amber-100)' },
];

/** IDs destacados en el "Drop de la semana". */
export const FEATURED_IDS = [1, 4, 9];

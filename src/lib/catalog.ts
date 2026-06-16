import type { Category, Product } from './types';

/** Prefijo de los placeholders 3D. Cambia el campo `image` por una ruta en
 *  /products/<archivo>.jpg para servir fotos reales (ver README). */
const ph = (file: string) => `/assets/thiings/${file}`;

/**
 * Catálogo de productos. Equivalente 1:1 al `CATALOG` del prototipo de diseño.
 * Los `image` son placeholders intercambiables por fotos reales.
 */
export const CATALOG: Product[] = [
  { id: 1, name: 'Peluche Mew 30 cm', cat: 'Peluches', price: 34.99, rating: 4.9, image: ph('star.png'), tint: 'var(--pink-soft)', badge: 'Nuevo' },
  { id: 2, name: 'Peluche Pikachu', cat: 'Peluches', price: 29.99, oldPrice: 39.99, rating: 4.8, image: ph('heart.png'), tint: 'var(--blue-50)' },
  { id: 3, name: 'Peluche Snorlax XL', cat: 'Peluches', price: 49.99, rating: 5.0, image: ph('golden-heart.png'), tint: 'var(--amber-100)', badge: 'Nuevo' },
  { id: 4, name: 'Figura Charizard', cat: 'Figuras', price: 59.99, rating: 5.0, image: ph('lightning.png'), tint: 'var(--rose-100)', badge: 'Nuevo' },
  { id: 5, name: 'Figura Bulbasaur', cat: 'Figuras', price: 24.99, oldPrice: 32.99, rating: 4.7, image: ph('peace.png'), tint: 'var(--green-100)' },
  { id: 6, name: 'Figura Gengar', cat: 'Figuras', price: 39.99, rating: 4.9, image: ph('purple-heart.png'), tint: 'var(--violet-100)', badge: 'Nuevo' },
  { id: 7, name: 'Booster 151', cat: 'Cartas', price: 6.99, rating: 4.7, image: ph('five-star.png'), tint: 'var(--blue-50)', badge: 'Últimas' },
  { id: 8, name: 'Caja Élite Trainer', cat: 'Cartas', price: 49.99, rating: 5.0, image: ph('medal.png'), tint: 'var(--amber-100)' },
  { id: 9, name: 'Carta Mew ex', cat: 'Cartas', price: 89.99, rating: 4.9, image: ph('award.png'), tint: 'var(--pink-soft)', badge: 'Rara' },
  { id: 10, name: 'Camiseta Pokémon', cat: 'Ropa', price: 24.99, oldPrice: 34.99, rating: 4.6, image: ph('like.png'), tint: 'var(--blue-50)' },
  { id: 11, name: 'Gorra Pokéball', cat: 'Ropa', price: 19.99, oldPrice: 27.99, rating: 4.5, image: ph('love.png'), tint: 'var(--rose-100)' },
  { id: 12, name: 'Funda para consola', cat: 'Accesorios', price: 14.99, rating: 4.4, image: ph('console.png'), tint: 'var(--graphite-100)' },
  { id: 13, name: 'Llavero Pikachu', cat: 'Accesorios', price: 9.99, rating: 4.6, image: ph('eighth-note.png'), tint: 'var(--violet-100)' },
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

export interface CategoryShortcut {
  name: Category;
  count: string;
  image: string;
  tint: string;
}

/** Atajos de categoría mostrados en la home (estilo image-forward). */
export const HOME_CATEGORIES: CategoryShortcut[] = [
  { name: 'Peluches', count: '120+ piezas', image: ph('star.png'), tint: 'var(--pink-soft)' },
  { name: 'Figuras', count: '85+ piezas', image: ph('lightning.png'), tint: 'var(--blue-100)' },
  { name: 'Cartas', count: '240+ piezas', image: ph('five-star.png'), tint: 'var(--violet-100)' },
  { name: 'Ropa', count: '60+ piezas', image: ph('like.png'), tint: 'var(--amber-100)' },
];

/** IDs destacados en el "Drop de la semana". */
export const FEATURED_IDS = [1, 4, 9];

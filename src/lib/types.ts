/**
 * Tipos del dominio de Dra. Mew Store.
 */

export type Category = 'Peluches' | 'Figuras' | 'Cartas' | 'Ropa' | 'Accesorios';

export interface Product {
  id: number;
  name: string;
  cat: Category;
  price: number;
  /** Precio anterior (si está rebajado). */
  oldPrice?: number;
  rating: number;
  /**
   * Ruta pública de la imagen del producto.
   * Hoy apunta a un placeholder 3D en /assets/thiings; para usar una foto
   * real basta con cambiar esta ruta a /products/<archivo> (ver README).
   */
  image: string;
  /** Color/var de fondo para el gradiente de la tarjeta. */
  tint: string;
  /** Etiqueta opcional ("Nuevo", "Últimas", "Rara"...). */
  badge?: string;
}

export interface CartLine {
  id: number;
  qty: number;
}

export interface FaqItem {
  q: string;
  a: string;
}

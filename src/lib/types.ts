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
  /** Stock total (sumatoria de variantes o stock directo). */
  stock?: number;
  /** Descripción detallada del producto. */
  description?: string;
  /** Dimensiones: alto x ancho x profundidad. */
  dimensions?: string;
  /** Material del producto. */
  material?: string;
  /** Origen: official (Pokemon Center) o generic. */
  origin?: 'official' | 'generic';
  /** Disponible en preventa: se muestra como "Se puede pre-ordenar" en la tienda; el stock sigue aplicando normalmente. */
  is_preorder?: boolean;
  /** Nota de preventa (ej. "Llega en octubre"). */
  preorder_note?: string;
  /** Máximo de unidades que un mismo cliente puede pedir en total. undefined = sin límite. */
  max_qty_per_customer?: number;
}

export interface ProductVariant {
  id: string;
  product_id: number;
  name: string;
  sku?: string;
  price_override?: number;
  stock: number;
  image?: string;
}

export interface CartLine {
  /** Id de producto (number) o de binder listing (UUID string). */
  id: number | string;
  qty: number;
  variant_id?: string;
  /** 'product' es el default (carritos guardados antes de esta feature no tienen kind). */
  kind?: 'product' | 'binder';
}

// ─── Binder virtual (cartas sueltas) ────────────────────────────

export type CardFinish = 'comun' | 'holo' | 'reverse';
export type CardCondition = 'NM' | 'LP' | 'MP' | 'HP' | 'Damaged';

export interface BinderCard {
  id: string;
  name: string;
  collection: string;
  cardNumber?: string;
  image?: string;
}

/** Un listing es una combinación vendible (acabado + condición) de una BinderCard. */
export interface BinderListing {
  id: string;
  cardId: string;
  name: string;
  collection: string;
  cardNumber?: string;
  image?: string;
  finish: CardFinish;
  condition: CardCondition;
  price: number;
  stock: number;
  isPreorder: boolean;
}

export interface FaqItem {
  q: string;
  a: string;
}

export interface CategoryShortcut {
  name: Category;
  count: string;
  image: string;
  tint: string;
}

// ─── Orders ──────────────────────────────────────────────────

export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled'
  | 'refunded';

export interface OrderItem {
  id: string;
  order_id: string;
  product_id?: number;
  variant_id?: string;
  binder_listing_id?: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  is_preorder?: boolean;
}

export interface Order {
  id: string;
  order_number: number;
  customer_id?: string;
  status: OrderStatus;
  subtotal: number;
  discount: number;
  shipping_cost: number;
  total: number;
  coupon_id?: string;
  shipping_method?: string;
  shipping_address?: ShippingAddress;
  payment_method?: string;
  payment_status: string;
  notes?: string;
  whatsapp_sent: boolean;
  created_at: string;
  updated_at: string;
  items?: OrderItem[];
}

// ─── Customers ───────────────────────────────────────────────

export interface Customer {
  id: string;
  email?: string;
  name: string;
  phone?: string;
  address?: ShippingAddress;
}

export interface ShippingAddress {
  name: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  phone: string;
}

// ─── Coupons ─────────────────────────────────────────────────

export interface Coupon {
  id: string;
  code: string;
  discount_type: 'percentage' | 'fixed';
  discount_value: number;
  min_order: number;
  max_uses?: number;
  used_count: number;
  valid_from: string;
  valid_until?: string;
  active: boolean;
}

export interface CouponValidation {
  valid: boolean;
  coupon?: Coupon;
  error?: string;
  discount_amount?: number;
}

// ─── Shipping ────────────────────────────────────────────────

export interface ShippingMethod {
  id: string;
  name: string;
  price: number;
  estimated_days: string;
  free_threshold?: number;
}

// ─── Checkout ────────────────────────────────────────────────

export interface CheckoutPayload {
  customer: {
    name: string;
    email: string;
    phone: string;
  };
  shipping_address?: ShippingAddress;
  shipping_method: string;
  payment_method: string;
  coupon_code?: string;
  notes?: string;
  cart: CartLine[];
}

// ─── Reviews ─────────────────────────────────────────────────

export interface Review {
  id: string;
  product_id: number;
  customer_name: string;
  rating: number;
  comment?: string;
  approved: boolean;
  created_at: string;
}

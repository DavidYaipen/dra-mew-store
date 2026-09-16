import type { BinderListing, CartLine, Product } from './types';
import { getProduct } from './catalog';

/** Umbral de envío gratis (S/). */
export const FREE_SHIPPING_THRESHOLD = 150;

function sameLine(a: CartLine, id: CartLine['id'], kind: NonNullable<CartLine['kind']>): boolean {
  return a.id === id && (a.kind ?? 'product') === kind;
}

/** Añade `qty` unidades de la línea `id`/`kind`, fusionando con una existente. */
export function addLine(
  cart: CartLine[],
  id: CartLine['id'],
  qty = 1,
  kind: NonNullable<CartLine['kind']> = 'product',
): CartLine[] {
  const next = cart.slice();
  const i = next.findIndex((c) => sameLine(c, id, kind));
  if (i >= 0) next[i] = { ...next[i], qty: next[i].qty + qty };
  else next.push({ id, qty, kind });
  return next;
}

/** Cambia la cantidad de una línea en `delta`, con mínimo 1. */
export function changeQty(
  cart: CartLine[],
  id: CartLine['id'],
  delta: number,
  kind: NonNullable<CartLine['kind']> = 'product',
): CartLine[] {
  return cart.map((c) => (sameLine(c, id, kind) ? { ...c, qty: Math.max(1, c.qty + delta) } : c));
}

/** Elimina una línea del carrito. */
export function removeLine(
  cart: CartLine[],
  id: CartLine['id'],
  kind: NonNullable<CartLine['kind']> = 'product',
): CartLine[] {
  return cart.filter((c) => !sameLine(c, id, kind));
}

/** Nº total de unidades en el carrito. */
export function cartCount(cart: CartLine[]): number {
  return cart.reduce((a, c) => a + c.qty, 0);
}

/**
 * Subtotal del carrito en S/. Ignora líneas con producto/listing desconocido.
 * `binderListings` solo hace falta si el carrito tiene líneas `kind: 'binder'`.
 */
export function subtotal(
  cart: CartLine[],
  products?: Map<number, Product>,
  binderListings?: Map<string, BinderListing>,
): number {
  return cart.reduce((a, c) => {
    if (c.kind === 'binder') {
      const listing = binderListings?.get(String(c.id));
      return listing ? a + listing.price * c.qty : a;
    }
    const p = products ? products.get(c.id as number) : getProduct(c.id as number);
    return p ? a + p.price * c.qty : a;
  }, 0);
}

export interface ShippingProgress {
  free: boolean;
  /** Importe que falta para el envío gratis (S/). */
  remaining: number;
  /** Progreso 0-100 hacia el umbral. */
  pct: number;
}

export function shippingProgress(sub: number): ShippingProgress {
  const free = sub >= FREE_SHIPPING_THRESHOLD;
  return {
    free,
    remaining: Math.max(0, FREE_SHIPPING_THRESHOLD - sub),
    pct: Math.min(100, Math.round((sub / FREE_SHIPPING_THRESHOLD) * 100)),
  };
}

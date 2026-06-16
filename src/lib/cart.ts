import type { CartLine } from './types';
import { getProduct } from './catalog';

/** Umbral de envío gratis (€). */
export const FREE_SHIPPING_THRESHOLD = 35;

/** Añade `qty` unidades del producto `id`, fusionando con una línea existente. */
export function addLine(cart: CartLine[], id: number, qty = 1): CartLine[] {
  const next = cart.slice();
  const i = next.findIndex((c) => c.id === id);
  if (i >= 0) next[i] = { id, qty: next[i].qty + qty };
  else next.push({ id, qty });
  return next;
}

/** Cambia la cantidad de una línea en `delta`, con mínimo 1. */
export function changeQty(cart: CartLine[], id: number, delta: number): CartLine[] {
  return cart.map((c) => (c.id === id ? { id, qty: Math.max(1, c.qty + delta) } : c));
}

/** Elimina una línea del carrito. */
export function removeLine(cart: CartLine[], id: number): CartLine[] {
  return cart.filter((c) => c.id !== id);
}

/** Nº total de unidades en el carrito. */
export function cartCount(cart: CartLine[]): number {
  return cart.reduce((a, c) => a + c.qty, 0);
}

/** Subtotal del carrito en €. Ignora líneas con producto desconocido. */
export function subtotal(cart: CartLine[]): number {
  return cart.reduce((a, c) => {
    const p = getProduct(c.id);
    return p ? a + p.price * c.qty : a;
  }, 0);
}

export interface ShippingProgress {
  free: boolean;
  /** Importe que falta para el envío gratis (€). */
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

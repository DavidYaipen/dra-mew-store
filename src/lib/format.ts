/** Formatea un número como precio en soles: S/ 34.99. */
export function formatPrice(n: number): string {
  return 'S/ ' + n.toFixed(2);
}

/** @deprecated Usa formatPrice */
export const formatEuro = formatPrice;

/** Porcentaje de descuento (entero) entre precio actual y anterior, p.ej. "-25%". */
export function discountLabel(price: number, oldPrice?: number): string | null {
  if (!oldPrice || oldPrice <= price) return null;
  return '-' + Math.round((1 - price / oldPrice) * 100) + '%';
}

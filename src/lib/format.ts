/** Formatea un número como precio en euros, estilo español: 34,99 €. */
export function formatEuro(n: number): string {
  return n.toFixed(2).replace('.', ',') + ' €';
}

/** Porcentaje de descuento (entero) entre precio actual y anterior, p.ej. "-25%". */
export function discountLabel(price: number, oldPrice?: number): string | null {
  if (!oldPrice || oldPrice <= price) return null;
  return '-' + Math.round((1 - price / oldPrice) * 100) + '%';
}

export function isProductSoldOut(product: { stock?: number }): boolean {
  return product.stock === 0;
}

export function isBinderCardSoldOut(listings: { stock: number; isPreorder: boolean }[]): boolean {
  return listings.length > 0 && listings.every((l) => !l.isPreorder && l.stock === 0);
}

export function remainingQty(
  product: { stock?: number; max_qty_per_customer?: number },
  alreadyInCart: number,
): { remaining: number; limitedBy: 'stock' | 'customer' | null; cap?: number } {
  const stockRemaining = product.stock == null ? Infinity : Math.max(0, product.stock - alreadyInCart);
  const customerRemaining =
    product.max_qty_per_customer == null
      ? Infinity
      : Math.max(0, product.max_qty_per_customer - alreadyInCart);

  if (stockRemaining === Infinity && customerRemaining === Infinity) {
    return { remaining: Infinity, limitedBy: null };
  }
  if (stockRemaining <= customerRemaining) {
    return { remaining: stockRemaining, limitedBy: 'stock', cap: product.stock };
  }
  return { remaining: customerRemaining, limitedBy: 'customer', cap: product.max_qty_per_customer };
}

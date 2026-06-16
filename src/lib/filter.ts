import type { Category, Product } from './types';

export interface ProductFilter {
  cat?: Category | null;
  query?: string;
  onlyNew?: boolean;
  onlySale?: boolean;
}

/**
 * Filtra el catálogo por categoría, búsqueda de texto, novedades y rebajas.
 * Equivale al método `filtered()` del prototipo.
 */
export function filterProducts(catalog: Product[], filter: ProductFilter): Product[] {
  let list = catalog.slice();
  if (filter.cat) list = list.filter((p) => p.cat === filter.cat);
  if (filter.onlyNew) list = list.filter((p) => p.badge === 'Nuevo');
  if (filter.onlySale) list = list.filter((p) => p.oldPrice != null);
  if (filter.query) {
    const q = filter.query.toLowerCase();
    list = list.filter(
      (p) => p.name.toLowerCase().includes(q) || p.cat.toLowerCase().includes(q),
    );
  }
  return list;
}

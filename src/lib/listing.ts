import type { Category } from './types';
import type { ProductFilter } from './filter';

const CATEGORIES: Category[] = ['Peluches', 'Figuras', 'Cartas', 'Ropa', 'Accesorios'];

function toCategory(value?: string): Category | null {
  return value && (CATEGORIES as string[]).includes(value) ? (value as Category) : null;
}

export interface ListingParams {
  cat?: string;
  q?: string;
  new?: string;
  sale?: string;
}

export interface ResolvedListing {
  filter: ProductFilter;
  title: string;
}

/** Traduce el querystring de /productos a filtro + título de la página. */
export function resolveListing(params: ListingParams): ResolvedListing {
  const cat = toCategory(params.cat);
  const query = params.q?.trim() || undefined;
  const onlyNew = params.new === '1';
  const onlySale = params.sale === '1';

  let title = 'Todos los productos';
  if (query) title = `Resultados para "${query}"`;
  else if (onlyNew) title = 'Nuevos lanzamientos';
  else if (onlySale) title = 'Rebajas';
  else if (cat) title = cat;

  return { filter: { cat, query, onlyNew, onlySale }, title };
}

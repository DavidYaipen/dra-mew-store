import { describe, it, expect } from 'vitest';
import { filterProducts } from './filter';
import { CATALOG } from './catalog';

describe('filterProducts', () => {
  it('sin filtros devuelve todo el catálogo', () => {
    expect(filterProducts(CATALOG, {})).toHaveLength(CATALOG.length);
  });

  it('filtra por categoría', () => {
    const figuras = filterProducts(CATALOG, { cat: 'Figuras' });
    expect(figuras.length).toBeGreaterThan(0);
    expect(figuras.every((p) => p.cat === 'Figuras')).toBe(true);
  });

  it('filtra solo novedades (badge "Nuevo")', () => {
    const news = filterProducts(CATALOG, { onlyNew: true });
    expect(news.every((p) => p.badge === 'Nuevo')).toBe(true);
  });

  it('filtra solo rebajas (con precio anterior)', () => {
    const sale = filterProducts(CATALOG, { onlySale: true });
    expect(sale.length).toBeGreaterThan(0);
    expect(sale.every((p) => p.oldPrice != null)).toBe(true);
  });

  it('busca por nombre o categoría, sin distinguir mayúsculas', () => {
    expect(filterProducts(CATALOG, { query: 'mew' }).map((p) => p.name)).toContain('Peluche Mew 30 cm');
    expect(filterProducts(CATALOG, { query: 'CARTAS' }).every((p) => p.cat === 'Cartas')).toBe(true);
  });

  it('devuelve vacío cuando no hay coincidencias', () => {
    expect(filterProducts(CATALOG, { query: 'zzzz-no-existe' })).toHaveLength(0);
  });
});

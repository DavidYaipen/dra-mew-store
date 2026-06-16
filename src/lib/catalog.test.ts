import { describe, it, expect } from 'vitest';
import { CATALOG, getProduct, relatedProducts } from './catalog';

describe('getProduct', () => {
  it('encuentra un producto por id', () => {
    expect(getProduct(1)?.name).toBe('Peluche Mew 30 cm');
  });
  it('devuelve undefined si no existe', () => {
    expect(getProduct(9999)).toBeUndefined();
  });
});

describe('relatedProducts', () => {
  it('devuelve 4 productos sin incluir el actual', () => {
    const product = getProduct(1)!;
    const related = relatedProducts(product);
    expect(related).toHaveLength(4);
    expect(related.some((p) => p.id === product.id)).toBe(false);
  });

  it('prioriza la misma categoría', () => {
    const product = getProduct(7)!; // Cartas (hay 3 en total)
    const related = relatedProducts(product);
    const sameCat = related.filter((p) => p.cat === 'Cartas');
    expect(sameCat.length).toBeGreaterThanOrEqual(2);
  });
});

describe('CATALOG', () => {
  it('tiene ids únicos', () => {
    const ids = new Set(CATALOG.map((p) => p.id));
    expect(ids.size).toBe(CATALOG.length);
  });

  it('todas las imágenes apuntan a una ruta pública', () => {
    expect(CATALOG.every((p) => p.image.startsWith('/'))).toBe(true);
  });
});

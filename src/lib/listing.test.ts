import { describe, it, expect } from 'vitest';
import { resolveListing } from './listing';

describe('resolveListing', () => {
  it('por defecto muestra todos los productos', () => {
    const { title, filter } = resolveListing({});
    expect(title).toBe('Todos los productos');
    expect(filter).toEqual({ cat: null, query: undefined, onlyNew: false, onlySale: false });
  });

  it('resuelve categoría válida', () => {
    const { title, filter } = resolveListing({ cat: 'Figuras' });
    expect(title).toBe('Figuras');
    expect(filter.cat).toBe('Figuras');
  });

  it('ignora categorías inválidas', () => {
    expect(resolveListing({ cat: 'NoExiste' }).filter.cat).toBeNull();
  });

  it('prioriza la búsqueda en el título', () => {
    const { title, filter } = resolveListing({ q: 'pikachu', cat: 'Figuras' });
    expect(title).toBe('Resultados para "pikachu"');
    expect(filter.query).toBe('pikachu');
  });

  it('reconoce novedades y rebajas', () => {
    expect(resolveListing({ new: '1' }).title).toBe('Nuevos lanzamientos');
    expect(resolveListing({ sale: '1' }).title).toBe('Rebajas');
  });
});

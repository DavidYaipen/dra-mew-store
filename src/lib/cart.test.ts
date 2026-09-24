import { describe, it, expect } from 'vitest';
import { addLine, cartCount, changeQty, removeLine, shippingCost, subtotal } from './cart';
import type { BinderListing, CartLine } from './types';

describe('addLine', () => {
  it('añade una línea nueva', () => {
    expect(addLine([], 1, 2)).toEqual([{ id: 1, qty: 2, kind: 'product' }]);
  });

  it('fusiona cantidades de un producto existente', () => {
    const cart: CartLine[] = [{ id: 1, qty: 1, kind: 'product' }];
    expect(addLine(cart, 1, 3)).toEqual([{ id: 1, qty: 4, kind: 'product' }]);
  });

  it('no muta el carrito original', () => {
    const cart: CartLine[] = [{ id: 1, qty: 1, kind: 'product' }];
    addLine(cart, 1, 1);
    expect(cart).toEqual([{ id: 1, qty: 1, kind: 'product' }]);
  });

  it('usa cantidad 1 por defecto', () => {
    expect(addLine([], 5)).toEqual([{ id: 5, qty: 1, kind: 'product' }]);
  });

  it('trata un producto y un binder listing con el mismo id como líneas distintas', () => {
    const cart = addLine([], 1, 1, 'product');
    const next = addLine(cart, 1, 1, 'binder');
    expect(next).toEqual([
      { id: 1, qty: 1, kind: 'product' },
      { id: 1, qty: 1, kind: 'binder' },
    ]);
  });
});

describe('changeQty', () => {
  it('incrementa y decrementa', () => {
    const cart: CartLine[] = [{ id: 1, qty: 2, kind: 'product' }];
    expect(changeQty(cart, 1, 1)).toEqual([{ id: 1, qty: 3, kind: 'product' }]);
    expect(changeQty(cart, 1, -1)).toEqual([{ id: 1, qty: 1, kind: 'product' }]);
  });

  it('nunca baja de 1', () => {
    const cart: CartLine[] = [{ id: 1, qty: 1, kind: 'product' }];
    expect(changeQty(cart, 1, -5)).toEqual([{ id: 1, qty: 1, kind: 'product' }]);
  });

  it('no afecta una línea binder con el mismo id', () => {
    const cart: CartLine[] = [
      { id: 1, qty: 2, kind: 'product' },
      { id: 1, qty: 2, kind: 'binder' },
    ];
    expect(changeQty(cart, 1, 1, 'product')).toEqual([
      { id: 1, qty: 3, kind: 'product' },
      { id: 1, qty: 2, kind: 'binder' },
    ]);
  });
});

describe('removeLine', () => {
  it('elimina la línea indicada', () => {
    const cart: CartLine[] = [
      { id: 1, qty: 1, kind: 'product' },
      { id: 2, qty: 1, kind: 'product' },
    ];
    expect(removeLine(cart, 1)).toEqual([{ id: 2, qty: 1, kind: 'product' }]);
  });

  it('no elimina una línea binder con el mismo id', () => {
    const cart: CartLine[] = [
      { id: 1, qty: 1, kind: 'product' },
      { id: 1, qty: 1, kind: 'binder' },
    ];
    expect(removeLine(cart, 1, 'product')).toEqual([{ id: 1, qty: 1, kind: 'binder' }]);
  });
});

describe('cartCount', () => {
  it('suma todas las unidades', () => {
    expect(cartCount([{ id: 1, qty: 2 }, { id: 2, qty: 3 }])).toBe(5);
    expect(cartCount([])).toBe(0);
  });
});

describe('subtotal', () => {
  it('multiplica precio por cantidad usando el catálogo', () => {
    // Producto 1 = 34.99, producto 7 = 6.99
    expect(subtotal([{ id: 1, qty: 2 }, { id: 7, qty: 1 }])).toBeCloseTo(34.99 * 2 + 6.99, 2);
  });

  it('ignora ids desconocidos', () => {
    expect(subtotal([{ id: 9999, qty: 2 }])).toBe(0);
  });

  it('suma líneas binder usando el mapa de listings', () => {
    const listing: BinderListing = {
      id: 'a1',
      cardId: 'c1',
      name: 'Charizard ex',
      collection: 'Obsidian Flames',
      finish: 'holo',
      condition: 'NM',
      price: 50,
      stock: 3,
      isPreorder: false,
    };
    const binderListings = new Map([[listing.id, listing]]);
    const cart: CartLine[] = [{ id: 'a1', qty: 2, kind: 'binder' }];
    expect(subtotal(cart, undefined, binderListings)).toBe(100);
  });

  it('ignora líneas binder si no se pasa el mapa de listings', () => {
    const cart: CartLine[] = [{ id: 'a1', qty: 2, kind: 'binder' }];
    expect(subtotal(cart)).toBe(0);
  });
});

describe('shippingCost', () => {
  it('cobra la tarifa estándar para delivery normal', () => {
    expect(shippingCost('standard')).toBe(14.9);
  });

  it('cobra estándar + recargo para express', () => {
    expect(shippingCost('express')).toBeCloseTo(19.9, 2);
  });

  it('el recojo en tienda siempre es gratis', () => {
    expect(shippingCost('pickup')).toBe(0);
  });
});

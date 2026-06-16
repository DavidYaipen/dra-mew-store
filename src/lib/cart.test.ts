import { describe, it, expect } from 'vitest';
import {
  FREE_SHIPPING_THRESHOLD,
  addLine,
  cartCount,
  changeQty,
  removeLine,
  shippingProgress,
  subtotal,
} from './cart';
import type { CartLine } from './types';

describe('addLine', () => {
  it('añade una línea nueva', () => {
    expect(addLine([], 1, 2)).toEqual([{ id: 1, qty: 2 }]);
  });

  it('fusiona cantidades de un producto existente', () => {
    const cart: CartLine[] = [{ id: 1, qty: 1 }];
    expect(addLine(cart, 1, 3)).toEqual([{ id: 1, qty: 4 }]);
  });

  it('no muta el carrito original', () => {
    const cart: CartLine[] = [{ id: 1, qty: 1 }];
    addLine(cart, 1, 1);
    expect(cart).toEqual([{ id: 1, qty: 1 }]);
  });

  it('usa cantidad 1 por defecto', () => {
    expect(addLine([], 5)).toEqual([{ id: 5, qty: 1 }]);
  });
});

describe('changeQty', () => {
  it('incrementa y decrementa', () => {
    const cart: CartLine[] = [{ id: 1, qty: 2 }];
    expect(changeQty(cart, 1, 1)).toEqual([{ id: 1, qty: 3 }]);
    expect(changeQty(cart, 1, -1)).toEqual([{ id: 1, qty: 1 }]);
  });

  it('nunca baja de 1', () => {
    const cart: CartLine[] = [{ id: 1, qty: 1 }];
    expect(changeQty(cart, 1, -5)).toEqual([{ id: 1, qty: 1 }]);
  });
});

describe('removeLine', () => {
  it('elimina la línea indicada', () => {
    const cart: CartLine[] = [
      { id: 1, qty: 1 },
      { id: 2, qty: 1 },
    ];
    expect(removeLine(cart, 1)).toEqual([{ id: 2, qty: 1 }]);
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
});

describe('shippingProgress', () => {
  it('marca envío gratis al alcanzar el umbral', () => {
    const p = shippingProgress(FREE_SHIPPING_THRESHOLD);
    expect(p.free).toBe(true);
    expect(p.remaining).toBe(0);
    expect(p.pct).toBe(100);
  });

  it('calcula lo que falta y el progreso por debajo del umbral', () => {
    const p = shippingProgress(20);
    expect(p.free).toBe(false);
    expect(p.remaining).toBeCloseTo(15, 2);
    expect(p.pct).toBe(57); // round(20/35*100)
  });
});

import { describe, it, expect } from 'vitest';
import { formatPrice, formatEuro, discountLabel } from './format';

describe('formatPrice', () => {
  it('formatea con punto decimal y símbolo de sol', () => {
    expect(formatPrice(34.99)).toBe('S/ 34.99');
    expect(formatPrice(6.9)).toBe('S/ 6.90');
    expect(formatPrice(0)).toBe('S/ 0.00');
  });
});

describe('formatEuro (alias)', () => {
  it('es alias de formatPrice', () => {
    expect(formatEuro(10)).toBe('S/ 10.00');
  });
});

describe('discountLabel', () => {
  it('devuelve el porcentaje redondeado de descuento', () => {
    expect(discountLabel(29.99, 39.99)).toBe('-25%');
    expect(discountLabel(24.99, 32.99)).toBe('-24%');
  });

  it('devuelve null si no hay precio anterior o no es mayor', () => {
    expect(discountLabel(20)).toBeNull();
    expect(discountLabel(20, 20)).toBeNull();
    expect(discountLabel(20, 10)).toBeNull();
  });
});

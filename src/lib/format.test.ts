import { describe, it, expect } from 'vitest';
import { discountLabel, formatEuro } from './format';

describe('formatEuro', () => {
  it('formatea con coma decimal y símbolo de euro', () => {
    expect(formatEuro(34.99)).toBe('34,99 €');
    expect(formatEuro(6.9)).toBe('6,90 €');
    expect(formatEuro(0)).toBe('0,00 €');
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

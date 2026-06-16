import { describe, it, expect, beforeEach } from 'vitest';
import { act, renderHook, waitFor } from '@testing-library/react';
import type { ReactNode } from 'react';
import { StoreProvider } from './StoreProvider';
import { useStore } from './useStore';

const wrapper = ({ children }: { children: ReactNode }) => <StoreProvider>{children}</StoreProvider>;

describe('StoreProvider', () => {
  beforeEach(() => window.localStorage.clear());

  it('acumula unidades y subtotal al añadir al carrito', () => {
    const { result } = renderHook(() => useStore(), { wrapper });
    act(() => result.current.addToCart(1, 2));
    act(() => result.current.addToCart(1, 1));
    expect(result.current.cartCount).toBe(3);
    expect(result.current.subtotal).toBeCloseTo(34.99 * 3, 2);
  });

  it('alterna favoritos', () => {
    const { result } = renderHook(() => useStore(), { wrapper });
    act(() => result.current.toggleWishlist(5));
    expect(result.current.isWished(5)).toBe(true);
    expect(result.current.wishCount).toBe(1);
    act(() => result.current.toggleWishlist(5));
    expect(result.current.isWished(5)).toBe(false);
  });

  it('muestra un toast con CTA al añadir al carrito', () => {
    const { result } = renderHook(() => useStore(), { wrapper });
    act(() => result.current.addToCart(1, 1));
    expect(result.current.toast).toEqual({ message: 'Añadido al carrito', cta: true });
  });

  it('persiste el carrito en localStorage', async () => {
    const { result } = renderHook(() => useStore(), { wrapper });
    act(() => result.current.addToCart(7, 1));
    await waitFor(() =>
      expect(JSON.parse(window.localStorage.getItem('dmw.cart') ?? '[]')).toEqual([
        { id: 7, qty: 1 },
      ]),
    );
  });
});

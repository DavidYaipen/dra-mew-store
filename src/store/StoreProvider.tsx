'use client';

import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import type { BinderListing, CartLine, Product } from '@/lib/types';
import {
  addLine,
  cartCount as countUnits,
  changeQty as changeQtyFn,
  removeLine,
  subtotal as subtotalFn,
} from '@/lib/cart';

export interface ToastState {
  message: string;
  /** Muestra la acción rápida "Ver carrito →". */
  cta: boolean;
}

export interface StoreContextValue {
  cart: CartLine[];
  wishlist: number[];
  toast: ToastState | null;
  cartCount: number;
  wishCount: number;
  subtotal: number;
  productMap: Map<number, Product>;
  binderMap: Map<string, BinderListing>;
  getProduct: (id: number) => Product | undefined;
  getBinderListing: (id: string) => BinderListing | undefined;
  addToCart: (id: CartLine['id'], qty?: number, kind?: NonNullable<CartLine['kind']>) => void;
  changeQty: (id: CartLine['id'], delta: number, kind?: NonNullable<CartLine['kind']>) => void;
  removeFromCart: (id: CartLine['id'], kind?: NonNullable<CartLine['kind']>) => void;
  toggleWishlist: (id: number) => void;
  isWished: (id: number) => boolean;
  showToast: (message: string, cta?: boolean) => void;
  dismissToast: () => void;
}

export const StoreContext = createContext<StoreContextValue | null>(null);

const CART_KEY = 'dmw.cart';
const WISH_KEY = 'dmw.wishlist';

function readStorage<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartLine[]>([]);
  const [wishlist, setWishlist] = useState<number[]>([]);
  const [toast, setToast] = useState<ToastState | null>(null);
  const [hydrated, setHydrated] = useState(false);
  const [productMap, setProductMap] = useState<Map<number, Product>>(new Map());
  const [binderMap, setBinderMap] = useState<Map<string, BinderListing>>(new Map());
  const toastTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  // Hidratar desde localStorage tras el montaje (evita desajustes SSR).
  useEffect(() => {
    setCart(readStorage<CartLine[]>(CART_KEY, []));
    setWishlist(readStorage<number[]>(WISH_KEY, []));
    setHydrated(true);
  }, []);

  // Fetch catálogo desde la API y construir Map para resolución de productos.
  useEffect(() => {
    fetch('/api/catalog')
      .then((r) => r.json())
      .then((data: Product[]) => {
        setProductMap(new Map(data.map((p) => [p.id, p])));
      })
      .catch(() => {
        // Silenciar errores de red; el Map queda vacío y la UI muestra fallback.
      });
  }, []);

  // Fetch catálogo del binder (cartas sueltas) para resolver líneas kind: 'binder'.
  useEffect(() => {
    fetch('/api/binder-catalog')
      .then((r) => r.json())
      .then((data: BinderListing[]) => {
        setBinderMap(new Map(data.map((l) => [l.id, l])));
      })
      .catch(() => {
        // Silenciar errores de red; el Map queda vacío y la UI muestra fallback.
      });
  }, []);

  useEffect(() => {
    if (hydrated) window.localStorage.setItem(CART_KEY, JSON.stringify(cart));
  }, [cart, hydrated]);

  useEffect(() => {
    if (hydrated) window.localStorage.setItem(WISH_KEY, JSON.stringify(wishlist));
  }, [wishlist, hydrated]);

  useEffect(() => () => clearTimeout(toastTimer.current), []);

  const showToast = useCallback((message: string, cta = false) => {
    clearTimeout(toastTimer.current);
    setToast({ message, cta });
    toastTimer.current = setTimeout(() => setToast(null), cta ? 2600 : 1900);
  }, []);

  const dismissToast = useCallback(() => {
    clearTimeout(toastTimer.current);
    setToast(null);
  }, []);

  const addToCart = useCallback(
    (id: CartLine['id'], qty = 1, kind: NonNullable<CartLine['kind']> = 'product') => {
      setCart((c) => addLine(c, id, qty, kind));
      showToast('Añadido al carrito', true);
    },
    [showToast],
  );

  const changeQty = useCallback(
    (id: CartLine['id'], delta: number, kind: NonNullable<CartLine['kind']> = 'product') => {
      setCart((c) => changeQtyFn(c, id, delta, kind));
    },
    [],
  );

  const removeFromCart = useCallback(
    (id: CartLine['id'], kind: NonNullable<CartLine['kind']> = 'product') => {
      setCart((c) => removeLine(c, id, kind));
    },
    [],
  );

  const toggleWishlist = useCallback(
    (id: number) => {
      setWishlist((w) => {
        const has = w.includes(id);
        showToast(has ? 'Quitado de favoritos' : 'Añadido a favoritos');
        return has ? w.filter((x) => x !== id) : [...w, id];
      });
    },
    [showToast],
  );

  const isWished = useCallback((id: number) => wishlist.includes(id), [wishlist]);

  const getProductFn = useCallback(
    (id: number) => productMap.get(id),
    [productMap],
  );

  const getBinderListingFn = useCallback(
    (id: string) => binderMap.get(id),
    [binderMap],
  );

  const value = useMemo<StoreContextValue>(
    () => ({
      cart,
      wishlist,
      toast,
      cartCount: countUnits(cart),
      wishCount: wishlist.length,
      subtotal: subtotalFn(cart, productMap, binderMap),
      productMap,
      binderMap,
      getProduct: getProductFn,
      getBinderListing: getBinderListingFn,
      addToCart,
      changeQty,
      removeFromCart,
      toggleWishlist,
      isWished,
      showToast,
      dismissToast,
    }),
    [
      cart,
      wishlist,
      toast,
      productMap,
      binderMap,
      getProductFn,
      getBinderListingFn,
      addToCart,
      changeQty,
      removeFromCart,
      toggleWishlist,
      isWished,
      showToast,
      dismissToast,
    ],
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

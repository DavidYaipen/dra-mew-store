'use client';

import { useContext } from 'react';
import { StoreContext, type StoreContextValue } from './StoreProvider';

/** Acceso al estado global de la tienda (carrito, favoritos, toasts). */
export function useStore(): StoreContextValue {
  const ctx = useContext(StoreContext);
  if (!ctx) {
    throw new Error('useStore debe usarse dentro de <StoreProvider>');
  }
  return ctx;
}

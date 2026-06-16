import type { ReactElement, ReactNode } from 'react';
import { render, type RenderOptions } from '@testing-library/react';
import { StoreProvider } from '@/store/StoreProvider';

function Wrapper({ children }: { children: ReactNode }) {
  return <StoreProvider>{children}</StoreProvider>;
}

/** Render que envuelve el árbol en <StoreProvider>. */
export function renderWithStore(ui: ReactElement, options?: Omit<RenderOptions, 'wrapper'>) {
  return render(ui, { wrapper: Wrapper, ...options });
}

export * from '@testing-library/react';

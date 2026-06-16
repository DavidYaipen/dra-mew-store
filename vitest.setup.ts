import '@testing-library/jest-dom/vitest';
import { afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';

// Limpia el DOM renderizado entre tests.
afterEach(() => {
  cleanup();
});

// --- Mocks de Next.js para el entorno jsdom ---

vi.mock('next/image', async () => {
  const React = await import('react');
  type ImgProps = {
    src: string;
    alt: string;
    width?: number;
    height?: number;
    style?: React.CSSProperties;
    className?: string;
  };
  return {
    default: ({ src, alt, width, height, style, className }: ImgProps) =>
      React.createElement('img', { src, alt, width, height, style, className }),
  };
});

vi.mock('next/link', async () => {
  const React = await import('react');
  type LinkProps = { href: string | { pathname: string }; children: React.ReactNode };
  return {
    default: ({ href, children, ...rest }: LinkProps & Record<string, unknown>) =>
      React.createElement('a', { href: typeof href === 'string' ? href : '#', ...rest }, children),
  };
});

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn(), replace: vi.fn(), prefetch: vi.fn(), back: vi.fn() }),
  usePathname: () => '/',
  useSearchParams: () => new URLSearchParams(),
}));

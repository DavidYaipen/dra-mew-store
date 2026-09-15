/**
 * Iconos SVG inline reutilizados en la interfaz.
 * Heredan `currentColor`; el tamaño se controla con la prop `size`.
 */
import type { SVGProps } from 'react';

type IconProps = SVGProps<SVGSVGElement> & { size?: number };

function base({ size = 20, ...props }: IconProps) {
  return {
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    'aria-hidden': true as const,
    ...props,
  };
}

export function SearchIcon(props: IconProps) {
  return (
    <svg {...base(props)} fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
      <circle cx="11" cy="11" r="7" />
      <line x1="21" y1="21" x2="16.5" y2="16.5" />
    </svg>
  );
}

export function UserIcon(props: IconProps) {
  return (
    <svg {...base(props)} fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round">
      <circle cx="12" cy="8" r="4" />
      <path d="M4.5 20c0-4 3.4-6 7.5-6s7.5 2 7.5 6" />
    </svg>
  );
}

export function HeartIcon({ filled = false, ...props }: IconProps & { filled?: boolean }) {
  return (
    <svg
      {...base(props)}
      fill={filled ? 'currentColor' : 'none'}
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 20s-7-4.4-9.2-8.6C1.3 8 2.9 4.7 6.2 4.7c2 0 3.2 1.3 3.8 2.3.6-1 1.8-2.3 3.8-2.3 3.3 0 4.9 3.3 3.4 6.7C19 15.6 12 20 12 20z" />
    </svg>
  );
}

export function CartIcon(props: IconProps) {
  return (
    <svg
      {...base(props)}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* Pokeball icon */}
      <circle cx="12" cy="12" r="10" />
      <path d="M2 12h20" />
      <circle cx="12" cy="12" r="3" fill="currentColor" />
      <path d="M12 2a10 10 0 0 1 0 20" fill="none" />
    </svg>
  );
}

export function CloseIcon(props: IconProps) {
  return (
    <svg {...base(props)} fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round">
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  );
}

export function ArrowUpIcon(props: IconProps) {
  return (
    <svg
      {...base(props)}
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 19V5M6 11l6-6 6 6" />
    </svg>
  );
}

export function ArrowRightIcon(props: IconProps) {
  return (
    <svg
      {...base(props)}
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

export function FacebookIcon(props: IconProps) {
  return (
    <svg {...base(props)} fill="currentColor">
      <path d="M13 22v-8h2.7l.4-3H13V9c0-.9.3-1.5 1.6-1.5H16V4.8C15.7 4.8 14.8 4.7 13.7 4.7 11.4 4.7 9.8 6.1 9.8 8.7V11H7v3h2.8v8z" />
    </svg>
  );
}

export function InstagramIcon(props: IconProps) {
  return (
    <svg {...base(props)} fill="none" stroke="currentColor" strokeWidth={1.7}>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
    </svg>
  );
}

export function YoutubeIcon(props: IconProps) {
  return (
    <svg {...base(props)} fill="currentColor">
      <path d="M21.5 7.2a2.7 2.7 0 0 0-1.9-1.9C17.9 4.8 12 4.8 12 4.8s-5.9 0-7.6.5A2.7 2.7 0 0 0 2.5 7.2 28 28 0 0 0 2 12a28 28 0 0 0 .5 4.8 2.7 2.7 0 0 0 1.9 1.9c1.7.5 7.6.5 7.6.5s5.9 0 7.6-.5a2.7 2.7 0 0 0 1.9-1.9A28 28 0 0 0 22 12a28 28 0 0 0-.5-4.8zM10 15V9l5 3z" />
    </svg>
  );
}

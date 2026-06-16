'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import styles from './FilterChips.module.css';

interface Chip {
  label: string;
  href: string;
  /** ¿Está activo dado el querystring actual? */
  match: (params: URLSearchParams) => boolean;
}

const isPlain = (p: URLSearchParams) => !p.get('cat') && !p.get('sale') && !p.get('new') && !p.get('q');

const BASE_CHIPS: Chip[] = [
  { label: 'Todo', href: '/productos', match: isPlain },
  { label: 'Peluches', href: '/productos?cat=Peluches', match: (p) => p.get('cat') === 'Peluches' },
  { label: 'Figuras', href: '/productos?cat=Figuras', match: (p) => p.get('cat') === 'Figuras' },
  { label: 'Cartas', href: '/productos?cat=Cartas', match: (p) => p.get('cat') === 'Cartas' },
  { label: 'Ropa', href: '/productos?cat=Ropa', match: (p) => p.get('cat') === 'Ropa' },
];

const SALE_CHIP: Chip = {
  label: 'Rebajas',
  href: '/productos?sale=1',
  match: (p) => p.get('sale') === '1',
};

export function FilterChips({ includeSale = false }: { includeSale?: boolean }) {
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams.toString());
  const chips = includeSale ? [...BASE_CHIPS, SALE_CHIP] : BASE_CHIPS;

  return (
    <div className={styles.chips}>
      {chips.map((chip) => (
        <Link key={chip.label} href={chip.href} className={styles.chip} data-active={chip.match(params)}>
          {chip.label}
        </Link>
      ))}
    </div>
  );
}

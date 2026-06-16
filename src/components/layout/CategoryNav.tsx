'use client';

import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import styles from './CategoryNav.module.css';

interface NavItem {
  label: string;
  href: string;
  sale?: boolean;
  isActive: (pathname: string, params: URLSearchParams) => boolean;
}

const onListing = (pathname: string) => pathname === '/productos';

const NAV_ITEMS: NavItem[] = [
  {
    label: 'Nuevos lanzamientos',
    href: '/productos?new=1',
    isActive: (p, sp) => onListing(p) && sp.get('new') === '1',
  },
  {
    label: 'Figuras',
    href: '/productos?cat=Figuras',
    isActive: (p, sp) => onListing(p) && sp.get('cat') === 'Figuras',
  },
  {
    label: 'Cartas',
    href: '/productos?cat=Cartas',
    isActive: (p, sp) => onListing(p) && sp.get('cat') === 'Cartas',
  },
  {
    label: 'Accesorios',
    href: '/productos?cat=Accesorios',
    isActive: (p, sp) => onListing(p) && sp.get('cat') === 'Accesorios',
  },
  {
    label: 'Rebajas',
    href: '/productos?sale=1',
    sale: true,
    isActive: (p, sp) => onListing(p) && sp.get('sale') === '1',
  },
  {
    label: 'Sobre nosotros',
    href: '/sobre-nosotros',
    isActive: (p) => p === '/sobre-nosotros',
  },
];

export function CategoryNav() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams.toString());

  return (
    <nav className={styles.nav} aria-label="Categorías">
      {NAV_ITEMS.map((item) => {
        const active = item.isActive(pathname, params);
        return (
          <Link
            key={item.label}
            href={item.href}
            className={styles.link}
            data-active={active}
          >
            {item.label}
            {item.sale && <span className={styles.saleTag}>-30%</span>}
          </Link>
        );
      })}
    </nav>
  );
}

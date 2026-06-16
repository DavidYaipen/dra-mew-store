import Link from 'next/link';
import { Fragment } from 'react';
import styles from './Breadcrumb.module.css';

export interface Crumb {
  label: string;
  href?: string;
}

/** Migas de pan navegables. El último elemento es la página actual. */
export function Breadcrumb({ items }: { items: Crumb[] }) {
  return (
    <nav className={styles.crumbs} aria-label="Ruta de navegación">
      {items.map((item, i) => (
        <Fragment key={item.label}>
          {i > 0 && <span className={styles.sep}>/</span>}
          {item.href ? (
            <Link href={item.href} className={styles.link}>
              {item.label}
            </Link>
          ) : (
            <span className={styles.current}>{item.label}</span>
          )}
        </Fragment>
      ))}
    </nav>
  );
}

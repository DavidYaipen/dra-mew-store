'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import styles from './FilterChips.module.css';

export function BinderCollectionFilter({ collections }: { collections: string[] }) {
  const searchParams = useSearchParams();
  const current = searchParams.get('collection');

  return (
    <div className={styles.chips}>
      <Link href="/binder" className={styles.chip} data-active={!current}>
        Todas
      </Link>
      {collections.map((collection) => (
        <Link
          key={collection}
          href={`/binder?collection=${encodeURIComponent(collection)}`}
          className={styles.chip}
          data-active={current === collection}
        >
          {collection}
        </Link>
      ))}
    </div>
  );
}

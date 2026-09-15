import Link from 'next/link';
import type { CategoryShortcut } from '@/lib/types';
import { ProductImage } from '@/components/ui/ProductImage';
import styles from './CategoryCard.module.css';

/** Tarjeta de categoría image-forward con overlay y zoom al hover. */
export function CategoryCard({ category }: { category: CategoryShortcut }) {
  return (
    <Link
      href={`/categoria/${category.name.toLowerCase()}`}
      className={styles.wrap}
      aria-label={`Ver categoría ${category.name}`}
    >
      <div
        className={styles.imageCard}
        style={{ background: `linear-gradient(158deg, ${category.tint}, var(--graphite-100))` }}
      >
        <ProductImage
          src={category.image}
          alt={category.name}
          size={104}
          shadow="0 14px 20px rgba(14,15,18,.2)"
        />
      </div>
      <div className={styles.overlay} />
      <div className={styles.label}>
        <div className={styles.name}>{category.name}</div>
        <div className={styles.count}>{category.count}</div>
      </div>
    </Link>
  );
}

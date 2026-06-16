import type { Product } from '@/lib/types';
import { ProductCard } from './ProductCard';
import styles from './ProductGrid.module.css';

interface ProductGridProps {
  products: Product[];
  showCategory?: boolean;
  showBadge?: boolean;
  showOldPrice?: boolean;
}

/** Rejilla de 4 columnas de tarjetas de producto. */
export function ProductGrid({
  products,
  showCategory = false,
  showBadge = true,
  showOldPrice = true,
}: ProductGridProps) {
  return (
    <div className={styles.grid}>
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          showCategory={showCategory}
          showBadge={showBadge}
          showOldPrice={showOldPrice}
        />
      ))}
    </div>
  );
}

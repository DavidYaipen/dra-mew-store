'use client';

import type { Product } from '@/lib/types';
import { useStore } from '@/store/useStore';
import { ProductGrid } from '@/components/product/ProductGrid';
import { EmptyState } from '@/components/ui/EmptyState';
import styles from './WishlistView.module.css';

export function WishlistView() {
  const { wishlist, getProduct } = useStore();
  const products = wishlist
    .map((id) => getProduct(id))
    .filter((p): p is Product => p != null);

  return (
    <>
      <h1 className={styles.heading}>Favoritos</h1>
      {products.length === 0 ? (
        <EmptyState
          icon="golden-heart.png"
          title="Aún no tienes favoritos"
          description="Toca el corazón en cualquier producto para guardarlo aquí."
          actionLabel="Explorar productos"
          actionHref="/productos"
        />
      ) : (
        <ProductGrid products={products} showBadge={false} showOldPrice={false} />
      )}
    </>
  );
}

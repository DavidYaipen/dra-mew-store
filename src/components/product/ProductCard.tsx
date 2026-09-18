'use client';

import Link from 'next/link';
import type { MouseEvent } from 'react';
import type { Product } from '@/lib/types';
import { discountLabel, formatEuro } from '@/lib/format';
import { isProductSoldOut, remainingQty } from '@/lib/stock';
import { useStore } from '@/store/useStore';
import { ProductImage } from '@/components/ui/ProductImage';
import { HeartIcon } from '@/components/ui/Icons';
import styles from './ProductCard.module.css';

interface ProductCardProps {
  product: Product;
  showCategory?: boolean;
  showBadge?: boolean;
  showOldPrice?: boolean;
}

export function ProductCard({
  product,
  showCategory = false,
  showBadge = true,
  showOldPrice = true,
}: ProductCardProps) {
  const { cart, addToCart, toggleWishlist, isWished, showToast } = useStore();
  const wished = isWished(product.id);
  const discount = showOldPrice ? discountLabel(product.price, product.oldPrice) : null;
  const onSale = product.oldPrice != null && showOldPrice;
  const soldOut = isProductSoldOut(product);
  const preorder = product.is_preorder && !soldOut;

  const stop = (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  return (
    <Link href={`/producto/${product.id}`} className={styles.card}>
      <div className={styles.imageWrap} style={{ background: `linear-gradient(158deg,#fff, ${product.tint})` }}>
        <ProductImage
          src={product.image}
          alt={product.name}
          fill
          sizes="(max-width: 460px) 90vw, (max-width: 760px) 45vw, (max-width: 1000px) 30vw, 22vw"
          faded={soldOut}
        />
        {soldOut && <span className={styles.soldOut}>SOLD OUT</span>}
        {discount && <span className={styles.discount}>{discount}</span>}
        {!discount && preorder && (
          <span className={styles.preorderBadge}>Se puede pre-ordenar</span>
        )}
        {!discount && !preorder && showBadge && product.badge && (
          <span className={styles.badge}>{product.badge}</span>
        )}
        <button
          type="button"
          aria-label={wished ? 'Quitar de favoritos' : 'Añadir a favoritos'}
          aria-pressed={wished}
          className={styles.wish}
          data-wished={wished}
          onClick={(e) => {
            stop(e);
            toggleWishlist(product.id);
          }}
        >
          <HeartIcon size={17} filled={wished} />
        </button>
      </div>
      <div className={styles.body}>
        <div className={styles.name} title={product.name}>{product.name}</div>
        {showCategory && <div className={styles.cat}>{product.cat}</div>}
        <div className={styles.priceRow}>
          <span className={styles.price} data-sale={onSale}>
            {formatEuro(product.price)}
          </span>
          {onSale && <span className={styles.oldPrice}>{formatEuro(product.oldPrice!)}</span>}
          <span className={styles.rating}>
            <ProductImage src="/assets/thiings/star.png" alt="" size={14} shadow="0 1px 2px rgba(14,15,18,.2)" />
            {product.rating}
          </span>
        </div>
        <button
          type="button"
          className={styles.addBtn}
          disabled={soldOut}
          onClick={(e) => {
            stop(e);
            if (soldOut) return;
            const alreadyInCart =
              cart.find((l) => l.id === product.id && (l.kind ?? 'product') === 'product')?.qty ?? 0;
            const { remaining, limitedBy, cap } = remainingQty(product, alreadyInCart);
            if (remaining < 1) {
              showToast(
                limitedBy === 'stock'
                  ? 'No hay más stock disponible de este producto.'
                  : `Este producto tiene un límite de ${cap} unidad(es) por cliente.`,
                false,
                'warning',
              );
              return;
            }
            addToCart(product.id, 1);
          }}
        >
          Añadir al carrito
        </button>
      </div>
    </Link>
  );
}

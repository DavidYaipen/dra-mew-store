'use client';

import { useState } from 'react';
import type { Product } from '@/lib/types';
import { discountLabel, formatEuro } from '@/lib/format';
import { useStore } from '@/store/useStore';
import { Button } from '@/components/ui/Button';
import { ProductImage } from '@/components/ui/ProductImage';
import { HeartIcon } from '@/components/ui/Icons';
import styles from './ProductDetail.module.css';

function stockStatus(product: Product): { label: string; level: 'ok' | 'low' | 'out' | 'preorder' } {
  if (product.is_preorder) {
    return {
      label: product.preorder_note ? `Preventa · ${product.preorder_note}` : 'Preventa',
      level: 'preorder',
    };
  }
  const stock = product.stock;
  if (stock === undefined) return { label: 'En stock · listo para enviar', level: 'ok' };
  if (stock === 0) return { label: 'Agotado', level: 'out' };
  if (stock <= 5) return { label: `¡Últimas ${stock} unidades!`, level: 'low' };
  return { label: 'En stock · listo para enviar', level: 'ok' };
}

export function ProductDetail({ product }: { product: Product }) {
  const { addToCart, toggleWishlist, isWished } = useStore();
  const [qty, setQty] = useState(1);
  const wished = isWished(product.id);
  const discount = discountLabel(product.price, product.oldPrice);
  const onSale = product.oldPrice != null;
  const stock = stockStatus(product);

  return (
    <div className={styles.layout}>
      <div>
        <div
          className={styles.stage}
          style={{ background: `linear-gradient(158deg,#fff, ${product.tint})` }}
        >
          <ProductImage src={product.image} alt={product.name} size={280} shadow="0 26px 38px rgba(14,15,18,.2)" priority />
          {product.badge && <span className={styles.badge}>{product.badge}</span>}
        </div>
      </div>

      <div>
        <div className={styles.cat}>{product.cat}</div>
        <h1 className={styles.title}>{product.name}</h1>
        <div className={styles.meta}>
          <span className={styles.rating}>
            <ProductImage src="/assets/thiings/star.png" alt="" size={18} shadow="0 2px 3px rgba(14,15,18,.2)" />
            <strong className={styles.mono}>{product.rating}</strong>
          </span>
          <span className={styles.dot} />
          <span className={styles.stock} data-level={stock.level}>{stock.label}</span>
        </div>

        <div className={styles.prices}>
          <span className={styles.price} data-sale={onSale}>
            {formatEuro(product.price)}
          </span>
          {onSale && <span className={styles.oldPrice}>{formatEuro(product.oldPrice!)}</span>}
          {discount && <span className={styles.discount}>{discount}</span>}
        </div>

        <p className={styles.description}>
          {product.description || 'Pieza de colección oficial con acabado premium y materiales de alta calidad. Edición cuidada al detalle, ideal para regalar o sumar a tu universo Pokémon.'}
        </p>

        {/* Especificaciones del producto */}
        {(product.dimensions || product.material || product.origin) && (
          <div className={styles.specs}>
            <h3 className={styles.specsTitle}>Especificaciones</h3>
            <ul className={styles.specsList}>
              {product.dimensions && (
                <li>
                  <span className={styles.specLabel}>Dimensiones:</span>
                  <span>{product.dimensions}</span>
                </li>
              )}
              {product.material && (
                <li>
                  <span className={styles.specLabel}>Material:</span>
                  <span>{product.material}</span>
                </li>
              )}
              {product.origin && (
                <li>
                  <span className={styles.specLabel}>Origen:</span>
                  <span className={styles.originBadge} data-origin={product.origin}>
                    {product.origin === 'official' ? 'Pokémon Center (Oficial)' : 'Genérico'}
                  </span>
                </li>
              )}
            </ul>
          </div>
        )}

        <div className={styles.actions}>
          <div className={styles.qty}>
            <button type="button" aria-label="Restar" onClick={() => setQty((q) => Math.max(1, q - 1))}>
              −
            </button>
            <span className={styles.qtyValue}>{qty}</span>
            <button type="button" aria-label="Sumar" onClick={() => setQty((q) => q + 1)}>
              +
            </button>
          </div>
          <div className={styles.addWrap}>
            <Button variant="primary" size="lg" fullWidth onClick={() => addToCart(product.id, qty)}>
              Añadir al carrito
            </Button>
          </div>
          <button
            type="button"
            className={styles.wish}
            data-wished={wished}
            aria-pressed={wished}
            aria-label={wished ? 'Quitar de favoritos' : 'Añadir a favoritos'}
            onClick={() => toggleWishlist(product.id)}
          >
            <HeartIcon size={22} filled={wished} />
          </button>
        </div>

        <div className={styles.guarantees}>
          <span className={styles.guarantee}>
            <ProductImage src="/assets/thiings/lightning.png" alt="" size={34} shadow="0 6px 9px rgba(14,15,18,.14)" />
            Envío en 24-48h
          </span>
          <span className={styles.guarantee}>
            <ProductImage src="/assets/thiings/shield.png" alt="" size={34} shadow="0 6px 9px rgba(14,15,18,.14)" />
            100% original
          </span>
          <span className={styles.guarantee}>
            <ProductImage src="/assets/thiings/refresh.png" alt="" size={34} shadow="0 6px 9px rgba(14,15,18,.14)" />
            Devolución 30 días
          </span>
        </div>
      </div>
    </div>
  );
}

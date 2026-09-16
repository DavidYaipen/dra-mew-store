'use client';

import Link from 'next/link';
import { formatEuro } from '@/lib/format';
import { shippingProgress } from '@/lib/cart';
import { useStore } from '@/store/useStore';
import { ProductImage } from '@/components/ui/ProductImage';
import { EmptyState } from '@/components/ui/EmptyState';
import { CloseIcon } from '@/components/ui/Icons';
import styles from './CartView.module.css';

const FINISH_LABELS: Record<string, string> = { comun: 'Común', holo: 'Holo', reverse: 'Reverse' };

export function CartView() {
  const { cart, subtotal, changeQty, removeFromCart, getProduct, getBinderListing } = useStore();

  if (cart.length === 0) {
    return (
      <>
        <h1 className={styles.heading}>Tu carrito</h1>
        <EmptyState
          icon="heart.png"
          title="Tu carrito está vacío"
          description="Descubre peluches, figuras y cartas para empezar tu colección."
          actionLabel="Seguir comprando"
          actionHref="/productos"
        />
      </>
    );
  }

  const ship = shippingProgress(subtotal);

  return (
    <>
      <h1 className={styles.heading}>Tu carrito</h1>
      <div className={styles.layout}>
        <div>
          {cart.map((line) => {
            const key = `${line.kind ?? 'product'}-${line.id}`;

            if (line.kind === 'binder') {
              const listing = getBinderListing(String(line.id));
              if (!listing) return null;
              const label = `${listing.name} · ${FINISH_LABELS[listing.finish] ?? listing.finish} · ${listing.condition}`;
              return (
                <div key={key} className={styles.line}>
                  <Link href="/binder" className={styles.thumb} style={{ background: 'linear-gradient(158deg,#fff,var(--violet-100))' }}>
                    <ProductImage src={listing.image || '/assets/thiings/five-star.png'} alt={label} size={58} shadow="0 8px 12px rgba(14,15,18,.16)" />
                  </Link>
                  <div className={styles.info}>
                    <Link href="/binder" className={styles.name}>
                      {label}
                    </Link>
                    <div className={styles.cat}>{listing.collection}</div>
                    <div className={styles.unit}>{formatEuro(listing.price)} / ud.</div>
                  </div>
                  <div className={styles.qty}>
                    <button type="button" aria-label="Restar" onClick={() => changeQty(line.id, -1, 'binder')}>
                      −
                    </button>
                    <span className={styles.qtyValue}>{line.qty}</span>
                    <button type="button" aria-label="Sumar" onClick={() => changeQty(line.id, 1, 'binder')}>
                      +
                    </button>
                  </div>
                  <div className={styles.lineTotal}>{formatEuro(listing.price * line.qty)}</div>
                  <button
                    type="button"
                    className={styles.remove}
                    aria-label={`Eliminar ${label}`}
                    onClick={() => removeFromCart(line.id, 'binder')}
                  >
                    <CloseIcon size={18} />
                  </button>
                </div>
              );
            }

            const product = getProduct(line.id as number);
            if (!product) return null;
            return (
              <div key={key} className={styles.line}>
                <Link
                  href={`/producto/${product.id}`}
                  className={styles.thumb}
                  style={{ background: `linear-gradient(158deg,#fff, ${product.tint})` }}
                >
                  <ProductImage src={product.image} alt={product.name} size={58} shadow="0 8px 12px rgba(14,15,18,.16)" />
                </Link>
                <div className={styles.info}>
                  <Link href={`/producto/${product.id}`} className={styles.name}>
                    {product.name}
                  </Link>
                  <div className={styles.cat}>{product.cat}</div>
                  <div className={styles.unit}>{formatEuro(product.price)} / ud.</div>
                </div>
                <div className={styles.qty}>
                  <button type="button" aria-label="Restar" onClick={() => changeQty(line.id, -1)}>
                    −
                  </button>
                  <span className={styles.qtyValue}>{line.qty}</span>
                  <button type="button" aria-label="Sumar" onClick={() => changeQty(line.id, 1)}>
                    +
                  </button>
                </div>
                <div className={styles.lineTotal}>{formatEuro(product.price * line.qty)}</div>
                <button
                  type="button"
                  className={styles.remove}
                  aria-label={`Eliminar ${product.name}`}
                  onClick={() => removeFromCart(line.id)}
                >
                  <CloseIcon size={18} />
                </button>
              </div>
            );
          })}
        </div>

        <aside className={styles.summary}>
          <div className={styles.summaryTitle}>Resumen</div>
          {ship.free ? (
            <div className={styles.shipFree}>
              <span>✓</span> ¡Tienes envío gratis!
            </div>
          ) : (
            <div className={styles.shipBar}>
              <div className={styles.shipText}>
                Te faltan <strong className={styles.mono}>{formatEuro(ship.remaining)}</strong> para
                el envío gratis
              </div>
              <div className={styles.track}>
                <div className={styles.fill} style={{ width: `${ship.pct}%` }} />
              </div>
            </div>
          )}
          <div className={styles.row}>
            <span>Subtotal</span>
            <span className={styles.mono}>{formatEuro(subtotal)}</span>
          </div>
          <div className={styles.row}>
            <span>Envío</span>
            <span className={styles.free}>Gratis</span>
          </div>
          <div className={styles.totalRow}>
            <span className={styles.totalLabel}>Total</span>
            <span className={styles.total}>{formatEuro(subtotal)}</span>
          </div>
          <Link href="/checkout" className={styles.checkout}>
            Finalizar compra
          </Link>
          <Link href="/productos" className={styles.keep}>
            Seguir comprando
          </Link>
        </aside>
      </div>
    </>
  );
}

'use client';

import { useState } from 'react';
import { formatEuro } from '@/lib/format';
import { useStore } from '@/store/useStore';
import type { BinderListing } from '@/lib/types';
import styles from './BinderListingsTable.module.css';

const FINISH_LABELS: Record<string, string> = { comun: 'Común', holo: 'Holo', reverse: 'Reverse' };

function stockStatus(listing: BinderListing): { label: string; level: 'ok' | 'low' | 'out' | 'preorder' } {
  if (listing.isPreorder) return { label: 'Preventa', level: 'preorder' };
  if (listing.stock === 0) return { label: 'Agotado', level: 'out' };
  if (listing.stock <= 5) return { label: `Últimas ${listing.stock}`, level: 'low' };
  return { label: 'En stock', level: 'ok' };
}

function ListingRow({ listing }: { listing: BinderListing }) {
  const { addToCart } = useStore();
  const [qty, setQty] = useState(1);
  const status = stockStatus(listing);
  const disabled = !listing.isPreorder && listing.stock === 0;

  return (
    <tr>
      <td>{FINISH_LABELS[listing.finish] ?? listing.finish}</td>
      <td>{listing.condition}</td>
      <td className={styles.price}>{formatEuro(listing.price)}</td>
      <td>
        <span className={styles.stock} data-level={status.level}>{status.label}</span>
      </td>
      <td>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <input
            type="number"
            min={1}
            value={qty}
            onChange={(e) => setQty(Math.max(1, Number(e.target.value) || 1))}
            className={styles.qtyInput}
            disabled={disabled}
          />
          <button
            type="button"
            className={styles.addBtn}
            disabled={disabled}
            onClick={() => addToCart(listing.id, qty, 'binder')}
          >
            Añadir
          </button>
        </div>
      </td>
    </tr>
  );
}

export function BinderListingsTable({ listings }: { listings: BinderListing[] }) {
  if (listings.length === 0) {
    return <p style={{ color: 'var(--text-muted)', marginTop: 16 }}>Todavía no hay listings para esta carta.</p>;
  }

  return (
    <table className={styles.table}>
      <thead>
        <tr>
          <th>Acabado</th>
          <th>Condición</th>
          <th>Precio</th>
          <th>Disponibilidad</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {listings.map((listing) => (
          <ListingRow key={listing.id} listing={listing} />
        ))}
      </tbody>
    </table>
  );
}

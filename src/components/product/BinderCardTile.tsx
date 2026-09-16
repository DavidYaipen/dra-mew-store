import Link from 'next/link';
import { formatEuro } from '@/lib/format';
import { ProductImage } from '@/components/ui/ProductImage';
import type { BinderCardWithListings } from '@/lib/supabase/binder';
import styles from './BinderCardTile.module.css';

export function BinderCardTile({ card }: { card: BinderCardWithListings }) {
  const prices = card.listings.map((l) => l.price);
  const minPrice = prices.length ? Math.min(...prices) : undefined;

  return (
    <Link href={`/binder/${card.id}`} className={styles.card}>
      <div className={styles.imageWrap}>
        <ProductImage src={card.image || '/assets/thiings/five-star.png'} alt={card.name} size={116} />
      </div>
      <div className={styles.body}>
        <div className={styles.name}>{card.name}</div>
        <div className={styles.meta}>
          {card.collection}
          {card.cardNumber ? ` · #${card.cardNumber}` : ''}
        </div>
        <div className={styles.price}>
          {minPrice != null ? `Desde ${formatEuro(minPrice)}` : 'Sin listings'}
        </div>
      </div>
    </Link>
  );
}

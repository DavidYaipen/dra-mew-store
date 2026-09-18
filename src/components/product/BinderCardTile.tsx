import Link from 'next/link';
import { formatEuro } from '@/lib/format';
import { isBinderCardSoldOut } from '@/lib/stock';
import { ProductImage } from '@/components/ui/ProductImage';
import type { BinderCardWithListings } from '@/lib/supabase/binder';
import styles from './BinderCardTile.module.css';

export function BinderCardTile({ card }: { card: BinderCardWithListings }) {
  const prices = card.listings.map((l) => l.price);
  const minPrice = prices.length ? Math.min(...prices) : undefined;
  const soldOut = isBinderCardSoldOut(card.listings);

  return (
    <Link href={`/binder/${card.id}`} className={styles.card}>
      <div className={styles.imageWrap}>
        <ProductImage
          src={card.image || '/assets/thiings/five-star.png'}
          alt={card.name}
          fill
          sizes="(max-width: 460px) 90vw, (max-width: 760px) 45vw, (max-width: 1000px) 30vw, 22vw"
          faded={soldOut}
        />
        {soldOut && <span className={styles.soldOut}>SOLD OUT</span>}
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

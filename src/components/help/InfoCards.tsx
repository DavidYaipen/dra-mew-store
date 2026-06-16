import { ProductImage } from '@/components/ui/ProductImage';
import styles from './InfoCards.module.css';

export interface InfoCard {
  icon: string;
  title: string;
  text: string;
}

/** Trío de tarjetas informativas (envíos, devoluciones). */
export function InfoCards({ cards }: { cards: InfoCard[] }) {
  return (
    <div className={styles.grid}>
      {cards.map((card) => (
        <div key={card.title} className={styles.card}>
          <ProductImage
            src={`/assets/thiings/${card.icon}`}
            alt=""
            size={44}
            shadow="0 8px 12px rgba(14,15,18,.14)"
          />
          <div className={styles.title}>{card.title}</div>
          <p className={styles.text}>{card.text}</p>
        </div>
      ))}
    </div>
  );
}

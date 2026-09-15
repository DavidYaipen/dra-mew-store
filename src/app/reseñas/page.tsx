import type { Metadata } from 'next';
import { REVIEWS, getAverageRating } from '@/lib/reviews';
import { ReviewCard } from '@/components/reviews/ReviewCard';
import { StarRating } from '@/components/reviews/StarRating';
import styles from './page.module.css';

export const metadata: Metadata = {
  title: 'Reseñas de Clientes',
  description:
    'Opiniones y valoraciones de nuestros clientes sobre productos Pokémon de Dra. Mew Store.',
};

export default function ReviewsPage() {
  const avg = getAverageRating();

  return (
    <section className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>Reseñas de Clientes</h1>
        <p className={styles.subtitle}>
          Lo que nuestros clientes opinan sobre nosotros
        </p>
      </div>

      <div className={styles.summary}>
        <div className={styles.avgScore}>{avg}</div>
        <StarRating rating={Math.round(avg)} size={24} />
        <div className={styles.total}>{REVIEWS.length} reseñas</div>
      </div>

      <div className={styles.grid}>
        {REVIEWS.map((review) => (
          <ReviewCard key={review.id} review={review} />
        ))}
      </div>
    </section>
  );
}

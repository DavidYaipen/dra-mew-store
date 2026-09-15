import type { Metadata } from 'next';
import { getApprovedReviews } from '@/lib/supabase/catalog';
import { ReviewCard } from '@/components/reviews/ReviewCard';
import { StarRating } from '@/components/reviews/StarRating';
import { EmptyState } from '@/components/ui/EmptyState';
import styles from './page.module.css';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Reseñas de Clientes',
  description:
    'Opiniones y valoraciones de nuestros clientes sobre productos Pokémon de Dra. Mew Store.',
};

export default async function ReviewsPage() {
  const reviews = await getApprovedReviews();

  if (reviews.length === 0) {
    return (
      <section className={styles.page}>
        <div className={styles.header}>
          <h1 className={styles.title}>Reseñas de Clientes</h1>
          <p className={styles.subtitle}>Lo que nuestros clientes opinan sobre nosotros</p>
        </div>
        <EmptyState
          icon="star.png"
          title="Aún no hay reseñas"
          description="Todavía no tenemos reseñas aprobadas. Vuelve pronto."
          actionLabel="Ver catálogo"
          actionHref="/productos"
        />
      </section>
    );
  }

  const avg = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

  return (
    <section className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>Reseñas de Clientes</h1>
        <p className={styles.subtitle}>
          Lo que nuestros clientes opinan sobre nosotros
        </p>
      </div>

      <div className={styles.summary}>
        <div className={styles.avgScore}>{avg.toFixed(1)}</div>
        <StarRating rating={Math.round(avg)} size={24} />
        <div className={styles.total}>{reviews.length} reseñas</div>
      </div>

      <div className={styles.grid}>
        {reviews.map((review) => (
          <ReviewCard
            key={review.id}
            review={{
              id: review.id,
              name: review.customer_name,
              rating: review.rating,
              comment: review.comment || '',
              date: new Date(review.created_at).toLocaleDateString('es-PE', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              }),
              product: review.product_name || undefined,
            }}
          />
        ))}
      </div>
    </section>
  );
}

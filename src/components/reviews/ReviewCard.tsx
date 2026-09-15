import { StarRating } from './StarRating';
import styles from './ReviewCard.module.css';

interface ReviewCardProps {
  review: {
    id: string | number;
    name: string;
    rating: number;
    comment: string;
    date: string;
    product?: string;
  };
}

export function ReviewCard({ review }: ReviewCardProps) {
  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <div className={styles.avatar}>{review.name.charAt(0)}</div>
        <div>
          <div className={styles.name}>{review.name}</div>
          <time className={styles.date}>{review.date}</time>
        </div>
      </div>
      <StarRating rating={review.rating} />
      {review.product && <div className={styles.product}>Producto: {review.product}</div>}
      <p className={styles.comment}>{review.comment}</p>
    </div>
  );
}

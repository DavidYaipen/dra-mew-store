import { ProductImage } from './ProductImage';
import { LinkButton } from './Button';
import styles from './EmptyState.module.css';

interface EmptyStateProps {
  icon: string;
  title: string;
  description: string;
  actionLabel: string;
  actionHref: string;
}

/** Estado vacío reutilizable (sin resultados, carrito vacío, favoritos vacíos). */
export function EmptyState({ icon, title, description, actionLabel, actionHref }: EmptyStateProps) {
  return (
    <div className={styles.empty}>
      <ProductImage
        src={`/assets/thiings/${icon}`}
        alt=""
        size={84}
        shadow="0 14px 20px rgba(14,15,18,.16)"
      />
      <div className={styles.title}>{title}</div>
      <p className={styles.description}>{description}</p>
      <LinkButton href={actionHref} variant="primary" size="md">
        {actionLabel}
      </LinkButton>
    </div>
  );
}

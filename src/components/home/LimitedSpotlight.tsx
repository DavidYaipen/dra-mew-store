import { getFeaturedProducts } from '@/lib/supabase/catalog';
import { LinkButton } from '@/components/ui/Button';
import { ProductCard } from '@/components/product/ProductCard';
import styles from './LimitedSpotlight.module.css';

export async function LimitedSpotlight() {
  const featured = await getFeaturedProducts();

  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <div className={styles.aside}>
          <span className={styles.tag}>Edición limitada</span>
          <h2 className={styles.title}>Drop de la semana</h2>
          <p className={styles.copy}>
            Piezas seleccionadas que rotan cada semana. Cuando se agotan, no vuelven.
          </p>
          <div className={styles.timer}>
            <span className={styles.timerDot} />
            <span>
              Termina en <strong className={styles.mono}>2d 14h 06m</strong>
            </span>
          </div>
          <div className={styles.cta}>
            <LinkButton href="/productos" variant="primary" size="md">
              Ver el drop completo
            </LinkButton>
          </div>
        </div>
        <div className={styles.grid}>
          {featured.map((product) => (
            <ProductCard key={product.id} product={product} showOldPrice={false} />
          ))}
        </div>
      </div>
    </section>
  );
}

import { LinkButton } from '@/components/ui/Button';
import { ProductImage } from '@/components/ui/ProductImage';
import styles from './Hero.module.css';

export function Hero() {
  return (
    <section className={styles.hero}>
      <div className={styles.inner}>
        <div>
          <span className={styles.eyebrow}>Nueva colección · 2026</span>
          <h1 className={styles.title}>
            Encuentra tu <span className={styles.accent}>compañero</span> Pokémon ideal
          </h1>
          <p className={styles.subtitle}>
            Peluches, figuras, cartas y ropa originales. Piezas seleccionadas para fans y
            coleccionistas, entregadas con cuidado de galería.
          </p>
          <div className={styles.ctas}>
            <LinkButton href="/productos" variant="primary" size="lg">
              Comprar ahora
            </LinkButton>
            <LinkButton href="/productos?new=1" variant="secondary" size="lg">
              Ver novedades
            </LinkButton>
          </div>
          <div className={styles.stats}>
            <span className={styles.stat}>
              <ProductImage src="/assets/thiings/star.png" alt="" size={22} shadow="0 3px 4px rgba(14,15,18,.16)" />
              <strong className={styles.mono}>4.9</strong> / 5
            </span>
            <span className={styles.statDot} />
            <span>
              <strong className={styles.mono}>+12.400</strong> pedidos enviados
            </span>
          </div>
        </div>

        <div className={styles.art}>
          <div className={styles.stage}>
            <ProductImage
              src="/assets/thiings/star.png"
              alt="Producto destacado de Dra. Mew Store"
              size={200}
              shadow="0 26px 36px rgba(14,15,18,.22)"
              priority
            />
          </div>
          <span className={`${styles.floatObj} ${styles.float1}`}>
            <ProductImage src="/assets/thiings/heart.png" alt="" size={64} shadow="0 16px 22px rgba(14,15,18,.18)" />
          </span>
          <span className={`${styles.floatObj} ${styles.float2}`}>
            <ProductImage src="/assets/thiings/lightning.png" alt="" size={58} shadow="0 16px 22px rgba(14,15,18,.18)" />
          </span>
          <span className={`${styles.floatObj} ${styles.float3}`}>
            <ProductImage src="/assets/thiings/golden-heart.png" alt="" size={56} shadow="0 16px 22px rgba(14,15,18,.18)" />
          </span>
        </div>
      </div>
    </section>
  );
}

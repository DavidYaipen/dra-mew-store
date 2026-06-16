import { ProductImage } from '@/components/ui/ProductImage';
import styles from './TrustBadges.module.css';

const BADGES = [
  { icon: 'lightning.png', title: 'Envío express', sub: 'Gratis desde 35 €' },
  { icon: 'shield.png', title: '100% originales', sub: 'Productos con licencia' },
  { icon: 'refresh.png', title: 'Devoluciones 30 días', sub: 'Sin complicaciones' },
  { icon: 'lock.png', title: 'Pago seguro', sub: 'Cifrado SSL' },
];

export function TrustBadges() {
  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        {BADGES.map((b) => (
          <div key={b.title} className={styles.item}>
            <ProductImage
              src={`/assets/thiings/${b.icon}`}
              alt=""
              size={46}
              shadow="0 8px 12px rgba(14,15,18,.14)"
            />
            <div>
              <div className={styles.title}>{b.title}</div>
              <div className={styles.sub}>{b.sub}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

import type { Metadata } from 'next';
import { ProductImage } from '@/components/ui/ProductImage';
import { LinkButton } from '@/components/ui/Button';
import styles from './page.module.css';

export const metadata: Metadata = { title: 'Sobre nosotros' };

const VALUES = [
  {
    icon: 'shield.png',
    title: '100% originales',
    text: 'Solo trabajamos con productos oficiales y con licencia. Sin imitaciones.',
  },
  {
    icon: 'lightning.png',
    title: 'Envío rápido',
    text: 'Preparamos y enviamos tu pedido en 24-48h, con seguimiento incluido.',
  },
  {
    icon: 'golden-heart.png',
    title: 'Hecho por fans',
    text: 'Conocemos lo que coleccionas porque también somos parte de la comunidad.',
  },
];

export default function AboutPage() {
  return (
    <section className={styles.wrap}>
      <div className={styles.hero}>
        <div className={styles.heroInner}>
          <span className={styles.eyebrow}>Sobre nosotros</span>
          <h1 className={styles.title}>
            Coleccionables Pokémon, <span className={styles.accent}>con cariño</span>
          </h1>
          <p className={styles.lead}>
            Somos una tienda independiente dedicada a fans y coleccionistas. Seleccionamos cada
            pieza a mano, garantizamos su originalidad y la enviamos con el cuidado de una galería.
          </p>
        </div>
      </div>

      <div className={styles.body}>
        <div className={styles.values}>
          {VALUES.map((v) => (
            <div key={v.title} className={styles.valueCard}>
              <ProductImage src={`/assets/thiings/${v.icon}`} alt="" size={52} shadow="0 10px 14px rgba(14,15,18,.14)" />
              <div className={styles.valueTitle}>{v.title}</div>
              <p className={styles.valueText}>{v.text}</p>
            </div>
          ))}
        </div>

        <div className={styles.cta}>
          <ProductImage src="/assets/thiings/team.png" alt="" size={96} shadow="0 14px 20px rgba(14,15,18,.16)" />
          <div className={styles.ctaText}>
            <div className={styles.ctaTitle}>+12.400 pedidos enviados</div>
            <p className={styles.ctaCopy}>
              Gracias a una comunidad de coleccionistas que confía en nosotros cada semana.
            </p>
            <div className={styles.ctaBtn}>
              <LinkButton href="/productos" variant="primary" size="md">
                Ver la tienda
              </LinkButton>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

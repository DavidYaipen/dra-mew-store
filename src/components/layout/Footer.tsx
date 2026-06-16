'use client';

import Link from 'next/link';
import { useStore } from '@/store/useStore';
import { STORE_NAME } from '@/lib/constants';
import { Logo } from './Logo';
import { ArrowRightIcon, FacebookIcon, InstagramIcon, YoutubeIcon } from '@/components/ui/Icons';
import styles from './Footer.module.css';

export function Footer() {
  const { showToast } = useStore();

  return (
    <footer className={styles.footer}>
      <div className={styles.grid}>
        <div>
          <Logo variant="compact" />
          <p className={styles.tagline}>
            Coleccionables Pokémon originales para fans de todas las edades.
          </p>
          <div className={styles.social}>
            <span className={styles.socialBtn} aria-hidden>
              <FacebookIcon size={16} />
            </span>
            <span className={styles.socialBtn} aria-hidden>
              <InstagramIcon size={16} />
            </span>
            <span className={styles.socialBtn} aria-hidden>
              <YoutubeIcon size={16} />
            </span>
          </div>
        </div>

        <div>
          <div className={styles.colTitle}>Tienda</div>
          <div className={styles.links}>
            <Link href="/productos?cat=Peluches" className={styles.link}>
              Peluches
            </Link>
            <Link href="/productos?cat=Figuras" className={styles.link}>
              Figuras
            </Link>
            <Link href="/productos?cat=Cartas" className={styles.link}>
              Cartas
            </Link>
            <Link href="/productos?cat=Ropa" className={styles.link}>
              Ropa
            </Link>
          </div>
        </div>

        <div>
          <div className={styles.colTitle}>Ayuda</div>
          <div className={styles.links}>
            <Link href="/ayuda?tab=faq" className={styles.link}>
              Preguntas frecuentes
            </Link>
            <Link href="/ayuda?tab=envios" className={styles.link}>
              Envíos
            </Link>
            <Link href="/ayuda?tab=devoluciones" className={styles.link}>
              Devoluciones
            </Link>
            <Link href="/ayuda?tab=contacto" className={styles.link}>
              Contacto
            </Link>
          </div>
        </div>

        <div>
          <div className={styles.colTitle}>Newsletter</div>
          <p className={styles.newsletterCopy}>Nuevos drops y ofertas en tu correo.</p>
          <form
            className={styles.newsletter}
            onSubmit={(e) => {
              e.preventDefault();
              showToast('¡Suscrito! Te avisaremos de los drops.');
              e.currentTarget.reset();
            }}
          >
            <input
              className={styles.newsletterInput}
              type="email"
              required
              placeholder="tu@email.com"
              aria-label="Tu email"
            />
            <button className={styles.newsletterBtn} type="submit" aria-label="Suscribirse">
              <ArrowRightIcon size={18} />
            </button>
          </form>
        </div>
      </div>

      <div className={styles.bottom}>
        <span>© 2026 {STORE_NAME} · Hecho con cariño para coleccionistas</span>
        <div className={styles.pay}>
          <span className={styles.payTag}>VISA</span>
          <span className={styles.payTag}>MC</span>
          <span className={styles.payTag}>PayPal</span>
        </div>
      </div>
    </footer>
  );
}

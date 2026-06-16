'use client';

import { useEffect, useState } from 'react';
import { ArrowUpIcon } from '@/components/ui/Icons';
import styles from './BackToTop.module.css';

/** Botón flotante "volver arriba", visible tras desplazarse > 400px. */
export function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  if (!visible) return null;

  return (
    <button
      type="button"
      className={styles.btn}
      aria-label="Volver arriba"
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
    >
      <ArrowUpIcon size={20} />
    </button>
  );
}

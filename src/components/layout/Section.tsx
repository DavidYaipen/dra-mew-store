import type { CSSProperties, ReactNode } from 'react';
import styles from './Section.module.css';

interface SectionProps {
  children: ReactNode;
  /** Ancho máximo del contenido en px. */
  maxWidth?: number;
  /** Fondo de la sección. */
  background?: string;
  className?: string;
  style?: CSSProperties;
}

/** Envoltorio de sección con padding consistente y contenido centrado. */
export function Section({ children, maxWidth = 1120, background = '#fff', className, style }: SectionProps) {
  return (
    <section className={`${styles.section} ${className ?? ''}`} style={{ background, ...style }}>
      <div className={styles.inner} style={{ maxWidth }}>
        {children}
      </div>
    </section>
  );
}

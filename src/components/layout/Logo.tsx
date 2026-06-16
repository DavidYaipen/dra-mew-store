import Link from 'next/link';
import { STORE_NAME } from '@/lib/constants';
import styles from './Logo.module.css';

/** Lockup de marca con el orbe rosa. `full` añade nombre + subtítulo. */
export function Logo({ variant = 'full' }: { variant?: 'full' | 'compact' }) {
  return (
    <Link href="/" className={styles.logo} aria-label={`${STORE_NAME} · inicio`}>
      <span className={variant === 'full' ? styles.orb : styles.orbSmall}>
        {variant === 'full' && (
          <>
            <span className={styles.core} />
            <span className={styles.ring} />
          </>
        )}
      </span>
      {variant === 'full' ? (
        <span className={styles.text}>
          <span className={styles.name}>{STORE_NAME}</span>
          <span className={styles.sub}>Pokémon · coleccionables</span>
        </span>
      ) : (
        <span className={styles.nameCompact}>{STORE_NAME}</span>
      )}
    </Link>
  );
}

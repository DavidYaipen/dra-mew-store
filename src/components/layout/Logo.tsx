import Image from 'next/image';
import Link from 'next/link';
import { STORE_NAME } from '@/lib/constants';
import styles from './Logo.module.css';

/** Lockup de marca con el logo oficial. `full` añade el subtítulo. */
export function Logo({ variant = 'full' }: { variant?: 'full' | 'compact' }) {
  return (
    <Link href="/" className={styles.logo} aria-label={`${STORE_NAME} · inicio`}>
      <span className={variant === 'full' ? styles.imgWrap : styles.imgWrapCompact}>
        <Image src="/logo/logo.png" alt={STORE_NAME} fill sizes="64px" className={styles.img} priority />
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

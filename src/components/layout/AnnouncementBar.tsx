import styles from './AnnouncementBar.module.css';

/** Barra superior de anuncios (envío, devoluciones, originalidad). */
export function AnnouncementBar() {
  return (
    <div className={styles.bar}>
      <span className={styles.item}>
        <span className={styles.spark}>✦</span> Recojo gratis en tienda
      </span>
      <span className={styles.dot} />
      <span>Devoluciones en 30 días</span>
      <span className={styles.dot} />
      <span>100% productos originales</span>
    </div>
  );
}

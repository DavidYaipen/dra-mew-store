import Link from 'next/link';
import styles from './LegalLayout.module.css';

interface LegalLayoutProps {
  title: string;
  lastUpdated: string;
  children: React.ReactNode;
}

export function LegalLayout({ title, lastUpdated, children }: LegalLayoutProps) {
  return (
    <section className={styles.page}>
      <nav className={styles.breadcrumb}>
        <Link href="/">Inicio</Link>
        <span aria-hidden>/</span>
        <span aria-current="page">{title}</span>
      </nav>
      <h1 className={styles.title}>{title}</h1>
      <p className={styles.date}>Última actualización: {lastUpdated}</p>
      <div className={styles.content}>{children}</div>
    </section>
  );
}

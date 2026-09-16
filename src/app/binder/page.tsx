import type { Metadata } from 'next';
import { Suspense } from 'react';
import { getBinderCards, getBinderCollections } from '@/lib/supabase/binder';
import { Section } from '@/components/layout/Section';
import { Breadcrumb } from '@/components/layout/Breadcrumb';
import { BinderCollectionFilter } from '@/components/product/BinderCollectionFilter';
import { BinderCardTile } from '@/components/product/BinderCardTile';
import { EmptyState } from '@/components/ui/EmptyState';
import styles from '../productos/page.module.css';
import gridStyles from '@/components/product/ProductGrid.module.css';

export const revalidate = 60;
export const metadata: Metadata = { title: 'Cartas sueltas · Binder' };

export default async function BinderPage({
  searchParams,
}: {
  searchParams: Promise<{ collection?: string }>;
}) {
  const { collection } = await searchParams;
  const [cards, collections] = await Promise.all([getBinderCards(), getBinderCollections()]);
  const filtered = collection ? cards.filter((c) => c.collection === collection) : cards;
  const withListings = filtered.filter((c) => c.listings.length > 0);

  return (
    <Section background="#fff">
      <Breadcrumb items={[{ label: 'Inicio', href: '/' }, { label: 'Cartas sueltas' }]} />
      <div className={styles.header}>
        <h1 className={styles.title}>Cartas sueltas</h1>
        <span className={styles.count}>{withListings.length} cartas</span>
      </div>

      <div className={styles.chips}>
        <Suspense fallback={null}>
          <BinderCollectionFilter collections={collections} />
        </Suspense>
      </div>

      {withListings.length === 0 ? (
        <EmptyState
          icon="search.png"
          title="Sin cartas todavía"
          description="Pronto vamos a subir cartas sueltas al binder."
          actionLabel="Ver productos sellados"
          actionHref="/categoria/cartas"
        />
      ) : (
        <div className={gridStyles.grid}>
          {withListings.map((card) => (
            <BinderCardTile key={card.id} card={card} />
          ))}
        </div>
      )}
    </Section>
  );
}

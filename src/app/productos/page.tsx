import type { Metadata } from 'next';
import { Suspense } from 'react';
import { getCatalog } from '@/lib/supabase/catalog';
import { filterProducts } from '@/lib/filter';
import { resolveListing, type ListingParams } from '@/lib/listing';
import { Section } from '@/components/layout/Section';
import { Breadcrumb } from '@/components/layout/Breadcrumb';
import { FilterChips } from '@/components/product/FilterChips';
import { ProductGrid } from '@/components/product/ProductGrid';
import { EmptyState } from '@/components/ui/EmptyState';
import styles from './page.module.css';

export const revalidate = 60;
export const metadata: Metadata = { title: 'Catálogo' };

export default async function ListingPage({
  searchParams,
}: {
  searchParams: Promise<ListingParams>;
}) {
  const params = await searchParams;
  const { filter, title } = resolveListing(params);
  const catalog = await getCatalog();
  const products = filterProducts(catalog, filter);

  return (
    <Section background="#fff">
      <Breadcrumb items={[{ label: 'Inicio', href: '/' }, { label: title }]} />
      <div className={styles.header}>
        <h1 className={styles.title}>{title}</h1>
        <span className={styles.count}>{products.length} productos</span>
      </div>

      <div className={styles.chips}>
        <Suspense fallback={null}>
          <FilterChips includeSale />
        </Suspense>
      </div>

      {products.length === 0 ? (
        <EmptyState
          icon="search.png"
          title="Sin resultados"
          description="No encontramos productos para esta búsqueda."
          actionLabel="Ver todos los productos"
          actionHref="/productos"
        />
      ) : (
        <ProductGrid products={products} showCategory />
      )}
    </Section>
  );
}

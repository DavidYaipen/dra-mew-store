import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getCatalog, getProductFromDB, relatedProductsFromDB } from '@/lib/supabase/catalog';
import { Section } from '@/components/layout/Section';
import { Breadcrumb } from '@/components/layout/Breadcrumb';
import { ProductDetail } from '@/components/product/ProductDetail';
import { ProductGrid } from '@/components/product/ProductGrid';
import styles from './page.module.css';

export const revalidate = 60;

export async function generateStaticParams() {
  const catalog = await getCatalog();
  return catalog.map((p) => ({ id: String(p.id) }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const product = await getProductFromDB(Number(id));
  return { title: product ? product.name : 'Producto' };
}

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await getProductFromDB(Number(id));
  if (!product) notFound();

  const related = await relatedProductsFromDB(product);

  return (
    <Section background="#fff">
      <Breadcrumb
        items={[
          { label: 'Inicio', href: '/' },
          { label: product.cat, href: `/productos?cat=${encodeURIComponent(product.cat)}` },
          { label: product.name },
        ]}
      />
      <ProductDetail product={product} />

      <div className={styles.related}>
        <h2 className={styles.relatedTitle}>También te puede gustar</h2>
        <ProductGrid products={related} showBadge={false} showOldPrice={false} />
      </div>
    </Section>
  );
}

import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { CATEGORY_PAGES, getCategoryPage } from '@/lib/categories';
import { getCatalog } from '@/lib/supabase/catalog';
import { CategoryHero } from '@/components/product/CategoryHero';
import { ProductGrid } from '@/components/product/ProductGrid';
import styles from './page.module.css';

export const revalidate = 60;

interface Props {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return CATEGORY_PAGES.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const category = getCategoryPage(slug);
  if (!category) return { title: 'Categoría no encontrada' };
  return {
    title: category.name,
    description: category.metaDescription,
  };
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;
  const category = getCategoryPage(slug);
  if (!category) notFound();

  const catalog = await getCatalog();
  const products = catalog.filter((p) => p.cat === category.name);

  return (
    <section>
      <nav className={styles.breadcrumb}>
        <Link href="/">Inicio</Link>
        <span aria-hidden>/</span>
        <span aria-current="page">{category.name}</span>
      </nav>

      <CategoryHero category={category} />

      <div className={styles.products}>
        <ProductGrid products={products} />
      </div>
    </section>
  );
}

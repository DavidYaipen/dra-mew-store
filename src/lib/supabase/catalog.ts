import { unstable_cache } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import type { Product, Category } from '@/lib/types';

interface ProductRow {
  id: number;
  name: string;
  cat: string;
  price: number;
  old_price: number | null;
  rating: number;
  image: string;
  tint: string;
  badge: string | null;
  is_featured: boolean;
}

function rowToProduct(row: ProductRow): Product {
  return {
    id: row.id,
    name: row.name,
    cat: row.cat as Category,
    price: row.price,
    oldPrice: row.old_price ?? undefined,
    rating: row.rating,
    image: row.image,
    tint: row.tint,
    badge: row.badge ?? undefined,
  };
}

export const getCatalog = unstable_cache(
  async (): Promise<Product[]> => {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('id');
    if (error) throw new Error(`Failed to fetch catalog: ${error.message}`);
    return (data as ProductRow[]).map(rowToProduct);
  },
  ['catalog'],
  { revalidate: 60, tags: ['catalog'] },
);

export async function getProductFromDB(id: number): Promise<Product | undefined> {
  const catalog = await getCatalog();
  return catalog.find((p) => p.id === id);
}

export async function relatedProductsFromDB(
  product: Product,
  limit = 4,
): Promise<Product[]> {
  const catalog = await getCatalog();
  let related = catalog.filter((p) => p.cat === product.cat && p.id !== product.id);
  if (related.length < limit) {
    related = related.concat(
      catalog.filter((p) => p.cat !== product.cat).slice(0, limit - related.length),
    );
  }
  return related.slice(0, limit);
}

export const getFeaturedProducts = unstable_cache(
  async (): Promise<Product[]> => {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('is_featured', true)
      .order('id');
    if (error) throw new Error(`Failed to fetch featured: ${error.message}`);
    return (data as ProductRow[]).map(rowToProduct);
  },
  ['featured'],
  { revalidate: 60, tags: ['catalog'] },
);

export interface CategoryCount {
  name: Category;
  count: number;
  image: string;
  tint: string;
}

const CATEGORY_META: Record<Category, { image: string; tint: string }> = {
  Peluches: { image: '/assets/thiings/star.png', tint: 'var(--pink-soft)' },
  Figuras: { image: '/assets/thiings/lightning.png', tint: 'var(--blue-100)' },
  Cartas: { image: '/assets/thiings/five-star.png', tint: 'var(--violet-100)' },
  Ropa: { image: '/assets/thiings/like.png', tint: 'var(--amber-100)' },
  Accesorios: { image: '/assets/thiings/console.png', tint: 'var(--graphite-100)' },
};

export const getCategoryCounts = unstable_cache(
  async (): Promise<CategoryCount[]> => {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('products')
      .select('cat')
      .order('cat');
    if (error) throw new Error(`Failed to fetch category counts: ${error.message}`);

    const counts = new Map<string, number>();
    for (const row of data as { cat: string }[]) {
      counts.set(row.cat, (counts.get(row.cat) ?? 0) + 1);
    }

    const allCategories: Category[] = ['Peluches', 'Figuras', 'Cartas', 'Ropa', 'Accesorios'];
    return allCategories
      .filter((cat) => counts.has(cat))
      .map((cat) => ({
        name: cat,
        count: counts.get(cat)!,
        image: CATEGORY_META[cat].image,
        tint: CATEGORY_META[cat].tint,
      }));
  },
  ['category-counts'],
  { revalidate: 60, tags: ['catalog'] },
);

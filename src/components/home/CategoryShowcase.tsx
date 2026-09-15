import { Suspense } from 'react';
import { getCategoryCounts } from '@/lib/supabase/catalog';
import { CategoryCard } from '@/components/product/CategoryCard';
import { FilterChips } from '@/components/product/FilterChips';
import styles from './CategoryShowcase.module.css';

export async function CategoryShowcase() {
  const categories = await getCategoryCounts();

  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <div className={styles.head}>
          <div className={styles.eyebrow}>Categorías</div>
          <h2 className={styles.title}>Explora por categoría</h2>
        </div>
        <div className={styles.chips}>
          <Suspense fallback={null}>
            <FilterChips />
          </Suspense>
        </div>
        <div className={styles.grid}>
          {categories.map((category) => (
            <CategoryCard
              key={category.name}
              category={{
                name: category.name,
                count: `${category.count}+ piezas`,
                image: category.image,
                tint: category.tint,
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

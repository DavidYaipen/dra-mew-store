import { HOME_CATEGORIES } from '@/lib/catalog';
import { CategoryCard } from '@/components/product/CategoryCard';
import { FilterChips } from '@/components/product/FilterChips';
import styles from './CategoryShowcase.module.css';

export function CategoryShowcase() {
  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <div className={styles.head}>
          <div className={styles.eyebrow}>Categorías</div>
          <h2 className={styles.title}>Explora por categoría</h2>
        </div>
        <div className={styles.chips}>
          <FilterChips />
        </div>
        <div className={styles.grid}>
          {HOME_CATEGORIES.map((category) => (
            <CategoryCard key={category.name} category={category} />
          ))}
        </div>
      </div>
    </section>
  );
}

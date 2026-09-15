import Image from 'next/image';
import type { CategoryPage } from '@/lib/categories';
import styles from './CategoryHero.module.css';

interface CategoryHeroProps {
  category: CategoryPage;
}

export function CategoryHero({ category }: CategoryHeroProps) {
  return (
    <section className={styles.hero}>
      <div className={styles.content}>
        <h1 className={styles.title}>{category.name}</h1>
        <p className={styles.description}>{category.description}</p>
      </div>
      <div className={styles.imageWrap}>
        <Image src={category.heroImage} alt="" width={120} height={120} className={styles.image} />
      </div>
    </section>
  );
}

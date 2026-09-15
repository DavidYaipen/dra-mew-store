import type { Metadata } from 'next';
import { BLOG_POSTS } from '@/lib/blog';
import { BlogCard } from '@/components/blog/BlogCard';
import styles from './page.module.css';

export const metadata: Metadata = {
  title: 'Blog',
  description:
    'Artículos sobre coleccionismo Pokémon, guías de cartas, consejos de cuidado y novedades de la tienda.',
};

export default function BlogPage() {
  return (
    <section className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>Blog</h1>
        <p className={styles.subtitle}>
          Artículos, guías y novedades del mundo Pokémon
        </p>
      </div>
      <div className={styles.grid}>
        {BLOG_POSTS.map((post) => (
          <BlogCard key={post.slug} post={post} />
        ))}
      </div>
    </section>
  );
}

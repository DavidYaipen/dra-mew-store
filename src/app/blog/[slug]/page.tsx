import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { BLOG_POSTS, getBlogPost, relatedPosts } from '@/lib/blog';
import { BlogCard } from '@/components/blog/BlogCard';
import styles from './page.module.css';

interface Props {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return BLOG_POSTS.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) return { title: 'Artículo no encontrado' };
  return {
    title: post.title,
    description: post.excerpt,
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) notFound();

  const related = relatedPosts(post);

  return (
    <article className={styles.article}>
      <nav className={styles.breadcrumb}>
        <Link href="/">Inicio</Link>
        <span aria-hidden>/</span>
        <Link href="/blog">Blog</Link>
        <span aria-hidden>/</span>
        <span aria-current="page">{post.title}</span>
      </nav>

      <header className={styles.header}>
        <span className={styles.category}>{post.category}</span>
        <h1 className={styles.title}>{post.title}</h1>
        <time className={styles.date}>{post.date}</time>
      </header>

      <div className={styles.hero}>
        <Image src={post.image} alt="" fill className={styles.heroImage} />
      </div>

      <div
        className={styles.content}
        dangerouslySetInnerHTML={{ __html: post.content }}
      />

      {related.length > 0 && (
        <aside className={styles.related}>
          <h2 className={styles.relatedTitle}>Artículos relacionados</h2>
          <div className={styles.relatedGrid}>
            {related.map((r) => (
              <BlogCard key={r.slug} post={r} />
            ))}
          </div>
        </aside>
      )}
    </article>
  );
}

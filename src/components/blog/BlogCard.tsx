import Link from 'next/link';
import Image from 'next/image';
import type { BlogPost } from '@/lib/blog';
import styles from './BlogCard.module.css';

interface BlogCardProps {
  post: BlogPost;
}

export function BlogCard({ post }: BlogCardProps) {
  return (
    <Link href={`/blog/${post.slug}`} className={styles.card}>
      <div className={styles.imageWrap}>
        <Image src={post.image} alt="" fill className={styles.image} />
        <span className={styles.category}>{post.category}</span>
      </div>
      <div className={styles.body}>
        <time className={styles.date}>{post.date}</time>
        <h3 className={styles.title}>{post.title}</h3>
        <p className={styles.excerpt}>{post.excerpt}</p>
        <span className={styles.readMore}>Leer más →</span>
      </div>
    </Link>
  );
}

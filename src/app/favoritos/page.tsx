import type { Metadata } from 'next';
import { Section } from '@/components/layout/Section';
import { WishlistView } from '@/components/wishlist/WishlistView';

export const metadata: Metadata = { title: 'Favoritos' };

export default function WishlistPage() {
  return (
    <Section background="#fff">
      <WishlistView />
    </Section>
  );
}

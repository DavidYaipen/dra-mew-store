import type { Metadata } from 'next';
import { Section } from '@/components/layout/Section';
import { CartView } from '@/components/cart/CartView';

export const metadata: Metadata = { title: 'Tu carrito' };

export default function CartPage() {
  return (
    <Section background="#fff" maxWidth={1000}>
      <CartView />
    </Section>
  );
}

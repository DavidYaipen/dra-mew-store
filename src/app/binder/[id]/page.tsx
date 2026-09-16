import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getBinderCard } from '@/lib/supabase/binder';
import { Section } from '@/components/layout/Section';
import { Breadcrumb } from '@/components/layout/Breadcrumb';
import { ProductImage } from '@/components/ui/ProductImage';
import { BinderListingsTable } from '@/components/product/BinderListingsTable';

export const revalidate = 60;

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const card = await getBinderCard(id);
  if (!card) return { title: 'Carta no encontrada' };
  return { title: `${card.name} · Binder` };
}

export default async function BinderCardPage({ params }: Props) {
  const { id } = await params;
  const card = await getBinderCard(id);
  if (!card) notFound();

  return (
    <Section background="#fff">
      <Breadcrumb
        items={[
          { label: 'Inicio', href: '/' },
          { label: 'Cartas sueltas', href: '/binder' },
          { label: card.name },
        ]}
      />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, alignItems: 'start' }}>
        <div
          style={{
            aspectRatio: '1 / 1',
            borderRadius: 28,
            border: '1px solid var(--border-subtle)',
            boxShadow: 'var(--shadow-md)',
            display: 'grid',
            placeItems: 'center',
            background: 'linear-gradient(158deg,#fff,var(--violet-100))',
          }}
        >
          <ProductImage src={card.image || '/assets/thiings/five-star.png'} alt={card.name} size={280} shadow="0 26px 38px rgba(14,15,18,.2)" priority />
        </div>

        <div>
          <div style={{ fontSize: 12, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--pink)', fontWeight: 700 }}>
            {card.collection}
          </div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 400, fontSize: 40, color: 'var(--text-strong)', marginTop: 8 }}>
            {card.name}
          </h1>
          {card.cardNumber && (
            <p style={{ color: 'var(--text-faint)', fontFamily: 'var(--font-mono)', marginTop: 4 }}>#{card.cardNumber}</p>
          )}

          <BinderListingsTable listings={card.listings} />
        </div>
      </div>
    </Section>
  );
}

import { notFound } from 'next/navigation';
import Link from 'next/link';
import { requireAdmin } from '@/lib/supabase/admin';
import { BinderCardForm } from '@/components/admin/BinderCardForm';
import { BinderListingsManager, type BinderListingData } from '@/components/admin/BinderListingsManager';
import { ArrowLeftIcon } from '@/components/admin/AdminIcons';

export const dynamic = 'force-dynamic';

export default async function EditBinderCardPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { serviceClient } = await requireAdmin();

  const { data: card } = await serviceClient
    .from('binder_cards')
    .select('*, binder_listings(*)')
    .eq('id', id)
    .single();

  if (!card) notFound();

  const listings = (card.binder_listings || []) as BinderListingData[];

  return (
    <div style={{ maxWidth: 700, display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div>
        <Link href="/admin/binder" className="admin-btn" data-variant="ghost" data-size="sm">
          <ArrowLeftIcon size={16} />
          Volver al binder
        </Link>
      </div>
      <h2 style={{ fontSize: 24, fontWeight: 700, margin: 0 }}>Editar: {card.name}</h2>
      <div className="admin-card">
        <BinderCardForm initialData={card} />
      </div>
      <BinderListingsManager cardId={card.id} listings={listings} />
    </div>
  );
}

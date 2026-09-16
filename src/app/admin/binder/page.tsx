import Link from 'next/link';
import { requireAdmin } from '@/lib/supabase/admin';
import { formatPrice } from '@/lib/format';
import { PlusIcon, EditIcon } from '@/components/admin/AdminIcons';

export const dynamic = 'force-dynamic';

const FINISH_LABELS: Record<string, string> = { comun: 'Común', holo: 'Holo', reverse: 'Reverse' };

interface BinderListingRow {
  id: string;
  finish: string;
  condition: string;
  price: number;
  stock: number;
  is_preorder: boolean;
}

interface BinderCardRow {
  id: string;
  name: string;
  collection: string;
  card_number: string | null;
  binder_listings: BinderListingRow[];
}

export default async function AdminBinderPage() {
  const { serviceClient } = await requireAdmin();

  const { data: cards } = await serviceClient
    .from('binder_cards')
    .select('*, binder_listings(*)')
    .order('name');

  const typed = (cards || []) as BinderCardRow[];
  const totalListings = typed.reduce((a, c) => a + c.binder_listings.length, 0);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h2 style={{ fontSize: 24, fontWeight: 700, margin: 0 }}>Binder virtual</h2>
          <p style={{ color: 'var(--text-faint)', margin: '4px 0 0', fontSize: 14 }}>
            {typed.length} cartas · {totalListings} listings
          </p>
        </div>
        <Link href="/admin/binder/nuevo" className="admin-btn" data-variant="primary">
          <PlusIcon size={18} />
          Nueva carta
        </Link>
      </div>

      <div className="admin-card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Carta</th>
                <th>Colección</th>
                <th>Listings</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {typed.map((card) => (
                <tr key={card.id}>
                  <td style={{ fontWeight: 600 }}>
                    {card.name}
                    {card.card_number && (
                      <span style={{ color: 'var(--text-faint)', fontWeight: 400, marginLeft: 6 }}>
                        #{card.card_number}
                      </span>
                    )}
                  </td>
                  <td>{card.collection}</td>
                  <td>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                      {card.binder_listings.length === 0 ? (
                        <span style={{ color: 'var(--text-faint)', fontSize: 12 }}>Sin listings</span>
                      ) : (
                        card.binder_listings.map((l) => (
                          <span key={l.id} style={{ fontSize: 12 }}>
                            {FINISH_LABELS[l.finish] ?? l.finish} · {l.condition} ·{' '}
                            <span className="mono">{formatPrice(l.price)}</span> ·{' '}
                            <span style={{ color: l.stock <= 0 && !l.is_preorder ? '#dc2626' : undefined }}>
                              stock {l.stock}
                            </span>
                            {l.is_preorder && (
                              <span style={{ marginLeft: 4, color: '#7c3aed', fontWeight: 600 }}>Preventa</span>
                            )}
                          </span>
                        ))
                      )}
                    </div>
                  </td>
                  <td>
                    <Link href={`/admin/binder/${card.id}/editar`} className="admin-btn" data-variant="ghost" data-size="sm">
                      <EditIcon size={16} />
                      Editar
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

import { requireAdmin } from '@/lib/supabase/admin';
import { AdminReviewActions } from '@/components/admin/AdminReviewActions';

export const dynamic = 'force-dynamic';

interface ReviewWithProduct {
  id: string;
  product_id: number;
  customer_name: string;
  rating: number;
  comment: string | null;
  approved: boolean;
  created_at: string;
  products: { name: string } | null;
}

export default async function AdminReviewsPage() {
  const { supabase } = await requireAdmin();

  const { data: reviews } = await supabase
    .from('reviews')
    .select('*, products(name)')
    .order('created_at', { ascending: false });

  const typed = (reviews || []) as ReviewWithProduct[];
  const pending = typed.filter((r) => !r.approved);
  const approved = typed.filter((r) => r.approved);

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 24, fontWeight: 700, margin: 0 }}>Resenas</h2>
        <p style={{ color: 'var(--text-faint)', margin: '4px 0 0', fontSize: 14 }}>
          {pending.length} pendientes · {approved.length} aprobadas
        </p>
      </div>

      {pending.length > 0 && (
        <div style={{ marginBottom: 32 }}>
          <h3 style={{ fontSize: 16, fontWeight: 600, margin: '0 0 12px', color: '#d97706' }}>
            Pendientes de revision
          </h3>
          <div className="admin-card" style={{ padding: 0, overflow: 'hidden' }}>
            <div style={{ overflowX: 'auto' }}>
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Producto</th>
                    <th>Cliente</th>
                    <th>Rating</th>
                    <th>Comentario</th>
                    <th>Fecha</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {pending.map((review) => (
                    <tr key={review.id}>
                      <td style={{ fontWeight: 500 }}>{review.products?.name || 'N/A'}</td>
                      <td>{review.customer_name}</td>
                      <td>
                        <div className="star-rating">
                          {Array.from({ length: 5 }, (_, i) => (
                            <span key={i} className={i < review.rating ? '' : 'empty'}>★</span>
                          ))}
                        </div>
                      </td>
                      <td style={{ maxWidth: 300, fontSize: 13 }}>{review.comment || '—'}</td>
                      <td style={{ fontSize: 12, color: 'var(--text-faint)' }}>
                        {new Date(review.created_at).toLocaleDateString('es-PE')}
                      </td>
                      <td>
                        <AdminReviewActions reviewId={review.id} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      <div>
        <h3 style={{ fontSize: 16, fontWeight: 600, margin: '0 0 12px' }}>
          Aprobadas ({approved.length})
        </h3>
        <div className="admin-card" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Producto</th>
                  <th>Cliente</th>
                  <th>Rating</th>
                  <th>Comentario</th>
                  <th>Fecha</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {approved.map((review) => (
                  <tr key={review.id}>
                    <td style={{ fontWeight: 500 }}>{review.products?.name || 'N/A'}</td>
                    <td>{review.customer_name}</td>
                    <td>
                      <div className="star-rating">
                        {Array.from({ length: 5 }, (_, i) => (
                          <span key={i} className={i < review.rating ? '' : 'empty'}>★</span>
                        ))}
                      </div>
                    </td>
                    <td style={{ maxWidth: 300, fontSize: 13 }}>{review.comment || '—'}</td>
                    <td style={{ fontSize: 12, color: 'var(--text-faint)' }}>
                      {new Date(review.created_at).toLocaleDateString('es-PE')}
                    </td>
                    <td>
                      <AdminReviewActions reviewId={review.id} approved />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

import { requireAdmin } from '@/lib/supabase/admin';
import { AddInventoryForm } from '@/components/admin/AddInventoryForm';

export const dynamic = 'force-dynamic';

interface MovementWithProduct {
  id: string;
  product_id: number;
  variant_id: string | null;
  quantity: number;
  reason: string;
  reference: string | null;
  created_at: string;
  products: { name: string } | null;
}

export default async function AdminInventoryPage() {
  const { serviceClient } = await requireAdmin();

  const { data: products } = await serviceClient
    .from('products')
    .select('id, name, cat')
    .order('name');

  const { data: variants } = await serviceClient
    .from('product_variants')
    .select('*')
    .order('created_at', { ascending: false });

  const { data: movements } = await serviceClient
    .from('inventory_movements')
    .select('*, products(name)')
    .order('created_at', { ascending: false })
    .limit(50);

  const typedMovements = (movements || []) as MovementWithProduct[];

  const productNames = new Map<number, string>();
  for (const p of products || []) {
    productNames.set(p.id, p.name);
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h2 style={{ fontSize: 24, fontWeight: 700, margin: 0 }}>Inventario</h2>
          <p style={{ color: 'var(--text-faint)', margin: '4px 0 0', fontSize: 14 }}>
            {variants?.length || 0} variantes · {typedMovements.length} movimientos recientes
          </p>
        </div>
        <AddInventoryForm products={products || []} />
      </div>

      <div className="admin-grid-2">
        <div className="admin-card">
          <div className="admin-card-header">
            <h3 className="admin-card-title">Variantes con stock</h3>
          </div>
          {(!variants || variants.length === 0) ? (
            <div className="admin-empty">
              <h3>Sin variantes</h3>
              <p>Crea variantes para gestionar stock por opcion.</p>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Producto</th>
                    <th>Variante</th>
                    <th>SKU</th>
                    <th>Stock</th>
                  </tr>
                </thead>
                <tbody>
                  {variants.map((v) => (
                    <tr key={v.id}>
                      <td style={{ fontWeight: 500 }}>{productNames.get(v.product_id) || v.product_id}</td>
                      <td>{v.name}</td>
                      <td className="mono" style={{ fontSize: 12 }}>{v.sku || '—'}</td>
                      <td className="mono" style={{ fontWeight: 600, color: v.stock <= 5 ? '#dc2626' : undefined }}>
                        {v.stock}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="admin-card">
          <div className="admin-card-header">
            <h3 className="admin-card-title">Movimientos recientes</h3>
          </div>
          {typedMovements.length === 0 ? (
            <div className="admin-empty">
              <h3>Sin movimientos</h3>
              <p>Los movimientos de inventario apareceran aqui.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {typedMovements.map((m) => (
                <div key={m.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid var(--border-soft)' }}>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 500 }}>
                      {m.products?.name || 'Producto'}
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--text-faint)' }}>
                      {m.reason} {m.reference ? `#${m.reference}` : ''}
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span className="mono" style={{ fontWeight: 600, color: m.quantity > 0 ? '#16a34a' : '#dc2626' }}>
                      {m.quantity > 0 ? '+' : ''}{m.quantity}
                    </span>
                    <span style={{ fontSize: 11, color: 'var(--text-faint)' }}>
                      {new Date(m.created_at).toLocaleDateString('es-PE')}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

import { requireAdmin } from '@/lib/supabase/admin';
import { formatPrice } from '@/lib/format';
import { AdminOrderActions } from '@/components/admin/AdminOrderActions';

export const dynamic = 'force-dynamic';

interface OrderWithCustomer {
  id: string;
  total: number;
  status: string;
  payment_status: string;
  created_at: string;
  customers: { name: string; email: string } | null;
  order_items: { is_preorder: boolean }[] | null;
}

export default async function AdminOrdersPage() {
  const { serviceClient } = await requireAdmin();

  const { data: orders } = await serviceClient
    .from('orders')
    .select('*, customers(name, email), order_items(is_preorder)')
    .order('created_at', { ascending: false });

  const typed = (orders || []) as OrderWithCustomer[];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h2 style={{ fontSize: 24, fontWeight: 700, margin: 0 }}>Pedidos</h2>
          <p style={{ color: 'var(--text-faint)', margin: '4px 0 0', fontSize: 14 }}>
            {typed.length} pedidos en total
          </p>
        </div>
      </div>

      <div className="admin-card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Pedido</th>
                <th>Cliente</th>
                <th>Total</th>
                <th>Estado</th>
                <th>Pago</th>
                <th>Fecha</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {typed.map((order) => (
                <tr key={order.id}>
                  <td className="mono">
                    #{order.id.slice(0, 8)}
                    {order.order_items?.some((i) => i.is_preorder) && (
                      <span
                        style={{
                          marginLeft: 8,
                          padding: '2px 8px',
                          borderRadius: 999,
                          fontSize: 10,
                          fontWeight: 700,
                          background: '#ede9fe',
                          color: '#6d28d9',
                        }}
                      >
                        Preventa
                      </span>
                    )}
                  </td>
                  <td>
                    <div style={{ fontSize: 14 }}>
                      <div style={{ fontWeight: 500 }}>{order.customers?.name || 'Sin nombre'}</div>
                      <div style={{ fontSize: 12, color: 'var(--text-faint)' }}>{order.customers?.email || ''}</div>
                    </div>
                  </td>
                  <td className="mono" style={{ fontWeight: 600 }}>{formatPrice(order.total)}</td>
                  <td><span className="status-badge" data-status={order.status}>{order.status}</span></td>
                  <td><span className="status-badge" data-status={order.payment_status}>{order.payment_status}</span></td>
                  <td style={{ fontSize: 13, color: 'var(--text-faint)' }}>
                    {new Date(order.created_at).toLocaleDateString('es-PE')}
                  </td>
                  <td>
                    <AdminOrderActions orderId={order.id} currentStatus={order.status} />
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

import { requireAdmin } from '@/lib/supabase/admin';

export const dynamic = 'force-dynamic';

export default async function AdminCustomersPage() {
  const { supabase } = await requireAdmin();

  const { data: customers } = await supabase
    .from('customers')
    .select('*')
    .order('created_at', { ascending: false });

  const { data: orders } = await supabase
    .from('orders')
    .select('customer_id, total');

  const ordersByCustomer = new Map<string, { count: number; total: number }>();
  for (const o of orders || []) {
    if (!o.customer_id) continue;
    const existing = ordersByCustomer.get(o.customer_id) || { count: 0, total: 0 };
    existing.count += 1;
    existing.total += Number(o.total);
    ordersByCustomer.set(o.customer_id, existing);
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h2 style={{ fontSize: 24, fontWeight: 700, margin: 0 }}>Clientes</h2>
          <p style={{ color: 'var(--text-faint)', margin: '4px 0 0', fontSize: 14 }}>
            {customers?.length || 0} clientes registrados
          </p>
        </div>
      </div>

      <div className="admin-card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Email</th>
                <th>Telefono</th>
                <th>Pedidos</th>
                <th>Total gastado</th>
                <th>Registro</th>
              </tr>
            </thead>
            <tbody>
              {(customers || []).map((customer) => {
                const stats = ordersByCustomer.get(customer.id) || { count: 0, total: 0 };
                return (
                  <tr key={customer.id}>
                    <td style={{ fontWeight: 500 }}>{customer.name}</td>
                    <td style={{ fontSize: 13, color: 'var(--text-faint)' }}>{customer.email || '—'}</td>
                    <td className="mono" style={{ fontSize: 13 }}>{customer.phone || '—'}</td>
                    <td className="mono" style={{ fontWeight: 600 }}>{stats.count}</td>
                    <td className="mono" style={{ fontWeight: 600 }}>S/ {stats.total.toFixed(2)}</td>
                    <td style={{ fontSize: 12, color: 'var(--text-faint)' }}>
                      {new Date(customer.created_at).toLocaleDateString('es-PE')}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

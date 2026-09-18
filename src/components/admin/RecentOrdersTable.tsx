import Link from 'next/link';
import { formatPrice } from '@/lib/format';
import { orderStatusLabel, paymentStatusLabel } from '@/lib/orderStatus';

interface OrderRow {
  id: string;
  order_number?: number;
  total: number;
  status: string;
  payment_status: string;
  created_at: string;
}

export function RecentOrdersTable({ orders }: { orders: OrderRow[] }) {
  if (!orders.length) {
    return (
      <div className="admin-empty">
        <h3>Sin pedidos aun</h3>
        <p>Los pedidos apareceran aqui cuando se realicen.</p>
      </div>
    );
  }

  return (
    <div style={{ overflowX: 'auto' }}>
      <table className="admin-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Total</th>
            <th>Estado</th>
            <th>Pago</th>
            <th>Fecha</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id}>
              <td>
                <Link href={`/admin/pedidos/${order.id}`} className="mono" style={{ color: 'var(--pink)', textDecoration: 'none' }}>
                  #{order.id.slice(0, 8)}
                </Link>
              </td>
              <td className="mono" style={{ fontWeight: 600 }}>{formatPrice(order.total)}</td>
              <td><span className="status-badge" data-status={order.status}>{orderStatusLabel(order.status)}</span></td>
              <td><span className="status-badge" data-status={order.payment_status}>{paymentStatusLabel(order.payment_status)}</span></td>
              <td style={{ fontSize: 13, color: 'var(--text-faint)' }}>
                {new Date(order.created_at).toLocaleDateString('es-PE')}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

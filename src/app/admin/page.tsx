import { requireAdmin } from '@/lib/supabase/admin';
import { formatPrice } from '@/lib/format';
import Link from 'next/link';
import {
  DollarIcon,
  ShoppingCartIcon,
  PackageIcon,
  UsersIcon,
} from '@/components/admin/AdminIcons';
import { RecentOrdersTable } from '@/components/admin/RecentOrdersTable';

export const dynamic = 'force-dynamic';

async function getDashboardStats(supabase: ReturnType<typeof requireAdmin> extends Promise<infer R> ? R extends { supabase: infer S } ? S : never : never) {
  const [ordersResult, customersResult, productsResult, reviewsResult] = await Promise.all([
    supabase.from('orders').select('id, total, status, created_at, payment_status').order('created_at', { ascending: false }),
    supabase.from('customers').select('id, created_at'),
    supabase.from('products').select('id, name, price, cat'),
    supabase.from('reviews').select('id, rating, approved'),
  ]);

  const orders = ordersResult.data || [];
  const customers = customersResult.data || [];
  const products = productsResult.data || [];
  const reviews = reviewsResult.data || [];

  const totalRevenue = orders
    .filter((o) => o.payment_status === 'paid')
    .reduce((sum, o) => sum + Number(o.total), 0);

  const pendingOrders = orders.filter((o) => o.status === 'pending').length;
  const pendingReviews = reviews.filter((r) => !r.approved).length;

  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const recentOrders = orders.filter((o) => new Date(o.created_at) >= thirtyDaysAgo);
  const recentRevenue = recentOrders
    .filter((o) => o.payment_status === 'paid')
    .reduce((sum, o) => sum + Number(o.total), 0);

  const statusCounts: Record<string, number> = {};
  for (const o of orders) {
    statusCounts[o.status] = (statusCounts[o.status] || 0) + 1;
  }

  const catCounts: Record<string, number> = {};
  for (const p of products) {
    catCounts[p.cat] = (catCounts[p.cat] || 0) + 1;
  }

  return {
    totalRevenue,
    totalOrders: orders.length,
    totalCustomers: customers.length,
    totalProducts: products.length,
    pendingOrders,
    pendingReviews,
    recentRevenue,
    recentOrderCount: recentOrders.length,
    statusCounts,
    categoryCounts: catCounts,
    orders: orders.slice(0, 10),
    avgRating: reviews.length
      ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
      : '0',
  };
}

export default async function AdminDashboardPage() {
  const { supabase } = await requireAdmin();
  const stats = await getDashboardStats(supabase);

  return (
    <div>
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon" data-variant="green">
            <DollarIcon size={24} />
          </div>
          <div className="stat-info">
            <div className="stat-label">Ingresos totales</div>
            <div className="stat-value">{formatPrice(stats.totalRevenue)}</div>
            <div className="stat-change" data-positive="true">
              {formatPrice(stats.recentRevenue)} ultimos 30 dias
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" data-variant="pink">
            <ShoppingCartIcon size={24} />
          </div>
          <div className="stat-info">
            <div className="stat-label">Pedidos totales</div>
            <div className="stat-value">{stats.totalOrders}</div>
            <div className="stat-change" data-positive="true">
              {stats.pendingOrders} pendientes
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" data-variant="blue">
            <UsersIcon size={24} />
          </div>
          <div className="stat-info">
            <div className="stat-label">Clientes</div>
            <div className="stat-value">{stats.totalCustomers}</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" data-variant="amber">
            <PackageIcon size={24} />
          </div>
          <div className="stat-info">
            <div className="stat-label">Productos</div>
            <div className="stat-value">{stats.totalProducts}</div>
            <div className="stat-change" data-positive="false">
              {stats.pendingReviews} resenas pendientes
            </div>
          </div>
        </div>
      </div>

      <div className="admin-grid-3">
        <div className="admin-card">
          <div className="admin-card-header">
            <h3 className="admin-card-title">Pedidos recientes</h3>
            <Link href="/admin/pedidos" className="admin-btn" data-variant="secondary" data-size="sm">
              Ver todos
            </Link>
          </div>
          <RecentOrdersTable orders={stats.orders} />
        </div>

        <div className="admin-card">
          <div className="admin-card-header">
            <h3 className="admin-card-title">Resumen</h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <div style={{ fontSize: 13, color: 'var(--text-faint)', marginBottom: 8 }}>Estado de pedidos</div>
              {Object.entries(stats.statusCounts).map(([status, count]) => (
                <div key={status} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid var(--border-soft)' }}>
                  <span className="status-badge" data-status={status}>{status}</span>
                  <span className="mono" style={{ fontWeight: 600 }}>{count}</span>
                </div>
              ))}
            </div>
            <div>
              <div style={{ fontSize: 13, color: 'var(--text-faint)', marginBottom: 8 }}>Por categoria</div>
              {Object.entries(stats.categoryCounts).map(([cat, count]) => (
                <div key={cat} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid var(--border-soft)' }}>
                  <span>{cat}</span>
                  <span className="mono" style={{ fontWeight: 600 }}>{count}</span>
                </div>
              ))}
            </div>
            <div style={{ textAlign: 'center', padding: 12, background: 'var(--graphite-50)', borderRadius: 12 }}>
              <div style={{ fontSize: 13, color: 'var(--text-faint)' }}>Rating promedio</div>
              <div style={{ fontSize: 24, fontWeight: 800, fontFamily: 'var(--font-mono)', color: '#f59e0b' }}>
                {stats.avgRating} ★
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

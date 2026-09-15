import { requireAdmin } from '@/lib/supabase/admin';
import { formatPrice } from '@/lib/format';
import { AdminCouponActions } from '@/components/admin/AdminCouponActions';
import { CreateCouponForm } from '@/components/admin/CreateCouponForm';

export const dynamic = 'force-dynamic';

export default async function AdminCouponsPage() {
  const { serviceClient } = await requireAdmin();

  const { data: coupons } = await serviceClient
    .from('coupons')
    .select('*')
    .order('created_at', { ascending: false });

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h2 style={{ fontSize: 24, fontWeight: 700, margin: 0 }}>Cupones</h2>
          <p style={{ color: 'var(--text-faint)', margin: '4px 0 0', fontSize: 14 }}>
            {coupons?.length || 0} cupones creados
          </p>
        </div>
        <CreateCouponForm />
      </div>

      <div className="admin-card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Codigo</th>
                <th>Descuento</th>
                <th>Min. orden</th>
                <th>Usos</th>
                <th>Validez</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {(coupons || []).map((coupon) => (
                <tr key={coupon.id}>
                  <td className="mono" style={{ fontWeight: 600, letterSpacing: 1 }}>{coupon.code}</td>
                  <td className="mono" style={{ fontWeight: 600 }}>
                    {coupon.discount_type === 'percentage' ? `${coupon.discount_value}%` : formatPrice(coupon.discount_value)}
                  </td>
                  <td className="mono">{coupon.min_order > 0 ? formatPrice(coupon.min_order) : '—'}</td>
                  <td className="mono">
                    {coupon.used_count}{coupon.max_uses ? ` / ${coupon.max_uses}` : ''}
                  </td>
                  <td style={{ fontSize: 12, color: 'var(--text-faint)' }}>
                    {new Date(coupon.valid_from).toLocaleDateString('es-PE')}
                    {coupon.valid_until ? ` — ${new Date(coupon.valid_until).toLocaleDateString('es-PE')}` : ''}
                  </td>
                  <td>
                    <span className="status-badge" data-active={coupon.active ? 'true' : 'false'}>
                      {coupon.active ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td>
                    <AdminCouponActions couponId={coupon.id} active={coupon.active} />
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

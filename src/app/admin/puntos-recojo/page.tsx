import { requireAdmin } from '@/lib/supabase/admin';
import { AdminPickupPointActions } from '@/components/admin/AdminPickupPointActions';
import { CreatePickupPointForm } from '@/components/admin/CreatePickupPointForm';
import type { PickupPoint } from '@/lib/types';

export const dynamic = 'force-dynamic';

export default async function AdminPickupPointsPage() {
  const { serviceClient } = await requireAdmin();

  const { data: points } = await serviceClient
    .from('pickup_points')
    .select('*')
    .order('display_order', { ascending: true });

  const typedPoints = (points || []) as PickupPoint[];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h2 style={{ fontSize: 24, fontWeight: 700, margin: 0 }}>Puntos de recojo</h2>
          <p style={{ color: 'var(--text-faint)', margin: '4px 0 0', fontSize: 14 }}>
            {typedPoints.length} puntos creados
          </p>
        </div>
        <CreatePickupPointForm />
      </div>

      <div className="admin-card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Direccion</th>
                <th>Horario</th>
                <th>Notas</th>
                <th>Orden</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {typedPoints.map((point) => (
                <tr key={point.id}>
                  <td style={{ fontWeight: 600 }}>{point.name}</td>
                  <td style={{ fontSize: 13 }}>{point.address}</td>
                  <td style={{ fontSize: 13, color: 'var(--text-faint)' }}>{point.schedule || '—'}</td>
                  <td style={{ fontSize: 13, color: 'var(--text-faint)' }}>{point.notes || '—'}</td>
                  <td className="mono">{point.display_order}</td>
                  <td>
                    <span className="status-badge" data-active={point.active ? 'true' : 'false'}>
                      {point.active ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td>
                    <AdminPickupPointActions point={point} />
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

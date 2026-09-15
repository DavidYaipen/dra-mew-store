import Link from 'next/link';
import { notFound } from 'next/navigation';
import { requireAdmin } from '@/lib/supabase/admin';
import { formatPrice } from '@/lib/format';
import { ArrowLeftIcon } from '@/components/admin/AdminIcons';
import { AdminOrderActions } from '@/components/admin/AdminOrderActions';
import { ProductImage } from '@/components/ui/ProductImage';
import type { OrderItem, OrderStatus, ShippingAddress } from '@/lib/types';

export const dynamic = 'force-dynamic';

interface OrderWithRelations {
  id: string;
  order_number: number;
  status: OrderStatus;
  subtotal: number;
  discount: number;
  shipping_cost: number;
  total: number;
  shipping_method: string | null;
  shipping_address: ShippingAddress | null;
  payment_method: string | null;
  payment_status: string;
  notes: string | null;
  whatsapp_sent: boolean;
  created_at: string;
  customers: { name: string; email: string; phone: string } | null;
  coupons: { code: string } | null;
}

export default async function AdminOrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { serviceClient } = await requireAdmin();

  const { data: order } = await serviceClient
    .from('orders')
    .select('*, customers(name, email, phone), coupons(code)')
    .eq('id', id)
    .single();

  if (!order) notFound();

  const typedOrder = order as OrderWithRelations;

  const { data: items } = await serviceClient
    .from('order_items')
    .select('*')
    .eq('order_id', id);

  const typedItems = (items || []) as OrderItem[];
  const address = typedOrder.shipping_address;

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <Link href="/admin/pedidos" className="admin-btn" data-variant="ghost" data-size="sm">
          <ArrowLeftIcon size={16} />
          Volver a pedidos
        </Link>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h2 style={{ fontSize: 24, fontWeight: 700, margin: 0 }}>
            Pedido #{typedOrder.order_number}
          </h2>
          <p style={{ color: 'var(--text-faint)', margin: '4px 0 0', fontSize: 14 }}>
            {new Date(typedOrder.created_at).toLocaleString('es-PE')}
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span className="status-badge" data-status={typedOrder.payment_status}>{typedOrder.payment_status}</span>
          <AdminOrderActions orderId={typedOrder.id} currentStatus={typedOrder.status} />
        </div>
      </div>

      <div className="admin-grid-3">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <div className="admin-card">
            <div className="admin-card-header">
              <h3 className="admin-card-title">Productos</h3>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {typedItems.map((item) => (
                <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  {item.image && <ProductImage src={item.image} alt={item.name} size={48} />}
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: 14 }}>{item.name}</div>
                    <div style={{ fontSize: 13, color: 'var(--text-faint)' }}>
                      {formatPrice(item.price)} x {item.quantity}
                    </div>
                  </div>
                  <div className="mono" style={{ fontWeight: 600 }}>
                    {formatPrice(item.price * item.quantity)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="admin-card">
            <div className="admin-card-header">
              <h3 className="admin-card-title">Totales</h3>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: 14 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-faint)' }}>Subtotal</span>
                <span className="mono">{formatPrice(typedOrder.subtotal)}</span>
              </div>
              {typedOrder.discount > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#16a34a' }}>
                  <span>Descuento {typedOrder.coupons?.code ? `(${typedOrder.coupons.code})` : ''}</span>
                  <span className="mono">-{formatPrice(typedOrder.discount)}</span>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-faint)' }}>Envio</span>
                <span className="mono">{formatPrice(typedOrder.shipping_cost)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: 16, paddingTop: 8, borderTop: '1px solid var(--border-soft)' }}>
                <span>Total</span>
                <span className="mono">{formatPrice(typedOrder.total)}</span>
              </div>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <div className="admin-card">
            <div className="admin-card-header">
              <h3 className="admin-card-title">Cliente</h3>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 14 }}>
              <div style={{ fontWeight: 600 }}>{typedOrder.customers?.name || 'Sin nombre'}</div>
              <div style={{ color: 'var(--text-faint)' }}>{typedOrder.customers?.email}</div>
              <div style={{ color: 'var(--text-faint)' }}>{typedOrder.customers?.phone}</div>
            </div>
          </div>

          {address && (
            <div className="admin-card">
              <div className="admin-card-header">
                <h3 className="admin-card-title">Direccion de envio</h3>
              </div>
              <div style={{ fontSize: 14, lineHeight: 1.6 }}>
                <div>{address.name}</div>
                <div>{address.street}</div>
                <div>{address.city}, {address.state} {address.zip}</div>
                <div>{address.country}</div>
                <div style={{ color: 'var(--text-faint)' }}>{address.phone}</div>
              </div>
            </div>
          )}

          <div className="admin-card">
            <div className="admin-card-header">
              <h3 className="admin-card-title">Detalles</h3>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: 14 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-faint)' }}>Metodo de pago</span>
                <span>{typedOrder.payment_method || '—'}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-faint)' }}>Metodo de envio</span>
                <span>{typedOrder.shipping_method || '—'}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-faint)' }}>WhatsApp enviado</span>
                <span>{typedOrder.whatsapp_sent ? 'Si' : 'No'}</span>
              </div>
              {typedOrder.notes && (
                <div>
                  <div style={{ color: 'var(--text-faint)', marginBottom: 4 }}>Notas</div>
                  <div>{typedOrder.notes}</div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

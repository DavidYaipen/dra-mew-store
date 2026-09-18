'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { formatPrice } from '@/lib/format';
import { ProductImage } from '@/components/ui/ProductImage';
import { TrashIcon } from '@/components/admin/AdminIcons';
import { ConfirmDeleteModal } from '@/components/admin/ConfirmDeleteModal';
import type { OrderItem } from '@/lib/types';

interface AdminOrderItemsEditorProps {
  items: OrderItem[];
  editable: boolean;
}

export function AdminOrderItemsEditor({ items, editable }: AdminOrderItemsEditorProps) {
  const router = useRouter();
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [removingItem, setRemovingItem] = useState<OrderItem | null>(null);
  const [removing, setRemoving] = useState(false);
  const [removeError, setRemoveError] = useState<string | null>(null);

  const decreaseQty = async (item: OrderItem) => {
    setUpdatingId(item.id);
    try {
      const res = await fetch('/api/admin/order-items', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: item.id, quantity: item.quantity - 1 }),
      });
      if (res.ok) {
        router.refresh();
      } else {
        const data = await res.json().catch(() => ({}));
        alert(data.error || 'Error al actualizar la cantidad');
      }
    } catch {
      alert('Error de conexion');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleRemove = async () => {
    if (!removingItem) return;
    setRemoving(true);
    setRemoveError(null);
    try {
      const res = await fetch(`/api/admin/order-items?id=${removingItem.id}`, { method: 'DELETE' });
      if (res.ok) {
        setRemovingItem(null);
        router.refresh();
      } else {
        const data = await res.json().catch(() => ({}));
        setRemoveError(data.error || 'Error al eliminar');
      }
    } catch {
      setRemoveError('Error de conexion');
    } finally {
      setRemoving(false);
    }
  };

  return (
    <>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {items.map((item) => (
          <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            {item.image && <ProductImage src={item.image} alt={item.name} size={48} />}
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600, fontSize: 14 }}>
                {item.name}
                {item.is_preorder && (
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
              </div>
              <div style={{ fontSize: 13, color: 'var(--text-faint)', display: 'flex', alignItems: 'center', gap: 6 }}>
                {editable && (
                  <button
                    type="button"
                    className="admin-btn"
                    data-variant="ghost"
                    data-size="sm"
                    aria-label="Reducir cantidad"
                    disabled={item.quantity <= 1 || updatingId === item.id}
                    onClick={() => decreaseQty(item)}
                    style={{ padding: '0 8px', minWidth: 0, lineHeight: 1 }}
                  >
                    −
                  </button>
                )}
                {formatPrice(item.price)} x {item.quantity}
              </div>
            </div>
            <div className="mono" style={{ fontWeight: 600 }}>
              {formatPrice(item.price * item.quantity)}
            </div>
            {editable && (
              <button
                type="button"
                className="admin-btn"
                data-variant="ghost"
                data-size="sm"
                aria-label={`Quitar ${item.name}`}
                title="Quitar producto"
                onClick={() => {
                  setRemoveError(null);
                  setRemovingItem(item);
                }}
              >
                <TrashIcon size={14} />
              </button>
            )}
          </div>
        ))}
      </div>

      <ConfirmDeleteModal
        open={removingItem != null}
        title="Quitar producto del pedido"
        description={
          <>
            ¿Seguro que quieres quitar <strong>{removingItem?.name}</strong> del pedido? El stock de{' '}
            {removingItem?.quantity} unidad(es) se repondrá automáticamente.
          </>
        }
        confirmLabel="Quitar"
        loading={removing}
        error={removeError}
        onConfirm={handleRemove}
        onCancel={() => setRemovingItem(null)}
      />
    </>
  );
}

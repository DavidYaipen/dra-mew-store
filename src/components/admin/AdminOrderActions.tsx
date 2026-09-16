'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { TrashIcon } from '@/components/admin/AdminIcons';
import { ConfirmDeleteModal } from '@/components/admin/ConfirmDeleteModal';

const STATUSES = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'];

export function AdminOrderActions({ orderId, currentStatus }: { orderId: string; currentStatus: string }) {
  const router = useRouter();
  const [updating, setUpdating] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleStatusChange = async (newStatus: string) => {
    if (newStatus === currentStatus) return;
    setUpdating(true);
    try {
      const res = await fetch('/api/admin/orders', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: orderId, status: newStatus }),
      });
      if (res.ok) {
        router.refresh();
      } else {
        const data = await res.json();
        alert(data.error || 'Error al actualizar el estado');
      }
    } catch {
      alert('Error de conexion');
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/orders?id=${orderId}`, { method: 'DELETE' });
      if (res.ok) {
        setShowModal(false);
        router.refresh();
      } else {
        const data = await res.json().catch(() => ({}));
        setError(data.error || 'Error al eliminar');
      }
    } catch {
      setError('Error de conexion');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
        <select
          value={currentStatus}
          onChange={(e) => handleStatusChange(e.target.value)}
          disabled={updating}
          style={{
            padding: '4px 8px',
            borderRadius: 8,
            border: '1px solid var(--border-soft)',
            fontSize: 12,
            fontWeight: 600,
            fontFamily: 'var(--font-sans)',
            background: '#fff',
            cursor: 'pointer',
          }}
        >
          {STATUSES.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
        <button
          className="admin-btn"
          data-variant="ghost"
          data-size="sm"
          onClick={() => {
            setError(null);
            setShowModal(true);
          }}
          disabled={updating}
          title="Eliminar pedido"
        >
          <TrashIcon size={14} />
        </button>
      </div>
      <ConfirmDeleteModal
        open={showModal}
        title="Eliminar pedido"
        description={
          <>
            ¿Seguro que quieres eliminar el pedido <strong>#{orderId.slice(0, 8)}</strong>? Esta accion no se puede
            deshacer.
          </>
        }
        loading={deleting}
        error={error}
        onConfirm={handleDelete}
        onCancel={() => setShowModal(false)}
      />
    </>
  );
}

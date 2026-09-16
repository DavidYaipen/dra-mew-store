'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { CheckIcon, TrashIcon } from '@/components/admin/AdminIcons';
import { ConfirmDeleteModal } from '@/components/admin/ConfirmDeleteModal';

export function AdminCouponActions({
  couponId,
  couponCode,
  active,
}: {
  couponId: string;
  couponCode: string;
  active: boolean;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const toggleActive = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/coupons', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: couponId, active: !active }),
      });
      if (res.ok) {
        router.refresh();
      } else {
        const data = await res.json();
        alert(data.error || 'Error al actualizar el cupon');
      }
    } catch {
      alert('Error de conexion');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/coupons?id=${couponId}`, { method: 'DELETE' });
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
      <div style={{ display: 'flex', gap: 4 }}>
        <button
          className="admin-btn"
          data-variant="ghost"
          data-size="sm"
          onClick={toggleActive}
          disabled={loading}
          title={active ? 'Desactivar' : 'Activar'}
        >
          <CheckIcon size={14} />
        </button>
        <button
          className="admin-btn"
          data-variant="ghost"
          data-size="sm"
          onClick={() => {
            setError(null);
            setShowModal(true);
          }}
          disabled={loading}
        >
          <TrashIcon size={14} />
        </button>
      </div>
      <ConfirmDeleteModal
        open={showModal}
        title="Eliminar cupon"
        description={
          <>
            ¿Seguro que quieres eliminar el cupon <strong>{couponCode}</strong>? Esta accion no se puede deshacer.
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

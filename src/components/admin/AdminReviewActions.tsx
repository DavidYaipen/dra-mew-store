'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { CheckIcon, TrashIcon } from '@/components/admin/AdminIcons';
import { ConfirmDeleteModal } from '@/components/admin/ConfirmDeleteModal';

export function AdminReviewActions({
  reviewId,
  customerName,
  productName,
  approved,
}: {
  reviewId: string;
  customerName: string;
  productName?: string;
  approved?: boolean;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const approve = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/reviews', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: reviewId, approved: true }),
      });
      if (res.ok) {
        router.refresh();
      } else {
        const data = await res.json();
        alert(data.error || 'Error al aprobar la resena');
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
      const res = await fetch(`/api/admin/reviews?id=${reviewId}`, { method: 'DELETE' });
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
        {!approved && (
          <button className="admin-btn" data-variant="ghost" data-size="sm" onClick={approve} disabled={loading} title="Aprobar">
            <CheckIcon size={14} />
          </button>
        )}
        <button
          className="admin-btn"
          data-variant="ghost"
          data-size="sm"
          onClick={() => {
            setError(null);
            setShowModal(true);
          }}
          disabled={loading}
          title="Eliminar"
        >
          <TrashIcon size={14} />
        </button>
      </div>
      <ConfirmDeleteModal
        open={showModal}
        title="Eliminar resena"
        description={
          <>
            ¿Seguro que quieres eliminar la resena de <strong>{customerName}</strong>
            {productName ? (
              <>
                {' '}
                sobre <strong>{productName}</strong>
              </>
            ) : null}
            ? Esta accion no se puede deshacer.
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

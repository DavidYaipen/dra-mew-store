'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { TrashIcon } from '@/components/admin/AdminIcons';
import { ConfirmDeleteModal } from '@/components/admin/ConfirmDeleteModal';

export function AdminCustomerActions({ customerId, customerName }: { customerId: string; customerName: string }) {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async () => {
    setDeleting(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/customers?id=${customerId}`, { method: 'DELETE' });
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
      <button
        className="admin-btn"
        data-variant="ghost"
        data-size="sm"
        onClick={() => {
          setError(null);
          setShowModal(true);
        }}
      >
        <TrashIcon size={14} />
      </button>
      <ConfirmDeleteModal
        open={showModal}
        title="Eliminar cliente"
        description={
          <>
            ¿Seguro que quieres eliminar a <strong>{customerName}</strong>? Esta accion no se puede deshacer.
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

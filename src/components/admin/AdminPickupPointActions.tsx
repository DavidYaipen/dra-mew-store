'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { CheckIcon, EditIcon, TrashIcon } from '@/components/admin/AdminIcons';
import { ConfirmDeleteModal } from '@/components/admin/ConfirmDeleteModal';
import { EditPickupPointForm } from '@/components/admin/EditPickupPointForm';
import type { PickupPoint } from '@/lib/types';

export function AdminPickupPointActions({ point }: { point: PickupPoint }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const toggleActive = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/puntos-recojo', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: point.id, active: !point.active }),
      });
      if (res.ok) {
        router.refresh();
      } else {
        const data = await res.json();
        alert(data.error || 'Error al actualizar el punto de recojo');
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
      const res = await fetch(`/api/admin/puntos-recojo?id=${point.id}`, { method: 'DELETE' });
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
          onClick={() => setShowEdit(true)}
          disabled={loading}
          title="Editar"
        >
          <EditIcon size={14} />
        </button>
        <button
          className="admin-btn"
          data-variant="ghost"
          data-size="sm"
          onClick={toggleActive}
          disabled={loading}
          title={point.active ? 'Desactivar' : 'Activar'}
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
          title="Eliminar"
        >
          <TrashIcon size={14} />
        </button>
      </div>
      {showEdit && <EditPickupPointForm point={point} onClose={() => setShowEdit(false)} />}
      <ConfirmDeleteModal
        open={showModal}
        title="Eliminar punto de recojo"
        description={
          <>
            ¿Seguro que quieres eliminar <strong>{point.name}</strong>? Esta accion no se puede deshacer.
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

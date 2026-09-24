'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import type { PickupPoint } from '@/lib/types';

export function EditPickupPointForm({ point, onClose }: { point: PickupPoint; onClose: () => void }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const form = new FormData(e.currentTarget);
    const body = {
      id: point.id,
      name: form.get('name'),
      address: form.get('address'),
      schedule: form.get('schedule') || null,
      notes: form.get('notes') || null,
      display_order: Number(form.get('display_order') || 0),
    };

    try {
      const res = await fetch('/api/admin/puntos-recojo', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (res.ok) {
        onClose();
        router.refresh();
      } else {
        const data = await res.json();
        alert(data.error || 'Error al editar el punto de recojo');
      }
    } catch {
      alert('Error de conexion');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-modal-overlay" onClick={onClose}>
      <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
        <div className="admin-modal-header">
          <h2>Editar punto de recojo</h2>
          <button className="admin-btn" data-variant="ghost" data-size="sm" onClick={onClose}>
            X
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="admin-modal-body">
            <div className="admin-form">
              <div className="form-group">
                <label>Nombre</label>
                <input name="name" type="text" required defaultValue={point.name} />
              </div>
              <div className="form-group">
                <label>Direccion</label>
                <input name="address" type="text" required defaultValue={point.address} />
              </div>
              <div className="form-group">
                <label>Horario</label>
                <input name="schedule" type="text" defaultValue={point.schedule ?? ''} />
              </div>
              <div className="form-group">
                <label>Notas</label>
                <textarea name="notes" rows={2} defaultValue={point.notes ?? ''} />
              </div>
              <div className="form-group">
                <label>Orden de aparicion</label>
                <input name="display_order" type="number" min="0" defaultValue={point.display_order} />
              </div>
            </div>
          </div>
          <div className="admin-modal-footer">
            <button type="button" className="admin-btn" data-variant="secondary" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="admin-btn" data-variant="primary" disabled={loading}>
              {loading ? 'Guardando...' : 'Guardar cambios'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { PlusIcon } from '@/components/admin/AdminIcons';

export function CreatePickupPointForm() {
  const router = useRouter();
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const form = new FormData(e.currentTarget);
    const body = {
      name: form.get('name'),
      address: form.get('address'),
      schedule: form.get('schedule') || null,
      notes: form.get('notes') || null,
      display_order: Number(form.get('display_order') || 0),
    };

    try {
      const res = await fetch('/api/admin/puntos-recojo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (res.ok) {
        setShow(false);
        router.refresh();
      } else {
        const data = await res.json();
        alert(data.error || 'Error al crear el punto de recojo');
      }
    } catch {
      alert('Error de conexion');
    } finally {
      setLoading(false);
    }
  };

  if (!show) {
    return (
      <button className="admin-btn" data-variant="primary" onClick={() => setShow(true)}>
        <PlusIcon size={18} />
        Nuevo punto
      </button>
    );
  }

  return (
    <div className="admin-modal-overlay" onClick={() => setShow(false)}>
      <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
        <div className="admin-modal-header">
          <h2>Crear punto de recojo</h2>
          <button className="admin-btn" data-variant="ghost" data-size="sm" onClick={() => setShow(false)}>
            X
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="admin-modal-body">
            <div className="admin-form">
              <div className="form-group">
                <label>Nombre</label>
                <input name="name" type="text" required placeholder="ej: San Miguel" />
              </div>
              <div className="form-group">
                <label>Direccion</label>
                <input name="address" type="text" required placeholder="Direccion exacta del local" />
              </div>
              <div className="form-group">
                <label>Horario</label>
                <input name="schedule" type="text" placeholder="ej: Lun-Sab 10:00-20:00" />
              </div>
              <div className="form-group">
                <label>Notas</label>
                <textarea name="notes" rows={2} placeholder="Referencias, indicaciones adicionales..." />
              </div>
              <div className="form-group">
                <label>Orden de aparicion</label>
                <input name="display_order" type="number" min="0" defaultValue="0" />
              </div>
            </div>
          </div>
          <div className="admin-modal-footer">
            <button type="button" className="admin-btn" data-variant="secondary" onClick={() => setShow(false)}>
              Cancelar
            </button>
            <button type="submit" className="admin-btn" data-variant="primary" disabled={loading}>
              {loading ? 'Creando...' : 'Crear punto'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

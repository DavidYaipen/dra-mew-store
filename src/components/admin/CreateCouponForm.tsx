'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { PlusIcon } from '@/components/admin/AdminIcons';

export function CreateCouponForm() {
  const router = useRouter();
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const form = new FormData(e.currentTarget);
    const body = {
      code: (form.get('code') as string).toUpperCase(),
      discount_type: form.get('discount_type'),
      discount_value: Number(form.get('discount_value')),
      min_order: Number(form.get('min_order') || 0),
      max_uses: form.get('max_uses') ? Number(form.get('max_uses')) : null,
      valid_until: form.get('valid_until') || null,
    };

    try {
      const res = await fetch('/api/admin/coupons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (res.ok) {
        setShow(false);
        router.refresh();
      } else {
        const data = await res.json();
        alert(data.error || 'Error al crear cupon');
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
        Nuevo cupon
      </button>
    );
  }

  return (
    <div className="admin-modal-overlay" onClick={() => setShow(false)}>
      <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
        <div className="admin-modal-header">
          <h2>Crear cupon</h2>
          <button className="admin-btn" data-variant="ghost" data-size="sm" onClick={() => setShow(false)}>
            X
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="admin-modal-body">
            <div className="admin-form">
              <div className="form-group">
                <label>Codigo</label>
                <input name="code" type="text" required placeholder="ej: VERANO20" style={{ textTransform: 'uppercase' }} />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Tipo</label>
                  <select name="discount_type" required>
                    <option value="percentage">Porcentaje (%)</option>
                    <option value="fixed">Fijo (S/)</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Valor</label>
                  <input name="discount_value" type="number" step="0.01" min="0" required />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Min. orden (S/)</label>
                  <input name="min_order" type="number" step="0.01" min="0" defaultValue="0" />
                </div>
                <div className="form-group">
                  <label>Max. usos</label>
                  <input name="max_uses" type="number" min="0" placeholder="Sin limite" />
                </div>
              </div>
              <div className="form-group">
                <label>Valido hasta</label>
                <input name="valid_until" type="date" />
              </div>
            </div>
          </div>
          <div className="admin-modal-footer">
            <button type="button" className="admin-btn" data-variant="secondary" onClick={() => setShow(false)}>
              Cancelar
            </button>
            <button type="submit" className="admin-btn" data-variant="primary" disabled={loading}>
              {loading ? 'Creando...' : 'Crear cupon'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

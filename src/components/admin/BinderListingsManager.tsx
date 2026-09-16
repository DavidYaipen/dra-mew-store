'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { formatPrice } from '@/lib/format';
import { PlusIcon, TrashIcon } from '@/components/admin/AdminIcons';

const FINISHES = [
  { value: 'comun', label: 'Común' },
  { value: 'holo', label: 'Holo' },
  { value: 'reverse', label: 'Reverse' },
];
const CONDITIONS = ['NM', 'LP', 'MP', 'HP', 'Damaged'];
const FINISH_LABELS: Record<string, string> = { comun: 'Común', holo: 'Holo', reverse: 'Reverse' };

export interface BinderListingData {
  id: string;
  finish: string;
  condition: string;
  price: number;
  stock: number;
  sku: string | null;
  is_preorder: boolean;
}

export function BinderListingsManager({ cardId, listings }: { cardId: string; listings: BinderListingData[] }) {
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editStock, setEditStock] = useState('');

  const handleAdd = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const form = new FormData(e.currentTarget);

    try {
      const res = await fetch('/api/admin/binder/listings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          card_id: cardId,
          finish: form.get('finish'),
          condition: form.get('condition'),
          price: Number(form.get('price')),
          stock: Number(form.get('stock') || 0),
          sku: form.get('sku') || null,
          is_preorder: form.get('is_preorder') === 'on',
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error || 'Error al crear el listing');
        return;
      }
      setShowForm(false);
      router.refresh();
    } catch {
      setError('Error de conexion');
    } finally {
      setLoading(false);
    }
  };

  const handleStockSave = async (id: string) => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/admin/binder/listings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, stock: Number(editStock) }),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error || 'Error al actualizar stock');
        return;
      }
      setEditingId(null);
      router.refresh();
    } catch {
      setError('Error de conexion');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/binder/listings?id=${id}`, { method: 'DELETE' });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error || 'Error al eliminar');
        return;
      }
      router.refresh();
    } catch {
      setError('Error de conexion');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-card">
      <div className="admin-card-header">
        <h3 className="admin-card-title">Listings (acabado + condición)</h3>
        <button type="button" className="admin-btn" data-variant="secondary" data-size="sm" onClick={() => setShowForm((s) => !s)}>
          <PlusIcon size={16} />
          Agregar listing
        </button>
      </div>

      {error && (
        <div style={{ padding: '10px 14px', background: '#fee2e2', color: '#991b1b', borderRadius: 10, fontSize: 13, marginBottom: 12 }}>
          {error}
        </div>
      )}

      {showForm && (
        <form onSubmit={handleAdd} className="admin-form" style={{ marginBottom: 16, paddingBottom: 16, borderBottom: '1px solid var(--border-soft)' }}>
          <div className="form-row">
            <div className="form-group">
              <label>Acabado</label>
              <select name="finish" required defaultValue="comun">
                {FINISHES.map((f) => (
                  <option key={f.value} value={f.value}>{f.label}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Condición</label>
              <select name="condition" required defaultValue="NM">
                {CONDITIONS.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Precio (S/)</label>
              <input name="price" type="number" step="0.01" min="0" required />
            </div>
            <div className="form-group">
              <label>Stock inicial</label>
              <input name="stock" type="number" step="1" min="0" defaultValue={0} />
            </div>
          </div>
          <div className="form-group">
            <label>SKU - opcional</label>
            <input name="sku" type="text" />
          </div>
          <div className="form-group">
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
              <input type="checkbox" name="is_preorder" style={{ width: 18, height: 18 }} />
              Disponible en preventa
            </label>
          </div>
          <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
            <button type="submit" className="admin-btn" data-variant="primary" data-size="sm" disabled={loading}>
              Guardar listing
            </button>
          </div>
        </form>
      )}

      {listings.length === 0 ? (
        <div className="admin-empty">
          <h3>Sin listings todavía</h3>
          <p>Agrega al menos un acabado/condición para que esta carta se pueda vender.</p>
        </div>
      ) : (
        <table className="admin-table">
          <thead>
            <tr>
              <th>Acabado</th>
              <th>Condición</th>
              <th>Precio</th>
              <th>Stock</th>
              <th>Preventa</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {listings.map((l) => (
              <tr key={l.id}>
                <td>{FINISH_LABELS[l.finish] ?? l.finish}</td>
                <td>{l.condition}</td>
                <td className="mono">{formatPrice(l.price)}</td>
                <td>
                  {editingId === l.id ? (
                    <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                      <input
                        type="number"
                        value={editStock}
                        onChange={(e) => setEditStock(e.target.value)}
                        style={{ width: 70 }}
                      />
                      <button type="button" className="admin-btn" data-variant="primary" data-size="sm" onClick={() => handleStockSave(l.id)} disabled={loading}>
                        OK
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      className="mono"
                      style={{ background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600, color: l.stock <= 0 && !l.is_preorder ? '#dc2626' : undefined }}
                      onClick={() => {
                        setEditingId(l.id);
                        setEditStock(String(l.stock));
                      }}
                    >
                      {l.stock}
                    </button>
                  )}
                </td>
                <td>{l.is_preorder ? <span className="status-badge" data-active="true">Sí</span> : '—'}</td>
                <td>
                  <button type="button" className="admin-btn" data-variant="ghost" data-size="sm" onClick={() => handleDelete(l.id)} disabled={loading}>
                    <TrashIcon size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

'use client';

import { useRouter } from 'next/navigation';
import { useState, useRef } from 'react';
import { ProductImage } from '@/components/ui/ProductImage';

const FINISHES = [
  { value: 'comun', label: 'Común' },
  { value: 'holo', label: 'Holo' },
  { value: 'reverse', label: 'Reverse' },
];
const CONDITIONS = ['NM', 'LP', 'MP', 'HP', 'Damaged'];

interface InitialData {
  id?: string;
  name?: string;
  collection?: string;
  card_number?: string;
  image?: string;
}

export function BinderCardForm({ initialData }: { initialData?: InitialData }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [imagePreview, setImagePreview] = useState(initialData?.image || '');
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError('');
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch('/api/admin/upload', { method: 'POST', body: formData });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error || 'Error al subir imagen');
        return;
      }
      const data = await res.json();
      setImagePreview(data.url);
    } catch {
      setError('Error de conexion al subir imagen');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const form = new FormData(e.currentTarget);
    const body: Record<string, unknown> = {
      ...(initialData?.id ? { id: initialData.id } : {}),
      name: form.get('name'),
      collection: form.get('collection'),
      card_number: form.get('card_number') || null,
      image: imagePreview || null,
    };

    if (!initialData?.id) {
      body.listings = [
        {
          finish: form.get('finish'),
          condition: form.get('condition'),
          price: Number(form.get('price')),
          stock: form.get('stock') !== '' ? Number(form.get('stock')) : 0,
          is_preorder: form.get('is_preorder') === 'on',
        },
      ];
    }

    try {
      const method = initialData?.id ? 'PUT' : 'POST';
      const res = await fetch('/api/admin/binder', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || 'Error al guardar');
        return;
      }

      router.push('/admin/binder');
      router.refresh();
    } catch {
      setError('Error de conexion');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="admin-form" onSubmit={handleSubmit}>
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="name">Nombre de la carta</label>
          <input id="name" name="name" type="text" defaultValue={initialData?.name} placeholder="Charizard ex" required />
        </div>
        <div className="form-group">
          <label htmlFor="collection">Colección</label>
          <input id="collection" name="collection" type="text" defaultValue={initialData?.collection} placeholder="Obsidian Flames" required />
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="card_number">Número de carta - opcional</label>
        <input id="card_number" name="card_number" type="text" defaultValue={initialData?.card_number} placeholder="054/197" />
      </div>

      <div className="form-group">
        <label>Imagen</label>
        <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
          <div
            style={{
              width: 100,
              height: 100,
              border: '2px dashed var(--graphite-200)',
              borderRadius: 12,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
              background: 'var(--graphite-50)',
              flexShrink: 0,
            }}
          >
            {imagePreview ? (
              <ProductImage src={imagePreview} alt="Preview" size={100} />
            ) : (
              <span style={{ fontSize: 11, color: 'var(--text-faint)', textAlign: 'center', padding: 8 }}>Sin imagen</span>
            )}
          </div>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
            <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/webp,image/gif" onChange={handleFileChange} style={{ display: 'none' }} />
            <button type="button" className="admin-btn" data-variant="secondary" onClick={() => fileInputRef.current?.click()} disabled={uploading}>
              {uploading ? 'Subiendo...' : 'Seleccionar imagen'}
            </button>
            <input
              type="text"
              value={imagePreview}
              onChange={(e) => setImagePreview(e.target.value)}
              placeholder="O ingresa una URL manualmente"
            />
          </div>
        </div>
      </div>

      {!initialData?.id && (
        <>
          <h3 style={{ fontSize: 15, fontWeight: 700, marginTop: 8 }}>Primer listing</h3>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="finish">Acabado</label>
              <select id="finish" name="finish" required defaultValue="comun">
                {FINISHES.map((f) => (
                  <option key={f.value} value={f.value}>{f.label}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="condition">Condición</label>
              <select id="condition" name="condition" required defaultValue="NM">
                {CONDITIONS.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="price">Precio (S/)</label>
              <input id="price" name="price" type="number" step="0.01" min="0" required />
            </div>
            <div className="form-group">
              <label htmlFor="stock">Stock</label>
              <input id="stock" name="stock" type="number" step="1" min="0" defaultValue={0} />
            </div>
          </div>
          <div className="form-group">
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
              <input type="checkbox" name="is_preorder" style={{ width: 18, height: 18 }} />
              Disponible en preventa
            </label>
          </div>
        </>
      )}

      {error && (
        <div style={{ padding: '12px 16px', background: '#fee2e2', color: '#991b1b', borderRadius: 10, fontSize: 14 }}>
          {error}
        </div>
      )}

      <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
        <button type="button" className="admin-btn" data-variant="secondary" onClick={() => router.back()}>
          Cancelar
        </button>
        <button type="submit" className="admin-btn" data-variant="primary" disabled={loading || uploading}>
          {loading ? 'Guardando...' : initialData?.id ? 'Actualizar' : 'Crear carta'}
        </button>
      </div>
    </form>
  );
}

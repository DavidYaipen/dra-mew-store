'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

const CATEGORIES = ['Peluches', 'Figuras', 'Cartas', 'Ropa', 'Accesorios'];
const TINTS: Record<string, string> = {
  Peluches: 'var(--pink-soft)',
  Figuras: 'var(--blue-100)',
  Cartas: 'var(--violet-100)',
  Ropa: 'var(--amber-100)',
  Accesorios: 'var(--graphite-100)',
};

export function ProductForm({ initialData }: { initialData?: Record<string, unknown> }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const form = new FormData(e.currentTarget);
    const body = {
      id: initialData?.id ? Number(initialData.id) : Number(form.get('id')),
      name: form.get('name'),
      cat: form.get('cat'),
      price: Number(form.get('price')),
      old_price: form.get('old_price') ? Number(form.get('old_price')) : null,
      rating: Number(form.get('rating')),
      image: form.get('image'),
      tint: form.get('tint'),
      badge: form.get('badge') || null,
      is_featured: form.get('is_featured') === 'on',
    };

    try {
      const method = initialData?.id ? 'PUT' : 'POST';
      const res = await fetch('/api/admin/products', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || 'Error al guardar');
        return;
      }

      router.push('/admin/productos');
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
          <label htmlFor="id">ID del producto</label>
          <input
            id="id"
            name="id"
            type="number"
            defaultValue={(initialData?.id as number) || ''}
            disabled={!!initialData?.id}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="name">Nombre</label>
          <input id="name" name="name" type="text" defaultValue={initialData?.name as string} required />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="cat">Categoria</label>
          <select id="cat" name="cat" defaultValue={initialData?.cat as string} required>
            <option value="">Seleccionar...</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="tint">Color de tarjeta</label>
          <select id="tint" name="tint" defaultValue={initialData?.tint as string} required>
            <option value="">Seleccionar...</option>
            {Object.entries(TINTS).map(([name, value]) => (
              <option key={name} value={value}>{name}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="price">Precio (S/)</label>
          <input id="price" name="price" type="number" step="0.01" min="0" defaultValue={initialData?.price as number} required />
        </div>
        <div className="form-group">
          <label htmlFor="old_price">Precio anterior (S/) - opcional</label>
          <input id="old_price" name="old_price" type="number" step="0.01" min="0" defaultValue={initialData?.old_price as number || ''} />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="rating">Rating (0-5)</label>
          <input id="rating" name="rating" type="number" step="0.1" min="0" max="5" defaultValue={(initialData?.rating as number) || 4.5} required />
        </div>
        <div className="form-group">
          <label htmlFor="badge">Badge - opcional</label>
          <select id="badge" name="badge" defaultValue={initialData?.badge as string || ''}>
            <option value="">Sin badge</option>
            <option value="Nuevo">Nuevo</option>
            <option value="Ultimas">Ultimas unidades</option>
            <option value="Rara">Rara</option>
            <option value="Coleccionista">Coleccionista</option>
          </select>
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="image">URL de imagen</label>
        <input id="image" name="image" type="text" defaultValue={initialData?.image as string || '/assets/thiings/star.png'} placeholder="/assets/thiings/star.png" required />
      </div>

      <div className="form-group">
        <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
          <input type="checkbox" name="is_featured" defaultChecked={initialData?.is_featured as boolean} style={{ width: 18, height: 18 }} />
          Producto destacado
        </label>
      </div>

      {error && (
        <div style={{ padding: '12px 16px', background: '#fee2e2', color: '#991b1b', borderRadius: 10, fontSize: 14 }}>
          {error}
        </div>
      )}

      <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
        <button type="button" className="admin-btn" data-variant="secondary" onClick={() => router.back()}>
          Cancelar
        </button>
        <button type="submit" className="admin-btn" data-variant="primary" disabled={loading}>
          {loading ? 'Guardando...' : initialData?.id ? 'Actualizar' : 'Crear producto'}
        </button>
      </div>
    </form>
  );
}

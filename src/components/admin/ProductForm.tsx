'use client';

import { useRouter } from 'next/navigation';
import { useState, useRef } from 'react';
import { ProductImage } from '@/components/ui/ProductImage';

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
  const [imagePreview, setImagePreview] = useState<string>((initialData?.image as string) || '');
  const [tint, setTint] = useState<string>((initialData?.tint as string) || '');
  const [isPreorder, setIsPreorder] = useState<boolean>(!!initialData?.is_preorder);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = async (file: File) => {
    setUploading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('file', file);
      if (initialData?.id) {
        formData.append('productId', String(initialData.id));
      }

      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });

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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Preview local
      const reader = new FileReader();
      reader.onload = (ev) => {
        setImagePreview(ev.target?.result as string);
      };
      reader.readAsDataURL(file);
      // Subir a Supabase
      handleImageUpload(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const form = new FormData(e.currentTarget);
    const body = {
      ...(initialData?.id ? { id: Number(initialData.id) } : {}),
      name: form.get('name'),
      cat: form.get('cat'),
      price: Number(form.get('price')),
      old_price: form.get('old_price') ? Number(form.get('old_price')) : null,
      rating: Number(form.get('rating')),
      image: imagePreview || form.get('image'),
      tint,
      badge: form.get('badge') || null,
      is_featured: form.get('is_featured') === 'on',
      stock: form.get('stock') !== '' ? Number(form.get('stock')) : null,
      is_preorder: form.get('is_preorder') === 'on',
      preorder_note: form.get('preorder_note') || null,
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
        {initialData?.id != null && (
          <div className="form-group">
            <label htmlFor="id">ID del producto</label>
            <input id="id" type="number" value={initialData.id as number} disabled readOnly />
          </div>
        )}
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
          <select id="tint" name="tint" value={tint} onChange={(e) => setTint(e.target.value)} required>
            <option value="">Seleccionar...</option>
            {tint && !Object.values(TINTS).includes(tint) && (
              <option value={tint}>Personalizado (actual)</option>
            )}
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
        <label htmlFor="stock">Stock - opcional (solo para productos sin variantes)</label>
        <input
          id="stock"
          name="stock"
          type="number"
          step="1"
          min="0"
          defaultValue={initialData?.stock != null ? (initialData.stock as number) : ''}
          placeholder="Vacío = sin control de stock"
        />
        <div style={{ fontSize: 12, color: 'var(--text-faint)', marginTop: 4 }}>
          Si el producto tiene variantes, el stock se gestiona por variante más abajo en{' '}
          /admin/productos. Cambiar este valor queda registrado como un ajuste en el
          cárdex de inventario.
        </div>
      </div>

      <div className="form-group">
        <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
          <input
            type="checkbox"
            name="is_preorder"
            checked={isPreorder}
            onChange={(e) => setIsPreorder(e.target.checked)}
            style={{ width: 18, height: 18 }}
          />
          Disponible en preventa (se puede comprar aunque no haya stock todavía)
        </label>
        {isPreorder && (
          <input
            name="preorder_note"
            type="text"
            defaultValue={(initialData?.preorder_note as string) || ''}
            placeholder="Nota de preventa, ej: Llega en octubre"
            style={{ marginTop: 8 }}
          />
        )}
      </div>

      {/* Image Upload Section */}
      <div className="form-group">
        <label>Imagen del producto</label>
        <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
          {/* Preview */}
          <div
            style={{
              width: 120,
              height: 120,
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
              imagePreview.startsWith('data:') ? (
                // Preview local instantanea (FileReader) antes de subir — next/image no soporta data: URLs.
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={imagePreview}
                  alt="Preview"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              ) : (
                <ProductImage src={imagePreview} alt="Preview" size={120} />
              )
            ) : (
              <span style={{ fontSize: 12, color: 'var(--text-faint)', textAlign: 'center', padding: 8 }}>
                Sin imagen
              </span>
            )}
          </div>

          {/* Upload controls */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              onChange={handleFileChange}
              style={{ display: 'none' }}
            />
            <button
              type="button"
              className="admin-btn"
              data-variant="secondary"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
            >
              {uploading ? 'Subiendo...' : 'Seleccionar imagen'}
            </button>
            <div style={{ fontSize: 12, color: 'var(--text-faint)' }}>
              JPEG, PNG, WebP o GIF. Max 5MB.
            </div>

            {/* Manual URL input */}
            <div style={{ marginTop: 8 }}>
              <label htmlFor="image" style={{ fontSize: 13, color: 'var(--graphite-600)', marginBottom: 4, display: 'block' }}>
                O ingresa URL manualmente:
              </label>
              <input
                id="image"
                name="image"
                type="text"
                value={imagePreview}
                onChange={(e) => setImagePreview(e.target.value)}
                placeholder="https://..."
                style={{ width: '100%' }}
              />
            </div>
          </div>
        </div>
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
        <button type="submit" className="admin-btn" data-variant="primary" disabled={loading || uploading}>
          {loading ? 'Guardando...' : initialData?.id ? 'Actualizar' : 'Crear producto'}
        </button>
      </div>
    </form>
  );
}

'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { PlusIcon } from '@/components/admin/AdminIcons';

interface Product {
  id: number;
  name: string;
  stock: number | null;
}

interface Variant {
  id: string;
  product_id: number;
  name: string;
  stock: number;
}

export function AddInventoryForm({ products, variants }: { products: Product[]; variants: Variant[] }) {
  const router = useRouter();
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [productId, setProductId] = useState('');

  const productVariants = variants.filter((v) => String(v.product_id) === productId);
  const selectedProduct = products.find((p) => String(p.id) === productId);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const form = new FormData(e.currentTarget);
    const body = {
      product_id: Number(form.get('product_id')),
      variant_id: form.get('variant_id') || null,
      quantity: Number(form.get('quantity')),
      reason: form.get('reason'),
      reference: form.get('reference') || null,
    };

    try {
      const res = await fetch('/api/admin/inventory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (res.ok) {
        setShow(false);
        setProductId('');
        router.refresh();
      } else {
        const data = await res.json();
        alert(data.error || 'Error al registrar movimiento');
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
        Registrar movimiento
      </button>
    );
  }

  return (
    <div className="admin-modal-overlay" onClick={() => setShow(false)}>
      <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
        <div className="admin-modal-header">
          <h2>Movimiento de inventario</h2>
          <button className="admin-btn" data-variant="ghost" data-size="sm" onClick={() => setShow(false)}>
            X
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="admin-modal-body">
            <div className="admin-form">
              <div className="form-group">
                <label>Producto</label>
                <select
                  name="product_id"
                  required
                  value={productId}
                  onChange={(e) => setProductId(e.target.value)}
                >
                  <option value="">Seleccionar producto...</option>
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>
              {productId && (
                productVariants.length > 0 ? (
                  <div className="form-group">
                    <label>Variante</label>
                    <select name="variant_id" required>
                      <option value="">Seleccionar variante...</option>
                      {productVariants.map((v) => (
                        <option key={v.id} value={v.id}>{v.name} (stock: {v.stock})</option>
                      ))}
                    </select>
                  </div>
                ) : selectedProduct?.stock != null ? (
                  <div style={{ fontSize: 13, color: 'var(--text-faint)' }}>
                    Este producto no tiene variantes; el movimiento se aplicará sobre su stock
                    directo (actualmente {selectedProduct.stock}).
                  </div>
                ) : (
                  <div style={{ fontSize: 13, color: '#dc2626' }}>
                    Este producto no tiene stock rastreado todavía. Asígnale un valor inicial
                    desde /admin/productos antes de registrar movimientos.
                  </div>
                )
              )}
              <div className="form-row">
                <div className="form-group">
                  <label>Cantidad (+ restock, - ajuste)</label>
                  <input name="quantity" type="number" required placeholder="ej: 10 o -2" />
                </div>
                <div className="form-group">
                  <label>Motivo</label>
                  <select name="reason" required>
                    <option value="restock">Reposicion</option>
                    <option value="adjustment">Ajuste</option>
                    <option value="return">Devolucion</option>
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label>Referencia (opcional)</label>
                <input name="reference" type="text" placeholder="ej: order_id, nota" />
              </div>
            </div>
          </div>
          <div className="admin-modal-footer">
            <button type="button" className="admin-btn" data-variant="secondary" onClick={() => setShow(false)}>
              Cancelar
            </button>
            <button type="submit" className="admin-btn" data-variant="primary" disabled={loading}>
              {loading ? 'Registrando...' : 'Registrar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

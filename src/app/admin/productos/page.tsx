import { requireAdmin } from '@/lib/supabase/admin';
import { formatPrice } from '@/lib/format';
import Link from 'next/link';
import { PlusIcon } from '@/components/admin/AdminIcons';
import { AdminProductActions } from '@/components/admin/AdminProductActions';
import { AddInventoryForm } from '@/components/admin/AddInventoryForm';
import { ProductImage } from '@/components/ui/ProductImage';

export const dynamic = 'force-dynamic';

const FINISH_LABELS: Record<string, string> = { comun: 'Común', holo: 'Holo', reverse: 'Reverse' };

interface MovementWithProduct {
  id: string;
  quantity: number;
  reason: string;
  reference: string | null;
  created_at: string;
  products: { name: string } | null;
  binder_listings: { finish: string; condition: string; binder_cards: { name: string } | null } | null;
}

function movementLabel(m: MovementWithProduct): string {
  if (m.binder_listings) {
    const cardName = m.binder_listings.binder_cards?.name || 'Carta';
    const finish = FINISH_LABELS[m.binder_listings.finish] ?? m.binder_listings.finish;
    return `${cardName} · ${finish} · ${m.binder_listings.condition}`;
  }
  return m.products?.name || 'Producto';
}

export default async function AdminProductsPage() {
  const { serviceClient } = await requireAdmin();

  const { data: products, error: productsError } = await serviceClient
    .from('products')
    .select('*')
    .order('id');

  const { data: variants } = await serviceClient
    .from('product_variants')
    .select('*')
    .order('created_at', { ascending: false });

  const { data: movements } = await serviceClient
    .from('inventory_movements')
    .select('*, products(name), binder_listings(finish, condition, binder_cards(name))')
    .order('created_at', { ascending: false })
    .limit(50);

  if (productsError) {
    console.error('Error fetching products:', productsError);
  }

  const typedMovements = (movements || []) as MovementWithProduct[];

  const stockByProduct = new Map<number, number>();
  for (const v of variants || []) {
    stockByProduct.set(v.product_id, (stockByProduct.get(v.product_id) || 0) + v.stock);
  }

  const productNames = new Map<number, string>();
  for (const p of products || []) {
    productNames.set(p.id, p.name);
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h2 style={{ fontSize: 24, fontWeight: 700, margin: 0 }}>Productos</h2>
          <p style={{ color: 'var(--text-faint)', margin: '4px 0 0', fontSize: 14 }}>
            {products?.length || 0} productos · {variants?.length || 0} variantes
          </p>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <AddInventoryForm products={products || []} variants={variants || []} />
          <Link href="/admin/productos/nuevo" className="admin-btn" data-variant="primary">
            <PlusIcon size={18} />
            Nuevo producto
          </Link>
        </div>
      </div>

      {productsError && (
        <div style={{ padding: 16, background: '#fee2e2', color: '#991b1b', borderRadius: 12, marginBottom: 16 }}>
          Error al cargar productos: {productsError.message}
        </div>
      )}

      <div className="admin-card" style={{ padding: 0, overflow: 'hidden', marginBottom: 24 }}>
        <div style={{ overflowX: 'auto' }}>
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Producto</th>
                <th>Categoria</th>
                <th>Precio</th>
                <th>Stock</th>
                <th>Badge</th>
                <th>Featured</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {(products || []).map((product) => {
                const stock = stockByProduct.get(product.id) ?? product.stock;
                return (
                  <tr key={product.id}>
                    <td className="mono">{product.id}</td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <ProductImage src={product.image} alt={product.name} size={40} />
                        <div>
                          <div style={{ fontWeight: 600 }}>{product.name}</div>
                          {product.old_price && (
                            <div style={{ fontSize: 12, color: 'var(--pink)', textDecoration: 'line-through' }}>
                              {formatPrice(product.old_price)}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td>{product.cat}</td>
                    <td className="mono" style={{ fontWeight: 600 }}>{formatPrice(product.price)}</td>
                    <td
                      className="mono"
                      style={{ fontWeight: 600, color: stock != null && stock <= 5 ? '#dc2626' : undefined }}
                    >
                      {stock != null ? stock : 'Sin rastrear'}
                    </td>
                    <td>
                      {product.badge ? (
                        <span style={{ padding: '3px 10px', borderRadius: 999, fontSize: 11, fontWeight: 600, background: 'var(--pink-soft)', color: 'var(--pink)' }}>
                          {product.badge}
                        </span>
                      ) : (
                        <span style={{ color: 'var(--text-faint)', fontSize: 12 }}>—</span>
                      )}
                    </td>
                    <td>
                      {product.is_featured ? (
                        <span className="status-badge" data-active="true">Destacado</span>
                      ) : (
                        <span className="status-badge" data-active="false">Normal</span>
                      )}
                    </td>
                    <td>
                      <AdminProductActions productId={product.id} productName={product.name} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="admin-grid-2">
        <div className="admin-card">
          <div className="admin-card-header">
            <h3 className="admin-card-title">Variantes con stock</h3>
          </div>
          {(!variants || variants.length === 0) ? (
            <div className="admin-empty">
              <h3>Sin variantes</h3>
              <p>Crea variantes para gestionar stock por opcion.</p>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Producto</th>
                    <th>Variante</th>
                    <th>SKU</th>
                    <th>Stock</th>
                  </tr>
                </thead>
                <tbody>
                  {variants.map((v) => (
                    <tr key={v.id}>
                      <td style={{ fontWeight: 500 }}>{productNames.get(v.product_id) || v.product_id}</td>
                      <td>{v.name}</td>
                      <td className="mono" style={{ fontSize: 12 }}>{v.sku || '—'}</td>
                      <td className="mono" style={{ fontWeight: 600, color: v.stock <= 5 ? '#dc2626' : undefined }}>
                        {v.stock}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="admin-card">
          <div className="admin-card-header">
            <h3 className="admin-card-title">Movimientos recientes</h3>
          </div>
          {typedMovements.length === 0 ? (
            <div className="admin-empty">
              <h3>Sin movimientos</h3>
              <p>Los movimientos de inventario apareceran aqui.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {typedMovements.map((m) => (
                <div key={m.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid var(--border-soft)' }}>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 500 }}>
                      {movementLabel(m)}
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--text-faint)' }}>
                      {m.reason} {m.reference ? `#${m.reference}` : ''}
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span className="mono" style={{ fontWeight: 600, color: m.quantity > 0 ? '#16a34a' : '#dc2626' }}>
                      {m.quantity > 0 ? '+' : ''}{m.quantity}
                    </span>
                    <span style={{ fontSize: 11, color: 'var(--text-faint)' }}>
                      {new Date(m.created_at).toLocaleDateString('es-PE')}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

import { requireAdmin } from '@/lib/supabase/admin';
import { formatPrice } from '@/lib/format';
import Link from 'next/link';
import { PlusIcon } from '@/components/admin/AdminIcons';
import { AdminProductActions } from '@/components/admin/AdminProductActions';

export const dynamic = 'force-dynamic';

export default async function AdminProductsPage() {
  const { serviceClient } = await requireAdmin();

  const { data: products, error: productsError } = await serviceClient
    .from('products')
    .select('*')
    .order('id');

  const { data: variants } = await serviceClient
    .from('product_variants')
    .select('product_id, stock');

  const stockByProduct = new Map<number, number>();
  for (const v of variants || []) {
    const pid = v.product_id;
    stockByProduct.set(pid, (stockByProduct.get(pid) || 0) + v.stock);
  }

  if (productsError) {
    console.error('Error fetching products:', productsError);
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h2 style={{ fontSize: 24, fontWeight: 700, margin: 0 }}>Productos</h2>
          <p style={{ color: 'var(--text-faint)', margin: '4px 0 0', fontSize: 14 }}>
            {products?.length || 0} productos en total
          </p>
        </div>
        <Link href="/admin/productos/nuevo" className="admin-btn" data-variant="primary">
          <PlusIcon size={18} />
          Nuevo producto
        </Link>
      </div>

      {productsError && (
        <div style={{ padding: 16, background: '#fee2e2', color: '#991b1b', borderRadius: 12, marginBottom: 16 }}>
          Error al cargar productos: {productsError.message}
        </div>
      )}

      <div className="admin-card" style={{ padding: 0, overflow: 'hidden' }}>
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
              {(products || []).map((product) => (
                <tr key={product.id}>
                  <td className="mono">{product.id}</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <img
                        src={product.image}
                        alt={product.name}
                        style={{ width: 40, height: 40, borderRadius: 8, objectFit: 'cover', background: 'var(--graphite-100)' }}
                      />
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
                  <td className="mono">{stockByProduct.get(product.id) ?? 0}</td>
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
                    <AdminProductActions productId={product.id} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

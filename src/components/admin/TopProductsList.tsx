import { formatPrice } from '@/lib/format';

interface Product {
  id: number;
  name: string;
  price: number;
  cat: string;
}

export function TopProductsList({ products }: { products: Product[] }) {
  if (!products.length) {
    return (
      <div className="admin-empty">
        <h3>Sin productos</h3>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {products.map((p) => (
        <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid var(--border-soft)' }}>
          <div>
            <div style={{ fontSize: 14, fontWeight: 500 }}>{p.name}</div>
            <div style={{ fontSize: 12, color: 'var(--text-faint)' }}>{p.cat}</div>
          </div>
          <div className="mono" style={{ fontWeight: 600 }}>{formatPrice(p.price)}</div>
        </div>
      ))}
    </div>
  );
}

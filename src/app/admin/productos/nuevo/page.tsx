import { ProductForm } from '@/components/admin/ProductForm';

export default function NewProductPage() {
  return (
    <div style={{ maxWidth: 700 }}>
      <h2 style={{ fontSize: 24, fontWeight: 700, margin: '0 0 24px' }}>Nuevo producto</h2>
      <div className="admin-card">
        <ProductForm />
      </div>
    </div>
  );
}

import { notFound } from 'next/navigation';
import { requireAdmin } from '@/lib/supabase/admin';
import { ProductForm } from '@/components/admin/ProductForm';

export const dynamic = 'force-dynamic';

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { serviceClient } = await requireAdmin();

  const { data: product } = await serviceClient
    .from('products')
    .select('*')
    .eq('id', Number(id))
    .single();

  if (!product) notFound();

  return (
    <div style={{ maxWidth: 700 }}>
      <h2 style={{ fontSize: 24, fontWeight: 700, margin: '0 0 24px' }}>
        Editar: {product.name}
      </h2>
      <div className="admin-card">
        <ProductForm initialData={product} />
      </div>
    </div>
  );
}

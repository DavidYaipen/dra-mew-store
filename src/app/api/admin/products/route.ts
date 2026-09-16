import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { requireAdmin } from '@/lib/supabase/admin';
import { isForeignKeyViolation } from '@/lib/supabase/errors';

function revalidateStorefront() {
  revalidatePath('/');
  revalidatePath('/productos');
  revalidatePath('/producto/[id]', 'page');
  revalidatePath('/categoria/[slug]', 'page');
}

export async function GET() {
  const { serviceClient } = await requireAdmin();
  const { data, error } = await serviceClient.from('products').select('*').order('id');
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(request: NextRequest) {
  const { serviceClient } = await requireAdmin();
  const body = await request.json();

  const { data, error } = await serviceClient
    .from('products')
    .insert({
      ...(body.id != null ? { id: body.id } : {}),
      name: body.name,
      cat: body.cat,
      price: body.price,
      old_price: body.old_price,
      rating: body.rating,
      image: body.image,
      tint: body.tint,
      badge: body.badge,
      is_featured: body.is_featured,
      stock: body.stock ?? null,
      is_preorder: body.is_preorder ?? false,
      preorder_note: body.preorder_note ?? null,
    })
    .select('id');

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  if (!data?.length) {
    return NextResponse.json({ error: 'No se pudo crear el producto' }, { status: 500 });
  }
  revalidateStorefront();
  return NextResponse.json({ ok: true, id: data[0].id });
}

export async function PUT(request: NextRequest) {
  const { serviceClient } = await requireAdmin();
  const body = await request.json();
  const { id, stock: newStock, ...updates } = body;

  if (newStock !== undefined) {
    const { data: currentProduct, error: currentError } = await serviceClient
      .from('products')
      .select('stock')
      .eq('id', id)
      .single();

    if (currentError || !currentProduct) {
      return NextResponse.json({ error: 'No se encontro el producto' }, { status: 404 });
    }

    const oldStock: number | null = currentProduct.stock;

    if (newStock !== oldStock) {
      if (oldStock !== null && newStock !== null) {
        // Ajuste entre dos valores rastreados: pasa por el cárdex atómico.
        const { error: rpcError } = await serviceClient.rpc('register_inventory_movement' as never, {
          p_product_id: id,
          p_variant_id: null,
          p_quantity: newStock - oldStock,
          p_reason: 'adjustment',
          p_reference: null,
        } as never);
        if (rpcError) return NextResponse.json({ error: rpcError.message }, { status: 400 });
      } else {
        // Activar o desactivar el rastreo de stock: no hay delta que
        // proteger de forma atómica, así que se fija el valor directo y se
        // deja constancia en el cárdex.
        const { error: setError } = await serviceClient
          .from('products')
          .update({ stock: newStock })
          .eq('id', id);
        if (setError) return NextResponse.json({ error: setError.message }, { status: 500 });

        if (newStock !== null) {
          await serviceClient.from('inventory_movements').insert({
            product_id: id,
            variant_id: null,
            quantity: newStock,
            reason: 'adjustment',
            reference: null,
          });
        }
      }
    }
  }

  const { data, error } = await serviceClient
    .from('products')
    .update(updates)
    .eq('id', id)
    .select('id');

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  if (!data?.length) {
    return NextResponse.json({ error: 'No se encontro el producto' }, { status: 404 });
  }
  revalidateStorefront();
  return NextResponse.json({ ok: true });
}

export async function DELETE(request: NextRequest) {
  const { serviceClient } = await requireAdmin();
  const url = new URL(request.url);
  const id = url.searchParams.get('id');

  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });

  const { data, error } = await serviceClient
    .from('products')
    .delete()
    .eq('id', Number(id))
    .select('id');
  if (error) {
    if (isForeignKeyViolation(error)) {
      return NextResponse.json(
        { error: 'No se puede eliminar: este producto tiene pedidos asociados.' },
        { status: 409 },
      );
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  if (!data?.length) {
    return NextResponse.json({ error: 'No se encontro el producto' }, { status: 404 });
  }
  revalidateStorefront();
  return NextResponse.json({ ok: true });
}

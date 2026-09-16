import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { requireAdmin } from '@/lib/supabase/admin';

function revalidateBinder() {
  revalidatePath('/binder');
  revalidatePath('/binder/[id]', 'page');
}

export async function POST(request: NextRequest) {
  const { serviceClient } = await requireAdmin();
  const body = await request.json();

  const { data, error } = await serviceClient
    .from('binder_listings')
    .insert({
      card_id: body.card_id,
      finish: body.finish,
      condition: body.condition,
      price: body.price,
      stock: body.stock ?? 0,
      sku: body.sku || null,
      is_preorder: body.is_preorder ?? false,
    })
    .select('id');

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  if (!data?.length) {
    return NextResponse.json({ error: 'No se pudo crear el listing' }, { status: 500 });
  }
  revalidateBinder();
  return NextResponse.json({ ok: true, id: data[0].id });
}

export async function PUT(request: NextRequest) {
  const { serviceClient } = await requireAdmin();
  const body = await request.json();
  const { id, stock: newStock, ...updates } = body;

  if (newStock !== undefined) {
    const { data: current, error: currentError } = await serviceClient
      .from('binder_listings')
      .select('stock')
      .eq('id', id)
      .single();

    if (currentError || !current) {
      return NextResponse.json({ error: 'No se encontro el listing' }, { status: 404 });
    }

    const delta = newStock - current.stock;
    if (delta !== 0) {
      const { error: rpcError } = await serviceClient.rpc('register_binder_movement' as never, {
        p_listing_id: id,
        p_quantity: delta,
        p_reason: 'adjustment',
        p_reference: null,
      } as never);
      if (rpcError) return NextResponse.json({ error: rpcError.message }, { status: 400 });
    }
  }

  const fields: Record<string, unknown> = {};
  if (updates.finish !== undefined) fields.finish = updates.finish;
  if (updates.condition !== undefined) fields.condition = updates.condition;
  if (updates.price !== undefined) fields.price = updates.price;
  if (updates.sku !== undefined) fields.sku = updates.sku || null;
  if (updates.is_preorder !== undefined) fields.is_preorder = updates.is_preorder;

  if (Object.keys(fields).length > 0) {
    const { error } = await serviceClient.from('binder_listings').update(fields).eq('id', id);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  }

  revalidateBinder();
  return NextResponse.json({ ok: true });
}

export async function DELETE(request: NextRequest) {
  const { serviceClient } = await requireAdmin();
  const url = new URL(request.url);
  const id = url.searchParams.get('id');

  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });

  const { data, error } = await serviceClient.from('binder_listings').delete().eq('id', id).select('id');
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  if (!data?.length) {
    return NextResponse.json({ error: 'No se encontro el listing' }, { status: 404 });
  }
  revalidateBinder();
  return NextResponse.json({ ok: true });
}

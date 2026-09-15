import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { requireAdmin } from '@/lib/supabase/admin';

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
      id: body.id,
      name: body.name,
      cat: body.cat,
      price: body.price,
      old_price: body.old_price,
      rating: body.rating,
      image: body.image,
      tint: body.tint,
      badge: body.badge,
      is_featured: body.is_featured,
    })
    .select('id');

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  if (!data?.length) {
    return NextResponse.json({ error: 'No se pudo crear el producto' }, { status: 500 });
  }
  revalidateStorefront();
  return NextResponse.json({ ok: true });
}

export async function PUT(request: NextRequest) {
  const { serviceClient } = await requireAdmin();
  const body = await request.json();
  const { id, ...updates } = body;

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
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  if (!data?.length) {
    return NextResponse.json({ error: 'No se encontro el producto' }, { status: 404 });
  }
  revalidateStorefront();
  return NextResponse.json({ ok: true });
}

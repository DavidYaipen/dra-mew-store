import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { requireAdmin } from '@/lib/supabase/admin';

function revalidateBinder() {
  revalidatePath('/binder');
  revalidatePath('/binder/[id]', 'page');
}

export async function GET() {
  const { serviceClient } = await requireAdmin();
  const { data, error } = await serviceClient
    .from('binder_cards')
    .select('*, binder_listings(*)')
    .order('name');
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(request: NextRequest) {
  const { serviceClient } = await requireAdmin();
  const body = await request.json();

  const { data: card, error: cardError } = await serviceClient
    .from('binder_cards')
    .insert({
      name: body.name,
      collection: body.collection,
      card_number: body.card_number || null,
      image: body.image || null,
    })
    .select('id')
    .single();

  if (cardError) return NextResponse.json({ error: cardError.message }, { status: 500 });

  if (Array.isArray(body.listings) && body.listings.length > 0) {
    const listings = body.listings.map((l: Record<string, unknown>) => ({
      card_id: card.id,
      finish: l.finish,
      condition: l.condition,
      price: l.price,
      stock: l.stock ?? 0,
      sku: l.sku || null,
      is_preorder: l.is_preorder ?? false,
    }));
    const { error: listingsError } = await serviceClient.from('binder_listings').insert(listings);
    if (listingsError) return NextResponse.json({ error: listingsError.message }, { status: 500 });
  }

  revalidateBinder();
  return NextResponse.json({ ok: true, id: card.id });
}

export async function PUT(request: NextRequest) {
  const { serviceClient } = await requireAdmin();
  const body = await request.json();
  const { id, ...updates } = body;

  const { data, error } = await serviceClient
    .from('binder_cards')
    .update({
      name: updates.name,
      collection: updates.collection,
      card_number: updates.card_number || null,
      image: updates.image || null,
    })
    .eq('id', id)
    .select('id');

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  if (!data?.length) {
    return NextResponse.json({ error: 'No se encontro la carta' }, { status: 404 });
  }
  revalidateBinder();
  return NextResponse.json({ ok: true });
}

export async function DELETE(request: NextRequest) {
  const { serviceClient } = await requireAdmin();
  const url = new URL(request.url);
  const id = url.searchParams.get('id');

  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });

  const { data, error } = await serviceClient.from('binder_cards').delete().eq('id', id).select('id');
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  if (!data?.length) {
    return NextResponse.json({ error: 'No se encontro la carta' }, { status: 404 });
  }
  revalidateBinder();
  return NextResponse.json({ ok: true });
}

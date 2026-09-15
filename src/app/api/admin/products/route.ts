import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/supabase/admin';

export async function GET() {
  const { supabase } = await requireAdmin();
  const { data, error } = await supabase.from('products').select('*').order('id');
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(request: NextRequest) {
  const { supabase } = await requireAdmin();
  const body = await request.json();

  const { error } = await supabase.from('products').insert({
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
  });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}

export async function PUT(request: NextRequest) {
  const { supabase } = await requireAdmin();
  const body = await request.json();
  const { id, ...updates } = body;

  const { error } = await supabase
    .from('products')
    .update(updates)
    .eq('id', id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}

export async function DELETE(request: NextRequest) {
  const { supabase } = await requireAdmin();
  const url = new URL(request.url);
  const id = url.searchParams.get('id');

  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });

  const { error } = await supabase.from('products').delete().eq('id', Number(id));
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}

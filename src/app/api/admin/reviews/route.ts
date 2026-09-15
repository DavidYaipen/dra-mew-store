import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { requireAdmin } from '@/lib/supabase/admin';

export async function PATCH(request: NextRequest) {
  const { serviceClient } = await requireAdmin();
  const body = await request.json();

  const { data, error } = await serviceClient
    .from('reviews')
    .update({ approved: body.approved })
    .eq('id', body.id)
    .select('id');

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  if (!data?.length) {
    return NextResponse.json({ error: 'No se encontro la resena' }, { status: 404 });
  }
  revalidatePath('/reseñas');
  return NextResponse.json({ ok: true });
}

export async function DELETE(request: NextRequest) {
  const { serviceClient } = await requireAdmin();
  const url = new URL(request.url);
  const id = url.searchParams.get('id');

  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });

  const { data, error } = await serviceClient.from('reviews').delete().eq('id', id).select('id');
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  if (!data?.length) {
    return NextResponse.json({ error: 'No se encontro la resena' }, { status: 404 });
  }
  revalidatePath('/reseñas');
  return NextResponse.json({ ok: true });
}

import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { requireAdmin } from '@/lib/supabase/admin';
import { isForeignKeyViolation } from '@/lib/supabase/errors';

function revalidateStorefront() {
  revalidatePath('/checkout');
  revalidatePath('/ayuda');
}

export async function GET() {
  const { serviceClient } = await requireAdmin();
  const { data, error } = await serviceClient
    .from('pickup_points')
    .select('*')
    .order('display_order', { ascending: true });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(request: NextRequest) {
  const { serviceClient } = await requireAdmin();
  const body = await request.json();

  const { data, error } = await serviceClient
    .from('pickup_points')
    .insert({
      name: body.name,
      address: body.address,
      schedule: body.schedule || null,
      notes: body.notes || null,
      display_order: Number(body.display_order) || 0,
    })
    .select('id');

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  if (!data?.length) {
    return NextResponse.json({ error: 'No se pudo crear el punto de recojo' }, { status: 500 });
  }
  revalidateStorefront();
  return NextResponse.json({ ok: true });
}

export async function PATCH(request: NextRequest) {
  const { serviceClient } = await requireAdmin();
  const body = await request.json();

  if (!body.id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });

  const update: Record<string, unknown> = {};
  if ('name' in body) update.name = body.name;
  if ('address' in body) update.address = body.address;
  if ('schedule' in body) update.schedule = body.schedule || null;
  if ('notes' in body) update.notes = body.notes || null;
  if ('display_order' in body) update.display_order = Number(body.display_order) || 0;
  if ('active' in body) update.active = body.active;

  const { data, error } = await serviceClient
    .from('pickup_points')
    .update(update)
    .eq('id', body.id)
    .select('id');

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  if (!data?.length) {
    return NextResponse.json({ error: 'No se encontro el punto de recojo' }, { status: 404 });
  }
  revalidateStorefront();
  return NextResponse.json({ ok: true });
}

export async function DELETE(request: NextRequest) {
  const { serviceClient } = await requireAdmin();
  const url = new URL(request.url);
  const id = url.searchParams.get('id');

  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });

  const { data, error } = await serviceClient.from('pickup_points').delete().eq('id', id).select('id');
  if (error) {
    if (isForeignKeyViolation(error)) {
      return NextResponse.json(
        { error: 'No se puede eliminar: este punto esta asociado a pedidos existentes. Desactivalo en su lugar.' },
        { status: 409 },
      );
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  if (!data?.length) {
    return NextResponse.json({ error: 'No se encontro el punto de recojo' }, { status: 404 });
  }
  revalidateStorefront();
  return NextResponse.json({ ok: true });
}

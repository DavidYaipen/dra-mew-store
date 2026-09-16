import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/supabase/admin';
import { isForeignKeyViolation } from '@/lib/supabase/errors';

export async function GET() {
  const { serviceClient } = await requireAdmin();
  const { data, error } = await serviceClient.from('coupons').select('*').order('created_at', { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(request: NextRequest) {
  const { serviceClient } = await requireAdmin();
  const body = await request.json();

  const { data, error } = await serviceClient
    .from('coupons')
    .insert({
      code: body.code,
      discount_type: body.discount_type,
      discount_value: body.discount_value,
      min_order: body.min_order || 0,
      max_uses: body.max_uses,
      valid_until: body.valid_until || null,
    })
    .select('id');

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  if (!data?.length) {
    return NextResponse.json({ error: 'No se pudo crear el cupon' }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}

export async function PATCH(request: NextRequest) {
  const { serviceClient } = await requireAdmin();
  const body = await request.json();

  const { data, error } = await serviceClient
    .from('coupons')
    .update({ active: body.active })
    .eq('id', body.id)
    .select('id');

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  if (!data?.length) {
    return NextResponse.json({ error: 'No se encontro el cupon' }, { status: 404 });
  }
  return NextResponse.json({ ok: true });
}

export async function DELETE(request: NextRequest) {
  const { serviceClient } = await requireAdmin();
  const url = new URL(request.url);
  const id = url.searchParams.get('id');

  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });

  const { data, error } = await serviceClient.from('coupons').delete().eq('id', id).select('id');
  if (error) {
    if (isForeignKeyViolation(error)) {
      return NextResponse.json(
        { error: 'No se puede eliminar: este cupon esta siendo usado en pedidos existentes.' },
        { status: 409 },
      );
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  if (!data?.length) {
    return NextResponse.json({ error: 'No se encontro el cupon' }, { status: 404 });
  }
  return NextResponse.json({ ok: true });
}

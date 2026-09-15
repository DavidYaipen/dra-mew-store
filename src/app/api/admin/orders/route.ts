import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/supabase/admin';

export async function GET() {
  const { serviceClient } = await requireAdmin();
  const { data, error } = await serviceClient
    .from('orders')
    .select('*, customers(name, email)')
    .order('created_at', { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function PATCH(request: NextRequest) {
  const { serviceClient } = await requireAdmin();
  const body = await request.json();

  const { data, error } = await serviceClient
    .from('orders')
    .update({ status: body.status, updated_at: new Date().toISOString() })
    .eq('id', body.id)
    .select('id');

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  if (!data?.length) {
    return NextResponse.json({ error: 'No se encontro el pedido' }, { status: 404 });
  }
  return NextResponse.json({ ok: true });
}

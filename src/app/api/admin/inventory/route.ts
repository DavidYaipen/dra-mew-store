import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/supabase/admin';

export async function POST(request: NextRequest) {
  const { serviceClient } = await requireAdmin();
  const body = await request.json();

  const { error } = await serviceClient.rpc('register_inventory_movement' as never, {
    p_product_id: body.product_id,
    p_variant_id: body.variant_id ?? null,
    p_quantity: body.quantity,
    p_reason: body.reason,
    p_reference: body.reference ?? null,
  } as never);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}

export async function GET() {
  const { serviceClient } = await requireAdmin();
  const { data, error } = await serviceClient
    .from('inventory_movements')
    .select('*, products(name)')
    .order('created_at', { ascending: false })
    .limit(100);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/supabase/admin';
import { PAYMENT_STATUSES } from '@/lib/orderStatus';

// El stock se descuenta al crear el pedido (en /api/checkout), no al
// confirmarlo, así que 'pending' ya cuenta como estado que retiene stock.
// Solo cancelado/reembolsado libera el stock reservado.
const RESTORE_STATUSES = ['cancelled', 'refunded'];

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

  if (!body.status && !body.customer && !body.shipping_address && !body.payment_status) {
    return NextResponse.json({ error: 'Nada para actualizar' }, { status: 400 });
  }

  if (body.payment_status) {
    if (!PAYMENT_STATUSES.includes(body.payment_status)) {
      return NextResponse.json({ error: 'payment_status inválido' }, { status: 400 });
    }
    const { error } = await serviceClient
      .from('orders')
      .update({ payment_status: body.payment_status, updated_at: new Date().toISOString() })
      .eq('id', body.id);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (body.status) {
    const { data: current, error: currentError } = await serviceClient
      .from('orders')
      .select('status')
      .eq('id', body.id)
      .single();

    if (currentError || !current) {
      return NextResponse.json({ error: 'No se encontro el pedido' }, { status: 404 });
    }

    if (body.status !== current.status) {
      const direction = RESTORE_STATUSES.includes(body.status) ? 'restore' : 'decrement';
      const { error: stockError } = await serviceClient.rpc(
        'apply_order_stock_change' as never,
        { p_order_id: body.id, p_direction: direction } as never,
      );
      if (stockError) return NextResponse.json({ error: stockError.message }, { status: 400 });
    }

    const { data, error } = await serviceClient
      .from('orders')
      .update({ status: body.status, updated_at: new Date().toISOString() })
      .eq('id', body.id)
      .select('id');

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    if (!data?.length) {
      return NextResponse.json({ error: 'No se encontro el pedido' }, { status: 404 });
    }
  }

  if (body.customer) {
    const { data: order, error: orderError } = await serviceClient
      .from('orders')
      .select('customer_id')
      .eq('id', body.id)
      .single();

    if (orderError || !order) {
      return NextResponse.json({ error: 'No se encontro el pedido' }, { status: 404 });
    }

    const customerFields = {
      name: body.customer.name,
      phone: body.customer.phone,
      email: body.customer.email || null,
    };

    if (order.customer_id) {
      const { error } = await serviceClient
        .from('customers')
        .update(customerFields)
        .eq('id', order.customer_id);
      if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    } else {
      const { data: customer, error: insertError } = await serviceClient
        .from('customers')
        .insert(customerFields)
        .select('id')
        .single();
      if (insertError) return NextResponse.json({ error: insertError.message }, { status: 500 });

      const { error: linkError } = await serviceClient
        .from('orders')
        .update({ customer_id: customer.id })
        .eq('id', body.id);
      if (linkError) return NextResponse.json({ error: linkError.message }, { status: 500 });
    }
  }

  if (body.shipping_address) {
    const { error } = await serviceClient
      .from('orders')
      .update({ shipping_address: body.shipping_address })
      .eq('id', body.id);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}

export async function DELETE(request: NextRequest) {
  const { serviceClient } = await requireAdmin();
  const url = new URL(request.url);
  const id = url.searchParams.get('id');

  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });

  const { data: order, error: orderError } = await serviceClient
    .from('orders')
    .select('stock_applied')
    .eq('id', id)
    .single();

  if (orderError || !order) {
    return NextResponse.json({ error: 'No se encontro el pedido' }, { status: 404 });
  }

  if (order.stock_applied) {
    const { error: stockError } = await serviceClient.rpc(
      'apply_order_stock_change' as never,
      { p_order_id: id, p_direction: 'restore' } as never,
    );
    if (stockError) return NextResponse.json({ error: stockError.message }, { status: 400 });
  }

  const { data, error } = await serviceClient.from('orders').delete().eq('id', id).select('id');
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  if (!data?.length) {
    return NextResponse.json({ error: 'No se encontro el pedido' }, { status: 404 });
  }
  return NextResponse.json({ ok: true });
}

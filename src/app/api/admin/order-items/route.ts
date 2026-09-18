import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/supabase/admin';
import type { SupabaseClient } from '@supabase/supabase-js';

// Solo se puede editar mientras el pedido no ha avanzado más allá de
// "confirmado" (pago recibido) — una vez en procesamiento/enviado/etc. los
// productos quedan fijos.
const EDITABLE_STATUSES = ['pending', 'confirmed'];

interface OrderItemRow {
  id: string;
  order_id: string;
  product_id: number | null;
  variant_id: string | null;
  binder_listing_id: string | null;
  quantity: number;
  price: number;
  is_preorder: boolean;
}

interface OrderRow {
  id: string;
  status: string;
  stock_applied: boolean;
  discount: number;
  shipping_cost: number;
}

async function restoreStock(serviceClient: SupabaseClient, item: OrderItemRow, quantity: number) {
  if (quantity <= 0) return { error: null as string | null };

  if (item.binder_listing_id) {
    if (item.is_preorder) return { error: null };
    const { error } = await serviceClient.rpc('register_binder_movement' as never, {
      p_listing_id: item.binder_listing_id,
      p_quantity: quantity,
      p_reason: 'return',
      p_reference: item.order_id,
    } as never);
    return { error: error?.message ?? null };
  }

  const { error } = await serviceClient.rpc('register_inventory_movement' as never, {
    p_product_id: item.product_id,
    p_variant_id: item.variant_id,
    p_quantity: quantity,
    p_reason: 'return',
    p_reference: item.order_id,
  } as never);
  return { error: error?.message ?? null };
}

async function recalcOrderTotals(serviceClient: SupabaseClient, order: OrderRow) {
  const { data: remaining, error } = await serviceClient
    .from('order_items')
    .select('price, quantity')
    .eq('order_id', order.id);
  if (error) return { error: error.message };

  const newSubtotal = (remaining ?? []).reduce((sum, i) => sum + i.price * i.quantity, 0);
  const newDiscount = Math.min(order.discount, newSubtotal);
  const newTotal = Math.max(0, newSubtotal - newDiscount + order.shipping_cost);

  const { error: updateError } = await serviceClient
    .from('orders')
    .update({
      subtotal: newSubtotal,
      discount: newDiscount,
      total: newTotal,
      updated_at: new Date().toISOString(),
    })
    .eq('id', order.id);

  return { error: updateError?.message ?? null };
}

async function loadItemAndOrder(serviceClient: SupabaseClient, itemId: string) {
  const { data: item, error: itemError } = await serviceClient
    .from('order_items')
    .select('id, order_id, product_id, variant_id, binder_listing_id, quantity, price, is_preorder')
    .eq('id', itemId)
    .single();
  if (itemError || !item) return { item: null, order: null, error: 'No se encontró el producto del pedido' };

  const { data: order, error: orderError } = await serviceClient
    .from('orders')
    .select('id, status, stock_applied, discount, shipping_cost')
    .eq('id', item.order_id)
    .single();
  if (orderError || !order) return { item: null, order: null, error: 'No se encontró el pedido' };

  return { item: item as OrderItemRow, order: order as OrderRow, error: null };
}

export async function PATCH(request: NextRequest) {
  const { serviceClient } = await requireAdmin();
  const body = await request.json();
  const { id, quantity } = body as { id?: string; quantity?: number };

  if (!id || !Number.isInteger(quantity)) {
    return NextResponse.json({ error: 'Datos inválidos' }, { status: 400 });
  }

  const { item, order, error } = await loadItemAndOrder(serviceClient, id);
  if (error || !item || !order) return NextResponse.json({ error }, { status: 404 });

  if (!EDITABLE_STATUSES.includes(order.status)) {
    return NextResponse.json({ error: 'No se puede editar el pedido en este estado' }, { status: 400 });
  }
  if (quantity! < 1 || quantity! >= item.quantity) {
    return NextResponse.json(
      { error: "La cantidad debe ser menor a la actual; usa 'Quitar' para eliminar el producto" },
      { status: 400 },
    );
  }

  const delta = item.quantity - quantity!;
  if (order.stock_applied) {
    const { error: stockError } = await restoreStock(serviceClient, item, delta);
    if (stockError) return NextResponse.json({ error: stockError }, { status: 400 });
  }

  const { error: updateError } = await serviceClient
    .from('order_items')
    .update({ quantity })
    .eq('id', id);
  if (updateError) return NextResponse.json({ error: updateError.message }, { status: 500 });

  const { error: totalsError } = await recalcOrderTotals(serviceClient, order);
  if (totalsError) return NextResponse.json({ error: totalsError }, { status: 500 });

  return NextResponse.json({ ok: true });
}

export async function DELETE(request: NextRequest) {
  const { serviceClient } = await requireAdmin();
  const url = new URL(request.url);
  const id = url.searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });

  const { item, order, error } = await loadItemAndOrder(serviceClient, id);
  if (error || !item || !order) return NextResponse.json({ error }, { status: 404 });

  if (!EDITABLE_STATUSES.includes(order.status)) {
    return NextResponse.json({ error: 'No se puede editar el pedido en este estado' }, { status: 400 });
  }

  const { count } = await serviceClient
    .from('order_items')
    .select('id', { count: 'exact', head: true })
    .eq('order_id', order.id);
  if ((count ?? 0) <= 1) {
    return NextResponse.json(
      { error: 'No puedes eliminar el último producto del pedido; cancela el pedido completo en su lugar' },
      { status: 400 },
    );
  }

  if (order.stock_applied) {
    const { error: stockError } = await restoreStock(serviceClient, item, item.quantity);
    if (stockError) return NextResponse.json({ error: stockError }, { status: 400 });
  }

  const { error: deleteError } = await serviceClient.from('order_items').delete().eq('id', id);
  if (deleteError) return NextResponse.json({ error: deleteError.message }, { status: 500 });

  const { error: totalsError } = await recalcOrderTotals(serviceClient, order);
  if (totalsError) return NextResponse.json({ error: totalsError }, { status: 500 });

  return NextResponse.json({ ok: true });
}

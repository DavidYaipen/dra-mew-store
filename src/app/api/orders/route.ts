import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  const orderNumber = request.nextUrl.searchParams.get('order_number');
  const email = request.nextUrl.searchParams.get('email');

  if (!orderNumber || !email) {
    return NextResponse.json({ error: 'order_number y email requeridos' }, { status: 400 });
  }

  const supabase = await createClient();

  // Buscar customer por email
  const { data: customer } = await supabase
    .from('customers')
    .select('id')
    .eq('email', email)
    .single();

  if (!customer) {
    return NextResponse.json({ error: 'Cliente no encontrado' }, { status: 404 });
  }

  // Buscar order
  const { data: order, error } = await supabase
    .from('orders')
    .select('*')
    .eq('order_number', Number(orderNumber))
    .eq('customer_id', customer.id)
    .single();

  if (error || !order) {
    return NextResponse.json({ error: 'Pedido no encontrado' }, { status: 404 });
  }

  // Fetch items
  const { data: items } = await supabase
    .from('order_items')
    .select('*')
    .eq('order_id', order.id);

  return NextResponse.json({ ...order, items: items || [] });
}

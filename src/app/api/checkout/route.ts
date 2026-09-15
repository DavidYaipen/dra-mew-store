import { NextRequest, NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase/service';
import { WHATSAPP_PHONE } from '@/lib/constants';
import type { CheckoutPayload } from '@/lib/types';

const STORE_URL = 'https://dra-mew-store.vercel.app';

export async function POST(request: NextRequest) {
  try {
    const payload: CheckoutPayload = await request.json();
    const supabase = createServiceClient();

    // 1. Validar cupón si se proporciona
    let discount = 0;
    let couponId: string | undefined;
    if (payload.coupon_code) {
      const { data: coupon, error: couponError } = await supabase
        .from('coupons')
        .select('*')
        .eq('code', payload.coupon_code.toUpperCase())
        .eq('active', true)
        .single();

      if (couponError || !coupon) {
        return NextResponse.json({ error: 'Cupón no válido' }, { status: 400 });
      }

      const now = new Date();
      if (coupon.valid_until && new Date(coupon.valid_until) < now) {
        return NextResponse.json({ error: 'Cupón expirado' }, { status: 400 });
      }
      if (coupon.max_uses && coupon.used_count >= coupon.max_uses) {
        return NextResponse.json({ error: 'Cupón agotado' }, { status: 400 });
      }

      couponId = coupon.id;
    }

    // 2. Fetch productos del carrito para calcular precios reales
    const productIds = payload.cart.map((line) => line.id);
    const { data: products } = await supabase
      .from('products')
      .select('id, name, price, image')
      .in('id', productIds);

    if (!products) {
      return NextResponse.json({ error: 'Error al consultar productos' }, { status: 500 });
    }

    // 3. Calcular subtotal
    let subtotal = 0;
    const items = payload.cart.map((line) => {
      const product = products.find((p) => p.id === line.id);
      if (!product) throw new Error(`Producto ${line.id} no encontrado`);
      const itemTotal = product.price * line.qty;
      subtotal += itemTotal;
      return {
        product_id: product.id,
        name: product.name,
        price: product.price,
        quantity: line.qty,
        image: product.image,
      };
    });

    // 4. Recalcular descuento con subtotal real
    if (payload.coupon_code && couponId) {
      const { data: coupon } = await supabase
        .from('coupons')
        .select('discount_type, discount_value, min_order')
        .eq('id', couponId)
        .single();

      if (coupon) {
        const minOrder = (coupon as { min_order: number }).min_order ?? 0;
        if (subtotal < minOrder) {
          return NextResponse.json(
            { error: `El pedido mínimo para este cupón es S/ ${minOrder}` },
            { status: 400 },
          );
        }
        discount =
          coupon.discount_type === 'percentage'
            ? (subtotal * coupon.discount_value) / 100
            : coupon.discount_value;
      }
    }

    // 5. Calcular envío
    const shippingCost = subtotal >= 150 ? 0 : 14.90;
    const total = Math.max(0, subtotal - discount + shippingCost);

    // 6. Crear customer
    const { data: customer, error: customerError } = await supabase
      .from('customers')
      .upsert(
        { email: payload.customer.email, name: payload.customer.name, phone: payload.customer.phone },
        { onConflict: 'email' },
      )
      .select('id')
      .single();

    if (customerError) throw customerError;

    // 7. Crear order
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        customer_id: customer.id,
        subtotal,
        discount,
        shipping_cost: shippingCost,
        total,
        coupon_id: couponId ?? null,
        shipping_method: payload.shipping_method,
        shipping_address: payload.shipping_address,
        payment_method: payload.payment_method,
        notes: payload.notes,
      })
      .select('id, order_number')
      .single();

    if (orderError) throw orderError;

    // 8. Crear order items
    const orderItems = items.map((item) => ({
      order_id: order.id,
      ...item,
    }));

    const { error: itemsError } = await supabase.from('order_items').insert(orderItems);
    if (itemsError) throw itemsError;

    // 9. Actualizar uso del cupón
    if (couponId) {
      await supabase.rpc('increment_coupon_usage' as never, { coupon_id: couponId } as never);
    }

    // 10. Generar mensaje de WhatsApp
    const shippingLabel = payload.shipping_method === 'express' ? 'Express' : 'Delivery';
    const addressParts = [
      payload.shipping_address.street,
      payload.shipping_address.city,
      payload.shipping_address.state,
      payload.shipping_address.country,
    ].filter(Boolean);
    const fullAddress = addressParts.join(', ') || 'No especificada';

    const whatsappMessage = generateWhatsAppMessage({
      orderNumber: order.order_number,
      customerName: payload.customer.name,
      customerPhone: payload.customer.phone,
      customerEmail: payload.customer.email,
      shippingMethod: shippingLabel,
      address: fullAddress,
      items,
      subtotal,
      shippingCost,
      total,
    });

    const whatsappUrl = `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(whatsappMessage)}`;

    return NextResponse.json({
      order_id: order.id,
      order_number: order.order_number,
      total,
      whatsapp_url: whatsappUrl,
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : error && typeof error === 'object' && 'message' in error
          ? String(error.message)
          : 'Error al procesar el pedido';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

function generateWhatsAppMessage({
  orderNumber,
  customerName,
  customerPhone,
  customerEmail,
  shippingMethod,
  address,
  items,
  subtotal,
  shippingCost,
  total,
}: {
  orderNumber: number;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  shippingMethod: string;
  address: string;
  items: Array<{ name: string; price: number; quantity: number; product_id: number }>;
  subtotal: number;
  shippingCost: number;
  total: number;
}): string {
  const productLines = items
    .map((item) => {
      const itemTotal = (item.price * item.quantity).toFixed(2);
      const productUrl = `${STORE_URL}/producto/${item.product_id}`;
      return `• ${item.name} - ${item.quantity} un. - S/ ${itemTotal} - ${productUrl}`;
    })
    .join('\n');

  const shippingLine = shippingCost === 0 ? 'Gratis' : `S/ ${shippingCost.toFixed(2)}`;

  const lines = [
    `Hola! Acabo de realizar el siguiente pedido:`,
    ``,
    `Nombre: ${customerName}`,
    `Celular: ${customerPhone}`,
    `Pedido: OR-${String(orderNumber).padStart(6, '0')}`,
    `Método de entrega: ${shippingMethod}`,
    `Dirección: ${address}`,
    `Correo: ${customerEmail}`,
    ``,
    `Productos:`,
    productLines,
    ``,
    `Subtotal: S/ ${subtotal.toFixed(2)}`,
    `Envío: ${shippingLine}`,
    `Total: S/ ${total.toFixed(2)}`,
    ``,
    `Me gustaría saber los métodos de pago.`,
  ];

  return lines.join('\n');
}

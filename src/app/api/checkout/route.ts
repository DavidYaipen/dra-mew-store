import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createServiceClient } from '@/lib/supabase/service';
import { WHATSAPP_PHONE } from '@/lib/constants';
import { shippingCost } from '@/lib/cart';
import type { CheckoutPayload } from '@/lib/types';

const STORE_URL = 'https://dra-mew-store.vercel.app';

const VALID_SHIPPING_METHODS = ['standard', 'express', 'pickup'];

export async function POST(request: NextRequest) {
  try {
    const authClient = await createClient();
    const {
      data: { user },
    } = await authClient.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Debes iniciar sesión para completar el pedido.' }, { status: 401 });
    }

    const payload: CheckoutPayload = await request.json();
    if (!VALID_SHIPPING_METHODS.includes(payload.shipping_method)) {
      return NextResponse.json({ error: 'Método de envío no válido' }, { status: 400 });
    }
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

    // 2. Fetch productos y binder listings del carrito para calcular precios reales
    const productLines = payload.cart.filter((line) => (line.kind ?? 'product') === 'product');
    const binderLines = payload.cart.filter((line) => line.kind === 'binder');

    const productIds = productLines.map((line) => line.id);
    const { data: products } = productIds.length
      ? await supabase
          .from('products')
          .select('id, name, price, image, stock, is_preorder, max_qty_per_customer')
          .in('id', productIds)
      : {
          data: [] as Array<{
            id: number;
            name: string;
            price: number;
            image: string;
            stock: number | null;
            is_preorder: boolean;
            max_qty_per_customer: number | null;
          }>,
        };

    if (!products) {
      return NextResponse.json({ error: 'Error al consultar productos' }, { status: 500 });
    }

    interface BinderListingRow {
      id: string;
      price: number;
      stock: number;
      is_preorder: boolean;
      finish: string;
      condition: string;
      binder_cards: { name: string; image: string | null } | null;
    }

    const binderIds = binderLines.map((line) => line.id);
    const binderListingsResult = binderIds.length
      ? await supabase
          .from('binder_listings')
          .select('id, price, stock, is_preorder, finish, condition, binder_cards(name, image)')
          .in('id', binderIds)
      : { data: [] as BinderListingRow[], error: null };

    if (binderListingsResult.error || !binderListingsResult.data) {
      return NextResponse.json({ error: 'Error al consultar el binder' }, { status: 500 });
    }
    const binderListings = binderListingsResult.data as unknown as BinderListingRow[];

    // 2b. Validar disponibilidad (chequeo optimista y amigable; el descuento
    // real y la validación atómica final ocurren al llamar a
    // apply_order_stock_change más abajo). La preventa de productos ya no
    // se salta esta validación: su stock es real y limitado igual que
    // cualquier otro producto.
    for (const line of productLines) {
      const product = products.find((p) => p.id === line.id);
      if (product?.stock != null && product.stock < line.qty) {
        return NextResponse.json(
          { error: `Solo quedan ${product.stock} unidades de ${product.name} disponibles.` },
          { status: 400 },
        );
      }
    }
    for (const line of binderLines) {
      const listing = binderListings.find((l) => l.id === line.id);
      const listingName = listing?.binder_cards?.name ?? 'la carta';
      if (listing && !listing.is_preorder && listing.stock < line.qty) {
        return NextResponse.json(
          { error: `Solo quedan ${listing.stock} unidades de ${listingName} disponibles.` },
          { status: 400 },
        );
      }
    }

    // 3. Calcular subtotal
    let subtotal = 0;
    const productItems = productLines.map((line) => {
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
        is_preorder: product.is_preorder,
        url: `${STORE_URL}/producto/${product.id}`,
      };
    });
    const binderItems = binderLines.map((line) => {
      const listing = binderListings.find((l) => l.id === line.id);
      if (!listing) throw new Error(`Carta ${line.id} no encontrada`);
      const itemTotal = listing.price * line.qty;
      subtotal += itemTotal;
      const finishLabels: Record<string, string> = { comun: 'Común', holo: 'Holo', reverse: 'Reverse' };
      const finishLabel = finishLabels[listing.finish] ?? listing.finish;
      return {
        binder_listing_id: listing.id,
        name: `${listing.binder_cards?.name ?? 'Carta'} · ${finishLabel} · ${listing.condition}`,
        price: listing.price,
        quantity: line.qty,
        image: listing.binder_cards?.image ?? undefined,
        is_preorder: listing.is_preorder,
        url: `${STORE_URL}/binder`,
      };
    });
    const items = [...productItems, ...binderItems];

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
    const isPickup = payload.shipping_method === 'pickup';
    let pickupPoint: { id: string; name: string; address: string; schedule: string | null } | null = null;
    if (isPickup) {
      if (!payload.pickup_point_id) {
        return NextResponse.json({ error: 'Selecciona un punto de recojo.' }, { status: 400 });
      }
      const { data: point } = await supabase
        .from('pickup_points')
        .select('id, name, address, schedule')
        .eq('id', payload.pickup_point_id)
        .eq('active', true)
        .maybeSingle();
      if (!point) {
        return NextResponse.json(
          { error: 'El punto de recojo seleccionado ya no está disponible. Elige otro.' },
          { status: 400 },
        );
      }
      pickupPoint = point;
    }
    const shippingCostValue = shippingCost(payload.shipping_method);
    const total = Math.max(0, subtotal - discount + shippingCostValue);

    // 6. Crear/vincular customer: primero por user_id (cuenta ya vinculada);
    // si no existe, por email (cliente antiguo sin cuenta vinculada aún); si
    // tampoco existe, se crea de cero. `customers` tiene dos columnas UNIQUE
    // (email y user_id) y un solo upsert con onConflict solo cubre una de
    // las dos, así que se resuelve con esta búsqueda explícita.
    let customer: { id: string };

    const byUserId = await supabase.from('customers').select('id').eq('user_id', user.id).maybeSingle();
    if (byUserId.error) throw byUserId.error;

    if (byUserId.data) {
      const { data, error } = await supabase
        .from('customers')
        .update({ email: payload.customer.email, name: payload.customer.name, phone: payload.customer.phone })
        .eq('id', byUserId.data.id)
        .select('id')
        .single();
      if (error) throw error;
      customer = data;
    } else {
      const byEmail = await supabase
        .from('customers')
        .select('id')
        .eq('email', payload.customer.email)
        .maybeSingle();
      if (byEmail.error) throw byEmail.error;

      if (byEmail.data) {
        const { data, error } = await supabase
          .from('customers')
          .update({ user_id: user.id, name: payload.customer.name, phone: payload.customer.phone })
          .eq('id', byEmail.data.id)
          .select('id')
          .single();
        if (error) throw error;
        customer = data;
      } else {
        const { data, error } = await supabase
          .from('customers')
          .insert({
            user_id: user.id,
            email: payload.customer.email,
            name: payload.customer.name,
            phone: payload.customer.phone,
          })
          .select('id')
          .single();
        if (error) throw error;
        customer = data;
      }
    }

    // 6b. Límite de cantidad por cliente (acumulado entre todos sus pedidos
    // no cancelados/reembolsados). Solo aplica a productos con
    // max_qty_per_customer definido; el binder queda fuera de alcance.
    const limitedProducts = productLines
      .map((line) => ({ line, product: products.find((p) => p.id === line.id) }))
      .filter(
        (
          entry,
        ): entry is { line: (typeof productLines)[number]; product: NonNullable<typeof entry.product> } =>
          entry.product != null && entry.product.max_qty_per_customer != null,
      );

    if (limitedProducts.length) {
      const { data: pastOrders } = await supabase
        .from('orders')
        .select('id')
        .eq('customer_id', customer.id)
        .not('status', 'in', '(cancelled,refunded)');

      const pastOrderIds = (pastOrders ?? []).map((o) => o.id);
      const { data: pastItems } = pastOrderIds.length
        ? await supabase
            .from('order_items')
            .select('product_id, quantity')
            .in('order_id', pastOrderIds)
            .in(
              'product_id',
              limitedProducts.map((entry) => entry.product.id),
            )
        : { data: [] as Array<{ product_id: number | null; quantity: number }> };

      const pastQtyByProduct = new Map<number, number>();
      for (const item of pastItems ?? []) {
        if (item.product_id == null) continue;
        pastQtyByProduct.set(item.product_id, (pastQtyByProduct.get(item.product_id) ?? 0) + item.quantity);
      }

      for (const { line, product } of limitedProducts) {
        const max = product.max_qty_per_customer!;
        const alreadyOrdered = pastQtyByProduct.get(product.id) ?? 0;
        if (alreadyOrdered + line.qty > max) {
          const remaining = Math.max(0, max - alreadyOrdered);
          return NextResponse.json(
            {
              error:
                remaining > 0
                  ? `Ya pediste ${alreadyOrdered} unidad(es) de "${product.name}". Solo puedes pedir ${remaining} más (límite de ${max} por cliente).`
                  : `Ya alcanzaste el límite de ${max} unidad(es) de "${product.name}" por cliente.`,
            },
            { status: 400 },
          );
        }
      }
    }

    // 7. Crear order
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        customer_id: customer.id,
        subtotal,
        discount,
        shipping_cost: shippingCostValue,
        total,
        coupon_id: couponId ?? null,
        shipping_method: payload.shipping_method,
        pickup_point_id: isPickup ? pickupPoint!.id : null,
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
      product_id: 'product_id' in item ? item.product_id : undefined,
      binder_listing_id: 'binder_listing_id' in item ? item.binder_listing_id : undefined,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      image: item.image,
      is_preorder: item.is_preorder,
    }));

    const { error: itemsError } = await supabase.from('order_items').insert(orderItems);
    if (itemsError) throw itemsError;

    // 8b. Descontar stock real de forma atómica al momento del pedido (no
    // se espera a que un admin confirme). Si falla (p. ej. carrera con otro
    // pedido que agotó el stock), se revierte el pedido recién creado.
    const { error: stockError } = await supabase.rpc('apply_order_stock_change' as never, {
      p_order_id: order.id,
      p_direction: 'decrement',
    } as never);
    if (stockError) {
      await supabase.from('orders').delete().eq('id', order.id);
      return NextResponse.json(
        { error: 'Uno o más productos ya no tienen stock suficiente. Actualiza tu carrito e inténtalo de nuevo.' },
        { status: 409 },
      );
    }

    // 9. Actualizar uso del cupón
    if (couponId) {
      await supabase.rpc('increment_coupon_usage' as never, { coupon_id: couponId } as never);
    }

    // 10. Generar mensaje de WhatsApp
    const shippingLabel = isPickup
      ? `Recojo en ${pickupPoint!.name}`
      : payload.shipping_method === 'express'
        ? 'Express'
        : 'Delivery';
    const fullAddress = isPickup
      ? `${pickupPoint!.address}${pickupPoint!.schedule ? ` (${pickupPoint!.schedule})` : ''}`
      : [
          payload.shipping_address?.street,
          payload.shipping_address?.city,
          payload.shipping_address?.state,
          payload.shipping_address?.country,
        ]
          .filter(Boolean)
          .join(', ') || 'No especificada';

    const whatsappMessage = generateWhatsAppMessage({
      orderNumber: order.order_number,
      customerName: payload.customer.name,
      customerPhone: payload.customer.phone,
      customerEmail: payload.customer.email,
      shippingMethod: shippingLabel,
      address: fullAddress,
      items,
      subtotal,
      shippingCost: shippingCostValue,
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
  items: Array<{ name: string; price: number; quantity: number; url: string }>;
  subtotal: number;
  shippingCost: number;
  total: number;
}): string {
  const productLines = items
    .map((item) => {
      const itemTotal = (item.price * item.quantity).toFixed(2);
      return `• ${item.name} - ${item.quantity} un. - S/ ${itemTotal} - ${item.url}`;
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

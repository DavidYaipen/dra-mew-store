'use client';

import { useState, useEffect } from 'react';
import { useStore } from '@/store/useStore';
import { formatPrice } from '@/lib/format';
import { CouponInput } from '@/components/cart/CouponInput';
import styles from './page.module.css';

interface CouponData {
  code: string;
  discount_type: 'percentage' | 'fixed';
  discount_value: number;
}

interface OrderResult {
  order_id: string;
  order_number: number;
  total: number;
  whatsapp_url: string;
}

export default function CheckoutPage() {
  const { cart, subtotal, getProduct, showToast } = useStore();
  const [step, setStep] = useState<'data' | 'shipping' | 'payment' | 'confirming'>('data');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<OrderResult | null>(null);
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [appliedCoupon, setAppliedCoupon] = useState<CouponData | null>(null);

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    street: '',
    city: '',
    state: '',
    zip: '',
    country: 'Peru',
    shipping_method: 'standard',
    payment_method: 'whatsapp',
    notes: '',
  });

  const shippingCost = subtotal >= 150 ? 0 : 14.90;
  const total = Math.max(0, subtotal - couponDiscount + shippingCost);

  // Redirect to WhatsApp after order
  useEffect(() => {
    if (result?.whatsapp_url) {
      window.location.href = result.whatsapp_url;
    }
  }, [result]);

  function updateField(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit() {
    if (cart.length === 0) return;
    setLoading(true);
    setStep('confirming');

    try {
      const payload = {
        customer: { name: form.name, email: form.email, phone: form.phone },
        shipping_address: {
          name: form.name,
          street: form.street,
          city: form.city,
          state: form.state,
          zip: form.zip,
          country: form.country,
          phone: form.phone,
        },
        shipping_method: form.shipping_method,
        payment_method: form.payment_method,
        coupon_code: appliedCoupon?.code,
        notes: form.notes,
        cart,
      };

      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setResult(data);
      showToast('¡Pedido realizado con éxito!');
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Error al procesar';
      showToast(msg);
      setStep('payment');
    } finally {
      setLoading(false);
    }
  }

  if (cart.length === 0 && !result) {
    return (
      <div className={styles.empty}>
        <h1>Checkout</h1>
        <p>Tu carrito está vacío.</p>
      </div>
    );
  }

  if (result) {
    return (
      <div className={styles.page}>
        <div className={styles.result}>
          <div className={styles.checkIcon}>✓</div>
          <h1>¡Pedido confirmado!</h1>
          <div className={styles.orderNumber}>
            <span className={styles.orderLabel}>Número de pedido</span>
            <span className={styles.orderId}>OR-{String(result.order_number).padStart(6, '0')}</span>
          </div>
          <p className={styles.total}>Total: {formatPrice(result.total)}</p>
          <p className={styles.note} style={{ marginBottom: 16 }}>
            Redirigiendo a WhatsApp para confirmar tu pedido...
          </p>
          <a
            href={result.whatsapp_url}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.whatsappBtn}
          >
            Enviar pedido por WhatsApp
          </a>
          <p className={styles.note}>
            Guarda tu número de pedido para hacer seguimiento.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <h1 className={styles.heading}>Checkout</h1>

      <div className={styles.layout}>
        <div className={styles.form}>
          {/* Step indicator */}
          <div className={styles.steps}>
            <button
              type="button"
              className={`${styles.stepBtn} ${step === 'data' ? styles.active : ''}`}
              onClick={() => setStep('data')}
            >
              1. Datos
            </button>
            <button
              type="button"
              className={`${styles.stepBtn} ${step === 'shipping' ? styles.active : ''}`}
              onClick={() => setStep('shipping')}
            >
              2. Envío
            </button>
            <button
              type="button"
              className={`${styles.stepBtn} ${step === 'payment' ? styles.active : ''}`}
              onClick={() => setStep('payment')}
            >
              3. Pago
            </button>
          </div>

          {/* Step 1: Datos */}
          {step === 'data' && (
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>Tus datos</h2>
              <div className={styles.field}>
                <label>Nombre completo *</label>
                <input value={form.name} onChange={(e) => updateField('name', e.target.value)} required />
              </div>
              <div className={styles.fieldRow}>
                <div className={styles.field}>
                  <label>Email *</label>
                  <input type="email" value={form.email} onChange={(e) => updateField('email', e.target.value)} required />
                </div>
                <div className={styles.field}>
                  <label>Teléfono *</label>
                  <input type="tel" value={form.phone} onChange={(e) => updateField('phone', e.target.value)} required placeholder="956 455 973" />
                </div>
              </div>
              <button
                type="button"
                className={styles.nextBtn}
                onClick={() => setStep('shipping')}
                disabled={!form.name || !form.email || !form.phone}
              >
                Siguiente →
              </button>
            </div>
          )}

          {/* Step 2: Envío */}
          {step === 'shipping' && (
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>Dirección de envío</h2>
              <div className={styles.field}>
                <label>Dirección *</label>
                <input value={form.street} onChange={(e) => updateField('street', e.target.value)} required placeholder="Calle, número, urbanización" />
              </div>
              <div className={styles.fieldRow}>
                <div className={styles.field}>
                  <label>Ciudad *</label>
                  <input value={form.city} onChange={(e) => updateField('city', e.target.value)} required />
                </div>
                <div className={styles.field}>
                  <label>Provincia *</label>
                  <input value={form.state} onChange={(e) => updateField('state', e.target.value)} required />
                </div>
              </div>
              <div className={styles.fieldRow}>
                <div className={styles.field}>
                  <label>Código postal</label>
                  <input value={form.zip} onChange={(e) => updateField('zip', e.target.value)} />
                </div>
                <div className={styles.field}>
                  <label>País</label>
                  <input value={form.country} onChange={(e) => updateField('country', e.target.value)} />
                </div>
              </div>

              <h2 className={styles.sectionTitle}>Método de envío</h2>
              <div className={styles.radioGroup}>
                <label className={styles.radio}>
                  <input
                    type="radio"
                    name="shipping"
                    value="standard"
                    checked={form.shipping_method === 'standard'}
                    onChange={(e) => updateField('shipping_method', e.target.value)}
                  />
                  <span>Delivery — {shippingCost === 0 ? 'Gratis' : formatPrice(shippingCost)}</span>
                </label>
                <label className={styles.radio}>
                  <input
                    type="radio"
                    name="shipping"
                    value="express"
                    checked={form.shipping_method === 'express'}
                    onChange={(e) => updateField('shipping_method', e.target.value)}
                  />
                  <span>Express (1-2 días) — {formatPrice(shippingCost + 5)}</span>
                </label>
              </div>

              <div className={styles.btnRow}>
                <button type="button" className={styles.backBtn} onClick={() => setStep('data')}>
                  ← Atrás
                </button>
                <button
                  type="button"
                  className={styles.nextBtn}
                  onClick={() => setStep('payment')}
                  disabled={!form.street || !form.city || !form.state}
                >
                  Siguiente →
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Pago */}
          {step === 'payment' && (
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>Método de pago</h2>
              <div className={styles.radioGroup}>
                <label className={styles.radio}>
                  <input
                    type="radio"
                    name="payment"
                    value="whatsapp"
                    checked={form.payment_method === 'whatsapp'}
                    onChange={(e) => updateField('payment_method', e.target.value)}
                  />
                  <span>📱 WhatsApp — Coordinar pago directo</span>
                </label>
                <label className={styles.radio} aria-disabled="true">
                  <input type="radio" name="payment" value="card" disabled />
                  <span>💳 Tarjeta (próximamente)</span>
                </label>
                <label className={styles.radio} aria-disabled="true">
                  <input type="radio" name="payment" value="paypal" disabled />
                  <span>PayPal (próximamente)</span>
                </label>
              </div>

              <div className={styles.field}>
                <label>Notas (opcional)</label>
                <textarea value={form.notes} onChange={(e) => updateField('notes', e.target.value)} rows={3} placeholder="Instrucciones especiales, referencias de entrega..." />
              </div>

              <div className={styles.btnRow}>
                <button type="button" className={styles.backBtn} onClick={() => setStep('shipping')}>
                  ← Atrás
                </button>
                <button
                  type="button"
                  className={styles.confirmBtn}
                  onClick={handleSubmit}
                  disabled={loading}
                >
                  {loading ? 'Procesando...' : 'Confirmar pedido'}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Order summary sidebar */}
        <div className={styles.summary}>
          <h3 className={styles.summaryTitle}>Tu pedido</h3>
          {cart.map((line) => {
            const product = getProduct(line.id);
            if (!product) return null;
            return (
              <div key={line.id} className={styles.summaryItem}>
                <span className={styles.itemName}>
                  {product.name} × {line.qty}
                </span>
                <span>{formatPrice(product.price * line.qty)}</span>
              </div>
            );
          })}

          <div className={styles.couponSection}>
            <CouponInput
              subtotal={subtotal}
              onApply={(_coupon, discount) => setCouponDiscount(discount)}
              onRemove={() => { setCouponDiscount(0); setAppliedCoupon(null); }}
            />
          </div>

          <div className={styles.summaryRow}>
            <span>Subtotal</span>
            <span>{formatPrice(subtotal)}</span>
          </div>
          {couponDiscount > 0 && (
            <div className={styles.summaryRow}>
              <span>Descuento</span>
              <span className={styles.discount}>-{formatPrice(couponDiscount)}</span>
            </div>
          )}
          <div className={styles.summaryRow}>
            <span>Envío</span>
            <span>{shippingCost === 0 ? 'Gratis' : formatPrice(shippingCost)}</span>
          </div>
          <div className={styles.totalRow}>
            <span>Total</span>
            <span className={styles.total}>{formatPrice(total)}</span>
          </div>
          {subtotal >= 150 && (
            <div className={styles.freeShipping}>✓ Envío gratis por superar S/ 150</div>
          )}
        </div>
      </div>
    </div>
  );
}

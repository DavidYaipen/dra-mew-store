'use client';

import { useState } from 'react';
import type { Order } from '@/lib/types';
import { formatEuro } from '@/lib/format';
import styles from './page.module.css';

const STATUS_LABELS: Record<string, string> = {
  pending: 'Pendiente',
  confirmed: 'Confirmado',
  processing: 'Preparando envío',
  shipped: 'Enviado',
  delivered: 'Entregado',
  cancelled: 'Cancelado',
  refunded: 'Reembolsado',
};

const STATUS_STEPS = ['pending', 'confirmed', 'processing', 'shipped', 'delivered'];

export default function OrderTrackingPage() {
  const [orderNumber, setOrderNumber] = useState('');
  const [email, setEmail] = useState('');
  const [order, setOrder] = useState<Order | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSearch() {
    if (!orderNumber || !email) return;
    setLoading(true);
    setError('');
    setOrder(null);

    try {
      const res = await fetch(`/api/orders?order_number=${orderNumber}&email=${encodeURIComponent(email)}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setOrder(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Pedido no encontrado');
    } finally {
      setLoading(false);
    }
  }

  if (order) {
    const currentStep = STATUS_STEPS.indexOf(order.status);

    return (
      <div className={styles.page}>
        <h1 className={styles.title}>Pedido #{order.order_number}</h1>

        <div className={styles.progress}>
          {STATUS_STEPS.map((step, i) => (
            <div
              key={step}
              className={`${styles.progressStep} ${i <= currentStep ? styles.done : ''} ${i === currentStep ? styles.current : ''}`}
            >
              <div className={styles.dot} />
              <span className={styles.stepLabel}>{STATUS_LABELS[step]}</span>
            </div>
          ))}
        </div>

        <div className={styles.card}>
          <div className={styles.row}>
            <span>Estado</span>
            <span className={styles.statusBadge}>{STATUS_LABELS[order.status]}</span>
          </div>
          <div className={styles.row}>
            <span>Subtotal</span>
            <span>{formatEuro(order.subtotal)}</span>
          </div>
          {order.discount > 0 && (
            <div className={styles.row}>
              <span>Descuento</span>
              <span className={styles.discount}>-{formatEuro(order.discount)}</span>
            </div>
          )}
          <div className={styles.row}>
            <span>Envío</span>
            <span>{order.shipping_cost === 0 ? 'Gratis' : formatEuro(order.shipping_cost)}</span>
          </div>
          <div className={styles.totalRow}>
            <span>Total</span>
            <span>{formatEuro(order.total)}</span>
          </div>
        </div>

        {order.items && order.items.length > 0 && (
          <div className={styles.card}>
            <h3 className={styles.cardTitle}>Artículos</h3>
            {order.items.map((item) => (
              <div key={item.id} className={styles.item}>
                <span>{item.name} × {item.quantity}</span>
                <span>{formatEuro(item.price * item.quantity)}</span>
              </div>
            ))}
          </div>
        )}

        <button type="button" className={styles.backBtn} onClick={() => setOrder(null)}>
          ← Buscar otro pedido
        </button>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Seguimiento de pedido</h1>
      <p className={styles.subtitle}>Introduce tu número de pedido y email para ver el estado.</p>

      <div className={styles.searchCard}>
        <div className={styles.field}>
          <label>Número de pedido</label>
          <input
            type="number"
            value={orderNumber}
            onChange={(e) => setOrderNumber(e.target.value)}
            placeholder="Ej: 1234"
          />
        </div>
        <div className={styles.field}>
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="tu@email.com"
          />
        </div>
        {error && <div className={styles.error}>{error}</div>}
        <button
          type="button"
          className={styles.searchBtn}
          onClick={handleSearch}
          disabled={loading || !orderNumber || !email}
        >
          {loading ? 'Buscando...' : 'Buscar pedido'}
        </button>
      </div>
    </div>
  );
}

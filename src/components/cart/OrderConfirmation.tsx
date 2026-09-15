'use client';

import { formatEuro } from '@/lib/format';
import type { Order } from '@/lib/types';
import styles from './OrderConfirmation.module.css';

interface Props {
  order: Order;
}

const STATUS_LABELS: Record<string, string> = {
  pending: 'Pendiente',
  confirmed: 'Confirmado',
  processing: 'Preparando',
  shipped: 'Enviado',
  delivered: 'Entregado',
  cancelled: 'Cancelado',
  refunded: 'Reembolsado',
};

export function OrderConfirmation({ order }: Props) {
  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <div className={styles.checkIcon}>✓</div>
        <h2 className={styles.title}>¡Pedido confirmado!</h2>
        <p className={styles.orderNum}>Pedido #{order.order_number}</p>
      </div>

      <div className={styles.status}>
        <span className={styles.statusLabel}>Estado:</span>
        <span className={styles.statusBadge}>{STATUS_LABELS[order.status] || order.status}</span>
      </div>

      <div className={styles.summary}>
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
          <span className={styles.total}>{formatEuro(order.total)}</span>
        </div>
      </div>

      {order.shipping_address && (
        <div className={styles.address}>
          <h3 className={styles.sectionTitle}>Dirección de envío</h3>
          <p>{order.shipping_address.name}</p>
          <p>{order.shipping_address.street}</p>
          <p>{order.shipping_address.zip} {order.shipping_address.city}</p>
          <p>{order.shipping_address.state}, {order.shipping_address.country}</p>
          <p>Tel: {order.shipping_address.phone}</p>
        </div>
      )}

      {order.whatsapp_sent && (
        <div className={styles.whatsapp}>
          <span>📱</span> Pedido enviado por WhatsApp
        </div>
      )}
    </div>
  );
}

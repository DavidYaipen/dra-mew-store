'use client';

import { useState } from 'react';
import { useStore } from '@/store/useStore';
import { formatEuro } from '@/lib/format';
import styles from './CouponInput.module.css';

interface CouponData {
  code: string;
  discount_type: 'percentage' | 'fixed';
  discount_value: number;
}

interface Props {
  subtotal: number;
  onApply: (coupon: CouponData, discountAmount: number) => void;
  onRemove: () => void;
}

export function CouponInput({ subtotal, onApply, onRemove }: Props) {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [applied, setApplied] = useState<CouponData | null>(null);
  const { showToast } = useStore();

  async function handleApply() {
    if (!code.trim()) return;
    setLoading(true);
    setError('');

    try {
      const res = await fetch(`/api/coupons?code=${encodeURIComponent(code.trim())}`);
      const data = await res.json();

      if (!data.valid) {
        setError(data.error || 'Cupón no válido');
        return;
      }

      const coupon = data.coupon;
      if (subtotal < coupon.min_order) {
        setError(`Pedido mínimo: ${formatEuro(coupon.min_order)}`);
        return;
      }

      let discountAmount: number;
      if (coupon.discount_type === 'percentage') {
        discountAmount = (subtotal * coupon.discount_value) / 100;
      } else {
        discountAmount = coupon.discount_value;
      }

      setApplied({ code: coupon.code, discount_type: coupon.discount_type, discount_value: coupon.discount_value });
      onApply({ code: coupon.code, discount_type: coupon.discount_type, discount_value: coupon.discount_value }, discountAmount);
      showToast(`Cupón ${coupon.code} aplicado`);
    } catch {
      setError('Error al validar el cupón');
    } finally {
      setLoading(false);
    }
  }

  function handleRemove() {
    setApplied(null);
    setCode('');
    setError('');
    onRemove();
  }

  if (applied) {
    return (
      <div className={styles.applied}>
        <div className={styles.appliedInfo}>
          <span className={styles.badge}>✓</span>
          <span className={styles.code}>{applied.code}</span>
          <span className={styles.discount}>
            {applied.discount_type === 'percentage'
              ? `-${applied.discount_value}%`
              : `-${formatEuro(applied.discount_value)}`}
          </span>
        </div>
        <button type="button" className={styles.removeBtn} onClick={handleRemove}>
          Quitar
        </button>
      </div>
    );
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.row}>
        <input
          type="text"
          className={styles.input}
          placeholder="Código de descuento"
          value={code}
          onChange={(e) => { setCode(e.target.value.toUpperCase()); setError(''); }}
          onKeyDown={(e) => e.key === 'Enter' && handleApply()}
        />
        <button
          type="button"
          className={styles.applyBtn}
          onClick={handleApply}
          disabled={loading || !code.trim()}
        >
          {loading ? '...' : 'Aplicar'}
        </button>
      </div>
      {error && <div className={styles.error}>{error}</div>}
    </div>
  );
}

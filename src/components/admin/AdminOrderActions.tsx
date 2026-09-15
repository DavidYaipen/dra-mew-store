'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

const STATUSES = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'];

export function AdminOrderActions({ orderId, currentStatus }: { orderId: string; currentStatus: string }) {
  const router = useRouter();
  const [updating, setUpdating] = useState(false);

  const handleStatusChange = async (newStatus: string) => {
    if (newStatus === currentStatus) return;
    setUpdating(true);
    try {
      const res = await fetch('/api/admin/orders', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: orderId, status: newStatus }),
      });
      if (res.ok) router.refresh();
    } catch {
      // silent
    } finally {
      setUpdating(false);
    }
  };

  return (
    <select
      value={currentStatus}
      onChange={(e) => handleStatusChange(e.target.value)}
      disabled={updating}
      style={{
        padding: '4px 8px',
        borderRadius: 8,
        border: '1px solid var(--border-soft)',
        fontSize: 12,
        fontWeight: 600,
        fontFamily: 'var(--font-sans)',
        background: '#fff',
        cursor: 'pointer',
      }}
    >
      {STATUSES.map((s) => (
        <option key={s} value={s}>{s}</option>
      ))}
    </select>
  );
}

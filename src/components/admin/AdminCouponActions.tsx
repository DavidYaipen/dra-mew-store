'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { CheckIcon, TrashIcon } from '@/components/admin/AdminIcons';

export function AdminCouponActions({ couponId, active }: { couponId: string; active: boolean }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const toggleActive = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/coupons', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: couponId, active: !active }),
      });
      if (res.ok) {
        router.refresh();
      } else {
        const data = await res.json();
        alert(data.error || 'Error al actualizar el cupon');
      }
    } catch {
      alert('Error de conexion');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Eliminar este cupon?')) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/coupons?id=${couponId}`, { method: 'DELETE' });
      if (res.ok) {
        router.refresh();
      } else {
        const data = await res.json();
        alert(data.error || 'Error al eliminar');
      }
    } catch {
      alert('Error de conexion');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', gap: 4 }}>
      <button
        className="admin-btn"
        data-variant="ghost"
        data-size="sm"
        onClick={toggleActive}
        disabled={loading}
        title={active ? 'Desactivar' : 'Activar'}
      >
        <CheckIcon size={14} />
      </button>
      <button
        className="admin-btn"
        data-variant="ghost"
        data-size="sm"
        onClick={handleDelete}
        disabled={loading}
      >
        <TrashIcon size={14} />
      </button>
    </div>
  );
}

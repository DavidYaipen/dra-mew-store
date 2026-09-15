'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { CheckIcon, TrashIcon } from '@/components/admin/AdminIcons';

export function AdminReviewActions({ reviewId, approved }: { reviewId: string; approved?: boolean }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const approve = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/reviews', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: reviewId, approved: true }),
      });
      if (res.ok) {
        router.refresh();
      } else {
        const data = await res.json();
        alert(data.error || 'Error al aprobar la resena');
      }
    } catch {
      alert('Error de conexion');
    } finally {
      setLoading(false);
    }
  };

  const reject = async () => {
    if (!confirm('Eliminar esta resena?')) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/reviews?id=${reviewId}`, { method: 'DELETE' });
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
      {!approved && (
        <button className="admin-btn" data-variant="ghost" data-size="sm" onClick={approve} disabled={loading} title="Aprobar">
          <CheckIcon size={14} />
        </button>
      )}
      <button className="admin-btn" data-variant="ghost" data-size="sm" onClick={reject} disabled={loading} title="Eliminar">
        <TrashIcon size={14} />
      </button>
    </div>
  );
}

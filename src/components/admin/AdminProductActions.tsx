'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { EditIcon, TrashIcon } from '@/components/admin/AdminIcons';

export function AdminProductActions({ productId }: { productId: number }) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm('Eliminar este producto?')) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/products?id=${productId}`, { method: 'DELETE' });
      if (res.ok) router.refresh();
      else alert('Error al eliminar');
    } catch {
      alert('Error de conexion');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div style={{ display: 'flex', gap: 4 }}>
      <Link
        href={`/admin/productos/${productId}/editar`}
        className="admin-btn"
        data-variant="ghost"
        data-size="sm"
      >
        <EditIcon size={14} />
      </Link>
      <button
        className="admin-btn"
        data-variant="ghost"
        data-size="sm"
        onClick={handleDelete}
        disabled={deleting}
      >
        <TrashIcon size={14} />
      </button>
    </div>
  );
}

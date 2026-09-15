'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeftIcon } from '@/components/admin/AdminIcons';

const PAGE_TITLES: Record<string, string> = {
  '/admin': 'Dashboard',
  '/admin/productos': 'Productos',
  '/admin/pedidos': 'Pedidos',
  '/admin/cupones': 'Cupones',
  '/admin/clientes': 'Clientes',
  '/admin/resenas': 'Resenas',
  '/admin/inventario': 'Inventario',
};

export function AdminHeader() {
  const pathname = usePathname();
  const title = PAGE_TITLES[pathname] || 'Admin';

  return (
    <header className="admin-header">
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <Link
          href="/"
          className="admin-btn"
          data-variant="ghost"
          data-size="sm"
        >
          <ArrowLeftIcon size={16} />
          Volver a la tienda
        </Link>
      </div>
      <h1 className="admin-header-title">{title}</h1>
      <div className="admin-header-actions" />
    </header>
  );
}

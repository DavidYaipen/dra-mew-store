'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  DashboardIcon,
  PackageIcon,
  ShoppingCartIcon,
  TagIcon,
  UsersIcon,
  StarIcon,
  CardsIcon,
} from '@/components/admin/AdminIcons';

const NAV_ITEMS = [
  { href: '/admin', label: 'Dashboard', icon: DashboardIcon },
  { href: '/admin/productos', label: 'Productos', icon: PackageIcon },
  { href: '/admin/binder', label: 'Binder', icon: CardsIcon },
  { href: '/admin/pedidos', label: 'Pedidos', icon: ShoppingCartIcon },
  { href: '/admin/cupones', label: 'Cupones', icon: TagIcon },
  { href: '/admin/clientes', label: 'Clientes', icon: UsersIcon },
  { href: '/admin/resenas', label: 'Resenas', icon: StarIcon },
];

export function AdminSidebar({ email }: { email?: string }) {
  const pathname = usePathname();
  const displayName = email ? email.split('@')[0] : 'Admin';
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <aside className="admin-sidebar">
      <div className="sidebar-logo">
        <div className="sidebar-logo-chip">
          <Image src="/logo/logo.png" alt="Dra. Mew Store" fill className="sidebar-logo-img" />
        </div>
        <span>Admin Panel</span>
      </div>

      <nav className="sidebar-nav">
        <div className="sidebar-section">
          <div className="sidebar-section-title">Menu</div>
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="sidebar-link"
              data-active={
                item.href === '/admin'
                  ? pathname === '/admin'
                  : pathname.startsWith(item.href)
              }
            >
              <item.icon size={18} />
              {item.label}
            </Link>
          ))}
        </div>
      </nav>

      <div className="sidebar-footer">
        <div className="sidebar-user">
          <div className="sidebar-avatar">{initial}</div>
          <div className="sidebar-user-info">
            <div className="sidebar-user-name">{displayName}</div>
            <div className="sidebar-user-email">{email || 'dra.mew.store'}</div>
          </div>
        </div>
      </div>
    </aside>
  );
}

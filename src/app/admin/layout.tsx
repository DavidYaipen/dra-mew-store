import type { Metadata } from 'next';
import { requireAdmin } from '@/lib/supabase/admin';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminHeader } from '@/components/admin/AdminHeader';
import './admin.css';

export const metadata: Metadata = {
  title: 'Admin — Dra. Mew Store',
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user } = await requireAdmin();

  return (
    <div className="admin-layout">
      <AdminSidebar email={user.email} />
      <div className="admin-main">
        <AdminHeader />
        <main className="admin-content">{children}</main>
      </div>
    </div>
  );
}

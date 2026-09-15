import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getUser } from '@/lib/supabase/auth';
import { formatPrice } from '@/lib/format';
import { createClient } from '@/lib/supabase/server';
import { logout } from '@/lib/supabase/auth';
import styles from './page.module.css';

export const metadata: Metadata = { title: 'Mi cuenta' };

interface OrderRow {
  id: string;
  order_number: number;
  status: string;
  total: number;
  created_at: string;
}

export default async function AccountPage() {
  const user = await getUser();
  if (!user) redirect('/login');

  const supabase = await createClient();

  const { data: orders } = await supabase
    .from('orders')
    .select('id, order_number, status, total, created_at')
    .eq('customer_id', user.id)
    .order('created_at', { ascending: false })
    .limit(10);

  const customerName = user.user_metadata?.name || user.email?.split('@')[0] || 'Usuario';

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Hola, {customerName}</h1>
          <p className={styles.email}>{user.email}</p>
        </div>
        <form action={logout}>
          <button type="submit" className={styles.logoutBtn}>Cerrar sesión</button>
        </form>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Mis pedidos</h2>
        {!orders || orders.length === 0 ? (
          <div className={styles.empty}>
            <p>Aún no tienes pedidos.</p>
            <Link href="/productos" className={styles.shopLink}>Explorar productos</Link>
          </div>
        ) : (
          <div className={styles.orders}>
            {orders.map((order: OrderRow) => (
              <Link
                key={order.id}
                href={`/pedido/${order.order_number}`}
                className={styles.orderCard}
              >
                <div className={styles.orderInfo}>
                  <span className={styles.orderNum}>#{order.order_number}</span>
                  <span className={styles.orderDate}>
                    {new Date(order.created_at).toLocaleDateString('es-PE')}
                  </span>
                </div>
                <div className={styles.orderMeta}>
                  <span className={styles.orderStatus}>{order.status}</span>
                  <span className={styles.orderTotal}>{formatPrice(order.total)}</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Acciones</h2>
        <div className={styles.actions}>
          <Link href="/favoritos" className={styles.actionBtn}>♥ Mis favoritos</Link>
          <Link href="/productos" className={styles.actionBtn}>🛍 Seguir comprando</Link>
        </div>
      </div>
    </div>
  );
}

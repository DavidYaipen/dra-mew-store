import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { createServiceClient } from '@/lib/supabase/service';

const ADMIN_EMAILS = (process.env.ADMIN_EMAILS || '')
  .split(',')
  .map((e) => e.trim().toLowerCase())
  .filter(Boolean);

export async function requireAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect('/login?redirect=/admin');

  const isAdmin = ADMIN_EMAILS.includes(user.email?.toLowerCase() || '');
  if (!isAdmin) redirect('/');

  // Service client para lectura de datos (admin tiene acceso total)
  const serviceClient = createServiceClient();

  return { user, supabase, serviceClient };
}

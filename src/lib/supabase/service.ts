import { createClient as createSupabaseClient } from '@supabase/supabase-js';

/** Cliente Supabase sin cookies — para generateStaticParams, generateMetadata, etc.
 *  También es el cliente usado por requireAdmin() para bypass real de RLS
 *  (requiere SUPABASE_SERVICE_ROLE_KEY, nunca expuesta al cliente). */
export function createServiceClient() {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceRoleKey) {
    throw new Error(
      'Falta SUPABASE_SERVICE_ROLE_KEY en el entorno. Ver CLAUDE.md > Environment.',
    );
  }

  return createSupabaseClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

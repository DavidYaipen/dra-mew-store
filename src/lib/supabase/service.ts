import { createClient as createSupabaseClient } from '@supabase/supabase-js';

/** Cliente Supabase sin cookies — para generateStaticParams, generateMetadata, etc. */
export function createServiceClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
  );
}

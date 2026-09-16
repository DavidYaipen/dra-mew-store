import { NextResponse } from 'next/server';
import { getBinderCatalog } from '@/lib/supabase/binder';

export async function GET() {
  const listings = await getBinderCatalog();
  return NextResponse.json(listings);
}

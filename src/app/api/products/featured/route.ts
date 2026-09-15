import { NextResponse } from 'next/server';
import { getFeaturedProducts } from '@/lib/supabase/catalog';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const products = await getFeaturedProducts();
    return NextResponse.json(products);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

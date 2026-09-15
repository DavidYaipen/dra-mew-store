import { NextResponse } from 'next/server';
import { getCategoryCounts } from '@/lib/supabase/catalog';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const categories = await getCategoryCounts();
    return NextResponse.json(categories);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

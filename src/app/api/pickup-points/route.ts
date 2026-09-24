import { NextResponse } from 'next/server';
import { getActivePickupPoints } from '@/lib/supabase/pickupPoints';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const points = await getActivePickupPoints();
    return NextResponse.json(points);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

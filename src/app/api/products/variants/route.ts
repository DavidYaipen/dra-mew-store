import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  const productId = request.nextUrl.searchParams.get('product_id');
  if (!productId) {
    return NextResponse.json({ error: 'product_id requerido' }, { status: 400 });
  }

  const supabase = await createClient();

  const { data, error } = await supabase
    .from('product_variants')
    .select('*')
    .eq('product_id', Number(productId))
    .order('name');

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

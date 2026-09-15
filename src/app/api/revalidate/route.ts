import { NextRequest, NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';

export async function POST(request: NextRequest) {
  const { tag } = await request.json();
  if (tag === 'catalog') {
    revalidateTag('catalog');
    return NextResponse.json({ revalidated: true, tag });
  }
  return NextResponse.json({ error: 'Invalid tag' }, { status: 400 });
}

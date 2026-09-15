import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/supabase/admin';

export async function POST(request: NextRequest) {
  const { serviceClient } = await requireAdmin();

  const formData = await request.formData();
  const file = formData.get('file') as File | null;
  const productId = formData.get('productId') as string | null;

  if (!file) {
    return NextResponse.json({ error: 'No file provided' }, { status: 400 });
  }

  // Validate file type
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
  if (!allowedTypes.includes(file.type)) {
    return NextResponse.json(
      { error: 'Invalid file type. Allowed: JPEG, PNG, WebP, GIF' },
      { status: 400 }
    );
  }

  // Validate file size (5MB max)
  if (file.size > 5 * 1024 * 1024) {
    return NextResponse.json(
      { error: 'File too large. Max size: 5MB' },
      { status: 400 }
    );
  }

  // Generate unique filename
  const ext = file.name.split('.').pop() || 'webp';
  const filename = productId
    ? `product-${productId}-${Date.now()}.${ext}`
    : `product-${Date.now()}.${ext}`;

  // Convert File to ArrayBuffer
  const arrayBuffer = await file.arrayBuffer();
  const uint8Array = new Uint8Array(arrayBuffer);

  // Upload to Supabase Storage
  const { error } = await serviceClient.storage
    .from('products')
    .upload(filename, uint8Array, {
      contentType: file.type,
      upsert: false,
    });

  if (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Get public URL
  const { data: urlData } = serviceClient.storage
    .from('products')
    .getPublicUrl(filename);

  return NextResponse.json({
    url: urlData.publicUrl,
    filename,
  });
}

export async function DELETE(request: NextRequest) {
  const { serviceClient } = await requireAdmin();

  const url = new URL(request.url);
  const filename = url.searchParams.get('filename');

  if (!filename) {
    return NextResponse.json({ error: 'Missing filename' }, { status: 400 });
  }

  const { error } = await serviceClient.storage
    .from('products')
    .remove([filename]);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}

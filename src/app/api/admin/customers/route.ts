import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/supabase/admin';
import { isForeignKeyViolation } from '@/lib/supabase/errors';

export async function DELETE(request: NextRequest) {
  const { serviceClient } = await requireAdmin();
  const url = new URL(request.url);
  const id = url.searchParams.get('id');

  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });

  const { data, error } = await serviceClient.from('customers').delete().eq('id', id).select('id');
  if (error) {
    if (isForeignKeyViolation(error)) {
      return NextResponse.json(
        { error: 'No se puede eliminar: este cliente tiene pedidos registrados.' },
        { status: 409 },
      );
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  if (!data?.length) {
    return NextResponse.json({ error: 'No se encontro el cliente' }, { status: 404 });
  }
  return NextResponse.json({ ok: true });
}

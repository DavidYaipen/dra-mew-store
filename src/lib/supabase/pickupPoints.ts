import { cache } from 'react';
import { createServiceClient } from '@/lib/supabase/service';
import type { PickupPoint } from '@/lib/types';

interface PickupPointRow {
  id: string;
  name: string;
  address: string;
  schedule: string | null;
  notes: string | null;
  active: boolean;
  display_order: number;
  created_at: string;
}

function rowToPickupPoint(row: PickupPointRow): PickupPoint {
  return {
    id: row.id,
    name: row.name,
    address: row.address,
    schedule: row.schedule ?? undefined,
    notes: row.notes ?? undefined,
    active: row.active,
    display_order: row.display_order,
    created_at: row.created_at,
  };
}

/** Puntos de recojo activos, para el checkout y la página de ayuda. */
export const getActivePickupPoints = cache(async (): Promise<PickupPoint[]> => {
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from('pickup_points')
    .select('*')
    .eq('active', true)
    .order('display_order', { ascending: true })
    .order('name', { ascending: true });
  if (error) throw new Error(`Failed to fetch pickup points: ${error.message}`);
  return (data as PickupPointRow[]).map(rowToPickupPoint);
});

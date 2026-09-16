import { cache } from 'react';
import { createServiceClient } from '@/lib/supabase/service';
import type { BinderCard, BinderListing, CardCondition, CardFinish } from '@/lib/types';

interface BinderListingRow {
  id: string;
  card_id: string;
  finish: string;
  condition: string;
  price: number;
  stock: number;
  is_preorder: boolean;
  binder_cards: { name: string; collection: string; card_number: string | null; image: string | null } | null;
}

function rowToListing(row: BinderListingRow): BinderListing {
  return {
    id: row.id,
    cardId: row.card_id,
    name: row.binder_cards?.name ?? 'Carta',
    collection: row.binder_cards?.collection ?? '',
    cardNumber: row.binder_cards?.card_number ?? undefined,
    image: row.binder_cards?.image ?? undefined,
    finish: row.finish as CardFinish,
    condition: row.condition as CardCondition,
    price: row.price,
    stock: row.stock,
    isPreorder: row.is_preorder,
  };
}

/** Todos los listings vendibles del binder (cada combinación carta+acabado+condición). */
export const getBinderCatalog = cache(async (): Promise<BinderListing[]> => {
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from('binder_listings')
    .select('id, card_id, finish, condition, price, stock, is_preorder, binder_cards(name, collection, card_number, image)')
    .order('created_at');
  if (error) throw new Error(`Failed to fetch binder catalog: ${error.message}`);
  return (data as unknown as BinderListingRow[]).map(rowToListing);
});

export interface BinderCardWithListings extends BinderCard {
  listings: BinderListing[];
}

/** Todas las cartas del binder agrupadas, con sus listings anidados. */
export const getBinderCards = cache(async (): Promise<BinderCardWithListings[]> => {
  const listings = await getBinderCatalog();
  const supabase = createServiceClient();
  const { data: cards, error } = await supabase
    .from('binder_cards')
    .select('id, name, collection, card_number, image')
    .order('name');
  if (error) throw new Error(`Failed to fetch binder cards: ${error.message}`);

  const listingsByCard = new Map<string, BinderListing[]>();
  for (const listing of listings) {
    const list = listingsByCard.get(listing.cardId) ?? [];
    list.push(listing);
    listingsByCard.set(listing.cardId, list);
  }

  return (cards as Array<{ id: string; name: string; collection: string; card_number: string | null; image: string | null }>).map(
    (row) => ({
      id: row.id,
      name: row.name,
      collection: row.collection,
      cardNumber: row.card_number ?? undefined,
      image: row.image ?? undefined,
      listings: listingsByCard.get(row.id) ?? [],
    }),
  );
});

export async function getBinderCard(id: string): Promise<BinderCardWithListings | undefined> {
  const cards = await getBinderCards();
  return cards.find((c) => c.id === id);
}

export const getBinderCollections = cache(async (): Promise<string[]> => {
  const cards = await getBinderCards();
  return Array.from(new Set(cards.map((c) => c.collection))).sort();
});

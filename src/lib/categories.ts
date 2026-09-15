import type { Category } from './types';

export interface CategoryPage {
  slug: string;
  name: Category;
  description: string;
  heroImage: string;
  metaDescription: string;
}

export const CATEGORY_PAGES: CategoryPage[] = [
  {
    slug: 'peluches',
    name: 'Peluches',
    description:
      'Descubre nuestra colección de peluches Pokémon. Desde el icónico Mew hasta el eterno Snorlax, cada peluche está confeccionado con telvete de primera calidad y detalles que enamoran a coleccionistas y fans de todas las edades.',
    heroImage: '/assets/thiings/star.png',
    metaDescription:
      'Peluches Pokémon originales de alta calidad. Mew, Pikachu, Snorlax y más. Envío gratis desde 35 € en Dra. Mew Store.',
  },
  {
    slug: 'figuras',
    name: 'Figuras',
    description:
      'Figuras coleccionables de Pokémon con acabados premium. Piezas detalladas para exhibir en tu estantería, desde figuras de escala hasta ediciones especiales de personajes legendarios.',
    heroImage: '/assets/thiings/lightning.png',
    metaDescription:
      'Figuras Pokémon coleccionables de alta gama. Charizard, Bulbasaur, Gengar y más. Envío gratis desde 35 €.',
  },
  {
    slug: 'cartas',
    name: 'Cartas',
    description:
      'Cartas Pokémon oficiales: sobres booster, cajas Élite Trainer y cartas individuales raras. Construye tu mazo o completa tu colección con el set 151 y las últimas expansiones.',
    heroImage: '/assets/thiings/five-star.png',
    metaDescription:
      'Cartas Pokémon originales: booster packs, cajas Élite Trainer y cartas raras. Set 151 y últimas expansiones.',
  },
  {
    slug: 'ropa',
    name: 'Ropa',
    description:
      'Ropa Pokémon para fans que quieren llevar su fandom a diario. Camisetas, gorras y accesorios con diseños originales que no encontrarás en ningún otro lugar.',
    heroImage: '/assets/thiings/like.png',
    metaDescription:
      'Ropa Pokémon: camisetas, gorras y accesorios con diseños originales. Envío gratis desde 35 €.',
  },
  {
    slug: 'accesorios',
    name: 'Accesorios',
    description:
      'Accesorios Pokémon para completar tu colección. Fundas para consola, llaveros, pins y más detalles que hacen especial tu día a día como entrenador Pokémon.',
    heroImage: '/assets/thiings/console.png',
    metaDescription:
      'Accesorios Pokémon: fundas, llaveros, pins y más. Detalles originales para fans y coleccionistas.',
  },
];

export function getCategoryPage(slug: string): CategoryPage | undefined {
  return CATEGORY_PAGES.find((c) => c.slug === slug);
}

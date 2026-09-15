export interface Review {
  id: number;
  name: string;
  rating: number;
  comment: string;
  date: string;
  product?: string;
}

export const REVIEWS: Review[] = [
  {
    id: 1,
    name: 'María García',
    rating: 5,
    comment:
      'El peluche de Mew es precioso, superó mis expectativas. La calidad del telvete es increíble y llegó en perfecto estado. Totalmente recomendado.',
    date: '12 de septiembre de 2026',
    product: 'Peluche Mew 30 cm',
  },
  {
    id: 2,
    name: 'Carlos Ruiz',
    rating: 5,
    comment:
      'Pedí una caja Élite Trainer para mi hijo y encantado. Todo llegó bien embalado y en menos de 48 horas. La tienda es de confianza.',
    date: '10 de septiembre de 2026',
    product: 'Caja Élite Trainer',
  },
  {
    id: 3,
    name: 'Laura Martínez',
    rating: 4,
    comment:
      'La figura de Charizard es espectacular, aunque el envío tardó un día más de lo previsto. El producto en sí, perfecto.',
    date: '8 de septiembre de 2026',
    product: 'Figura Charizard',
  },
  {
    id: 4,
    name: 'Pedro Sánchez',
    rating: 5,
    comment:
      'Tercera vez que compro aquí y siempre la misma calidad. Las cartas originales y a buen precio. El envío gratis por encima de 35 € es un detalle genial.',
    date: '5 de septiembre de 2026',
    product: 'Booster 151',
  },
  {
    id: 5,
    name: 'Ana López',
    rating: 5,
    comment:
      'Regalé la camiseta Pokémon a mi pareja y flipó. La talla fue perfecta siguiendo la guía. El empaquetado es muy cuidado.',
    date: '1 de septiembre de 2026',
    product: 'Camiseta Pokémon',
  },
  {
    id: 6,
    name: 'Javier Moreno',
    rating: 4,
    comment:
      'El llavero de Pikachu es pequeñito pero muy mono. Buena calidad por el precio. Sí que echo en falta más opciones de pago.',
    date: '28 de agosto de 2026',
    product: 'Llavero Pikachu',
  },
  {
    id: 7,
    name: 'Sofía Hernández',
    rating: 5,
    comment:
      'La Snorlax XL es enorme y súper suave. La uso como almohada y es perfecta. El envío fue rapidísimo.',
    date: '25 de agosto de 2026',
    product: 'Peluche Snorlax XL',
  },
  {
    id: 8,
    name: 'Diego Fernández',
    rating: 5,
    comment:
      'Colecciono cartas Pokémon desde hace años y esta tienda tiene los mejores precios que he encontrado. El booster 151 es una pasada.',
    date: '20 de agosto de 2026',
    product: 'Booster 151',
  },
  {
    id: 9,
    name: 'Elena Torres',
    rating: 4,
    comment:
      'La gorra Pokéball es muy bonita y bien ajustable. El único pero es que el color no es exactamente igual que en la foto, pero aun así me gusta mucho.',
    date: '18 de agosto de 2026',
    product: 'Gorra Pokéball',
  },
  {
    id: 10,
    name: 'Pablo Navarro',
    rating: 5,
    comment:
      'Excelente tienda. Pedí la funda para consola y llegó protegida con burbuja. El diseño es muy fiel al original. Volveré a comprar seguro.',
    date: '15 de agosto de 2026',
    product: 'Funda para consola',
  },
];

export function getAverageRating(): number {
  const sum = REVIEWS.reduce((acc, r) => acc + r.rating, 0);
  return Math.round((sum / REVIEWS.length) * 10) / 10;
}

export function getReviewsByProduct(productId: number): Review[] {
  return REVIEWS.filter((r) => r.product && r.product.toLowerCase().includes(String(productId)));
}

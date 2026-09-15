export interface BlogPost {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  content: string;
  image: string;
  category: string;
}

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://gqlsmnscpmvymxzrrorx.supabase.co';
const img = (file: string) => `${SUPABASE_URL}/storage/v1/object/public/products/${file}`;

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: 'top-5-peluches-pokemon-2026',
    title: 'Top 5 peluches Pokémon que no puedes perderte en 2026',
    date: '10 de septiembre de 2026',
    excerpt:
      'Desde el clásico Pikachu hasta el escurridizo Mew, estos son los peluches más buscados del año.',
    content: `<p>El mundo de los coleccionables Pokémon no deja de crecer, y este 2026 ha traído figuras de peluche que han roto esquemas. Si estás pensando en ampliar tu colección o regalar algo especial, estos son los imprescindibles:</p>
<h3>1. Peluche Mew 30 cm</h3>
<p>El Pokémon legendario favorito de todos. Su diseño suave y sus detalles lo convierten en una pieza de coleccionista que también funciona como peluche decorativo.</p>
<h3>2. Peluche Pikachu Clásico</h3>
<p>Un clásico que nunca pasa de moda. El Pikachu de peluche más vendido de la tienda, con telvete de alta calidad y bordes reforzados.</p>
<h3>3. Peluche Snorlax XL</h3>
<p>Para los que quieren algo grande y cómodo. Con casi 45 cm, Snorlax es perfecto como almohada o pieza central de la estantería.</p>
<h3>4. Peluche Eevee</h3>
<p>La evolución más adorable. Eevee ha ganado popularidad gracias a sus múltiples formas y su diseño redondeado.</p>
<h3>5. Peluche Gengar</h3>
<p>Para los fans del tipo fantasma. Con su sonrisa traviesa y su color púrpura intenso, Gengar es un must para completar la colección.</p>
<p>¿Ya tienes alguno en tu lista de deseos? ¡Añádelo al carrito antes de que se agoten!</p>`,
    image: img('star.png'),
    category: 'Coleccionismo',
  },
  {
    slug: 'guia-cartas-pokemon-para-principiantes',
    title: 'Guía completa de cartas Pokémon para principiantes',
    date: '5 de septiembre de 2026',
    excerpt:
      'Todo lo que necesitas saber para empezar a coleccionar cartas Pokémon: tipos, raridades y cómo construir tu primer mazo.',
    content: `<p>Si estás dando tus primeros pasos en el emocionante mundo de las cartas Pokémon, esta guía es para ti.</p>
<h3>Tipos de cartas</h3>
<p>Existen varios tipos de cartas Pokémon: básicas, evoluciones, y especiales como las V, VMAX y ex. Cada tipo tiene un papel distinto en el juego.</p>
<h3>Raridades</h3>
<p>Las cartas se clasifican por su rareza: Común, Poco Común, Rara, Rara Ultra y Rara Secreta. Cuanto mayor sea la rareza, más difícil es encontrarla en un sobre.</p>
<h3>Booster Packs</h3>
<p>Los sobres (booster packs) contienen 10 cartas aleatorias. Es la forma más económica de empezar tu colección. Te recomendamos empezar con el set 151, que incluye todas las primeras 151 especies.</p>
<h3>Cajas Élite Trainer</h3>
<p>Si quieres ir más allá, una caja Élite Trainer incluye sobres, dados, marcadores de daño y todo lo necesario para jugar. Perfecta para regalar o para empezar en serio.</p>
<p>Visita nuestra sección de <a href="/productos?cat=Cartas">Cartas</a> para ver todos los productos disponibles.</p>`,
    image: img('five-star.png'),
    category: 'Guías',
  },
  {
    slug: 'como-cuidar-tus-figuras-coleccionables',
    title: 'Cómo cuidar y conservar tus figuras coleccionables',
    date: '28 de agosto de 2026',
    excerpt:
      'Consejos prácticos para que tus figuras Pokémon mantengan su valor y apariencia durante años.',
    content: `<p>Las figuras coleccionables de Pokémon son inversiones que, bien cuidadas, pueden mantener o incluso aumentar su valor con el tiempo.</p>
<h3>Limpieza regular</h3>
<p>Utiliza un paño de microfibra ligeramente humedecido para eliminar el polvo cada semana. Evita productos químicos agresivos que puedan dañar la pintura.</p>
<h3>Protección del sol</h3>
<p>La luz solar directa decolora los materiales y la pintura. Coloca tus figuras en estanterías cerradas o con protección UV.</p>
<h3>Temperatura y humedad</h3>
<p>Lo ideal es mantener una temperatura entre 18-22°C y una humedad relativa del 40-50%. Evita áticos, sótanos o zonas con cambios bruscos de temperatura.</p>
<h3>Almacenaje original</h3>
<p>Si eres coleccionista serio, conserva las cajas y el embalaje original. Las figuras "caja cerrada" tienen un valor significativamente mayor en el mercado de segunda mano.</p>
<p>En Dra. Mew Store enviamos todas nuestras figuras con embalaje protector reforzado para que lleguen en perfecto estado.</p>`,
    image: img('shield.png'),
    category: 'Consejos',
  },
  {
    slug: 'nuevos-productos-septiembre-2026',
    title: 'Novedades de septiembre: drops exclusivos en la tienda',
    date: '1 de septiembre de 2026',
    excerpt:
      'Descubre los nuevos productos que hemos preparado para este mes, con piezas limitadas y ofertas especiales.',
    content: `<p>Septiembre arranca con fuerza en Dra. Mew Store. Hemos preparado una selección de productos nuevos que no querrás perderte.</p>
<h3>Nuevos peluches</h3>
<p>Se han incorporado peluches de nuevas especies con telvete de primera calidad. Mew de 30 cm, Snorlax XL y más sorpresas que se irán añadiendo durante el mes.</p>
<h3>Figuras exclusivas</h3>
<p>La sección de figuras crece con piezas de detalles premium: Charizard, Bulbasaur y Gengar con acabados especiales que enamoran.</p>
<h3>Cartas: Booster 151</h3>
<p>El set más esperado del año ya está disponible. El Booster 151 incluye todas las especies originales de la primera generación en versiones actualizadas.</p>
<h3>Ofertas de temporada</h3>
<p>Durante todo septiembre tendrás envío gratis en pedidos superiores a S/ 150. Además, hemos preparado descuentos exclusivos en artículos seleccionados.</p>
<p>¡No dejes pasar la oportunidad! Visita nuestra <a href="/productos">tienda</a> y descubre todas las novedades.</p>`,
    image: img('lightning.png'),
    category: 'Novedades',
  },
  {
    slug: 'regalos-pokemon-navidad-2026',
    title: 'Ideas de regalos Pokémon para esta Navidad',
    date: '20 de agosto de 2026',
    excerpt:
      'Aunque falte un poco, ya puedes ir pensando en los regalos perfectos para los fans de Pokémon.',
    content: `<p>La Navidad se acerca y si tienes un fan de Pokémon en tu familia o círculo de amigos, ya es buen momento para empezar a buscar el regalo perfecto.</p>
<h3>Para los más pequeños</h3>
<p>Los peluches son siempre una apuesta segura. Pikachu, Eevee y Mew son los favoritos. Combínalos con una camiseta Pokémon para un regalo completo.</p>
<h3>Para coleccionistas</h3>
<p>Las figuras de alta gama o las cajas Élite Trainer de cartas son regalos que todo coleccionista apreciará. Si conoces su Pokémon favorito, aún mejor.</p>
<h3>Para fans de la estética</h3>
<p>La ropa y accesorios Pokémon son perfectos para quienes quieren llevar su fandom a diario. Gorras, fundas para consola y camisetas con diseños originales.</p>
<h3>Para quienes buscan algo único</h3>
<p>Las cartas raras (como la Mew ex) son piezas de colección con valor sentimental y económico. Un regalo que recordarán siempre.</p>
<p>En Dra. Mew Store encontrarás regalos para todos los presupuestos, desde S/ 39.90 hasta piezas premium. ¡Empieza a planificar tu lista!</p>`,
    image: img('heart.png'),
    category: 'Regalos',
  },
];

export function getBlogPost(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((p) => p.slug === slug);
}

export function relatedPosts(post: BlogPost, limit = 2): BlogPost[] {
  return BLOG_POSTS.filter((p) => p.slug !== post.slug && p.category === post.category)
    .slice(0, limit)
    .concat(
      BLOG_POSTS.filter((p) => p.slug !== post.slug && p.category !== post.category).slice(
        0,
        limit
      )
    )
    .slice(0, limit);
}

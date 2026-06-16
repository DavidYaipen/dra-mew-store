# Dra. Mew Store

Tienda de coleccionables Pokémon (peluches, figuras, cartas, ropa y accesorios) construida con
**Next.js (App Router) + TypeScript**. Es la implementación productiva del prototipo de diseño
_"Dra Mew Store Landing — Final"_, sobre el sistema visual **Universal Identity**
(galería blanca + azul de marca `#1c3f8f` + acento rosa `#f56fa1`).

Idioma de la interfaz: **español**. Todas las imágenes de producto son **placeholders 3D**
preparados para sustituirse por fotos reales (ver más abajo).

## Stack

- **Next.js 15** (App Router, rutas reales, SSG donde aplica)
- **TypeScript** estricto
- **CSS Modules** sobre tokens del design system (`src/app/globals.css`)
- **next/font** (Manrope · Instrument Serif · JetBrains Mono)
- **ESLint** (`next/core-web-vitals` + `next/typescript`) y **Prettier**
- **Vitest** + Testing Library (unit/componentes) y **Playwright** (e2e)

## Arranque

```bash
npm install
npm run dev        # http://localhost:3000
```

Otros scripts:

```bash
npm run build      # build de producción
npm run start      # sirve el build
npm run lint       # ESLint
npm run typecheck  # tsc --noEmit
npm run format     # Prettier --write
npm run test       # Vitest (unit + componentes)
npm run test:e2e   # Playwright (levanta el server en el puerto 3100)
```

> Para los e2e la primera vez: `npx playwright install chromium`.

## Estructura

```
src/
  app/                 Rutas (App Router)
    layout.tsx         Chrome global: anuncios, header, nav, footer, toast, back-to-top
    page.tsx           Home (hero, categorías, drop, badges de confianza)
    productos/         Catálogo con filtros (?cat= ?q= ?new= ?sale=)
    producto/[id]/     Ficha de producto (SSG con generateStaticParams)
    carrito/ favoritos/ cuenta/ sobre-nosotros/ ayuda/
  components/          UI por dominio (layout, ui, product, home, help, cart, ...)
  lib/                 Lógica pura y datos: catalog, cart, filter, format, faq, listing
  store/               StoreProvider (carrito/favoritos/toast) + useStore
public/
  assets/thiings/      Placeholders 3D (intercambiables)
  products/            Carpeta destino de las fotos reales
e2e/                   Tests Playwright
```

La lógica de negocio (carrito, filtros, formato de precios) vive en `src/lib` como funciones
puras y está cubierta por tests, separada del estado de React (`src/store`).

## Cómo poner imágenes reales

Los productos se definen en [`src/lib/catalog.ts`](src/lib/catalog.ts). Cada uno tiene un campo
`image` que hoy apunta a un placeholder en `/assets/thiings/`:

```ts
{ id: 1, name: 'Peluche Mew 30 cm', cat: 'Peluches', price: 34.99, image: ph('star.png'), ... }
```

Para usar fotos reales:

1. Copia la foto en `public/products/` (p.ej. `public/products/peluche-mew.jpg`).
2. Cambia el `image` del producto a esa ruta:
   ```ts
   image: '/products/peluche-mew.jpg',
   ```

No hace falta tocar componentes: todo se renderiza con `next/image` a través de
[`ProductImage`](src/components/ui/ProductImage.tsx). Si las fotos pasan a un CDN externo, añade
su dominio en `images.remotePatterns` dentro de `next.config.mjs`.

El nombre de la tienda y otros textos clave están en `src/lib/constants.ts` y `src/lib/faq.ts`.

## Notas de implementación

- El prototipo original era una SPA con estado de vista; aquí se traduce a **rutas reales**, de
  modo que cada vista tiene URL propia, el botón _atrás_ funciona y las fichas de producto se
  prerenderizan estáticamente.
- El carrito y los favoritos se mantienen en cliente (Context) y se **persisten en
  `localStorage`**.
- Se respeta `prefers-reduced-motion` (heredado de los tokens base).

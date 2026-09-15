# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

**Dra. Mew Store** — a Pokémon collectibles store (landing + shop) built with Next.js 15 App Router, React 19, and TypeScript (strict). UI text is in Spanish; prices are EUR. Product images are 3D placeholders meant to be swapped for real photos. No backend — cart/favorites live in `localStorage`.

## Commands

```bash
npm run dev          # dev server at http://localhost:3000
npm run build        # production build
npm start            # serve the build
npm run lint         # ESLint (next/core-web-vitals, next/typescript)
npm run typecheck    # tsc --noEmit
npm run format       # Prettier --write   (check: npm run format:check)
npm run test         # Vitest run (unit + component)
npm run test:watch   # Vitest watch
npm run test:e2e     # Playwright (builds, then serves on port 3100)
```

Run a single Vitest file: `npm run test -- src/lib/cart.test.ts`
Run a single Vitest test by name: `npm run test -- -t "free shipping"`

## Architecture

The codebase enforces a strict separation between pure logic, state, and UI. Understand these four layers before making changes:

- **`src/lib/`** — Pure business logic and data, **no React**. This is where the real rules live and where most unit tests point.
  - `catalog.ts` — `CATALOG` product array (hardcoded), `getProduct`, `relatedProducts`, `FEATURED_IDS`, `HOME_CATEGORIES`. Image paths via `ph()` helper.
  - `cart.ts` — pure cart math: `addLine`, `changeQty`, `removeLine`, `cartCount`, `subtotal`, `shippingProgress`, `FREE_SHIPPING_THRESHOLD` (€35).
  - `filter.ts` — `filterProducts(catalog, filter)` with `ProductFilter` (cat/query/onlyNew/onlySale).
  - `listing.ts` — `resolveListing(params)` translates URL query (`?cat ?q ?new ?sale`) into a filter + page title.
  - `format.ts` — `formatEuro` (Spanish "34,99 €"), `discountLabel`.
  - `types.ts`, `constants.ts` (`STORE_NAME`), `faq.ts`.
- **`src/store/`** — single React Context for all client state. `StoreProvider.tsx` manages cart (`CartLine[]`), wishlist (`number[]`), and toast; persists to `localStorage` (keys `dmw.cart`, `dmw.wishlist`) with hydration to avoid SSR mismatch. Cart logic is delegated to `lib/cart.ts`. Access via `useStore()` (`src/store/useStore.ts`), which throws outside the provider.
- **`src/components/`** — UI grouped by domain: `layout/` (Header, Footer, Toast, nav chrome), `ui/` (Button, Icons, ProductImage, EmptyState — the reusable design-system pieces), `product/`, `home/`, `cart/`, `wishlist/`, `account/`, `help/`. Components that read `useStore` are `'use client'`. Styling is **CSS Modules** (`*.module.css`) per component.
- **`src/app/`** — App Router routes. `layout.tsx` wraps everything in `StoreProvider` + global chrome. Pages are thin: they pull from `CATALOG`/`lib` and render domain components. Routes: `/` (home), `/productos` (catalog, filter-driven), `/producto/[id]` (detail, **SSG via `generateStaticParams`**), `/carrito`, `/favoritos`, `/cuenta`, `/ayuda`, `/sobre-nosotros`.

### Key conventions

- **Path alias**: `@/*` → `./src/*` (tsconfig). Import as `@/lib/...`, `@/components/...`, `@/store/...`.
- **URL-driven filters**: catalog state lives in the query string (`?cat ?q ?new ?sale`), parsed by `listing.ts` → shareable/bookmarkable. Don't hold filter state in React when it belongs in the URL.
- **Design tokens**: all colors, typography, spacing, shadows, and motion are CSS custom properties defined in `src/app/globals.css` ("Universal Identity" system — graphite/blue scales + pink brand accent `--pink: #f56fa1`). Use tokens, not literals. Fonts come from `next/font` (Manrope, Instrument Serif, JetBrains Mono). Motion respects `prefers-reduced-motion`.
- **Keep logic out of components**: cart/filter/format/pricing changes belong in `src/lib/` (and get a Vitest test), not inline in JSX.

### Swapping placeholder images for real photos

Products in `src/lib/catalog.ts` point `image` at placeholders in `/public/assets/thiings/`. To use a real photo: drop it in `public/products/`, set `image: '/products/your-file.jpg'` on the product. No component changes needed — everything renders through `ProductImage` (`src/components/ui/ProductImage.tsx`). For a CDN, add the domain to `images.remotePatterns` in `next.config.mjs`.

## Testing

- Unit/component tests are **colocated** as `*.test.ts(x)` under `src/`, run by Vitest (jsdom, globals on). Setup in `vitest.setup.ts` mocks `next/image`, `next/link`, `next/navigation`.
- Most coverage is on `src/lib/` pure functions; component tests use Testing Library (`ProductCard`, `FaqAccordion`, `StoreProvider`).
- E2E lives in `e2e/` (Playwright, excluded from tsconfig and ESLint). `npm run test:e2e` builds and starts the app on port 3100.

## Tooling notes

- Prettier: single quotes, semicolons, trailing commas (`all`), printWidth 100.
- No Tailwind / no CSS-in-JS — styling is CSS Modules + `globals.css` tokens only.

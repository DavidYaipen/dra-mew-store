# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

**Dra. Mew Store** — a Pokémon collectibles store (landing + shop + admin panel) built with Next.js 15 App Router, React 19, and TypeScript (strict). UI text is in Spanish; prices are in Peruvian soles (`S/`, see `formatPrice` in `src/lib/format.ts` — `formatEuro` is a deprecated alias kept for import compatibility). Checkout has no payment gateway: an order is written to Supabase and the customer is handed off to WhatsApp with a prefilled message to arrange payment.

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

One-off scripts (run with `npx tsx`, load `.env.local` themselves):
- `scripts/migrate-images.ts` — uploads the local placeholder images into the Supabase `products` storage bucket.
- `supabase/verify.ts` — sanity-checks the Supabase connection and `products` table.

## Environment

Requires `.env.local` with:
- `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` — used by every Supabase client (browser, server, service, and the migration/verify scripts).
- `SUPABASE_SERVICE_ROLE_KEY` — server-only secret (never `NEXT_PUBLIC_*`) used by `createServiceClient()` in `src/lib/supabase/service.ts` for genuine RLS bypass in admin server code. Get it from Supabase Dashboard → Settings → API → API Keys → Secret keys.
- `ADMIN_EMAILS` — comma-separated allowlist checked by `middleware.ts` and `requireAdmin()` to gate `/admin*` and `/api/admin/*`.

## Architecture

The product catalog, orders, coupons, reviews, and auth are backed by **Supabase** (Postgres + Auth + Storage) — this is not a static/localStorage-only app. Cart and wishlist are the one piece of state that stays client-only.

- **`src/lib/`** — pure logic and data, mostly no React.
  - `cart.ts` — pure cart math: `addLine`, `changeQty`, `removeLine`, `cartCount`, `subtotal`, `shippingProgress`, `FREE_SHIPPING_THRESHOLD` (S/ 150).
  - `catalog.ts` — a **hardcoded** `CATALOG` array kept only as a test fixture (used by `ProductCard.test.tsx`, `StoreProvider.test.tsx`, `catalog.test.ts`). Live pages do **not** import this — see `lib/supabase/catalog.ts` below. Don't add products here expecting them to appear in the app.
  - `supabase/catalog.ts` — the real, DB-backed catalog: `getCatalog`, `getProductFromDB`, `relatedProductsFromDB`, `getFeaturedProducts`, `getCategoryCounts`, all wrapped in React `cache()` and reading from the Supabase `products` table via the service client. This is what `/productos`, `/producto/[id]`, `/categoria/[slug]`, and the `/api/catalog`, `/api/categories`, `/api/products/featured` routes use.
  - `supabase/{client,server,service}.ts` — three Supabase client factories: `client.ts` (browser, cookies via `@supabase/ssr`), `server.ts` (Server Components/Actions, cookie read/write, awaits `cookies()`), `service.ts` (`createServiceClient`, no cookies — for `generateStaticParams`, `generateMetadata`, and any read that needs to bypass request context).
  - `supabase/auth.ts` — server actions (`'use server'`): `login`, `signup`, `resendConfirmation`, `logout`, `getUser`, `getSession`.
  - `supabase/admin.ts` — `requireAdmin()`: redirects to `/login` if unauthenticated, to `/` if authenticated but not in `ADMIN_EMAILS`; returns `{ user, supabase, serviceClient }` for use in admin pages/routes.
  - `filter.ts` — `filterProducts(catalog, filter)` with `ProductFilter` (cat/query/onlyNew/onlySale).
  - `listing.ts` — `resolveListing(params)` translates URL query (`?cat ?q ?new ?sale`) into a filter + page title.
  - `format.ts`, `types.ts` (all domain types: `Product`, `CartLine`, `Order`, `Customer`, `Coupon`, `ShippingMethod`, `CheckoutPayload`, `Review`, etc.), `constants.ts` (`STORE_NAME`, `WHATSAPP_PHONE`, `WHATSAPP_MESSAGE`), `faq.ts`, `categories.ts` (static category-page copy for `/categoria/[slug]`), `blog.ts` (hardcoded `BLOG_POSTS` for `/blog`), `reviews.ts` (hardcoded testimonial data — unrelated to the DB-backed `Review`/`reseñas` admin flow), `analytics.ts` (GA/Meta Pixel event helpers: `trackViewContent`, `trackAddToCart`, `trackBeginCheckout`, `trackPurchase`).
- **`src/middleware.ts`** — refreshes the Supabase session on every request and enforces route protection: `/admin*` and `/api/admin/*` require an `ADMIN_EMAILS` match (401/403 JSON for API, redirect for pages); `/cuenta`, `/checkout`, `/pedido` require any authenticated user.
- **`src/store/`** — single React Context for cart/wishlist/toast. `StoreProvider.tsx` persists cart (`CartLine[]`) and wishlist (`number[]`) to `localStorage` (keys `dmw.cart`, `dmw.wishlist`), delegating cart math to `lib/cart.ts`. It also fetches `/api/catalog` on mount to build a `productMap` (id → `Product`) used to resolve cart/wishlist items — it does **not** import `lib/catalog.ts`. Access via `useStore()` (`src/store/useStore.ts`), which throws outside the provider.
- **`src/components/`** — UI grouped by domain: `layout/`, `ui/` (Button, Icons, ProductImage, EmptyState), `product/`, `home/`, `cart/`, `wishlist/`, `account/`, `help/`, `admin/`, `blog/`, `reviews/`. Components reading `useStore` or Supabase browser client are `'use client'`. Styling is **CSS Modules** per component (admin panel uses a shared `src/app/admin/admin.css` instead).
- **`src/app/`** — App Router routes.
  - Storefront: `/` (home), `/productos` (catalog, filter-driven), `/categoria/[slug]`, `/producto/[id]` (SSG via `generateStaticParams`, reads via the service client), `/carrito`, `/favoritos`, `/blog`, `/blog/[slug]`, `/ayuda`, `/sobre-nosotros`, `/devoluciones`, `/privacidad`, `/terminos`, `/reseñas`.
  - Auth: `/login`, `/registro`, `/olvido-contrasena` (Supabase Auth via `lib/supabase/auth.ts` server actions).
  - Order flow: `/checkout` → `POST /api/checkout` (validates coupon, prices the cart server-side from the DB, creates `customers`/`orders`/`order_items`, bumps coupon usage via RPC, returns a `wa.me` URL with a formatted order summary) → `/pedido/[id]`.
  - Admin (`/admin/*`, gated by `requireAdmin`): dashboard, `productos` (list/new/edit), `inventario`, `pedidos`, `cupones`, `clientes`, `resenas`. Mirrored by `/api/admin/*` routes (products, inventory, orders, coupons, reviews, upload) for mutations.
  - Public API: `/api/catalog`, `/api/categories`, `/api/products/featured`, `/api/products/variants`, `/api/coupons` (validation), `/api/orders`, `/api/subscribe`, `/api/revalidate` (ISR revalidation webhook).
- **`supabase/`** — SQL migrations applied manually against the Supabase project (`migration_ecommerce.sql` is the main schema: products/customers/orders/order_items/coupons; plus `migration_product_details`, `migration_rls_products`, `migration_storage_products`, `migration_add_featured`) and `seed.sql`. There is no migration-runner CLI wired up — apply these by hand in the Supabase SQL editor when the schema changes.

### Key conventions

- **Path alias**: `@/*` → `./src/*` (tsconfig). Import as `@/lib/...`, `@/components/...`, `@/store/...`.
- **URL-driven filters**: catalog state lives in the query string (`?cat ?q ?new ?sale`), parsed by `listing.ts` → shareable/bookmarkable. Don't hold filter state in React when it belongs in the URL.
- **Design tokens**: all colors, typography, spacing, shadows, and motion are CSS custom properties defined in `src/app/globals.css` ("Universal Identity" system — graphite/blue scales + pink brand accent `--pink: #f56fa1`). Use tokens, not literals. Fonts come from `next/font` (Manrope, Instrument Serif, JetBrains Mono). Motion respects `prefers-reduced-motion`.
- **Keep logic out of components**: cart/filter/format/pricing changes belong in `src/lib/` (and get a Vitest test), not inline in JSX.
- **Product images** live in Supabase Storage (public bucket `products`), served via `${NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/products/<file>` (see the `img()` helpers in `lib/catalog.ts`, `lib/supabase/catalog.ts`, `lib/blog.ts`). `next.config.mjs` allows `*.supabase.co` in `images.remotePatterns`. Uploading new product photos goes through `/admin/productos` → `/api/admin/upload`, not through editing files in `public/`.

## Testing

- Unit/component tests are **colocated** as `*.test.ts(x)` under `src/`, run by Vitest (jsdom, globals on). Setup in `vitest.setup.ts` mocks `next/image`, `next/link`, `next/navigation`. Shared render helpers live in `src/test/utils.tsx`.
- Most coverage is on `src/lib/` pure functions; component tests use Testing Library (`ProductCard`, `FaqAccordion`, `StoreProvider`). Note `catalog.test.ts` and the catalog-touching component tests exercise the hardcoded `lib/catalog.ts` fixture, not the live Supabase-backed catalog.
- E2E lives in `e2e/` (Playwright, excluded from tsconfig and ESLint). `npm run test:e2e` builds and starts the app on port 3100.

## Tooling notes

- Prettier: single quotes, semicolons, trailing commas (`all`), printWidth 100.
- No Tailwind / no CSS-in-JS — styling is CSS Modules + `globals.css` tokens only.

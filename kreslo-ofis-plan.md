# Kreslo Ofis Salon — Full Website Blueprint
**Stack: Next.js (App Router) · TypeScript · Tailwind CSS · shadcn/ui · Supabase**

---

## Table of Contents

1. [Tech Stack & Tooling](#1-tech-stack--tooling)
2. [Project Structure](#2-project-structure)
3. [Database Schema](#3-database-schema)
4. [Row Level Security (RLS)](#4-row-level-security-rls)
5. [Environment Variables & Secrets](#5-environment-variables--secrets)
6. [Localization Strategy](#6-localization-strategy)
7. [Image Pipeline](#7-image-pipeline)
8. [Public Storefront](#8-public-storefront)
9. [Admin Dashboard](#9-admin-dashboard)
10. [Cart & WhatsApp Checkout](#10-cart--whatsapp-checkout)
11. [Promotion Engine](#11-promotion-engine)
12. [SEO & Metadata](#12-seo--metadata)
13. [Analytics](#13-analytics)
14. [Deployment](#14-deployment)
15. [Performance Checklist](#15-performance-checklist)
16. [Color Palette & Typography](#16-color-palette--typography)
17. [Phase-by-Phase Build Order](#17-phase-by-phase-build-order)

---

## 1. Tech Stack & Tooling

| Layer | Choice | Why |
|---|---|---|
| Framework | Next.js 14 (App Router) | Backend + frontend in one repo; RSC for fast page loads |
| Language | TypeScript | Catch bugs before deploy; required for Supabase types |
| Styling | Tailwind CSS | Rapid responsive layouts |
| Components | shadcn/ui | Copy-paste accessible components; no bundle bloat |
| Database | PostgreSQL via Supabase | Relational, perfect for categories/products/bundles |
| Auth | Supabase Auth | Built-in; guards the Admin Dashboard |
| File Storage | Supabase Storage | Hosts product images after client-side compression |
| Cart State | Zustand | Lightweight; persists cart across page navigations |
| Forms | React Hook Form + Zod | Schema-validated forms in the Admin Dashboard |
| i18n | next-intl | File-based translations; URL-prefix routing (`/az`, `/ru`, `/en`) |
| Image Compression | browser-image-compression | Compresses before upload; keeps Supabase storage costs near zero |
| Analytics | Vercel Analytics (free tier) | Zero-config; GDPR-friendly |
| Deployment | Vercel | Native Next.js host; edge caching out of the box |

---

## 2. Project Structure

```
kreslo-ofis/
├── messages/                  # i18n translation files
│   ├── az.json
│   ├── ru.json
│   └── en.json
├── src/
│   ├── app/
│   │   ├── [locale]/          # All public routes scoped to locale
│   │   │   ├── page.tsx                   # Homepage / Landing
│   │   │   ├── category/[slug]/page.tsx   # Category product grid
│   │   │   ├── product/[slug]/page.tsx    # Single product page
│   │   │   └── layout.tsx
│   │   ├── admin/             # Admin Dashboard (no locale prefix)
│   │   │   ├── page.tsx                   # Dashboard overview
│   │   │   ├── products/page.tsx
│   │   │   ├── categories/page.tsx
│   │   │   ├── promotions/page.tsx
│   │   │   └── settings/page.tsx
│   │   └── api/               # Route Handlers
│   │       └── revalidate/route.ts        # On-demand ISR revalidation
│   ├── components/
│   │   ├── storefront/        # Public-facing components
│   │   ├── admin/             # Admin-only components
│   │   └── shared/            # Used in both
│   ├── lib/
│   │   ├── supabase/
│   │   │   ├── client.ts      # Browser Supabase client
│   │   │   └── server.ts      # Server Component Supabase client
│   │   ├── cart/
│   │   │   └── store.ts       # Zustand cart store
│   │   ├── whatsapp.ts        # Message formatter + URL builder
│   │   └── image-compress.ts  # browser-image-compression wrapper
│   ├── types/
│   │   └── database.types.ts  # Auto-generated from Supabase CLI
│   └── i18n.ts                # next-intl config
├── supabase/
│   ├── migrations/            # All SQL migration files
│   └── seed.sql               # Demo data for local dev
├── .env.local
└── next.config.ts
```

---

## 3. Database Schema

### 3.1 `settings` — Global Store Config

```sql
CREATE TABLE settings (
  id          SERIAL PRIMARY KEY,
  key         TEXT UNIQUE NOT NULL,   -- e.g. 'whatsapp_number'
  value       TEXT NOT NULL,
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Seed the WhatsApp number
INSERT INTO settings (key, value) VALUES ('whatsapp_number', '994554017464');
```

### 3.2 `categories` — Unlimited Self-Referencing Tree

```sql
CREATE TABLE categories (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name_az     TEXT NOT NULL,    -- "Menecer Kreslolar"
  name_ru     TEXT NOT NULL,    -- "Кресла для менеджеров"
  name_en     TEXT NOT NULL,    -- "Manager Chairs"
  slug        TEXT UNIQUE NOT NULL,
  parent_id   UUID REFERENCES categories(id) ON DELETE SET NULL,
  sort_order  INT DEFAULT 0,    -- controls display order in nav/grid
  is_active   BOOLEAN DEFAULT TRUE,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_categories_parent ON categories(parent_id);
CREATE INDEX idx_categories_slug   ON categories(slug);
```

`parent_id IS NULL` = top-level category. `parent_id = some UUID` = subcategory.

### 3.3 `products` — Core Product Catalog

```sql
CREATE TABLE products (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name_az          TEXT NOT NULL,
  name_ru          TEXT NOT NULL,
  name_en          TEXT NOT NULL,
  slug             TEXT UNIQUE NOT NULL,
  description_az   TEXT,
  description_ru   TEXT,
  description_en   TEXT,
  category_id      UUID REFERENCES categories(id) ON DELETE SET NULL,
  price            NUMERIC(10, 2) NOT NULL,
  discount_price   NUMERIC(10, 2),         -- null = no active sale price
  discount_ends_at TIMESTAMPTZ,            -- null = no expiry; past = expired
  image_url        TEXT NOT NULL,
  extra_images     TEXT[],                 -- array of additional image URLs
  is_active        BOOLEAN DEFAULT TRUE,   -- soft-delete / hide from store
  in_stock         BOOLEAN DEFAULT TRUE,
  sort_order       INT DEFAULT 0,
  created_at       TIMESTAMPTZ DEFAULT NOW(),
  updated_at       TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_products_category  ON products(category_id);
CREATE INDEX idx_products_slug      ON products(slug);
CREATE INDEX idx_products_active    ON products(is_active);
```

### 3.4 `product_variants` — Colors, Materials, Sizes

```sql
CREATE TABLE product_variants (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id   UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  label_az     TEXT NOT NULL,   -- "Qara Dəri"
  label_ru     TEXT NOT NULL,   -- "Чёрная кожа"
  label_en     TEXT NOT NULL,   -- "Black Leather"
  image_url    TEXT,            -- override image for this variant
  price_delta  NUMERIC(10, 2) DEFAULT 0,  -- add/subtract from base price
  in_stock     BOOLEAN DEFAULT TRUE,
  sort_order   INT DEFAULT 0
);

CREATE INDEX idx_variants_product ON product_variants(product_id);
```

### 3.5 `bundles` — Bundle Offers (e.g. CEO Starter Pack)

```sql
CREATE TABLE bundles (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name_az             TEXT NOT NULL,
  name_ru             TEXT NOT NULL,
  name_en             TEXT NOT NULL,
  slug                TEXT UNIQUE NOT NULL,
  description_az      TEXT,
  description_ru      TEXT,
  description_en      TEXT,
  discount_percentage NUMERIC(5, 2) NOT NULL DEFAULT 10,
  is_active           BOOLEAN DEFAULT TRUE,
  created_at          TIMESTAMPTZ DEFAULT NOW()
);
```

### 3.6 `bundle_items` — Junction: Bundles ↔ Products

```sql
CREATE TABLE bundle_items (
  bundle_id  UUID NOT NULL REFERENCES bundles(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  PRIMARY KEY (bundle_id, product_id)
);
```

### 3.7 Auto-update `updated_at`

```sql
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_updated_at
BEFORE UPDATE ON products
FOR EACH ROW EXECUTE FUNCTION update_updated_at();
```

### 3.8 Useful Views

```sql
-- Active flash sales (used by the Flash Deals banner)
CREATE VIEW active_flash_sales AS
SELECT * FROM products
WHERE is_active = TRUE
  AND discount_price IS NOT NULL
  AND (discount_ends_at IS NULL OR discount_ends_at > NOW());

-- Category tree (joins parent name for admin breadcrumb display)
CREATE VIEW category_tree AS
SELECT
  c.id, c.name_az, c.name_ru, c.name_en, c.slug, c.sort_order,
  p.name_az AS parent_name_az,
  p.name_ru AS parent_name_ru,
  p.name_en AS parent_name_en
FROM categories c
LEFT JOIN categories p ON c.parent_id = p.id;
```

---

## 4. Row Level Security (RLS)

Enable RLS on all tables so the database is protected even if the API key leaks.

```sql
-- Enable RLS
ALTER TABLE products         ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories       ENABLE ROW LEVEL SECURITY;
ALTER TABLE bundles          ENABLE ROW LEVEL SECURITY;
ALTER TABLE bundle_items     ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings         ENABLE ROW LEVEL SECURITY;

-- PUBLIC can read active products, categories, bundles
CREATE POLICY "Public read active products"
  ON products FOR SELECT
  USING (is_active = TRUE);

CREATE POLICY "Public read active categories"
  ON categories FOR SELECT
  USING (is_active = TRUE);

CREATE POLICY "Public read active bundles"
  ON bundles FOR SELECT
  USING (is_active = TRUE);

CREATE POLICY "Public read bundle items"
  ON bundle_items FOR SELECT
  USING (TRUE);

CREATE POLICY "Public read variants"
  ON product_variants FOR SELECT
  USING (TRUE);

CREATE POLICY "Public read settings"
  ON settings FOR SELECT
  USING (TRUE);

-- AUTHENTICATED (admin) can do everything
CREATE POLICY "Admin full access products"
  ON products FOR ALL
  USING (auth.role() = 'authenticated');

CREATE POLICY "Admin full access categories"
  ON categories FOR ALL
  USING (auth.role() = 'authenticated');

CREATE POLICY "Admin full access bundles"
  ON bundles FOR ALL
  USING (auth.role() = 'authenticated');

CREATE POLICY "Admin full access bundle_items"
  ON bundle_items FOR ALL
  USING (auth.role() = 'authenticated');

CREATE POLICY "Admin full access variants"
  ON product_variants FOR ALL
  USING (auth.role() = 'authenticated');

CREATE POLICY "Admin full access settings"
  ON settings FOR ALL
  USING (auth.role() = 'authenticated');
```

Also protect the Supabase Storage bucket:

- Bucket name: `product-images`
- Policy: Public read, authenticated write/delete only.

---

## 5. Environment Variables & Secrets

### `.env.local` (never commit this file)

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...  # Only used server-side for admin ops

# App
NEXT_PUBLIC_SITE_URL=https://kresloofis.az
NEXT_PUBLIC_DEFAULT_LOCALE=az

# ISR revalidation secret (used in /api/revalidate)
REVALIDATION_SECRET=some-random-string
```

### Vercel Dashboard

Add all the same variables in **Vercel → Project → Settings → Environment Variables**. The service role key must be marked **Server-only** (no `NEXT_PUBLIC_` prefix).

---

## 6. Localization Strategy

The Baku market uses three languages: Azerbaijani (primary), Russian (second most common), and English (fallback).

### URL Structure

```
kresloofis.az/az/           → Azerbaijani homepage
kresloofis.az/ru/           → Russian homepage
kresloofis.az/en/           → English homepage
kresloofis.az/              → Redirect to /az/ by default
```

### next-intl Setup

```typescript
// src/i18n.ts
import { getRequestConfig } from 'next-intl/server';

export default getRequestConfig(async ({ locale }) => ({
  messages: (await import(`../messages/${locale}.json`)).default
}));
```

### Translation File Structure (`messages/az.json`)

```json
{
  "nav": {
    "home": "Ana Səhifə",
    "categories": "Kateqoriyalar",
    "deals": "Endirimler",
    "contact": "Əlaqə"
  },
  "product": {
    "add_to_cart": "Səbətə əlavə et",
    "out_of_stock": "Stokda yoxdur",
    "sale_ends": "Endirim bitmək üzrədir"
  },
  "cart": {
    "order_via_whatsapp": "WhatsApp ilə sifariş ver",
    "message_template": "Salam! Sifariş vermək istəyirəm: {items}. Ümumi: {total} AZN. Stokda varmı?"
  }
}
```

### Product Names in Database

Since product names are stored in three columns (`name_az`, `name_ru`, `name_en`), the frontend reads the correct column based on the active locale:

```typescript
// lib/utils/localize.ts
export function localizeField<T extends { name_az: string; name_ru: string; name_en: string }>(
  obj: T,
  locale: string
): string {
  if (locale === 'az') return obj.name_az;
  if (locale === 'ru') return obj.name_ru;
  return obj.name_en;
}
```

---

## 7. Image Pipeline

### Client-Side Compression (Admin Dashboard)

```typescript
// lib/image-compress.ts
import imageCompression from 'browser-image-compression';

export async function compressForUpload(file: File): Promise<File> {
  return imageCompression(file, {
    maxSizeMB: 0.2,        // 200KB max
    maxWidthOrHeight: 1200, // Enough for full-width product images on retina
    useWebWorker: true,
    fileType: 'image/webp', // WebP = best quality/size ratio
  });
}
```

### Upload Flow

```typescript
// In the Admin product form submit handler
const compressed = await compressForUpload(selectedFile);
const filename = `products/${Date.now()}-${compressed.name}`;

const { data, error } = await supabase.storage
  .from('product-images')
  .upload(filename, compressed, { upsert: true });

const { data: { publicUrl } } = supabase.storage
  .from('product-images')
  .getPublicUrl(filename);

// Save publicUrl to products.image_url
```

### Serving Images

Use Next.js `<Image>` with Supabase's domain allowlisted:

```typescript
// next.config.ts
const config = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '*.supabase.co', pathname: '/storage/v1/object/public/**' }
    ]
  }
};
```

---

## 8. Public Storefront

### 8.1 Hero Section

A full-width banner with a premium office setup image. Headline in bold Azerbaijani (with Russian/English alternates loaded via locale). Two CTAs: "Shop Top Chairs" scrolls down to the product grid; "View Deals" scrolls to the Flash Sales row.

### 8.2 Flash Deals Banner

Horizontally scrollable row of cards. Each card is built from the `active_flash_sales` view and renders:
- Chair thumbnail
- Name (locale-aware)
- Struck-through original price in AZN
- Red bold discounted price
- Countdown timer (client component using `useEffect` + `setInterval`, seeded with `discount_ends_at`)

### 8.3 Category Grid

A responsive grid of large square cards pulled from top-level categories (`parent_id IS NULL`). Each card shows a representative product image and the category name. Clicking navigates to `/[locale]/category/[slug]`.

On the category page, if the category has subcategories, render a horizontal filter tab bar at the top so users can narrow down without leaving the page.

### 8.4 Product Grid & Cards

Each product card shows:
- Thumbnail (with `priority` on first 4 cards for LCP optimization)
- A "SALE" badge if `discount_price` is active
- "Out of Stock" overlay if `in_stock = FALSE`
- Name (locale-aware)
- Price (or strikethrough + discount price)
- "Add to Cart" button that opens the variant picker if variants exist

### 8.5 Single Product Page

- Image gallery (main image + `extra_images` thumbnails)
- Full description (locale-aware)
- Variant selector (color/material chips from `product_variants`)
- Price block with countdown timer if on sale
- "Add to Cart" button → Zustand store
- "Frequently Bought Together" section if the product belongs to a bundle: shows other bundle products and an "Add Bundle + Save 10%" CTA
- Breadcrumb: Home → Category → Subcategory → Product

### 8.6 Bundle & Save Section (Homepage)

A dedicated section rendering active bundles. Shows all products in the bundle, the individual total, and the discounted bundle price. One-click "Add Bundle to Cart" pushes all bundle products into the Zustand store simultaneously.

### 8.7 Instagram Trust Banner

A static grid of 4–6 lifestyle images curated from their Instagram (uploaded once to Supabase Storage, not fetched live via API to avoid token management). Displays "Join 75,000+ followers on Instagram" with a link to their profile. Update images seasonally via the Admin Dashboard.

### 8.8 Footer

- Logo and short tagline (locale-aware)
- Navigation links by category
- WhatsApp contact button (number pulled from `settings` table)
- Language switcher (AZ / RU / EN)
- Copyright line

---

## 9. Admin Dashboard

The admin area lives at `/admin/*` and is protected by Supabase Auth middleware. Only one authenticated user (the shop owner) can access it.

### 9.1 Auth Guard

```typescript
// middleware.ts
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';

export async function middleware(req) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });
  const { data: { session } } = await supabase.auth.getSession();

  if (!session && req.nextUrl.pathname.startsWith('/admin')) {
    return NextResponse.redirect(new URL('/admin/login', req.url));
  }
  return res;
}
```

### 9.2 Overview Dashboard

Three metric cards (fetched server-side on every load):
- **Total Active Products** — `SELECT COUNT(*) FROM products WHERE is_active = TRUE`
- **Active Flash Sales** — `SELECT COUNT(*) FROM active_flash_sales`
- **Total Categories** — `SELECT COUNT(*) FROM categories WHERE is_active = TRUE`

A recent activity list showing the last 5 updated products.

### 9.3 Product Manager

**Product List Table** (shadcn DataTable with TanStack Table):
- Columns: Thumbnail, Name (AZ), Category, Price, Discount Price, In Stock (toggle), Active (toggle), Actions
- Searchable by name
- Filterable by category
- Sortable by price, created_at

**Add / Edit Product Form** (shadcn Dialog/Sheet):
- Name inputs for AZ, RU, EN
- Slug (auto-generated from AZ name, editable)
- Category dropdown (shows full tree: "Manager Chairs → Executive Leather")
- Description textareas for AZ, RU, EN
- Price (AZN)
- Discount price + end date picker (shadcn Calendar popover)
- In Stock toggle
- Is Active toggle
- Sort order number input
- **Image Uploader:** Drag-and-drop zone. On file selection, runs `compressForUpload()` silently, shows a preview, then uploads to Supabase on form submit.
- **Extra Images:** Multi-image uploader for gallery shots.
- **Variants Tab:** Add/remove color or material variants with label (AZ/RU/EN), optional image override, and price delta.

### 9.4 Category Builder

A visual list showing the category tree. Each top-level category can be expanded to reveal its subcategories.

**Create Category Form:**
- Name inputs (AZ, RU, EN)
- Auto-generated slug
- Parent Category dropdown (or "None" for top-level)
- Sort order
- Is Active toggle

Drag-and-drop reordering updates `sort_order` in a batch update.

### 9.5 Hype Center (Promotions)

**Flash Sales Tab:**
- Shows all products with no active discount
- Each row has a "Set Sale Price" button that opens an inline popover: discount price field + end date picker
- Products with an active sale show a green badge and an "End Sale" button that NULLifies `discount_price` and `discount_ends_at`

**Bundle Creator Tab:**
- Form: Bundle name (AZ/RU/EN), discount percentage
- Multi-select product picker with search
- Saves to `bundles` + `bundle_items`
- List of existing bundles with edit/delete

### 9.6 Store Settings

A simple form with:
- WhatsApp number (saved to `settings` table under key `whatsapp_number`)
- Instagram profile URL (for the trust banner link)
- Store name (used in page titles and WhatsApp messages)

Submit triggers a server action that upserts the `settings` row.

---

## 10. Cart & WhatsApp Checkout

### 10.1 Zustand Store

```typescript
// lib/cart/store.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface CartItem {
  productId: string;
  name: string;       // locale-aware name at time of add
  price: number;      // actual price (discount if active, base otherwise)
  quantity: number;
  variantLabel?: string;
  imageUrl: string;
}

interface CartStore {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (productId: string, variantLabel?: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set) => ({
      items: [],
      addItem: (item) => set((state) => {
        const existing = state.items.find(
          (i) => i.productId === item.productId && i.variantLabel === item.variantLabel
        );
        if (existing) {
          return {
            items: state.items.map((i) =>
              i.productId === item.productId && i.variantLabel === item.variantLabel
                ? { ...i, quantity: i.quantity + item.quantity }
                : i
            )
          };
        }
        return { items: [...state.items, item] };
      }),
      removeItem: (productId, variantLabel) => set((state) => ({
        items: state.items.filter(
          (i) => !(i.productId === productId && i.variantLabel === variantLabel)
        )
      })),
      updateQuantity: (productId, quantity) => set((state) => ({
        items: state.items.map((i) =>
          i.productId === productId ? { ...i, quantity } : i
        )
      })),
      clearCart: () => set({ items: [] })
    }),
    { name: 'kreslo-cart' }
  )
);
```

### 10.2 Cart Drawer (shadcn Sheet)

A slide-out panel from the right edge. Shows:
- Each item: thumbnail, name, variant, quantity stepper, price, remove button
- Subtotal in AZN
- Note: "Prices in AZN. Delivery discussed with manager."
- Big green "Order via WhatsApp" button

### 10.3 WhatsApp Message Formatter

```typescript
// lib/whatsapp.ts
export function buildWhatsAppUrl(items: CartItem[], whatsappNumber: string, locale: string): string {
  const lines = items.map(
    (item) => `• ${item.quantity}x ${item.name}${item.variantLabel ? ` (${item.variantLabel})` : ''} — ${(item.price * item.quantity).toFixed(2)} AZN`
  );
  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  const templates = {
    az: `Salam! Sifariş vermək istəyirəm:\n${lines.join('\n')}\n\nÜmumi: ${total.toFixed(2)} AZN\nStokda varmı?`,
    ru: `Здравствуйте! Хочу заказать:\n${lines.join('\n')}\n\nИтого: ${total.toFixed(2)} AZN\nЕсть в наличии?`,
    en: `Hello! I'd like to order:\n${lines.join('\n')}\n\nTotal: ${total.toFixed(2)} AZN\nAre these in stock?`
  };

  const message = templates[locale as keyof typeof templates] ?? templates.az;
  return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
}
```

---

## 11. Promotion Engine

### Flash Sale Logic (Server Component)

```typescript
// components/storefront/FlashSaleBadge.tsx
const isOnSale = product.discount_price !== null &&
  (product.discount_ends_at === null || new Date(product.discount_ends_at) > new Date());
```

### Countdown Timer (Client Component)

```typescript
'use client';
export function Countdown({ endsAt }: { endsAt: string }) {
  const [timeLeft, setTimeLeft] = useState(getTimeLeft(endsAt));

  useEffect(() => {
    const interval = setInterval(() => setTimeLeft(getTimeLeft(endsAt)), 1000);
    return () => clearInterval(interval);
  }, [endsAt]);

  return <span>{timeLeft.hours}h {timeLeft.minutes}m {timeLeft.seconds}s</span>;
}
```

### Bundle Discount Calculation

```typescript
export function calcBundlePrice(products: Product[], discountPct: number): number {
  const subtotal = products.reduce((sum, p) => sum + (p.discount_price ?? p.price), 0);
  return subtotal * (1 - discountPct / 100);
}
```

---

## 12. SEO & Metadata

### Per-Page Dynamic Metadata

```typescript
// app/[locale]/product/[slug]/page.tsx
export async function generateMetadata({ params }): Promise<Metadata> {
  const product = await getProduct(params.slug);
  const name = localizeField(product, params.locale);

  return {
    title: `${name} | Kreslo Ofis`,
    description: localizeField(product, params.locale, 'description'),
    openGraph: {
      title: name,
      images: [{ url: product.image_url, width: 1200, height: 630 }],
      type: 'website',
      locale: params.locale === 'az' ? 'az_AZ' : params.locale === 'ru' ? 'ru_RU' : 'en_US',
    },
    alternates: {
      canonical: `https://kresloofis.az/${params.locale}/product/${params.slug}`,
      languages: {
        'az': `https://kresloofis.az/az/product/${params.slug}`,
        'ru': `https://kresloofis.az/ru/product/${params.slug}`,
        'en': `https://kresloofis.az/en/product/${params.slug}`,
      }
    }
  };
}
```

### Sitemap

```typescript
// app/sitemap.ts
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const products = await getAllProducts();
  const categories = await getAllCategories();
  const locales = ['az', 'ru', 'en'];

  const productUrls = products.flatMap((p) =>
    locales.map((locale) => ({
      url: `https://kresloofis.az/${locale}/product/${p.slug}`,
      lastModified: p.updated_at,
    }))
  );

  // ... similar for categories
  return [...productUrls, ...categoryUrls];
}
```

### Structured Data (JSON-LD)

Add Product schema on every product page for Google Shopping eligibility:

```typescript
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Product',
  name: name,
  image: product.image_url,
  offers: {
    '@type': 'Offer',
    price: product.discount_price ?? product.price,
    priceCurrency: 'AZN',
    availability: product.in_stock
      ? 'https://schema.org/InStock'
      : 'https://schema.org/OutOfStock',
  },
};
```

---

## 13. Analytics

Use Vercel Analytics (free, zero-config, GDPR-friendly):

```typescript
// app/layout.tsx
import { Analytics } from '@vercel/analytics/react';
export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
```

Track key custom events:

```typescript
import { track } from '@vercel/analytics';

// When user clicks "Add to Cart"
track('add_to_cart', { productSlug: product.slug, price: product.price });

// When user clicks "Order via WhatsApp"
track('whatsapp_checkout', { totalItems: items.length, totalValue: total });

// When user clicks "Add Bundle to Cart"
track('bundle_add', { bundleSlug: bundle.slug });
```

---

## 14. Deployment

### Supabase

1. Create project at supabase.com
2. Run all migration SQL files via Supabase Dashboard SQL editor (or `supabase db push`)
3. Create `product-images` storage bucket (set to public)
4. Invite the shop owner's email as the single auth user: Supabase Dashboard → Auth → Users → Invite

### Vercel

1. Connect GitHub repo to Vercel
2. Add all environment variables
3. Set `NEXT_PUBLIC_DEFAULT_LOCALE=az`
4. Deploy

### Custom Domain

Point `kresloofis.az` DNS A-record to Vercel's IP (provided in Vercel dashboard after deployment).

### On-Demand Revalidation

When admin saves a product, trigger ISR revalidation so the live site updates within seconds without a full redeploy:

```typescript
// In server action after saving product
await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/revalidate`, {
  method: 'POST',
  headers: { 'x-secret': process.env.REVALIDATION_SECRET! },
  body: JSON.stringify({ tag: 'products' }),
});
```

---

## 15. Performance Checklist

- Next.js `<Image>` with `priority` on hero and first 4 product cards
- WebP images at max 200KB from the compression pipeline
- Static generation (`generateStaticParams`) for all category and product pages
- ISR with 60-second revalidation as a fallback, plus on-demand revalidation on admin saves
- Zustand `persist` uses `localStorage`; cart survives page refresh without a server round-trip
- `loading="lazy"` on all below-the-fold images (Next.js default)
- Supabase queries use `.select()` with specific columns — never `SELECT *`

---

## 16. Color Palette & Typography

### Palette — "Premium Modern Office"

| Role | Hex | Usage |
|---|---|---|
| Primary | `#1A1A2E` | Navbar, headings, CTA buttons |
| Accent | `#C9A84C` | Gold highlights, "Sale" badge borders, hover states |
| Sale Red | `#E63946` | Sale badges, countdown timer text |
| Surface | `#F5F5F0` | Page background (warm off-white, not clinical) |
| Card | `#FFFFFF` | Product cards |
| Text | `#1A1A1A` | Body copy |
| Muted | `#6B7280` | Secondary labels, metadata |

### Typography

- **Headings:** `Syne` (Google Fonts) — geometric, modern, premium feel
- **Body:** `Inter` — universally legible, works well in AZ/RU character sets
- **Price figures:** `Syne` bold, slightly larger than surrounding text

### Tailwind Config Extension

```typescript
// tailwind.config.ts
theme: {
  extend: {
    colors: {
      primary: '#1A1A2E',
      accent: '#C9A84C',
      sale: '#E63946',
      surface: '#F5F5F0',
    },
    fontFamily: {
      display: ['Syne', 'sans-serif'],
      body: ['Inter', 'sans-serif'],
    }
  }
}
```

---

## 17. Phase-by-Phase Build Order

Build in this order so you have something testable at every stage.

### Phase 1 — Foundation (Week 1)
1. Scaffold Next.js project with TypeScript, Tailwind, shadcn/ui
2. Set up Supabase project and run all migration SQL
3. Configure next-intl with AZ/RU/EN translation files
4. Set up environment variables locally and on Vercel

### Phase 2 — Admin Core (Week 2)
5. Implement Supabase Auth login page at `/admin/login`
6. Build the middleware auth guard
7. Build the Product Manager (list + add/edit form with image upload)
8. Build the Category Builder
9. Seed 10–15 real products with images to have data to work with

### Phase 3 — Public Storefront (Week 3)
10. Build the Homepage: Hero, Flash Deals banner, Category grid, Instagram trust banner
11. Build the Category page with subcategory tab filter
12. Build the Single Product page with gallery and variants
13. Wire up the Zustand cart store and Cart Drawer

### Phase 4 — Promotions & Checkout (Week 4)
14. Build the Hype Center in Admin (flash sale setter + bundle creator)
15. Implement the Bundle section on the homepage and product page
16. Build the WhatsApp message formatter and "Order via WhatsApp" button
17. Add countdown timers to flash sale cards and product pages

### Phase 5 — Polish & Launch (Week 5)
18. Add per-page metadata and JSON-LD structured data
19. Generate sitemap
20. Add Vercel Analytics + custom event tracking
21. Implement on-demand ISR revalidation from Admin saves
22. Performance audit: Lighthouse score, image sizes, query counts
23. Test all three locales end-to-end
24. Point custom domain, go live

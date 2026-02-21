# Kreslo Ofis - Codebase Analysis Report

**Generated:** February 2026  
**Project:** E-commerce furniture store for Baku, Azerbaijan  
**Stack:** Next.js 16 · TypeScript · Tailwind CSS · shadcn/ui · Supabase

---

## 1. Executive Summary

This is a multilingual (AZ/RU/EN) e-commerce website for selling office furniture. The codebase follows Next.js App Router conventions with server components for data fetching and client components for interactivity. The project is approximately **60% complete** based on the original blueprint in `kreslo-ofis-plan.md`.

### Current Status
| Feature | Status | Notes |
|---------|--------|-------|
| i18n (AZ/RU/EN) | ✅ Complete | next-intl with file-based translations |
| Database Schema | ✅ Complete | Products, categories, variants, bundles |
| Admin Auth | ✅ Complete | Supabase Auth with protected routes |
| Product Management | ✅ Complete | CRUD with image upload & auto-translation |
| Category Management | ✅ Complete | CRUD with translations |
| Storefront | ✅ Complete | Homepage, category pages, product pages |
| WhatsApp Checkout | ✅ Complete | Pre-filled messages for ordering |
| Cart System | ❌ Missing | Planned Zustand cart store |
| Flash Sales UI | ⚠️ Partial | Database schema exists, no countdown UI |
| Bundles UI | ❌ Missing | Schema exists, no storefront display |
| Product Variants | ⚠️ Partial | Schema exists, no UI for managing variants |
| SEO/Sitemap | ❌ Missing | No sitemap, limited structured data |

---

## 2. Architecture Overview

### 2.1 Tech Stack
```
Frontend:    Next.js 16 (App Router) + React 19 + TypeScript
Styling:     Tailwind CSS 4 + shadcn/ui components
Database:    PostgreSQL via Supabase
Auth:        Supabase Auth (email/password)
i18n:        next-intl with URL prefix routing
State:       Zustand (installed but not implemented)
Forms:       React Hook Form + Zod validation
Images:      browser-image-compression + Supabase Storage
```

### 2.2 Directory Structure
```
src/
├── app/
│   ├── [locale]/              # Public storefront (localized)
│   │   ├── page.tsx           # Homepage
│   │   ├── categories/        # Category listing & detail
│   │   └── products/          # Product listing & detail
│   └── admin/                 # Admin dashboard (not localized)
│       ├── login/             # Auth page
│       └── (authenticated)/   # Protected admin routes
│           ├── products/      # Product CRUD
│           ├── categories/    # Category CRUD
│           ├── promotions/    # Placeholder
│           └── settings/      # Store settings
├── components/
│   ├── storefront/            # Public-facing UI
│   ├── admin/                 # Admin forms & navigation
│   ├── product/               # Product display components
│   └── ui/                    # shadcn/ui primitives
├── lib/
│   ├── supabase/              # Client & server Supabase instances
│   ├── actions/               # Server actions (translation)
│   ├── whatsapp.ts            # WhatsApp link generator
│   ├── image-compress.ts      # Client-side compression
│   └── color-utils.ts         # Color localization helpers
├── i18n/                      # next-intl configuration
├── types/                     # TypeScript types (auto-generated)
└── middleware.ts              # Auth + i18n routing
```

---

## 3. Database Schema Analysis

### 3.1 Tables
| Table | Purpose | Status |
|-------|---------|--------|
| `settings` | Key-value store for site config | ✅ Active |
| `categories` | Product categories (self-referencing tree) | ✅ Active |
| `products` | Main product catalog | ✅ Active |
| `product_variants` | Color/material variants | ⚠️ Schema only, no UI |
| `bundles` | Bundle offers | ⚠️ Schema only, no UI |
| `bundle_items` | Junction table for bundles | ⚠️ Schema only, no UI |

### 3.2 Views
- `active_flash_sales` - Products with active discounts
- `category_tree` - Categories with parent names

### 3.3 Key Observations
- **Trilanguage fields**: Every translatable entity has `_az`, `_ru`, `_en` columns
- **Soft delete**: Products use `is_active` flag rather than hard deletes
- **Discount logic**: `discount_price` + `discount_ends_at` for flash sales
- **JSON attributes**: Products have `attributes` JSONB column for flexible data (currently storing colors)

---

## 4. Routing Logic

### 4.1 Public Routes (Localized)
```
/                           → Redirects to /az/
/az/                        → Homepage (Azerbaijani)
/ru/                        → Homepage (Russian)  
/en/                        → Homepage (English)
/[locale]/categories        → All categories
/[locale]/categories/[slug] → Category detail with products
/[locale]/products          → All products
/[locale]/products/[slug]   → Product detail page
```

### 4.2 Admin Routes (Protected)
```
/admin/login                → Supabase Auth login
/admin/                     → Dashboard overview
/admin/products             → Product management
/admin/categories           → Category management
/admin/promotions           → Placeholder (not implemented)
/admin/settings             → Store settings
```

### 4.3 Middleware Logic
```typescript
// src/middleware.ts
- Admin routes: Pass through (auth checked in layout)
- Public routes: Apply next-intl middleware for locale detection
```

---

## 5. Component Analysis

### 5.1 Storefront Components
| Component | File | Purpose |
|-----------|------|---------|
| `GlobalNavbar` | `storefront/GlobalNavbar.tsx` | Navigation with category dropdown + locale switcher |
| `Footer` | `storefront/Footer.tsx` | Site footer with category links |
| `FeaturedCategories` | `storefront/FeaturedCategories.tsx` | Sidebar category list (desktop only) |
| `PopularProducts` | `storefront/PopularProducts.tsx` | Bento-grid product showcase |
| `Hero` | `storefront/Hero.tsx` | Hero section (exists, not used on homepage) |

### 5.2 Product Components
| Component | File | Purpose |
|-----------|------|---------|
| `ProductCard` | `product/product-card.tsx` | Product card with hover overlay + WhatsApp CTA |
| `ProductGrid` | `product/product-grid.tsx` | CSS Grid container for products |
| `DesktopGallery` | `product/desktop-gallery.tsx` | Product image gallery (desktop) |
| `MobileGallerySlider` | `product/mobile-gallery-slider.tsx` | Product image slider (mobile) |
| `SortDropdown` | `product/sort-dropdown.tsx` | Price sort control |

### 5.3 Admin Components
| Component | File | Purpose |
|-----------|------|---------|
| `Sidebar` | `admin/Sidebar.tsx` | Admin navigation |
| `ProductForm` | `admin/ProductForm.tsx` | Product create/edit dialog |
| `CategoryForm` | `admin/CategoryForm.tsx` | Category create/edit dialog |
| `SettingsForm` | `admin/SettingsForm.tsx` | Store settings form |

---

## 6. Business Logic Flows

### 6.1 Product Purchase Flow
```
User browses products → Click product → View details
       ↓
Click "Order via WhatsApp" → Opens WhatsApp with pre-filled message
       ↓
Merchant receives message → Manual order processing
```
**Note:** No cart system implemented. All purchases go directly through WhatsApp.

### 6.2 Admin Product Creation Flow
```
Admin fills form (AZ name) → Click "Auto-translate" → Server action calls translation API
       ↓
Compress images client-side → Upload to Supabase Storage
       ↓
Upsert to products table → router.refresh() to update UI
```

### 6.3 Localization Flow
```
Request arrives → middleware.ts detects locale
       ↓
next-intl loads messages/[locale].json
       ↓
Components use getTranslations() server-side or useTranslations() client-side
       ↓
Database queries use locale to select name_[locale] columns
```

---

## 7. Key Files Reference

### Data Fetching
| Pattern | Location |
|---------|----------|
| Server Components | Page files in `app/[locale]/` |
| Supabase Client (Server) | `lib/supabase/server.ts` |
| Supabase Client (Browser) | `lib/supabase/client.ts` |

### Authentication
| Pattern | Location |
|---------|----------|
| Login Page | `app/admin/login/page.tsx` |
| Auth Guard | `app/admin/(authenticated)/layout.tsx` |
| Session Check | `React.cache()` + `supabase.auth.getUser()` |

### Internationalization
| Pattern | Location |
|---------|----------|
| Config | `i18n/routing.ts`, `i18n/request.ts` |
| Messages | `messages/{az,ru,en}.json` |
| Locale Helper | `lib/color-utils.ts` (color name translations) |

---

## 8. Missing / Incomplete Features

### 8.1 High Priority (Core E-commerce)

#### Cart System
**Planned Location:** `lib/cart/store.ts`  
**Status:** Zustand installed but no store created  
**Impact:** Users cannot build multi-item orders; must WhatsApp each product individually

#### Product Variants UI
**Planned Location:** `admin/ProductForm.tsx` variants tab  
**Status:** Database table exists, no admin UI to manage variants  
**Impact:** Cannot offer color/material options with different prices

#### Flash Sales Countdown
**Planned Location:** `components/storefront/Countdown.tsx`  
**Status:** Schema has `discount_ends_at`, no UI component  
**Impact:** Discount expiry not visible to customers

#### Bundle Offers
**Planned Location:** Homepage section + admin UI  
**Status:** Tables exist, no UI anywhere  
**Impact:** Cannot create "buy together & save" promotions

### 8.2 Medium Priority (SEO & Performance)

#### Sitemap Generation
**Missing:** `app/sitemap.ts`  
**Impact:** Poor search engine indexing

#### Structured Data
**Status:** Basic Product schema on product pages  
**Missing:** Organization schema, BreadcrumbList schema

#### Image Optimization
**Status:** Uses Next.js `<Image>` with Supabase domain  
**Missing:** Blur placeholders for LCP optimization

### 8.3 Low Priority (Polish)

#### Mobile Navigation
**Status:** Menu button visible but non-functional  
**Location:** `GlobalNavbar.tsx:28-31`

#### Instagram Trust Banner
**Status:** Planned but not implemented

#### Analytics Events
**Status:** Vercel Analytics can be added, no custom events

---

## 9. Code Quality Assessment

### Strengths
- ✅ Clean separation of server/client components
- ✅ Type-safe database access with generated types
- ✅ Consistent localization pattern across all pages
- ✅ Proper Supabase SSR handling with cookie management
- ✅ Image compression before upload reduces storage costs
- ✅ React Hook Form + Zod for validated forms
- ✅ Auto-translation feature for admin efficiency

### Areas for Improvement

#### Error Handling
```typescript
// Current pattern (ProductForm.tsx:199-202)
if (error) {
  console.error(error);
  return;
}

// Recommended: User-facing error messages + toast notifications
```

#### Loading States
- No loading.tsx files for route segments
- Products page has `force-dynamic` but no streaming

#### Type Safety
```typescript
// Common pattern throughout codebase
const products = productsData as any[];  // Loses type safety

// Should use proper types from database.types.ts
```

#### Query Optimization
```typescript
// GlobalNavbar fetches categories on every page load
// Should be cached or fetched once in layout
const { data: categories } = await supabase.from('categories')...
```

---

## 10. Recommendations

### Phase 1: Complete E-commerce Features (Week 1-2)
1. **Implement Cart Store** - Zustand with localStorage persistence
2. **Add Cart Drawer** - Slide-out panel with checkout button
3. **Product Variants UI** - Admin tab to manage variants
4. **Flash Sale Countdown** - Client component with useEffect timer

### Phase 2: SEO & Performance (Week 3)
1. **Generate Sitemap** - Dynamic sitemap from products/categories
2. **Add Structured Data** - Full JSON-LD implementation
3. **Implement Loading States** - Skeleton components + streaming
4. **Mobile Navigation** - Sheet-based mobile menu

### Phase 3: Polish (Week 4)
1. **Bundle Offers** - Admin UI + storefront section
2. **Instagram Section** - Static images with Instagram link
3. **Analytics Events** - Track add_to_cart, whatsapp_checkout
4. **Toast Notifications** - Feedback for admin actions

### Phase 4: Technical Debt
1. **Fix Type Safety** - Remove `any` casts
2. **Add Error Boundaries** - Graceful error handling
3. **Query Deduplication** - Cache category/settings fetches
4. **Add Tests** - Vitest for utilities, Playwright for E2E

---

## 11. File Count Summary

```
Total TypeScript/TSX files: 58
├── Pages:              15
├── Components:         32
│   ├── UI (shadcn):    14
│   ├── Storefront:     6
│   ├── Product:        5
│   └── Admin:          4
├── Lib files:          8
├── Config:             3
└── Types:              1
```

---

## 12. Conclusion

The codebase is well-structured with modern Next.js patterns. The core storefront and admin CRUD are functional. The main gap is the **cart system** - currently users must WhatsApp each product individually. Implementing the cart, variants, and flash sale UI would bring the project to a launch-ready state.

**Estimated completion to MVP:** 2-3 weeks of focused development.

import { getTranslations } from 'next-intl/server';
import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ProductGrid } from '@/components/product/product-grid';
import { ProductCard } from '@/components/product/product-card';

export default async function CategoryPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
    const resolvedParams = await params;
    const { locale, slug } = resolvedParams;
    const t = await getTranslations('storefront');
    const nt = await getTranslations('nav');
    const ft = await getTranslations('footer');
    const supabase = await createClient();

    // Fetch the specific category by slug
    const { data: category } = await supabase
        .from('categories')
        .select('*')
        .eq('slug', slug)
        .eq('is_active', true)
        .single();

    if (!category) {
        notFound();
    }

    // Fetch all active categories for the sidebar
    const { data: allCategories } = await supabase
        .from('categories')
        .select('*')
        .eq('is_active', true)
        .order('sort_order', { ascending: true });

    // Fetch products belonging to this category
    const { data: products } = await supabase
        .from('products')
        .select('*')
        .eq('category_id', category.id)
        .eq('is_active', true)
        .order('sort_order', { ascending: true });

    const localizedCategoryName = String(category[`name_${locale}` as keyof typeof category] || category.name_az);

    return (
        <div className="flex flex-col md:grid grid-cols-12 md:gap-sides min-h-screen pb-12">
            {/* Left sidebar — sticky filter panel */}
            <aside className="col-span-3 max-md:hidden grid sticky top-0 grid-cols-3 h-screen min-h-max pl-sides pt-top-spacing border-r border-zinc-200">
                <div className="flex flex-col col-span-3 xl:col-span-2 gap-4">
                    <div className="flex justify-between items-baseline pl-2 -mb-2">
                        <h2 className="text-2xl font-semibold">{t('filter')}</h2>
                    </div>

                    <div className="flex flex-col gap-1 pl-2">
                        <h3 className="text-sm font-semibold text-muted-foreground mb-2 uppercase tracking-wide">{nt('categories')}</h3>
                        {allCategories?.map(cat => {
                            const localizedName = String(cat[`name_${locale}` as keyof typeof cat] || cat.name_az);
                            const isActive = cat.slug === slug;
                            return (
                                <Link
                                    key={cat.id}
                                    href={`/${locale}/categories/${cat.slug}`}
                                    className={`text-sm py-1 transition-colors ${isActive ? 'text-black font-semibold' : 'text-foreground/70 hover:text-foreground'}`}
                                >
                                    {localizedName}
                                </Link>
                            );
                        })}
                    </div>
                </div>

                <div className="col-span-3 self-end pb-sides">
                    <ul className="flex flex-col-reverse gap-2 py-sides text-xs 2xl:text-sm">
                        <li><Link href={`/${locale}`} className="text-muted-foreground hover:text-foreground transition-colors">{ft('home')}</Link></li>
                        <li><Link href={`/${locale}#contact`} className="text-muted-foreground hover:text-foreground transition-colors">{ft('contact')}</Link></li>
                    </ul>
                </div>
            </aside>

            {/* Right content — product grid */}
            <div className="col-span-9 flex flex-col h-full md:pt-top-spacing">
                {/* Results bar */}
                <div className="grid grid-cols-3 items-center mb-4 w-full pr-sides mt-4 md:mt-0 px-4 md:px-0">
                    <div className="ml-1 col-span-2">
                        <nav className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Link href={`/${locale}`} className="hover:text-foreground transition-colors">{ft('home')}</Link>
                            <span>/</span>
                            <Link href={`/${locale}/categories`} className="hover:text-foreground transition-colors">{nt('categories')}</Link>
                            <span>/</span>
                            <span className="text-foreground font-semibold">{localizedCategoryName}</span>
                        </nav>
                    </div>
                    <p className="text-right text-sm text-muted-foreground">
                        {t('results', { count: products?.length || 0 })}
                    </p>
                </div>

                <div className="mb-8 px-4 md:px-0">
                    <h1 className="text-3xl md:text-5xl font-bold tracking-tight">{localizedCategoryName}</h1>
                </div>

                {/* Product grid */}
                {products && products.length > 0 ? (
                    <ProductGrid>
                        {products.map((product) => (
                            <ProductCard key={product.id} product={product} locale={locale} />
                        ))}
                    </ProductGrid>
                ) : (
                    <div className="flex flex-1 items-center justify-center mr-sides rounded-md border border-zinc-200 bg-zinc-50 min-h-[400px] m-4 md:m-0">
                        <p className="text-muted-foreground font-medium text-lg">{t('no_products')}</p>
                    </div>
                )}
            </div>
        </div>
    );
}

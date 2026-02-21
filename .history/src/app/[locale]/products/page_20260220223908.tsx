import { getTranslations } from 'next-intl/server';
import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { ProductGrid } from '@/components/product/product-grid';
import { ProductCard } from '@/components/product/product-card';

export default async function ProductsIndexPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    const t = await getTranslations('storefront');
    const ft = await getTranslations('footer');
    const nt = await getTranslations('nav');
    const supabase = await createClient();

    const { data: categories } = await supabase
        .from('categories')
        .select('*')
        .eq('is_active', true)
        .order('sort_order', { ascending: true });

    const { data: products } = await supabase
        .from('products')
        .select('*')
        .eq('is_active', true)
        .order('sort_order', { ascending: true });

    const formatter = new Intl.NumberFormat(locale, { style: 'currency', currency: 'AZN' });

    return (
        <div className="flex flex-col md:grid grid-cols-12 md:gap-sides">
            {/* Left sidebar — sticky filter panel */}
            <aside className="col-span-3 max-md:hidden grid sticky top-0 grid-cols-3 h-screen min-h-max pl-sides pt-top-spacing">
                <div className="flex flex-col col-span-3 xl:col-span-2 gap-4">
                    <div className="flex justify-between items-baseline pl-2 -mb-2">
                        <h2 className="text-2xl font-semibold">{t('filter')}</h2>
                    </div>

                    <div className="flex flex-col gap-1 pl-2">
                        <h3 className="text-sm font-semibold text-muted-foreground mb-2 uppercase tracking-wide">{nt('categories')}</h3>
                        {categories?.map(cat => {
                            const localizedName = String(cat[`name_${locale}` as keyof typeof cat] || cat.name_az);
                            return (
                                <Link
                                    key={cat.id}
                                    href={`/${locale}/categories/${cat.slug}`}
                                    className="text-sm text-foreground/70 hover:text-foreground py-1 transition-colors"
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
                <div className="grid grid-cols-3 items-center mb-1 w-full pr-sides">
                    <div className="ml-1">
                        <nav className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Link href={`/${locale}`} className="hover:text-foreground transition-colors">{ft('home')}</Link>
                            <span>/</span>
                            <span className="text-foreground font-medium">{t('shop')}</span>
                        </nav>
                    </div>
                    <p className="text-center text-sm text-muted-foreground">
                        {t('results', { count: products?.length || 0 })}
                    </p>
                    <div />
                </div>

                {/* Product grid */}
                {products && products.length > 0 ? (
                    <ProductGrid>
                        {products.map((product) => (
                            <ProductCard key={product.id} product={product} locale={locale} />
                        ))}
                    </ProductGrid>
                ) : (
                    <div className="flex flex-1 items-center justify-center mr-sides rounded-md border bg-card">
                        <p className="text-muted-foreground font-medium">{t('no_products')}</p>
                    </div>
                )}
            </div>
        </div>
    );
}

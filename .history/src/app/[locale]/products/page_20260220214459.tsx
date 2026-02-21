import { getTranslations } from 'next-intl/server';
import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRightIcon } from 'lucide-react';

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

    const formatter = new Intl.NumberFormat(locale, { style: 'currency', currency: 'USD' });

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
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
                        {products.map((product) => {
                            const localizedName = String(product[`name_${locale}` as keyof typeof product] || product.name_az);
                            const formattedPrice = formatter.format(product.price);

                            return (
                                <div key={product.id} className="relative w-full aspect-[3/4] md:aspect-square bg-muted group overflow-hidden">
                                    <Link
                                        href={`/${locale}/products/${product.slug}`}
                                        className="block size-full focus-visible:outline-none"
                                        prefetch
                                    >
                                        <Image
                                            src={product.image_url}
                                            alt={localizedName}
                                            fill
                                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                            className="object-cover size-full"
                                        />
                                    </Link>

                                    <div className="absolute inset-0 p-2 w-full pointer-events-none">
                                        <div className="flex gap-6 justify-between items-baseline px-3 py-1 w-full font-semibold transition-all duration-300 translate-y-0 max-md:hidden group-hover:opacity-0 group-hover:-translate-y-full">
                                            <p className="text-sm uppercase 2xl:text-base text-balance">{localizedName}</p>
                                            <p className="text-sm uppercase 2xl:text-base whitespace-nowrap">{formattedPrice}</p>
                                        </div>

                                        <div className="flex absolute inset-x-3 bottom-3 flex-col gap-8 px-2 py-3 rounded-md transition-all duration-300 pointer-events-none bg-popover md:opacity-0 group-hover:opacity-100 md:translate-y-1/3 group-hover:translate-y-0 group-hover:pointer-events-auto max-md:pointer-events-auto">
                                            <div className="grid grid-cols-2 gap-x-4 gap-y-8 items-end">
                                                <p className="text-lg font-semibold text-pretty">{localizedName}</p>
                                                <div className="flex gap-2 items-center place-self-end text-lg font-semibold">
                                                    {formattedPrice}
                                                </div>
                                                <div />
                                                <Link
                                                    href={`/${locale}/products/${product.slug}`}
                                                    className="col-start-2 flex items-center justify-between w-full px-3 py-2 bg-foreground text-background text-sm font-semibold rounded-sm hover:opacity-90 transition-opacity"
                                                >
                                                    <span>{t('view_product')}</span>
                                                    <ArrowRightIcon className="w-4 h-4" />
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="flex flex-1 items-center justify-center mr-sides rounded-md border bg-card">
                        <p className="text-muted-foreground font-medium">{t('no_products')}</p>
                    </div>
                )}
            </div>
        </div>
    );
}

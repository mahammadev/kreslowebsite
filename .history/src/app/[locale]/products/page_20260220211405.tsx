import { getTranslations } from 'next-intl/server';
import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import Image from 'next/image';

export default async function ProductsIndexPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    const t = await getTranslations('storefront');
    const supabase = await createClient();

    const { data: products } = await supabase
        .from('products')
        .select('*')
        .eq('is_active', true)
        .order('sort_order', { ascending: true });

    if (!products || products.length === 0) {
        return (
            <main className="min-h-screen pt-top-spacing pb-sides flex items-center justify-center bg-background">
                <p className="font-mono text-muted-foreground uppercase tracking-widest text-sm">
                    No products available.
                </p>
            </main>
        );
    }

    const formatter = new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: 'USD',
    });

    return (
        <main className="min-h-screen bg-background text-foreground pt-top-spacing">

            {/* Page header — template style */}
            <div className="base-grid px-sides py-sides border-b border-border">
                <div className="col-span-12 md:col-span-3">
                    <p className="font-mono text-xs font-bold uppercase tracking-widest text-muted-foreground">
                        §02 / Inventory
                    </p>
                </div>
                <div className="col-span-12 md:col-span-9 md:border-l border-foreground/10 md:pl-8">
                    <h1 className="text-4xl md:text-6xl font-semibold tracking-tighter leading-tight text-balance">
                        {t('popular_products_title')}
                    </h1>
                    <p className="text-muted-foreground text-base mt-2">
                        {products.length} items
                    </p>
                </div>
            </div>

            {/* Product grid — template card style with floating label */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 border-b border-l border-border">
                {products.map((product) => {
                    const localizedName = String(product[`name_${locale}` as keyof typeof product] || product.name_az);

                    return (
                        <Link
                            key={product.id}
                            href={`/${locale}/products/${product.slug}`}
                            className="group flex flex-col border-r border-b border-border bg-background hover:bg-card transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                        >
                            {/* Image area */}
                            <div className="relative w-full aspect-[4/5] overflow-hidden">
                                {/* SKU overlay */}
                                <div className="absolute top-sides left-sides z-20 font-mono text-xs font-bold text-foreground/30 pointer-events-none mix-blend-multiply">
                                    {product.sku}
                                </div>

                                <Image
                                    src={product.image_url}
                                    alt={localizedName}
                                    fill
                                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                                />
                            </div>

                            {/* Floating product label — template style */}
                            <div className="p-sides border-t border-border flex items-center gap-3">
                                <div className="flex-1 min-w-0">
                                    <h3 className="text-sm font-semibold text-foreground/80 group-hover:text-foreground truncate mb-1 transition-colors">
                                        {localizedName}
                                    </h3>
                                    <div className="text-sm font-semibold text-foreground">
                                        {formatter.format(product.price)}
                                    </div>
                                </div>
                                <div className="shrink-0 w-8 h-8 flex items-center justify-center rounded-sm border border-border group-hover:bg-foreground group-hover:text-background group-hover:border-foreground transition-colors text-foreground text-sm font-semibold">
                                    →
                                </div>
                            </div>
                        </Link>
                    );
                })}
            </div>

        </main>
    );
}

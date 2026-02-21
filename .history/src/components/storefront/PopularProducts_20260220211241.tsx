import { getTranslations, getLocale } from 'next-intl/server';
import Image from 'next/image';
import Link from 'next/link';
import { generateWhatsAppLink } from '@/lib/whatsapp';
import { createClient } from '@/lib/supabase/server';

export const PopularProducts = async () => {
    const t = await getTranslations('storefront');
    const locale = await getLocale();
    const supabase = await createClient();

    const { data: products } = await supabase
        .from('products')
        .select(`
            id, 
            name_az, 
            name_ru, 
            name_en, 
            price, 
            category:categories(slug), 
            sku, 
            image_url, 
            slug
        `)
        .eq('is_active', true)
        .order('sort_order', { ascending: true })
        .limit(8);

    const formatter = new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: 'USD',
    });

    const phoneNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "994505372177";

    if (!products || products.length === 0) {
        return null;
    }

    return (
        <section className="bg-background text-foreground border-t border-border">
            <div className="w-full">

                {/* Section header */}
                <div className="base-grid px-sides py-sides">
                    <div className="col-span-12 md:col-span-3">
                        <p className="font-mono text-xs font-bold uppercase tracking-widest text-muted-foreground">
                            §02 / Inventory
                        </p>
                    </div>
                    <div className="col-span-12 md:col-span-6 md:border-l border-foreground/10 md:pl-8">
                        <h2 className="text-4xl md:text-5xl font-semibold tracking-tighter leading-tight text-balance">
                            {t('popular_products_title')}
                        </h2>
                    </div>
                    <div className="col-span-12 md:col-span-3 flex items-end justify-start md:justify-end">
                        <Link
                            href={`/${locale}/products`}
                            className="font-semibold uppercase tracking-widest text-xs border border-foreground px-6 py-3 hover:bg-foreground hover:text-background transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                        >
                            {t('view_all_products')}
                        </Link>
                    </div>
                </div>

                {/* Product grid — template card style */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 border-t border-l border-border">
                    {products.map((product) => {
                        const localizedName = String(product[`name_${locale}` as keyof typeof product] || product.name_az);
                        const formattedPrice = formatter.format(product.price);
                        const waLink = generateWhatsAppLink(phoneNumber, `${localizedName} - ${formattedPrice}`, product.sku, locale);

                        return (
                            <div key={product.id} className="group flex flex-col border-r border-b border-border bg-background">

                                {/* Product image */}
                                <Link
                                    href={`/${locale}/products/${product.slug}`}
                                    className="relative aspect-[4/5] block overflow-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                                >
                                    {/* SKU label */}
                                    <div className="absolute top-sides left-sides z-20 font-mono text-xs font-bold text-foreground/40 pointer-events-none">
                                        {product.sku}
                                    </div>

                                    <Image
                                        src={product.image_url}
                                        alt={localizedName}
                                        fill
                                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                                    />
                                </Link>

                                {/* Floating info label — template style */}
                                <div className="flex gap-2 items-center p-sides border-t border-border bg-background group-hover:bg-card transition-colors">
                                    <div className="flex-1 min-w-0">
                                        <Link
                                            href={`/${locale}/products/${product.slug}`}
                                            className="block truncate text-sm font-semibold text-foreground/80 hover:text-foreground mb-1 transition-colors"
                                        >
                                            {localizedName}
                                        </Link>
                                        <div className="text-sm font-semibold text-foreground">
                                            {formattedPrice}
                                        </div>
                                    </div>

                                    {/* WhatsApp CTA */}
                                    <a
                                        href={waLink}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="shrink-0 w-9 h-9 flex items-center justify-center rounded-sm bg-foreground text-background text-xs font-bold hover:opacity-80 transition-opacity focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                                        aria-label={`Buy ${localizedName} via WhatsApp`}
                                    >
                                        →
                                    </a>
                                </div>

                            </div>
                        );
                    })}
                </div>

            </div>
        </section>
    );
};

import { getTranslations, getLocale } from 'next-intl/server';
import Image from 'next/image';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { BundleActions } from './BundleActions';

interface BundleWithProducts {
    id: string;
    slug: string;
    name_az: string;
    name_ru: string;
    name_en: string;
    description_az: string | null;
    description_ru: string | null;
    description_en: string | null;
    discount_percentage: number;
    products: {
        id: string;
        name_az: string;
        name_ru: string;
        name_en: string;
        price: number;
        discount_price: number | null;
        image_url: string;
        slug: string;
    }[];
}

export const BundleSection = async () => {
    const locale = await getLocale();
    const t = await getTranslations('storefront');
    const supabase = await createClient();

    const { data: bundlesData } = await supabase
        .from('bundles')
        .select(`
            id,
            slug,
            name_az,
            name_ru,
            name_en,
            description_az,
            description_ru,
            description_en,
            discount_percentage,
            products:bundle_items(
                products(
                    id,
                    name_az,
                    name_ru,
                    name_en,
                    price,
                    discount_price,
                    image_url,
                    slug
                )
            )
        `)
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(3);

    if (!bundlesData || bundlesData.length === 0) return null;

    const bundles = bundlesData.map((bundle): BundleWithProducts => ({
        ...bundle,
        products: bundle.products?.map((p: any) => p.products).filter(Boolean) || [],
    }));

    const formatter = new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: 'AZN',
    });

    const calculateBundlePrice = (products: BundleWithProducts['products'], discountPct: number) => {
        const subtotal = products.reduce((sum, p) => sum + (p.discount_price ?? p.price), 0);
        return subtotal * (1 - discountPct / 100);
    };

    const calculateOriginalPrice = (products: BundleWithProducts['products']) => {
        return products.reduce((sum, p) => sum + (p.discount_price ?? p.price), 0);
    };

    return (
        <section className="px-4 md:px-8 xl:px-16 py-12 md:py-16">
            <div className="max-w-[1600px] mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl md:text-3xl font-bold">
                        {locale === 'az' ? 'Paket Təklifləri' : locale === 'ru' ? 'Пакетные предложения' : 'Bundle Offers'}
                    </h2>
                    <p className="text-muted-foreground">
                        {locale === 'az' ? 'Birlikdə al, qənaət et!' : locale === 'ru' ? 'Купите вместе и сэкономьте!' : 'Buy together & save!'}
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {bundles.map((bundle) => {
                        const localizedName = String(bundle[`name_${locale}` as keyof typeof bundle] || bundle.name_az);
                        const localizedDesc = String(bundle[`description_${locale}` as keyof typeof bundle] || bundle.description_az || '');
                        const originalPrice = calculateOriginalPrice(bundle.products);
                        const bundlePrice = calculateBundlePrice(bundle.products, bundle.discount_percentage);
                        const savings = originalPrice - bundlePrice;

                        return (
                            <div
                                key={bundle.id}
                                className="bg-white border border-zinc-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                            >
                                {/* Product Images Grid */}
                                <div className="grid grid-cols-2 gap-1 p-2 bg-muted/30">
                                    {bundle.products.slice(0, 4).map((product) => (
                                        <Link
                                            key={product.id}
                                            href={`/${locale}/products/${product.slug}`}
                                            className="relative aspect-square overflow-hidden rounded-md bg-white"
                                        >
                                            <Image
                                                src={product.image_url}
                                                alt={String(product[`name_${locale}` as keyof typeof product] || product.name_az)}
                                                fill
                                                className="object-cover hover:scale-105 transition-transform"
                                                sizes="(max-width: 768px) 50vw, 200px"
                                            />
                                        </Link>
                                    ))}
                                    {bundle.products.length === 1 && (
                                        <div className="aspect-square rounded-md bg-muted/50 flex items-center justify-center">
                                            <span className="text-muted-foreground text-sm">+ More</span>
                                        </div>
                                    )}
                                </div>

                                {/* Bundle Info */}
                                <div className="p-4">
                                    <h3 className="text-lg font-semibold mb-1">{localizedName}</h3>
                                    {localizedDesc && (
                                        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{localizedDesc}</p>
                                    )}

                                    {/* Products List */}
                                    <div className="space-y-1 mb-4">
                                        {bundle.products.map((product) => (
                                            <div key={product.id} className="text-sm text-muted-foreground flex justify-between">
                                                <span className="truncate">{String(product[`name_${locale}` as keyof typeof product] || product.name_az)}</span>
                                                <span className="ml-2 flex-shrink-0">{formatter.format(product.discount_price ?? product.price)}</span>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Pricing */}
                                    <div className="border-t pt-4">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-sm text-muted-foreground line-through">
                                                {formatter.format(originalPrice)}
                                            </span>
                                            <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded">
                                                -{bundle.discount_percentage}%
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-2xl font-bold text-green-600">
                                                {formatter.format(bundlePrice)}
                                            </span>
                                            <span className="text-sm text-green-600 font-medium">
                                                {locale === 'az' ? `${formatter.format(savings)} qənaət` : locale === 'ru' ? `Сэкономьте ${formatter.format(savings)}` : `Save ${formatter.format(savings)}`}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Add to Cart Button */}
                                    <BundleActions bundle={bundle} locale={locale} bundlePrice={bundlePrice} />
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

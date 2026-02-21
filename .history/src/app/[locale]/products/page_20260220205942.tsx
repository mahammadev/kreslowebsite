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
            <main className="min-h-screen pt-32 pb-16 flex items-center justify-center">
                <p className="font-mono text-zinc-500 uppercase tracking-widest">No products available.</p>
            </main>
        );
    }

    const formatter = new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: 'USD',
    });

    return (
        <main className="min-h-screen bg-white text-black pt-32 pb-16">
            <div className="container mx-auto max-w-[1400px]">

                {/* Header Block */}
                <div className="px-4 lg:px-12 mb-16 text-center">
                    <p className="font-mono text-xs font-bold uppercase tracking-widest text-zinc-400 mb-4">
                        Idx. 02 / Inventory
                    </p>
                    <h1 className="text-4xl md:text-6xl lg:text-8xl font-black uppercase tracking-tighter mb-4 text-balance">
                        {t('popular_products_title')}
                    </h1>
                </div>

                {/* Swiss Layout Image Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 px-4 lg:px-12">
                    {products.map((product) => {
                        const localizedName = String(product[`name_${locale}` as keyof typeof product] || product.name_az);

                        return (
                            <Link
                                key={product.id}
                                href={`/${locale}/products/${product.slug}`}
                                className="group flex flex-col focus-visible:ring-4 focus-visible:ring-black focus-visible:outline-none"
                            >
                                <div className="w-full aspect-[4/5] bg-zinc-900 overflow-hidden relative mb-6">
                                    <Image
                                        src={product.image_url}
                                        alt={localizedName}
                                        fill
                                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                                        className="object-cover transition-transform duration-[10s] group-hover:scale-110 ease-linear contrast-125 grayscale group-hover:grayscale-0"
                                    />

                                    {/* SKU HUD */}
                                    <div className="absolute top-4 left-4 mix-blend-difference text-white font-mono text-xs font-bold pointer-events-none">
                                        {product.sku}
                                    </div>
                                </div>

                                <div className="flex flex-col flex-1 pb-4 border-b-2 border-transparent group-hover:border-black transition-colors">
                                    <h3 className="text-xl md:text-2xl font-black uppercase tracking-tighter leading-tight mb-2">
                                        {localizedName}
                                    </h3>

                                    <div className="mt-auto font-mono text-lg font-bold">
                                        {formatter.format(product.price)}
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </main>
    );
}

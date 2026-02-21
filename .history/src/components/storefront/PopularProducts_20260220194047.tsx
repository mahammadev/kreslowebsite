import { getTranslations, getLocale } from 'next-intl/server';
import Image from 'next/image';
import Link from 'next/link';
import { generateWhatsAppLink } from '@/lib/whatsapp';
import { createClient } from '@/lib/supabase/server';

export const PopularProducts = async () => {
    const t = await getTranslations('storefront');
    const locale = await getLocale();
    const supabase = await createClient();

    // Fetch active products from Supabase
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
        .limit(4);

    const formatter = new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: 'USD',
    });

    const phoneNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "994505372177";

    if (!products || products.length === 0) {
        return null; // Gracefully hide the section if no products exist
    }

    return (
        <section className="bg-white text-black border-t-8 border-black pt-16 lg:pt-24 pb-32">
            <div className="container mx-auto max-w-[1400px] px-4 lg:px-12">

                {/* Header Lockup */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end border-b-4 border-black pb-8 mb-0">
                    <div className="space-y-4 max-w-2xl">
                        <p className="font-mono text-xs font-bold uppercase tracking-widest text-zinc-400">
                            Idx. 02 / Inventory Status
                        </p>
                        <h2 className="text-5xl md:text-6xl font-black uppercase tracking-tighter leading-none">
                            {t('popular_products_title')}
                        </h2>
                    </div>
                    <Link
                        href="/products"
                        className="mt-8 md:mt-0 font-bold uppercase tracking-widest text-sm hover:bg-black hover:text-white border-2 border-black px-8 py-4 transition-colors focus-visible:ring-4 focus-visible:ring-black focus-visible:outline-none"
                    >
                        {t('view_all_products')} [ + ]
                    </Link>
                </div>

                {/* Gapless Border Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 border-b-[1px] border-l-[1px] border-black">
                    {products.map((product) => {
                        // Dynamic localization picking
                        const localizedName = String(product[`name_${locale}` as keyof typeof product] || product.name_az);
                        const formattedPrice = formatter.format(product.price);
                        const waLink = generateWhatsAppLink(phoneNumber, `${localizedName} - ${formattedPrice}`, product.sku, locale);
                        const categorySlug = product.category ? (product.category as any).slug?.toUpperCase() : 'ITEM';

                        return (
                            <div key={product.id} className="group flex flex-col border-r-[1px] border-black relative bg-white">

                                {/* Rigid Graphic Top */}
                                <Link
                                    href={`/products/${product.slug}`}
                                    className="relative aspect-[4/5] block overflow-hidden border-b-[1px] border-black focus-visible:ring-4 focus-visible:ring-black focus-visible:outline-none focus-[z-index:10]"
                                >
                                    <div className="absolute top-4 left-4 z-20 flex flex-col font-mono text-xs font-bold mix-blend-difference text-white">
                                        <span>{product.sku}</span>
                                        <span>{categorySlug}</span>
                                    </div>
                                    <Image
                                        src={product.image_url}
                                        alt={product.slug}
                                        fill
                                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                                        className="object-cover grayscale contrast-125 group-hover:scale-105 transition-transform duration-[10s] ease-linear"
                                    />
                                </Link>

                                {/* Typographic Information Panel */}
                                <div className="p-6 flex flex-col flex-1 justify-between group-hover:bg-black group-hover:text-white transition-colors duration-0">
                                    <Link
                                        href={`/products/${product.slug}`}
                                        className="focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none"
                                    >
                                        <h3 className="text-2xl font-black uppercase tracking-tight leading-none mb-6">
                                            {localizedName}
                                        </h3>
                                    </Link>

                                    <div className="flex items-end justify-between w-full mt-auto border-t border-black group-hover:border-white pt-4">
                                        <span className="font-mono text-xl font-bold tracking-tighter">
                                            {formattedPrice}
                                        </span>
                                        <a
                                            href={waLink}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="font-bold uppercase tracking-widest text-xs p-2 border border-transparent hover:border-white focus-visible:border-white focus-visible:outline-none"
                                            aria-label={`Buy ${product.slug} via WhatsApp`}
                                        >
                                            Buy
                                        </a>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>

            </div>
        </section>
    );
};

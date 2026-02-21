import { getTranslations, getLocale } from 'next-intl/server';
import Image from 'next/image';
import Link from 'next/link';
import { generateWhatsAppLink } from '@/lib/whatsapp';
import { createClient } from '@/lib/supabase/server';
import { ArrowRightIcon } from 'lucide-react';

export const PopularProducts = async () => {
    const t = await getTranslations('storefront');
    const locale = await getLocale();
    const supabase = await createClient();

    const { data: products } = await supabase
        .from('products')
        .select(`
            id, name_az, name_ru, name_en, price,
            category:categories(slug), sku, image_url, slug
        `)
        .eq('is_active', true)
        .order('sort_order', { ascending: true })
        .limit(8);

    const formatter = new Intl.NumberFormat(locale, { style: 'currency', currency: 'USD' });
    const phoneNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "994505372177";

    if (!products || products.length === 0) return null;

    return (
        <section>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
                {products.map((product) => {
                    const localizedName = String(product[`name_${locale}` as keyof typeof product] || product.name_az);
                    const formattedPrice = formatter.format(product.price);
                    const waLink = generateWhatsAppLink(phoneNumber, `${localizedName} - ${formattedPrice}`, product.sku, locale);

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
                                        <div className="self-center" />
                                        <a
                                            href={waLink}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="col-start-2 flex items-center justify-between w-full px-3 py-2 bg-foreground text-background text-sm font-semibold rounded-sm hover:opacity-90 transition-opacity"
                                        >
                                            <span>{t('buy')}</span>
                                            <ArrowRightIcon className="w-4 h-4" />
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </section>
    );
};

import { getTranslations, getLocale } from 'next-intl/server';
import Image from 'next/image';
import Link from 'next/link';
import { generateWhatsAppLink } from '@/lib/whatsapp';
import { createClient } from '@/lib/supabase/server';
import { PlusIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

const getLabelPosition = (index: number): 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' => {
    const positions = ['top-left', 'bottom-right', 'top-right', 'bottom-left'] as const;
    return positions[index % positions.length];
};

export const PopularProducts = async () => {
    const t = await getTranslations('storefront');
    const locale = await getLocale();
    const supabase = await createClient();

    const { data: products } = await supabase
        .from('products')
        .select(`
            id, name_az, name_ru, name_en, price, description_az, description_ru, description_en,
            category:categories(slug), sku, image_url, slug
        `)
        .eq('is_active', true)
        .order('sort_order', { ascending: true })
        .limit(9);

    const formatter = new Intl.NumberFormat(locale, { style: 'currency', currency: 'AZN' });
    const phoneNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "994505372177";

    if (!products || products.length === 0) return null;

    const [principalProduct, ...restProducts] = products;

    return (
        <>
            {/* Principal card — col-span-2, full-bleed hero with floating info box */}
            <PrincipalCard product={principalProduct} locale={locale} formatter={formatter} phoneNumber={phoneNumber} t={t} />

            {/* Bento grid — col-span-1 squares with floating labels at alternating corners */}
            {restProducts.map((product, index) => (
                <BentoCard
                    key={product.id}
                    product={product}
                    locale={locale}
                    formatter={formatter}
                    phoneNumber={phoneNumber}
                    labelPosition={getLabelPosition(index)}
                    t={t}
                />
            ))}
        </>
    );
};

/* ── Principal Product Card (full-width hero) ── */
function PrincipalCard({ product, locale, formatter, phoneNumber, t }: any) {
    const localizedName = String(product[`name_${locale}` as keyof typeof product] || product.name_az);
    const localizedDesc = String(product[`description_${locale}` as keyof typeof product] || product.description_az || '');
    const formattedPrice = formatter.format(product.price);
    const waLink = generateWhatsAppLink(phoneNumber, `${localizedName} - ${formattedPrice}`, product.sku, locale);

    return (
        <div className="min-h-fold flex flex-col relative col-span-2">
            <Link href={`/${locale}/products/${product.slug}`} className="size-full flex-1 flex flex-col" prefetch>
                <Image
                    priority
                    src={product.image_url}
                    alt={localizedName}
                    width={1000}
                    height={100}
                    quality={100}
                    className="object-cover size-full flex-1"
                />
            </Link>
            <div className="absolute bottom-0 left-0 grid w-full grid-cols-4 gap-6 pointer-events-none max-md:contents p-sides">
                <div className="col-span-3 col-start-2 pointer-events-auto 2xl:col-start-3 2xl:col-span-2 shrink-0 flex flex-col grid-cols-2 gap-y-3 p-4 w-full bg-white md:w-fit md:rounded-md md:grid">
                    <div className="col-span-2">
                        <Badge className="font-black capitalize rounded-full">{t('best_seller')}</Badge>
                    </div>
                    <Link href={`/${locale}/products/${product.slug}`} className="col-span-1 self-start text-2xl font-semibold">
                        {localizedName}
                    </Link>
                    <div className="col-span-1 mb-10">
                        <p className="text-sm font-medium line-clamp-3">{localizedDesc}</p>
                    </div>
                    <div className="flex col-span-1 gap-3 items-center text-2xl font-semibold md:self-end">
                        {formattedPrice}
                    </div>
                    <a
                        href={waLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="col-start-2 flex gap-20 justify-between pr-2 font-semibold cursor-pointer inline-flex items-center whitespace-nowrap rounded-md text-base transition-all bg-primary border border-transparent text-primary-foreground shadow-xs hover:bg-primary/90 h-12 px-3"
                    >
                        {t('buy')} <PlusIcon className="size-6" />
                    </a>
                </div>
            </div>
        </div>
    );
}

/* ── Bento Product Card (square, floating label at corner) ── */
function BentoCard({ product, locale, formatter, phoneNumber, labelPosition, t }: any) {
    const localizedName = String(product[`name_${locale}` as keyof typeof product] || product.name_az);
    const formattedPrice = formatter.format(product.price);
    const waLink = generateWhatsAppLink(phoneNumber, `${localizedName} - ${formattedPrice}`, product.sku, locale);

    return (
        <div className="relative col-span-1">
            <Link href={`/${locale}/products/${product.slug}`} className="block w-full aspect-square" prefetch>
                <Image
                    src={product.image_url}
                    alt={localizedName}
                    width={1000}
                    height={100}
                    className="object-cover size-full"
                />
            </Link>

            {/* Floating label — positioned at alternating corners */}
            <div
                className={cn(
                    'absolute flex p-sides inset-0 items-end pointer-events-none justify-end',
                    labelPosition === 'top-left' && 'md:justify-start md:items-start',
                    labelPosition === 'top-right' && 'md:justify-end md:items-start',
                    labelPosition === 'bottom-left' && 'md:justify-start md:items-end',
                    labelPosition === 'bottom-right' && 'md:justify-end md:items-end',
                )}
            >
                <div className="flex gap-2 items-center p-2 pl-8 bg-white rounded-md max-w-full pointer-events-auto">
                    <div className="pr-6 leading-4 overflow-hidden">
                        <Link
                            href={`/${locale}/products/${product.slug}`}
                            className="inline-block w-full truncate text-base font-semibold opacity-80 mb-1.5"
                        >
                            {localizedName}
                        </Link>
                        <div className="flex gap-2 items-center text-base font-semibold">
                            {formattedPrice}
                        </div>
                    </div>
                    <a
                        href={waLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-semibold cursor-pointer inline-flex items-center justify-center rounded-md transition-all bg-primary text-primary-foreground hover:bg-primary/90 size-12"
                        aria-label={`${t('buy')} ${localizedName}`}
                    >
                        <PlusIcon className="size-6" />
                    </a>
                </div>
            </div>
        </div>
    );
}

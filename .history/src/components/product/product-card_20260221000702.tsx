import React, { Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRightIcon } from 'lucide-react';
import { generateWhatsAppLink } from '@/lib/whatsapp';
import { useTranslations } from 'next-intl';
import { getColorHex } from '@/lib/color-utils';
import { ColorSwatch } from '@/components/ui/color-swatch';

interface ProductCardProps {
    product: {
        id: string;
        slug: string;
        name_az: string;
        name_ru: string;
        name_en: string;
        price: number | null;
        discount_price?: number | null;
        image_url: string;
        sku: string;
        price_negotiable: boolean;
        attributes?: any;
    };
    locale: string;
}

export const ProductCard = ({ product, locale }: ProductCardProps) => {
    const localizedName = String(product[`name_${locale}` as keyof typeof product] || product.name_az);
    const t = useTranslations('product');

    const formatter = new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: 'AZN',
    });

    const displayPrice = product.price ? formatter.format(product.price) : '';
    const displayDiscount = product.discount_price ? formatter.format(product.discount_price) : null;
    const productColors: string[] = product.attributes?.colors || [];

    const phoneNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "994505372177";
    const waLinkText = product.price_negotiable ? `${localizedName} - ${t('negotiable')}` : `${localizedName} - ${displayPrice}`;
    const waLink = generateWhatsAppLink(phoneNumber, waLinkText, product.sku, locale);

    return (
        <div className="relative w-full aspect-[3/4] md:aspect-square bg-muted group overflow-hidden border border-zinc-200">
            <Link
                href={`/${locale}/products/${product.slug}`}
                className="block size-full focus-visible:outline-none"
                aria-label={`View details for ${localizedName}`}
                prefetch
            >
                <Image
                    src={product.image_url}
                    alt={localizedName}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover size-full transition-transform duration-[10s] group-hover:scale-110 ease-linear hover:contrast-125"
                />
            </Link>

            {/* Interactive Overlay */}
            <div className="absolute inset-0 p-2 w-full pointer-events-none">
                <div className="flex gap-6 justify-between items-baseline px-3 py-1 w-full font-semibold transition-all duration-300 translate-y-0 max-md:hidden group-hover:opacity-0 group-focus-visible:opacity-0 group-hover:-translate-y-full group-focus-visible:-translate-y-full bg-white/50 backdrop-blur-md text-black">
                    <p className="text-sm uppercase 2xl:text-base text-balance line-clamp-1">{localizedName}</p>
                    <div className="flex gap-2 items-center text-sm uppercase 2xl:text-base whitespace-nowrap">
                        {product.price_negotiable ? (
                            <span className="text-primary">{t('negotiable')}</span>
                        ) : displayDiscount ? (
                            <>
                                <span>{displayDiscount}</span>
                                <span className="line-through opacity-50">{displayPrice}</span>
                            </>
                        ) : (
                            <span>{displayPrice}</span>
                        )}
                    </div>
                </div>

                <div className="flex absolute inset-x-3 bottom-3 flex-col gap-8 px-2 py-3 rounded-md transition-all duration-300 pointer-events-none bg-popover/90 backdrop-blur-sm md:opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 md:translate-y-1/3 group-hover:translate-y-0 group-focus-visible:translate-y-0 group-hover:pointer-events-auto group-focus-visible:pointer-events-auto max-md:pointer-events-auto shadow-xl">
                    <div className="grid grid-cols-2 gap-x-4 gap-y-4 items-end">
                        <div className="flex flex-col gap-2">
                            <p className="text-lg font-semibold text-pretty line-clamp-2">{localizedName}</p>
                            {productColors.length > 0 && (
                                <div className="flex flex-wrap gap-1">
                                    {productColors.slice(0, 5).map((colorName, idx) => {
                                        const hex = getColorHex(colorName);
                                        return (
                                            <ColorSwatch
                                                key={idx}
                                                color={{ name: colorName, value: typeof hex === 'string' ? hex : hex[0] }}
                                                size="sm"
                                            />
                                        );
                                    })}
                                    {productColors.length > 5 && (
                                        <span className="text-xs text-muted-foreground self-center ml-1">+{productColors.length - 5}</span>
                                    )}
                                </div>
                            )}
                        </div>
                        <div className="flex gap-2 items-center place-self-end text-lg font-semibold">
                            {product.price_negotiable ? (
                                <span className="text-primary text-base whitespace-nowrap">{t('negotiable')}</span>
                            ) : displayDiscount ? (
                                <>
                                    <span>{displayDiscount}</span>
                                    <span className="text-base line-through opacity-50">{displayPrice}</span>
                                </>
                            ) : (
                                <span>{displayPrice}</span>
                            )}
                        </div>

                        <Button className="col-start-1" size="sm" variant="outline" asChild>
                            <a href={waLink} target="_blank" rel="noopener noreferrer">
                                Order via WhatsApp
                            </a>
                        </Button>

                        <Button className="col-start-2" size="sm" variant="default" asChild>
                            <Link href={`/${locale}/products/${product.slug}`}>
                                <div className="flex justify-between items-center w-full">
                                    <span>Details</span>
                                    <ArrowRightIcon className="ml-2 w-4 h-4" />
                                </div>
                            </Link>
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

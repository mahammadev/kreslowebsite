import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { generateWhatsAppLink } from '@/lib/whatsapp';
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbSeparator,
    BreadcrumbPage,
} from '@/components/ui/breadcrumb';
import Link from 'next/link';
import { SidebarLinks } from '@/components/layout/sidebar/product-sidebar-links';
import Prose from '@/components/prose';
import { Suspense } from 'react';
import { getTranslations } from 'next-intl/server';
import { DesktopGallery } from '@/components/product/desktop-gallery';
import { MobileGallerySlider } from '@/components/product/mobile-gallery-slider';
import { Button } from '@/components/ui/button';
import { ArrowRightIcon } from 'lucide-react';
import { getColorHex, getLocalizedColorName } from '@/lib/color-utils';
import { ColorSwatch } from '@/components/ui/color-swatch';

export default async function ProductPage(props: { params: Promise<{ locale: string; slug: string }> }) {
    const resolvedParams = await props.params;
    const { slug, locale } = resolvedParams;
    const supabase = await createClient();

    const { data: product } = await supabase
        .from('products')
        .select(`
        id, 
        name_az, 
        name_ru, 
        name_en, 
        description_az, 
        description_ru, 
        description_en, 
        price,
        discount_price,
        category:categories(id, name_az, name_ru, name_en, slug), 
        sku, 
        image_url, 
        extra_images,
        slug, 
        attributes,
        price_negotiable
    `)
        .eq('slug', slug)
        .single();

    if (!product) return notFound();

    const localizedName = String(product[`name_${locale}` as keyof typeof product] || product.name_az);
    const localizedDescription = String(product[`description_${locale}` as keyof typeof product] || product.description_az || '');

    const category = product.category as any;
    const categoryName = category ? String(category[`name_${locale}` as keyof typeof category] || category.name_az) : null;
    const categorySlug = category ? category.slug : null;
    const t = await getTranslations('product');

    // Server-side formatting
    const formatter = new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: 'AZN',
    });

    const productColors: string[] = product.attributes?.colors || [];

    const displayPrice = product.price ? formatter.format(product.price) : '';
    const displayDiscount = product.discount_price ? formatter.format(product.discount_price) : null;

    const phoneNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "994505372177";
    const waLinkText = product.price_negotiable ? `${localizedName} - ${t('negotiable')}` : `${localizedName} - ${displayPrice}`;
    const waLink = generateWhatsAppLink(phoneNumber, waLinkText, product.sku, locale);

    const productJsonLd = {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: localizedName,
        description: localizedDescription,
        image: product.image_url,
        offers: {
            '@type': 'Offer',
            priceCurrency: 'AZN',
            price: product.price || 0,
        },
    };

    return (
        <div className="lg:pt-0 pt-16">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(productJsonLd),
                }}
            />

            <div className="flex flex-col md:grid md:grid-cols-12 md:gap-x-12 px-4 md:px-8 xl:px-16 min-h-max max-w-[1600px] mx-auto">
                {/* Mobile Gallery Slider */}
                <div className="md:hidden col-span-full h-[60vh] min-h-[400px] -mx-4">
                    <Suspense fallback={null}>
                        <MobileGallerySlider product={product as any} locale={locale} />
                    </Suspense>
                </div>

                <div className="flex sticky top-0 flex-col col-span-5 2xl:col-span-4 max-md:col-span-full md:h-screen min-h-max md:py-24 max-md:py-8 max-md:static">
                    <div className="col-span-full">
                        <Breadcrumb className="col-span-full mb-4 md:mb-8">
                            <BreadcrumbList>
                                <BreadcrumbItem>
                                    <BreadcrumbLink asChild>
                                        <Link href={`/${locale}/categories`} prefetch>
                                            {locale === 'az' ? 'Kataloq' : locale === 'ru' ? 'Каталог' : 'Catalog'}
                                        </Link>
                                    </BreadcrumbLink>
                                </BreadcrumbItem>
                                {categorySlug && (
                                    <>
                                        <BreadcrumbSeparator />
                                        <BreadcrumbItem>
                                            <BreadcrumbLink asChild>
                                                <Link href={`/${locale}/categories/${categorySlug}`} prefetch>
                                                    {categoryName}
                                                </Link>
                                            </BreadcrumbLink>
                                        </BreadcrumbItem>
                                    </>
                                )}
                                <BreadcrumbSeparator />
                                <BreadcrumbItem>
                                    <BreadcrumbPage>{localizedName}</BreadcrumbPage>
                                </BreadcrumbItem>
                            </BreadcrumbList>
                        </Breadcrumb>

                        <div className="flex flex-col col-span-full gap-4 md:mb-10 max-md:order-2">
                            <div className="flex flex-col px-4 py-6 rounded-md bg-white border border-zinc-200 md:gap-y-10 place-items-baseline">
                                <h1 className="text-2xl font-bold lg:text-3xl 2xl:text-4xl text-balance max-md:mb-4">
                                    {localizedName}
                                </h1>

                                <p className="flex gap-3 items-center text-xl font-bold lg:text-3xl 2xl:text-4xl max-md:mt-8 tracking-tight">
                                    {product.price_negotiable ? (
                                        <span className="text-xl lg:text-3xl text-primary">{t('negotiable')}</span>
                                    ) : displayDiscount ? (
                                        <>
                                            <span>{displayDiscount}</span>
                                            <span className="line-through opacity-30 text-lg lg:text-xl">
                                                {displayPrice}
                                            </span>
                                        </>
                                    ) : (
                                        <span>{displayPrice}</span>
                                    )}
                                </p>
                                <div className="mt-4 flex justify-between items-center w-full">
                                    <span className="font-mono text-xs text-zinc-500 uppercase tracking-widest">
                                        SKU: {product.sku}
                                    </span>
                                </div>

                                {productColors.length > 0 && (
                                    <div className="mt-6 flex flex-col gap-3 w-full border-t pt-6">
                                        <h3 className="text-sm font-semibold uppercase tracking-wider text-zinc-500">
                                            {locale === 'az' ? 'Mövcud Rənglər' : locale === 'ru' ? 'Доступные цвета' : 'Available Colors'}
                                        </h3>
                                        <div className="flex flex-wrap gap-2">
                                            {productColors.map((colorName, idx) => {
                                                const hex = getColorHex(colorName);
                                                const locName = getLocalizedColorName(colorName, locale);

                                                let colorProp: any;
                                                if (Array.isArray(hex)) {
                                                    const nameParts = locName.split('/');
                                                    colorProp = [
                                                        { name: nameParts[0]?.trim() || '', value: hex[0] },
                                                        { name: nameParts[1]?.trim() || '', value: hex[1] }
                                                    ];
                                                } else {
                                                    colorProp = { name: locName, value: hex };
                                                }

                                                return (
                                                    <div key={idx} className="flex flex-col items-center gap-1 w-12 text-center">
                                                        <ColorSwatch
                                                            color={colorProp}
                                                            size="lg"
                                                        />
                                                        <span className="text-[10px] uppercase text-muted-foreground break-words whitespace-normal leading-tight">{locName}</span>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}
                            </div>
                            <div className="grid grid-cols-1 gap-4 w-full">
                                <Button className="w-full text-lg h-14" size="lg" variant="default" asChild>
                                    <a href={waLink} target="_blank" rel="noopener noreferrer">
                                        <div className="flex justify-center items-center gap-2">
                                            <span>{locale === 'az' ? 'Sifariş Et (WhatsApp)' : locale === 'ru' ? 'Заказать (WhatsApp)' : 'Order via WhatsApp'}</span>
                                            <ArrowRightIcon className="w-5 h-5" />
                                        </div>
                                    </a>
                                </Button>
                            </div>
                        </div>
                    </div>

                    <Prose
                        className="col-span-full mb-auto opacity-80 max-md:order-3 max-md:my-6 whitespace-pre-wrap"
                        html={localizedDescription}
                    />

                    <SidebarLinks className="flex-col-reverse max-md:hidden py-12 w-full max-w-[408px] max-md:pr-0 max-md:py-0" />
                </div>

                {/* Desktop Gallery */}
                <div className="hidden relative col-span-7 col-start-6 w-full md:block py-24 min-h-screen">
                    <Suspense fallback={null}>
                        <DesktopGallery product={product as any} locale={locale} />
                    </Suspense>
                </div>
            </div>
        </div>
    );
}

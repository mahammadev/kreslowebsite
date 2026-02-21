'use client';

import { useTranslations } from 'next-intl';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';

export const HeroHorizontalSlider = () => {
    const t = useTranslations('reels');
    const params = useParams();
    const locale = (params?.locale as string) ?? 'az';

    const heroImage = "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=2158&auto=format&fit=crop";

    return (
        <div className="min-h-fold flex flex-col relative">
            <Link href={`/${locale}/products`} className="size-full flex-1 flex flex-col" prefetch>
                <Image
                    priority
                    src={heroImage}
                    alt="Premium Ergonomic Chair"
                    width={1000}
                    height={100}
                    quality={100}
                    className="object-cover size-full flex-1"
                />
            </Link>
            <div className="absolute bottom-0 left-0 grid w-full grid-cols-4 gap-6 pointer-events-none max-md:contents p-sides">
                <div className="col-span-3 col-start-2 pointer-events-auto 2xl:col-start-3 2xl:col-span-2 shrink-0 flex flex-col grid-cols-2 gap-y-3 p-4 w-full bg-white md:w-fit md:rounded-md md:grid">
                    <div className="col-span-2">
                        <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-black capitalize transition-colors border-transparent bg-primary text-primary-foreground">Best Seller</span>
                    </div>
                    <Link href={`/${locale}/products`} className="col-span-1 self-start text-2xl font-semibold">
                        {t('items.0.title')}
                    </Link>
                    <div className="col-span-1 mb-10">
                        <p className="text-sm font-medium line-clamp-3">{t('items.0.subtitle')}</p>
                    </div>
                    <div className="flex col-span-1 gap-3 items-center text-2xl font-semibold md:self-end">
                        —
                    </div>
                    <Link
                        href={`/${locale}/products`}
                        className="col-start-2 flex items-center justify-between gap-2 w-full px-4 py-2 bg-foreground text-background text-sm font-semibold rounded-sm hover:opacity-90 transition-opacity"
                    >
                        {t('items.0.cta')}
                    </Link>
                </div>
            </div>
        </div>
    );
};

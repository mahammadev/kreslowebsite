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
        <div className="relative w-full min-h-fold flex flex-col bg-foreground overflow-hidden">

            {/* Full-bleed background image */}
            <div className="absolute inset-0 z-0">
                <Image
                    src={heroImage}
                    alt="Premium Ergonomic Chair"
                    fill
                    sizes="100vw"
                    className="object-cover opacity-60"
                    priority
                />
                {/* Gradient: dark at top (for nav), clear in mid, dark at bottom (for card) */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-transparent to-black/80 pointer-events-none" />
            </div>

            {/* Floating product label at bottom — matches template style */}
            <div className="absolute bottom-0 left-0 w-full z-10 p-sides pb-sides">
                <div className="w-full md:w-fit md:ml-auto grid grid-cols-1 md:grid-cols-2 gap-y-3 gap-x-8 p-5 bg-background/95 backdrop-blur-md rounded-md border border-foreground/10">

                    {/* Badge */}
                    <div className="col-span-2">
                        <span className="inline-flex items-center text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full border border-foreground/20 text-foreground/60">
                            Best Seller
                        </span>
                    </div>

                    {/* Title */}
                    <h1 className="col-span-1 text-2xl md:text-3xl font-semibold text-foreground leading-tight text-balance">
                        {t('items.0.title')}
                    </h1>

                    {/* Description */}
                    <div className="col-span-1">
                        <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
                            {t('items.0.subtitle')}
                        </p>
                    </div>

                    {/* Price + CTA */}
                    <div className="col-span-1 flex items-center gap-4 text-2xl font-semibold text-foreground md:self-end">
                        —
                    </div>
                    <div className="col-span-1 flex gap-3 md:self-end">
                        <Link
                            href={`/${locale}/products`}
                            className="flex-1 text-center bg-foreground text-background text-sm font-semibold px-6 py-3 rounded-sm hover:bg-foreground/90 transition-colors"
                        >
                            {t('items.0.cta')}
                        </Link>
                        <Link
                            href={`/${locale}/categories`}
                            className="flex-1 text-center border border-foreground/20 text-foreground text-sm font-semibold px-6 py-3 rounded-sm hover:bg-foreground/5 transition-colors"
                        >
                            Browse
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

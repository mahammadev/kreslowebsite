'use client';

import { useTranslations } from 'next-intl';
import Image from 'next/image';
import Link from 'next/link';

export const HeroHorizontalSlider = () => {
    // Retaining component name for compatibility, but it acts as an Apple-style Hero showcase now.
    const t = useTranslations('reels');
    const index = 0; // Showcasing the primary product feature

    const heroImage = "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=2158&auto=format&fit=crop";

    return (
        <div className="relative w-full h-screen bg-black overflow-hidden flex flex-col items-center justify-start pt-32">

            {/* Edge-to-Edge Background Imagery */}
            <div className="absolute inset-0 z-0">
                <Image
                    src={heroImage}
                    alt="Premium Ergonomic Chair"
                    fill
                    sizes="100vw"
                    className="object-cover opacity-80"
                    priority
                />

                {/* Subtle gradient overlay to ensure text readability */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/20 to-black/80 pointer-events-none" />
            </div>

            {/* Centered Apple-style Typography */}
            <div className="relative z-10 flex flex-col items-center text-center px-4 max-w-5xl mx-auto space-y-6 mt-[10vh]">

                <h1 className="text-5xl md:text-7xl lg:text-8xl font-semibold text-white tracking-tight leading-tight text-balance">
                    {t(`items.${index}.title`)}
                </h1>

                <p className="text-xl md:text-2xl lg:text-3xl text-zinc-300 font-medium max-w-2xl leading-relaxed text-balance">
                    {t(`items.${index}.subtitle`)}
                </p>

                <div className="pt-8 flex flex-col sm:flex-row gap-4">
                    <Link
                        href="/products"
                        className="bg-white text-black text-lg font-medium px-8 py-4 rounded-full hover:bg-zinc-200 transition-colors"
                    >
                        {t(`items.${index}.cta`)}
                    </Link>

                    <Link
                        href="#categories"
                        className="bg-white/10 backdrop-blur-md border border-white/20 text-white text-lg font-medium px-8 py-4 rounded-full hover:bg-white/20 transition-colors"
                    >
                        Learn more
                    </Link>
                </div>
            </div>

        </div>
    );
};

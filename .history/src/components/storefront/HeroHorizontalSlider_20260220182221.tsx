'use client';

import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';

const REEL_IMAGES = [
    "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=2158&auto=format&fit=crop", // Ergonomic
    "https://images.unsplash.com/photo-1505330622279-bf7d7fc918f4?q=80&w=2070&auto=format&fit=crop", // Minimalist
    "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?q=80&w=2070&auto=format&fit=crop"  // Executive
];

export const HeroHorizontalSlider = () => {
    // We retain the name for component compatibility, but it acts as a stark typographic poster now.
    const t = useTranslations('reels');

    // For a strict poster look, we feature just the first primary item in a brutalist lockup
    const index = 0;

    return (
        <div className="relative w-full bg-black min-h-[90vh] flex flex-col items-center justify-center p-4 sm:p-8 lg:p-12 overflow-hidden selection:bg-white selection:text-black">

            {/* Rigid Grid Container */}
            <div className="w-full max-w-[1400px] h-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-0 relative z-10">

                {/* Typographic Block (Asymmetrical, dominating left side) */}
                <div className="lg:col-span-7 flex flex-col justify-center border-t-4 border-white pt-8 lg:pt-0 lg:border-t-0 lg:border-l-4 lg:pl-12 order-2 lg:order-1">

                    <div className="space-y-4 max-w-2xl">
                        <p className="text-white/60 font-mono text-xs sm:text-sm tracking-[0.2em] uppercase">
                            No. 001 / Edition Standard
                        </p>

                        <h1 className="text-6xl sm:text-7xl lg:text-9xl font-black text-white leading-[0.85] tracking-tighter uppercase break-words">
                            {t(`items.${index}.title`)}
                        </h1>

                        <p className="text-lg sm:text-xl lg:text-3xl text-zinc-400 font-medium max-w-xl leading-tight pt-8 border-t border-zinc-900">
                            {t(`items.${index}.subtitle`)}
                        </p>
                    </div>

                    <div className="mt-16 flex flex-col sm:flex-row gap-0 w-full sm:w-auto">
                        <button className="bg-white text-black text-xl font-bold uppercase tracking-tight py-6 px-12 rounded-none hover:bg-zinc-200 transition-none flex items-center justify-between group">
                            {t(`items.${index}.cta`)}
                            <ArrowRight className="w-6 h-6 ml-8 group-hover:translate-x-2 transition-transform duration-200" />
                        </button>
                    </div>

                </div>

                {/* Imagery Block (Strict edge alignment, right side) */}
                <div className="lg:col-span-5 relative min-h-[50vh] lg:min-h-full border-4 border-white order-1 lg:order-2 group overflow-hidden bg-zinc-900">
                    <Image
                        src={REEL_IMAGES[index]}
                        alt="Hero Architectural Context"
                        fill
                        sizes="(max-width: 1024px) 100vw, 50vw"
                        className="object-cover grayscale group-hover:grayscale-0 transition-all duration-700 contrast-125"
                        priority
                    />

                    {/* Brutalist Image Data Overlay */}
                    <div className="absolute top-4 right-4 bg-white text-black font-mono text-xs px-2 py-1 uppercase font-bold mix-blend-screen">
                        FIG.1: ERGONOMICS
                    </div>
                </div>

            </div>

            {/* Background absolute geometric decoration (Swiss abstract shapes) */}
            <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-red-600 rounded-full mix-blend-difference blur-[120px] opacity-20 pointer-events-none" />
            <div className="absolute top-1/4 right-0 w-[500px] h-2 bg-white/5 pointer-events-none" />
            <div className="absolute top-1/2 right-12 w-2 h-[500px] bg-white/5 pointer-events-none" />

        </div>
    );
};

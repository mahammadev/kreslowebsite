'use client';

import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ChevronDown } from 'lucide-react';

const REEL_IMAGES = [
    "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=2158&auto=format&fit=crop", // Ergonomic
    "https://images.unsplash.com/photo-1505330622279-bf7d7fc918f4?q=80&w=2070&auto=format&fit=crop", // Minimalist
    "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?q=80&w=2070&auto=format&fit=crop"  // Executive
];

export const ReelsLanding = () => {
    const t = useTranslations('reels');

    // We use raw messages to map over the items array defined in JSON
    const items = [0, 1, 2]; // For now, we manually map to the 3 items in JSON

    const scrollToNext = (index: number) => {
        const nextReel = document.getElementById(`reel-${index + 1}`);
        if (nextReel) {
            nextReel.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <div className="h-screen w-full overflow-y-auto snap-y snap-mandatory scroll-smooth hide-scrollbar transition-all duration-700">
            {items.map((index) => (
                <section
                    key={index}
                    id={`reel-${index}`}
                    className="relative h-screen w-full snap-start flex items-center justify-center overflow-hidden"
                >
                    {/* Background Media */}
                    <div className="absolute inset-0 z-0">
                        <Image
                            src={REEL_IMAGES[index]}
                            alt={`Reel ${index}`}
                            fill
                            className="object-cover"
                            priority={index === 0}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/40" />
                    </div>

                    {/* Content Overlay */}
                    <div className="relative z-10 w-full max-w-lg px-6 text-center space-y-6 animate-in fade-in slide-in-from-bottom-10 duration-1000">
                        <h2 className="text-4xl sm:text-6xl font-black text-white drop-shadow-2xl">
                            {t(`items.${index}.title`)}
                        </h2>
                        <p className="text-lg sm:text-xl text-zinc-100 font-medium drop-shadow-md">
                            {t(`items.${index}.subtitle`)}
                        </p>
                        <div className="pt-4 flex flex-col gap-3">
                            <Button size="lg" className="rounded-full h-14 text-lg font-bold bg-white text-black hover:bg-zinc-200 transition-transform active:scale-95">
                                {t(`items.${index}.cta`)}
                            </Button>
                        </div>
                    </div>

                    {/* View More / Scroll Indicator */}
                    {index < items.length - 1 && (
                        <button
                            onClick={() => scrollToNext(index)}
                            className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 text-white/80 hover:text-white transition-colors group cursor-pointer"
                        >
                            <span className="text-sm font-bold uppercase tracking-widest">{t('view_more')}</span>
                            <ChevronDown className="w-8 h-8 animate-bounce group-hover:scale-110 transition-transform" />
                        </button>
                    )}
                </section>
            ))}

            <style jsx global>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
        </div>
    );
};

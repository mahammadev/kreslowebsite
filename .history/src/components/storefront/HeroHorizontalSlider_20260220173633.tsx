'use client';

import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ChevronRight, ArrowRight } from 'lucide-react';
import { useRef } from 'react';

const REEL_IMAGES = [
    "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=2158&auto=format&fit=crop", // Ergonomic
    "https://images.unsplash.com/photo-1505330622279-bf7d7fc918f4?q=80&w=2070&auto=format&fit=crop", // Minimalist
    "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?q=80&w=2070&auto=format&fit=crop"  // Executive
];

export const HeroHorizontalSlider = () => {
    const t = useTranslations('reels');
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    const items = [0, 1, 2];

    const scrollRight = () => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollBy({ left: window.innerWidth, behavior: 'smooth' });
        }
    };

    return (
        <div className="relative h-[80vh] w-full bg-black group">
            {/* Horizontal Scroll Container */}
            <div
                ref={scrollContainerRef}
                className="flex h-full w-full overflow-x-auto snap-x snap-mandatory scroll-smooth hide-scrollbar transition-all duration-700"
            >
                {items.map((index) => (
                    <section
                        key={index}
                        className="relative h-full w-full shrink-0 snap-center flex items-center justify-center overflow-hidden"
                    >
                        {/* Background Media */}
                        <div className="absolute inset-0 z-0">
                            <Image
                                src={REEL_IMAGES[index]}
                                alt={`Hero Slide ${index}`}
                                fill
                                className="object-cover"
                                priority={index === 0}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/40" />
                        </div>

                        {/* Content Overlay */}
                        <div className="relative z-10 w-full max-w-2xl px-6 text-center space-y-6 animate-in fade-in slide-in-from-bottom-10 duration-1000">
                            <h2 className="text-4xl sm:text-6xl font-black text-white drop-shadow-2xl">
                                {t(`items.${index}.title`)}
                            </h2>
                            <p className="text-lg sm:text-xl text-zinc-100 font-medium drop-shadow-md">
                                {t(`items.${index}.subtitle`)}
                            </p>
                            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
                                <Button size="lg" className="rounded-full h-14 px-8 text-lg font-bold bg-white text-black hover:bg-zinc-200 transition-transform active:scale-95">
                                    {t(`items.${index}.cta`)}
                                </Button>
                                <Button size="lg" variant="outline" className="rounded-full h-14 px-8 border-white text-lg font-bold text-white hover:bg-white hover:text-black transition-transform active:scale-95 group/btn">
                                    {t('view_more')} <ArrowRight className="ml-2 w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
                                </Button>
                            </div>
                        </div>
                    </section>
                ))}
            </div>

            {/* Next Slide Indicator (Visible only if more slides exist to the right) */}
            <button
                onClick={scrollRight}
                className="absolute right-6 top-1/2 -translate-y-1/2 z-20 flex items-center justify-center w-14 h-14 rounded-full bg-black/20 backdrop-blur-md text-white border border-white/10 hover:bg-white/20 transition-all opacity-0 group-hover:opacity-100 cursor-pointer"
                aria-label="Next slide"
            >
                <ChevronRight className="w-8 h-8" />
            </button>

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

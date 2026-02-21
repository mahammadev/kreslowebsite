'use client';

import Image from 'next/image';
import useEmblaCarousel from 'embla-carousel-react';
import { useState, useCallback, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';

interface MobileGallerySliderProps {
    product: {
        image_url: string;
        name_az: string;
        name_ru: string;
        name_en: string;
        extra_images?: string[];
    };
    locale: string;
}

export function MobileGallerySlider({ product, locale }: MobileGallerySliderProps) {
    const localizedName = String(product[`name_${locale}` as keyof typeof product] || product.name_az);
    const allImages = [product.image_url, ...(product.extra_images || [])];

    const [emblaRef, emblaApi] = useEmblaCarousel({
        align: 'start',
        dragFree: false,
        loop: false,
    });
    const [selectedIndex, setSelectedIndex] = useState(0);

    const onSelect = useCallback((emblaApi: any) => {
        setSelectedIndex(emblaApi.selectedScrollSnap());
    }, []);

    useEffect(() => {
        if (!emblaApi) return;
        onSelect(emblaApi);
        emblaApi.on('select', onSelect);
    }, [emblaApi, onSelect]);

    return (
        <div className="relative w-full h-full bg-zinc-100 flex justify-center items-center">
            {/* Embla Carousel */}
            <div className="overflow-hidden h-full w-full" ref={emblaRef}>
                <div className="flex h-full w-full">
                    {allImages.map((src, index) => (
                        <div key={`${src}-${index}`} className="flex-shrink-0 w-full h-full relative">
                            <Image
                                src={src}
                                alt={`${localizedName} - Image ${index + 1}`}
                                fill
                                className="object-cover"
                                quality={100}
                                priority={index === 0}
                            />
                        </div>
                    ))}
                </div>
            </div>

            {/* Counter Badge */}
            {allImages.length > 1 && (
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10">
                    <Badge variant="secondary" className="bg-white/90 text-black shadow-sm font-medium border-0 px-3 py-1">
                        {selectedIndex + 1} / {allImages.length}
                    </Badge>
                </div>
            )}
        </div>
    );
}

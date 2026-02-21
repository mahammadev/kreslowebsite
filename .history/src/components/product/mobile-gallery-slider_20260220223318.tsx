'use client';

import Image from 'next/image';

interface MobileGallerySliderProps {
    product: {
        image_url: string;
        name_az: string;
        name_ru: string;
        name_en: string;
    };
    locale: string;
}

export function MobileGallerySlider({ product, locale }: MobileGallerySliderProps) {
    const localizedName = String(product[`name_${locale}` as keyof typeof product] || product.name_az);

    return (
        <div className="relative w-full h-full flex justify-center items-center bg-zinc-100">
            <div className="relative w-full h-full">
                <Image
                    src={product.image_url}
                    alt={localizedName}
                    fill
                    className="object-cover"
                    quality={100}
                    priority
                />
            </div>
        </div>
    );
}

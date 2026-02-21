'use client';

import Image from 'next/image';

interface DesktopGalleryProps {
    product: {
        image_url: string;
        name_az: string;
        name_ru: string;
        name_en: string;
    };
    locale: string;
}

export const DesktopGallery = ({ product, locale }: DesktopGalleryProps) => {
    const localizedName = String(product[`name_${locale}` as keyof typeof product] || product.name_az);

    return (
        <Image
            src={product.image_url}
            alt={localizedName}
            width={1200}
            height={1200}
            className="w-full h-full object-cover lg:aspect-auto aspect-square"
            quality={100}
            priority
        />
    );
};

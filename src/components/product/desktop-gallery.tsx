'use client';

import Image from 'next/image';

interface DesktopGalleryProps {
    product: {
        image_url: string;
        name_az: string;
        name_ru: string;
        name_en: string;
        extra_images?: string[];
    };
    locale: string;
}

export const DesktopGallery = ({ product, locale }: DesktopGalleryProps) => {
    const localizedName = String(product[`name_${locale}` as keyof typeof product] || product.name_az);

    const allImages = [product.image_url, ...(product.extra_images || [])];

    return (
        <div className="flex flex-col gap-4">
            {allImages.map((src, idx) => (
                <Image
                    key={`${src}-${idx}`}
                    src={src}
                    alt={`${localizedName} - Image ${idx + 1}`}
                    width={1200}
                    height={1200}
                    className="w-full h-full object-cover lg:aspect-auto aspect-square mb-8"
                    quality={100}
                    priority={idx === 0}
                />
            ))}
        </div>
    );
};

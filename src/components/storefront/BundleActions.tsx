'use client';

import { useState } from 'react';
import { Plus, Check, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCartStore, CartItem } from '@/lib/cart/store';

interface BundleActionsProps {
    bundle: {
        id: string;
        slug: string;
        name_az: string;
        name_ru: string;
        name_en: string;
        discount_percentage: number;
        products: {
            id: string;
            slug: string;
            name_az: string;
            name_ru: string;
            name_en: string;
            price: number;
            discount_price: number | null;
            image_url: string;
        }[];
    };
    locale: string;
    bundlePrice: number;
}

export function BundleActions({ bundle, locale, bundlePrice }: BundleActionsProps) {
    const [isAdded, setIsAdded] = useState(false);
    const { addItem, openCart } = useCartStore();

    const localizedName = String(bundle[`name_${locale}` as keyof typeof bundle] || bundle.name_az);

    const handleAddBundleToCart = () => {
        bundle.products.forEach((product) => {
            const productName = String(product[`name_${locale}` as keyof typeof product] || product.name_az);
            const cartItem: CartItem = {
                productId: product.id,
                slug: product.slug,
                name: productName,
                price: product.price,
                discountPrice: product.discount_price,
                quantity: 1,
                imageUrl: product.image_url,
            };
            addItem(cartItem);
        });

        setIsAdded(true);

        setTimeout(() => {
            setIsAdded(false);
            openCart();
        }, 500);
    };

    const addToCartLabel = locale === 'az' ? 'Səbətə əlavə et' : locale === 'ru' ? 'В корзину' : 'Add to Cart';

    return (
        <Button
            className="w-full mt-4 h-12"
            size="lg"
            onClick={handleAddBundleToCart}
            disabled={isAdded}
        >
            {isAdded ? (
                <>
                    <Check className="w-5 h-5 mr-2" />
                    {locale === 'az' ? 'Əlavə edildi!' : locale === 'ru' ? 'Добавлено!' : 'Added!'}
                </>
            ) : (
                <>
                    <ShoppingBag className="w-5 h-5 mr-2" />
                    {addToCartLabel}
                </>
            )}
        </Button>
    );
}

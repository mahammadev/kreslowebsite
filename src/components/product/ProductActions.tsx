'use client';

import { useState } from 'react';
import { Plus, Check, ArrowRightIcon, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCartStore, CartItem } from '@/lib/cart/store';
import { generateWhatsAppLink } from '@/lib/whatsapp';

interface ProductActionsProps {
    product: {
        id: string;
        slug: string;
        name_az: string;
        name_ru: string;
        name_en: string;
        price: number | null;
        discount_price?: number | null;
        image_url: string;
        sku: string;
        price_negotiable: boolean;
    };
    locale: string;
    whatsappNumber: string;
}

export function ProductActions({ product, locale, whatsappNumber }: ProductActionsProps) {
    const [isAdded, setIsAdded] = useState(false);
    const { addItem, openCart } = useCartStore();

    const localizedName = String(product[`name_${locale}` as keyof typeof product] || product.name_az);

    const formatter = new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: 'AZN',
    });

    const displayPrice = product.price ? formatter.format(product.price) : '';
    const waLinkText = product.price_negotiable ? `${localizedName} - ${locale === 'az' ? 'Razılaşma Yolu İlə' : locale === 'ru' ? 'Договорная цена' : 'Price Negotiable'}` : `${localizedName} - ${displayPrice}`;
    const waLink = generateWhatsAppLink(whatsappNumber, waLinkText, product.sku, locale);

    const handleAddToCart = () => {
        if (!product.price) return;

        const cartItem: CartItem = {
            productId: product.id,
            slug: product.slug,
            name: localizedName,
            price: product.price,
            discountPrice: product.discount_price,
            quantity: 1,
            imageUrl: product.image_url,
            sku: product.sku,
        };

        addItem(cartItem);
        setIsAdded(true);

        setTimeout(() => {
            setIsAdded(false);
        }, 1500);
    };

    const addToCartLabel = locale === 'az' ? 'Səbətə əlavə et' : locale === 'ru' ? 'В корзину' : 'Add to Cart';
    const orderLabel = locale === 'az' ? 'Sifariş Et (WhatsApp)' : locale === 'ru' ? 'Заказать (WhatsApp)' : 'Order via WhatsApp';

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
            <Button
                className="w-full text-lg h-14"
                size="lg"
                variant="outline"
                onClick={handleAddToCart}
                disabled={!product.price || product.price_negotiable || isAdded}
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

            <Button className="w-full text-lg h-14" size="lg" variant="default" asChild>
                <a href={waLink} target="_blank" rel="noopener noreferrer">
                    <div className="flex justify-center items-center gap-2">
                        <span>{orderLabel}</span>
                        <ArrowRightIcon className="w-5 h-5" />
                    </div>
                </a>
            </Button>
        </div>
    );
}

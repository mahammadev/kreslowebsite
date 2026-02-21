'use client';

import { useState } from 'react';
import { Plus, Check, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCartStore, CartItem } from '@/lib/cart/store';

interface AddToCartButtonProps {
  product: {
    id: string;
    slug: string;
    name_az: string;
    name_ru: string;
    name_en: string;
    price: number;
    discount_price?: number | null;
    image_url: string;
    sku?: string;
  };
  locale: string;
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  className?: string;
  showIcon?: boolean;
  children?: React.ReactNode;
}

export function AddToCartButton({
  product,
  locale,
  variant = 'default',
  size = 'default',
  className,
  showIcon = true,
  children,
}: AddToCartButtonProps) {
  const [isAdded, setIsAdded] = useState(false);
  const { addItem, openCart } = useCartStore();

  const localizedName = String(product[`name_${locale}` as keyof typeof product] || product.name_az);

  const handleAddToCart = () => {
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

  return (
    <Button
      variant={variant}
      size={size}
      className={className}
      onClick={handleAddToCart}
      disabled={isAdded}
    >
      {isAdded ? (
        <>
          <Check className="w-4 h-4 mr-1" />
          Added!
        </>
      ) : (
        <>
          {showIcon && <Plus className="w-4 h-4 mr-1" />}
          {children || 'Add to Cart'}
        </>
      )}
    </Button>
  );
}

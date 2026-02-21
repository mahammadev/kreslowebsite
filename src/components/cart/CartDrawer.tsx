'use client';

import Image from 'next/image';
import { Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { useCartStore, CartItem } from '@/lib/cart/store';
import { buildCartWhatsAppUrl } from '@/lib/whatsapp';

interface CartDrawerProps {
  locale: string;
  whatsappNumber: string;
  translations: {
    title: string;
    empty: string;
    emptyDesc: string;
    continueShopping: string;
    subtotal: string;
    note: string;
    orderViaWhatsApp: string;
    currency: string;
  };
}

export function CartDrawer({ locale, whatsappNumber, translations }: CartDrawerProps) {
  const { items, isOpen, closeCart, removeItem, updateQuantity, clearCart, getTotalPrice } = useCartStore();

  const formatter = new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: 'AZN',
  });

  const total = getTotalPrice();
  const waLink = buildCartWhatsAppUrl(items, whatsappNumber, locale, total);

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && closeCart()}>
      <SheetContent className="flex flex-col w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5" />
            {translations.title}
          </SheetTitle>
          <SheetDescription>
            {items.length} {items.length === 1 ? 'item' : 'items'} in your cart
          </SheetDescription>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 text-center">
            <ShoppingBag className="w-16 h-16 text-muted-foreground/30" />
            <div>
              <p className="font-semibold text-lg">{translations.empty}</p>
              <p className="text-sm text-muted-foreground">{translations.emptyDesc}</p>
            </div>
            <Button variant="outline" onClick={closeCart}>
              {translations.continueShopping}
            </Button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto -mx-4 px-4">
              <div className="space-y-4 py-4">
                {items.map((item) => (
                  <CartItemRow
                    key={item.productId}
                    item={item}
                    locale={locale}
                    formatter={formatter}
                    onRemove={() => removeItem(item.productId)}
                    onUpdateQuantity={(qty) => updateQuantity(item.productId, qty)}
                  />
                ))}
              </div>
            </div>

            <div className="border-t pt-4 space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">{translations.subtotal}</span>
                <span className="text-xl font-bold">{formatter.format(total)}</span>
              </div>

              <p className="text-xs text-muted-foreground">{translations.note}</p>

              <div className="grid grid-cols-2 gap-3">
                <Button variant="outline" onClick={clearCart}>
                  <Trash2 className="w-4 h-4 mr-2" />
                  Clear
                </Button>
                <Button asChild className="bg-green-600 hover:bg-green-700">
                  <a href={waLink} target="_blank" rel="noopener noreferrer">
                    {translations.orderViaWhatsApp}
                  </a>
                </Button>
              </div>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}

function CartItemRow({
  item,
  locale,
  formatter,
  onRemove,
  onUpdateQuantity,
}: {
  item: CartItem;
  locale: string;
  formatter: Intl.NumberFormat;
  onRemove: () => void;
  onUpdateQuantity: (qty: number) => void;
}) {
  const displayPrice = item.discountPrice ?? item.price;

  return (
    <div className="flex gap-3 p-3 bg-muted/30 rounded-lg">
      <div className="relative w-20 h-20 rounded-md overflow-hidden flex-shrink-0 bg-muted">
        <Image src={item.imageUrl} alt={item.name} fill className="object-cover" sizes="80px" />
      </div>

      <div className="flex-1 min-w-0">
        <p className="font-medium text-sm truncate">{item.name}</p>
        {item.sku && (
          <p className="text-xs text-muted-foreground">SKU: {item.sku}</p>
        )}

        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7"
              onClick={() => onUpdateQuantity(item.quantity - 1)}
            >
              <Minus className="w-3 h-3" />
            </Button>
            <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7"
              onClick={() => onUpdateQuantity(item.quantity + 1)}
            >
              <Plus className="w-3 h-3" />
            </Button>
          </div>

          <div className="text-right">
            {item.discountPrice ? (
              <div>
                <span className="font-semibold text-sm">{formatter.format(displayPrice * item.quantity)}</span>
                <span className="block text-xs text-muted-foreground line-through">
                  {formatter.format(item.price * item.quantity)}
                </span>
              </div>
            ) : (
              <span className="font-semibold text-sm">{formatter.format(displayPrice * item.quantity)}</span>
            )}
          </div>
        </div>
      </div>

      <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive" onClick={onRemove}>
        <Trash2 className="w-4 h-4" />
      </Button>
    </div>
  );
}

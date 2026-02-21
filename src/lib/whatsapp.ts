import { CartItem } from './cart/store';

/**
 * Utility to generate a pre-filled WhatsApp link for direct product inquiries.
 */
export function generateWhatsAppLink(
    phone_number: string,
    product_name: string,
    sku?: string,
    locale: string = 'az'
): string {
    const cleanPhone = phone_number.replace(/\D/g, '');

    let greeting = 'Hello, I am interested in buying:';
    if (locale === 'az') greeting = 'Salam, bu məhsulu almaq istəyirəm:';
    if (locale === 'ru') greeting = 'Здравствуйте, я хочу купить:';

    const skuText = sku ? ` (SKU: ${sku})` : '';
    const message = `${greeting} ${product_name}${skuText}`;

    const encodedMessage = encodeURIComponent(message);

    return `https://wa.me/${cleanPhone}?text=${encodedMessage}`;
}

/**
 * Generate a WhatsApp link for cart checkout with multiple items.
 * Items are separated by " + " to indicate a combined order.
 */
export function buildCartWhatsAppUrl(
    items: CartItem[],
    phone_number: string,
    locale: string,
    total: number
): string {
    const cleanPhone = phone_number.replace(/\D/g, '');

    if (items.length === 0) {
        return `https://wa.me/${cleanPhone}`;
    }

    const templates = {
        az: {
            greeting: 'Salam! Sifariş vermək istəyirəm:',
            total: 'Ümumi',
            question: 'Stokda varmı?',
        },
        ru: {
            greeting: 'Здравствуйте! Хочу заказать:',
            total: 'Итого',
            question: 'Есть в наличии?',
        },
        en: {
            greeting: "Hello! I'd like to order:",
            total: 'Total',
            question: 'Are these in stock?',
        },
    };

    const t = templates[locale as keyof typeof templates] ?? templates.en;

    const lines = items.map((item) => {
        const itemTotal = (item.discountPrice ?? item.price) * item.quantity;
        const skuText = item.sku ? ` (SKU: ${item.sku})` : '';
        return `• ${item.quantity}x ${item.name}${skuText} — ${itemTotal.toFixed(2)} AZN`;
    });

    const message = `${t.greeting}\n\n${lines.join(' +\n')}\n\n${t.total}: ${total.toFixed(2)} AZN\n\n${t.question}`;

    return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
}

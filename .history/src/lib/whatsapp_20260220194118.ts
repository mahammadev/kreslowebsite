/**
 * Utility to generate a pre-filled WhatsApp link for direct product inquiries.
 * 
 * @param phone_number - The merchant's WhatsApp Business number (e.g. "994505372177")
 * @param product_name - The name of the product the user wants to buy
 * @param sku - The product SKU for precise inventory checking
 * @param locale - For determining language specific greetings (optional)
 * @returns A formatted URL string ready to be used in an `href`
 */
export function generateWhatsAppLink(
    phone_number: string,
    product_name: string,
    sku?: string,
    locale: string = 'az'
): string {
    // Strip any non-numeric characters from the phone number just in case
    const cleanPhone = phone_number.replace(/\D/g, '');

    // Default to a generic greeting if locale is missing, else localize
    let greeting = 'Hello, I am interested in buying:';
    if (locale === 'az') greeting = 'Salam, bu məhsulu almaq istəyirəm:';
    if (locale === 'ru') greeting = 'Здравствуйте, я хочу купить:';

    const skuText = sku ? ` (SKU: ${sku})` : '';
    const message = `${greeting} ${product_name}${skuText}`;

    // Encode the message to be URL-safe
    const encodedMessage = encodeURIComponent(message);

    return `https://wa.me/${cleanPhone}?text=${encodedMessage}`;
}

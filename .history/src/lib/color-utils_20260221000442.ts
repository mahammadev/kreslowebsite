import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

// Internal color mapping for common color names across EN, AZ, RU to hex values
export const COLOR_MAP: Record<string, string> = {
    // English
    red: '#ef4444',
    blue: '#3b82f6',
    green: '#22c55e',
    yellow: '#eab308',
    orange: '#f97316',
    purple: '#a855f7',
    pink: '#ec4899',
    black: '#000000',
    white: '#ffffff',
    gray: '#6b7280',
    grey: '#6b7280',
    brown: '#92400e',
    navy: '#1e3a8a',
    teal: '#14b8a6',
    cyan: '#06b6d4',
    indigo: '#6366f1',
    violet: '#8b5cf6',
    lime: '#84cc16',
    emerald: '#10b981',
    rose: '#f43f5e',
    slate: '#64748b',
    neutral: '#737373',
    zinc: '#71717a',
    beige: '#f5f5dc',
    gold: '#ffd700',
    silver: '#c0c0c0',

    // Azerbaijani
    qırmızı: '#ef4444',
    mavi: '#3b82f6',
    göy: '#1e40af', // darker blue
    yaşıl: '#22c55e',
    sarı: '#eab308',
    narıncı: '#f97316',
    bənövşəyi: '#a855f7',
    çəhrayı: '#ec4899',
    qara: '#000000',
    ağ: '#ffffff',
    boz: '#6b7280',
    qəhvəyi: '#92400e',
    gümüşü: '#c0c0c0',
    qızılı: '#ffd700',
    bej: '#f5f5dc',

    // Russian
    красный: '#ef4444',
    синий: '#3b82f6',
    голубой: '#38bdf8', // light blue
    зеленый: '#22c55e',
    зелёный: '#22c55e',
    желтый: '#eab308',
    жёлтый: '#eab308',
    оранжевый: '#f97316',
    фиолетовый: '#a855f7',
    розовый: '#ec4899',
    черный: '#000000',
    чёрный: '#000000',
    белый: '#ffffff',
    серый: '#6b7280',
    коричневый: '#92400e',
    серебряный: '#c0c0c0',
    золотой: '#ffd700',
    бежевый: '#f5f5dc',
};

export function getColorHex(colorName: string): string | [string, string] {
    if (!colorName) return '#e5e7eb'; // default light gray

    const lowerColorName = colorName.toLowerCase().trim();

    // Check for exact match first
    if (COLOR_MAP[lowerColorName]) {
        return COLOR_MAP[lowerColorName];
    }

    // Check for partial matches (for cases where color name might have extra text)
    for (const [key, value] of Object.entries(COLOR_MAP)) {
        if (lowerColorName.includes(key) || key.includes(lowerColorName)) {
            return value;
        }
    }

    // Return a default color if no match found
    return '#e5e7eb';
}

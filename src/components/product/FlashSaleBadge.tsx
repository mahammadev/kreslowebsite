'use client';

import { useState, useEffect } from 'react';

interface FlashSaleBadgeProps {
    endsAt: string;
    locale: string;
    className?: string;
}

interface TimeLeft {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
}

function getTimeLeft(endsAt: string): TimeLeft {
    const diff = new Date(endsAt).getTime() - Date.now();

    if (diff <= 0) {
        return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }

    return {
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / (1000 * 60)) % 60),
        seconds: Math.floor((diff / 1000) % 60),
    };
}

const labels = {
    az: { sale: 'Endirim', days: 'gün', hours: 'saat', min: 'dəq', sec: 'san' },
    ru: { sale: 'Скидка', days: 'дн', hours: 'час', min: 'мин', sec: 'сек' },
    en: { sale: 'Sale', days: 'd', hours: 'h', min: 'm', sec: 's' },
};

export function FlashSaleBadge({ endsAt, locale, className = '' }: FlashSaleBadgeProps) {
    const [timeLeft, setTimeLeft] = useState<TimeLeft>(getTimeLeft(endsAt));
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const interval = setInterval(() => {
            setTimeLeft(getTimeLeft(endsAt));
        }, 1000);

        return () => clearInterval(interval);
    }, [endsAt]);

    const t = labels[locale as keyof typeof labels] ?? labels.en;

    if (!mounted) {
        return (
            <div className={`absolute top-2 left-2 z-10 ${className}`}>
                <div className="bg-red-600 text-white px-2 py-1 rounded-md text-xs font-bold shadow-lg animate-pulse">
                    {t.sale}
                </div>
            </div>
        );
    }

    if (timeLeft.days === 0 && timeLeft.hours === 0 && timeLeft.minutes === 0 && timeLeft.seconds === 0) {
        return null;
    }

    return (
        <div className={`absolute top-2 left-2 z-10 ${className}`}>
            <div className="bg-red-600 text-white px-2 py-1 rounded-md text-xs font-bold shadow-lg">
                <span className="mr-1">{t.sale}</span>
                <span className="font-mono">
                    {timeLeft.days > 0 && `${timeLeft.days}${t.days} `}
                    {timeLeft.hours.toString().padStart(2, '0')}:
                    {timeLeft.minutes.toString().padStart(2, '0')}:
                    {timeLeft.seconds.toString().padStart(2, '0')}
                </span>
            </div>
        </div>
    );
}

export function FlashSaleCountdown({ endsAt, locale, className = '' }: FlashSaleBadgeProps) {
    const [timeLeft, setTimeLeft] = useState<TimeLeft>(getTimeLeft(endsAt));
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const interval = setInterval(() => {
            setTimeLeft(getTimeLeft(endsAt));
        }, 1000);

        return () => clearInterval(interval);
    }, [endsAt]);

    const t = labels[locale as keyof typeof labels] ?? labels.en;

    if (!mounted) {
        return (
            <div className={`bg-red-50 border border-red-200 rounded-lg p-3 ${className}`}>
                <div className="animate-pulse flex gap-2">
                    <div className="h-8 w-12 bg-red-200 rounded"></div>
                    <div className="h-8 w-12 bg-red-200 rounded"></div>
                    <div className="h-8 w-12 bg-red-200 rounded"></div>
                    <div className="h-8 w-12 bg-red-200 rounded"></div>
                </div>
            </div>
        );
    }

    if (timeLeft.days === 0 && timeLeft.hours === 0 && timeLeft.minutes === 0 && timeLeft.seconds === 0) {
        return null;
    }

    return (
        <div className={`bg-red-50 border border-red-200 rounded-lg p-3 ${className}`}>
            <p className="text-red-600 text-sm font-semibold mb-2">
                {locale === 'az' ? 'Endirim bitir:' : locale === 'ru' ? 'Скидка заканчивается:' : 'Sale ends in:'}
            </p>
            <div className="flex gap-2">
                {timeLeft.days > 0 && (
                    <div className="bg-white border border-red-200 rounded-md px-3 py-2 text-center min-w-[60px]">
                        <span className="text-2xl font-bold text-red-600">{timeLeft.days}</span>
                        <span className="block text-xs text-muted-foreground">{t.days}</span>
                    </div>
                )}
                <div className="bg-white border border-red-200 rounded-md px-3 py-2 text-center min-w-[60px]">
                    <span className="text-2xl font-bold text-red-600">{timeLeft.hours.toString().padStart(2, '0')}</span>
                    <span className="block text-xs text-muted-foreground">{t.hours}</span>
                </div>
                <div className="bg-white border border-red-200 rounded-md px-3 py-2 text-center min-w-[60px]">
                    <span className="text-2xl font-bold text-red-600">{timeLeft.minutes.toString().padStart(2, '0')}</span>
                    <span className="block text-xs text-muted-foreground">{t.min}</span>
                </div>
                <div className="bg-white border border-red-200 rounded-md px-3 py-2 text-center min-w-[60px]">
                    <span className="text-2xl font-bold text-red-600">{timeLeft.seconds.toString().padStart(2, '0')}</span>
                    <span className="block text-xs text-muted-foreground">{t.sec}</span>
                </div>
            </div>
        </div>
    );
}

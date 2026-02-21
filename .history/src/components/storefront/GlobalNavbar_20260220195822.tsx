'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';

export const GlobalNavbar = ({ locale }: { locale: string }) => {
    const t = useTranslations('nav');
    const pathname = usePathname();

    // Utility to switch languages while maintaining the current path
    const getLocalizedHref = (targetLocale: string) => {
        if (!pathname) return `/${targetLocale}`;
        const segments = pathname.split('/');
        segments[1] = targetLocale; // Replace the locale segment
        return segments.join('/') || '/';
    };

    return (
        <nav className="fixed top-0 left-0 w-full z-50 bg-black/80 backdrop-blur-md border-b border-white/10">
            <div className="max-w-[1024px] mx-auto px-4 h-11 flex items-center justify-between text-xs font-medium tracking-wide text-zinc-300">

                {/* Brand Logo / Home */}
                <Link
                    href={`/${locale}`}
                    className="text-white hover:text-white transition-opacity opacity-90 hover:opacity-100"
                >
                    KRESLO
                </Link>

                {/* Main Navigation Links */}
                <div className="hidden md:flex items-center space-x-8">
                    <Link href={`/${locale}/categories`} className="hover:text-white transition-colors">
                        {t('categories')}
                    </Link>
                    <Link href={`/${locale}/products`} className="hover:text-white transition-colors">
                        {t('deals')}
                    </Link>
                    <Link href={`/${locale}#contact`} className="hover:text-white transition-colors">
                        {t('contact')}
                    </Link>
                </div>

                {/* Locale Switcher */}
                <div className="flex items-center space-x-4">
                    <Link
                        href={getLocalizedHref('az')}
                        className={`hover:text-white transition-colors ${locale === 'az' ? 'text-white' : ''}`}
                    >
                        AZ
                    </Link>
                    <Link
                        href={getLocalizedHref('ru')}
                        className={`hover:text-white transition-colors ${locale === 'ru' ? 'text-white' : ''}`}
                    >
                        RU
                    </Link>
                    <Link
                        href={getLocalizedHref('en')}
                        className={`hover:text-white transition-colors ${locale === 'en' ? 'text-white' : ''}`}
                    >
                        EN
                    </Link>
                </div>

            </div>
        </nav>
    );
};

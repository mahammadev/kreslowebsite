import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { createClient } from '@/lib/supabase/server';

export const GlobalNavbar = async ({ locale }: { locale: string }) => {
    const t = await getTranslations('nav');
    const supabase = await createClient();

    // Fetch live categories
    const { data: categories } = await supabase
        .from('categories')
        .select('*')
        .eq('is_active', true)
        .order('sort_order', { ascending: true });

    return (
        <header className="grid fixed top-0 left-0 z-50 grid-cols-3 items-start w-full p-sides md:grid-cols-12 md:gap-sides">

            {/* Mobile: hamburger placeholder */}
            <div className="block md:hidden flex-none">
                <button
                    aria-label="Open menu"
                    className="w-9 h-9 flex flex-col items-center justify-center gap-1.5 rounded-sm backdrop-blur-md bg-background/10 border border-foreground/10"
                >
                    <span className="block w-5 h-px bg-foreground" />
                    <span className="block w-5 h-px bg-foreground" />
                    <span className="block w-3 h-px bg-foreground" />
                </button>
            </div>

            {/* Logo */}
            <Link
                href={`/${locale}`}
                className="md:col-span-3 xl:col-span-2 flex items-center justify-center md:justify-start"
                prefetch
            >
                <span className="font-bold tracking-widest text-foreground text-base uppercase select-none">
                    KRESLO
                </span>
            </Link>

            {/* Desktop Nav */}
            <nav className="flex gap-2 justify-end items-center md:col-span-9 xl:col-span-10">
                <ul className="items-center gap-5 py-1.5 px-4 bg-background/60 rounded-sm backdrop-blur-md border border-foreground/10 hidden md:flex">

                    {/* Home */}
                    <li>
                        <Link
                            href={`/${locale}`}
                            className="font-semibold text-sm transition-colors duration-200 uppercase text-foreground/60 hover:text-foreground"
                            prefetch
                        >
                            {t('home')}
                        </Link>
                    </li>

                    {/* Categories with curtain dropdown */}
                    <li className="relative group h-full flex items-center">
                        <Link
                            href={`/${locale}/categories`}
                            className="font-semibold text-sm transition-colors duration-200 uppercase text-foreground/60 hover:text-foreground"
                            prefetch
                        >
                            {t('categories')}
                        </Link>

                        {/* Dropdown */}
                        {categories && categories.length > 0 && (
                            <div className="absolute top-[calc(100%+1rem)] left-1/2 -translate-x-1/2 w-[480px]
                                bg-background/95 backdrop-blur-md border border-foreground/10 rounded-md shadow-2xl
                                overflow-hidden transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]
                                max-h-0 opacity-0 pointer-events-none
                                group-hover:max-h-96 group-hover:opacity-100 group-hover:pointer-events-auto"
                            >
                                <div className="transform transition-transform duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]
                                    -translate-y-3 group-hover:translate-y-0
                                    p-6 grid grid-cols-2 gap-3"
                                >
                                    {categories.map(category => {
                                        const localizedName = String(category[`name_${locale}` as keyof typeof category] || category.name_az);
                                        return (
                                            <Link
                                                key={category.id}
                                                href={`/${locale}/categories/${category.slug}`}
                                                className="text-sm font-medium text-foreground/70 hover:text-foreground transition-colors py-1.5 px-2 rounded hover:bg-foreground/5 block"
                                            >
                                                {localizedName}
                                            </Link>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </li>

                    {/* Deals */}
                    <li>
                        <Link
                            href={`/${locale}/products`}
                            className="font-semibold text-sm transition-colors duration-200 uppercase text-foreground/60 hover:text-foreground"
                            prefetch
                        >
                            {t('deals')}
                        </Link>
                    </li>

                    {/* Contact */}
                    <li>
                        <Link
                            href={`/${locale}#contact`}
                            className="font-semibold text-sm transition-colors duration-200 uppercase text-foreground/60 hover:text-foreground"
                        >
                            {t('contact')}
                        </Link>
                    </li>
                </ul>

                {/* Locale Switcher */}
                <div className="flex items-center gap-1 py-1.5 px-3 bg-background/60 rounded-sm backdrop-blur-md border border-foreground/10">
                    {['az', 'ru', 'en'].map((loc) => (
                        <Link
                            key={loc}
                            href={`/${loc}`}
                            className={`text-xs font-bold uppercase px-1.5 py-0.5 rounded transition-colors
                                ${locale === loc
                                    ? 'text-foreground bg-foreground/10'
                                    : 'text-foreground/50 hover:text-foreground'
                                }`}
                        >
                            {loc}
                        </Link>
                    ))}
                </div>
            </nav>
        </header>
    );
};

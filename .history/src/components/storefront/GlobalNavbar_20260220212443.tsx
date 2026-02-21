import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { createClient } from '@/lib/supabase/server';

export const GlobalNavbar = async ({ locale }: { locale: string }) => {
    const t = await getTranslations('nav');
    const supabase = await createClient();

    const { data: categories } = await supabase
        .from('categories')
        .select('*')
        .eq('is_active', true)
        .order('sort_order', { ascending: true });

    return (
        <header className="grid fixed top-0 left-0 z-50 grid-cols-3 items-start w-full p-sides md:grid-cols-12 md:gap-sides">
            {/* Mobile menu button */}
            <div className="block flex-none md:hidden">
                <button className="inline-flex items-center justify-center text-sm font-semibold uppercase bg-secondary text-secondary-foreground rounded-sm px-3 py-1.5 hover:bg-secondary/80 transition-colors">
                    Menu
                </button>
            </div>

            {/* Logo / Brand */}
            <Link href={`/${locale}`} className="md:col-span-3 xl:col-span-2" prefetch>
                <span className="text-xl md:text-2xl font-black tracking-tighter uppercase max-md:place-self-center block md:w-full">
                    KRESLO
                </span>
            </Link>

            {/* Nav links */}
            <nav className="flex gap-2 justify-end items-center md:col-span-9 xl:col-span-10">
                <ul className="items-center gap-5 py-0.5 px-3 bg-background/10 rounded-sm backdrop-blur-md hidden md:flex">
                    <li>
                        <Link href={`/${locale}`} className="font-semibold text-base transition-colors duration-200 uppercase text-foreground/50 hover:text-foreground" prefetch>
                            {t('home')}
                        </Link>
                    </li>

                    {/* Categories dropdown */}
                    <li className="relative group">
                        <Link href={`/${locale}/categories`} className="font-semibold text-base transition-colors duration-200 uppercase text-foreground/50 hover:text-foreground" prefetch>
                            {t('categories')}
                        </Link>
                        {categories && categories.length > 0 && (
                            <div className="absolute top-full left-1/2 -translate-x-1/2 pt-3 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-opacity duration-200 z-50">
                                <div className="bg-popover border border-border rounded-md shadow-lg p-3 min-w-[200px]">
                                    {categories.map(cat => {
                                        const localizedName = String(cat[`name_${locale}` as keyof typeof cat] || cat.name_az);
                                        return (
                                            <Link
                                                key={cat.id}
                                                href={`/${locale}/categories/${cat.slug}`}
                                                className="block px-3 py-1.5 text-sm font-medium text-popover-foreground/70 hover:text-popover-foreground hover:bg-accent rounded transition-colors"
                                            >
                                                {localizedName}
                                            </Link>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </li>

                    <li>
                        <Link href={`/${locale}/products`} className="font-semibold text-base transition-colors duration-200 uppercase text-foreground/50 hover:text-foreground" prefetch>
                            {t('deals')}
                        </Link>
                    </li>
                    <li>
                        <Link href={`/${locale}#contact`} className="font-semibold text-base transition-colors duration-200 uppercase text-foreground/50 hover:text-foreground">
                            {t('contact')}
                        </Link>
                    </li>
                </ul>

                {/* Locale switcher */}
                <div className="flex items-center gap-1 py-0.5 px-2 bg-background/10 rounded-sm backdrop-blur-md">
                    {['az', 'ru', 'en'].map((loc) => (
                        <Link
                            key={loc}
                            href={`/${loc}`}
                            className={`text-xs font-bold uppercase px-1.5 py-0.5 rounded transition-colors ${locale === loc ? 'text-foreground' : 'text-foreground/50 hover:text-foreground'}`}
                        >
                            {loc}
                        </Link>
                    ))}
                </div>
            </nav>
        </header>
    );
};

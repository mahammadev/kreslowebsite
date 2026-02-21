import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { createClient } from '@/lib/supabase/server';

export const GlobalNavbar = async ({ locale }: { locale: string }) => {
    const t = await getTranslations('nav');
    const supabase = await createClient();

    // Fetch live categories to populate the mega-menu dropdown
    const { data: categories } = await supabase
        .from('categories')
        .select('*')
        .eq('is_active', true)
        .order('sort_order', { ascending: true });

    return (
        <nav className="fixed top-0 left-0 w-full z-50 bg-black/80 backdrop-blur-md border-b border-white/10">
            <div className="max-w-[1024px] mx-auto px-4 h-11 flex items-center justify-between text-xs font-medium tracking-wide text-zinc-300">

                {/* Brand Logo / Home */}
                <Link
                    href={`/${locale}`}
                    className="text-white hover:text-white transition-opacity opacity-90 hover:opacity-100 font-bold tracking-widest"
                >
                    KRESLO
                </Link>

                {/* Main Navigation Links */}
                <div className="hidden md:flex items-center h-full space-x-8">

                    {/* Categories with Dropdown */}
                    <div className="relative h-full flex items-center group">
                        <Link href={`/${locale}/categories`} className="hover:text-white transition-colors h-full flex items-center">
                            {t('categories')}
                        </Link>

                        {/* Apple-style Frosted Glass Dropdown */}
                        {categories && categories.length > 0 && (
                            <div className="absolute top-11 left-1/2 -translate-x-1/2 w-64 bg-black/95 backdrop-blur-2xl border border-white/10 p-2 flex flex-col gap-1 rounded-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible translate-y-2 group-hover:translate-y-0 transition-all duration-300 shadow-2xl">
                                {categories.map(category => {
                                    const localizedName = String(category[`name_${locale}` as keyof typeof category] || category.name_az);
                                    return (
                                        <Link
                                            key={category.id}
                                            href={`/${locale}/categories/${category.slug}`}
                                            className="text-zinc-400 hover:text-white transition-colors py-3 px-4 rounded-xl hover:bg-white/10 text-sm font-medium"
                                        >
                                            {localizedName}
                                        </Link>
                                    )
                                })}
                                {/* Base link to view all */}
                                <div className="h-[1px] bg-white/10 my-1 mx-2" />
                                <Link
                                    href={`/${locale}/categories`}
                                    className="text-white transition-colors py-3 px-4 rounded-xl hover:bg-white/10 text-sm font-semibold"
                                >
                                    Browse All Categories
                                </Link>
                            </div>
                        )}
                    </div>

                    <Link href={`/${locale}/products`} className="hover:text-white transition-colors h-full flex items-center">
                        {t('deals')}
                    </Link>
                    <Link href={`/${locale}#contact`} className="hover:text-white transition-colors h-full flex items-center">
                        {t('contact')}
                    </Link>
                </div>

                {/* Locale Switcher (Hardcoded paths to maintain Server Component purity) */}
                <div className="flex items-center space-x-4">
                    <Link
                        href={`/az`}
                        className={`hover:text-white transition-colors ${locale === 'az' ? 'text-white font-bold' : ''}`}
                    >
                        AZ
                    </Link>
                    <Link
                        href={`/ru`}
                        className={`hover:text-white transition-colors ${locale === 'ru' ? 'text-white font-bold' : ''}`}
                    >
                        RU
                    </Link>
                    <Link
                        href={`/en`}
                        className={`hover:text-white transition-colors ${locale === 'en' ? 'text-white font-bold' : ''}`}
                    >
                        EN
                    </Link>
                </div>

            </div>
        </nav>
    );
};

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
            {/* Nav container (Not relative, so the absolute dropdown can be full-width) */}
            <div className="max-w-[1024px] mx-auto px-4 h-11 flex items-center justify-between text-xs font-medium tracking-wide text-zinc-300">

                {/* Brand Logo / Home */}
                <Link
                    href={`/${locale}`}
                    className="text-white hover:text-white transition-opacity opacity-90 hover:opacity-100 font-bold tracking-widest z-50"
                >
                    KRESLO
                </Link>

                {/* Main Navigation Links */}
                <div className="hidden md:flex items-center h-full space-x-8 z-50">

                    {/* Categories with Full-Width Mega Menu Dropdown */}
                    <div className="h-full flex items-center group">
                        <Link href={`/${locale}/categories`} className="hover:text-white transition-colors h-full flex items-center cursor-pointer px-2">
                            {t('categories')}
                        </Link>

                        {/* Apple-style Animated Curtian Dropdown */}
                        {categories && categories.length > 0 && (
                            <div className="absolute top-11 left-0 w-full bg-[#161617]/95 backdrop-blur-3xl border-b border-white/10 overflow-hidden 
                                transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] 
                                max-h-0 opacity-0 pointer-events-none
                                group-hover:max-h-[600px] group-hover:opacity-100 group-hover:pointer-events-auto">

                                {/* Inner sliding content for parallax feeling */}
                                <div className="transform transition-transform duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] 
                                    -translate-y-8 group-hover:translate-y-0
                                    w-full max-w-[1024px] mx-auto px-4 pt-10 pb-12 grid grid-cols-1 md:grid-cols-4 gap-8">

                                    {/* Column 1 & 2: Main Categories */}
                                    <div className="col-span-2 space-y-4">
                                        <h3 className="text-zinc-500 font-mono text-xs uppercase tracking-widest pl-2">Shop Categories</h3>
                                        <ul className="flex flex-col flex-wrap max-h-[240px] gap-x-8">
                                            {categories.map(category => {
                                                const localizedName = String(category[`name_${locale}` as keyof typeof category] || category.name_az);
                                                return (
                                                    <li key={category.id} className="py-1">
                                                        <Link
                                                            href={`/${locale}/categories/${category.slug}`}
                                                            className="text-white/80 hover:text-white text-xl sm:text-2xl font-semibold tracking-tight transition-colors block px-2 py-1 rounded-md hover:bg-white/5"
                                                        >
                                                            {localizedName}
                                                        </Link>
                                                    </li>
                                                );
                                            })}
                                        </ul>
                                    </div>

                                    {/* Column 3: Quick Links */}
                                    <div className="col-span-1 space-y-4 pl-4 border-l border-white/10">
                                        <h3 className="text-zinc-500 font-mono text-xs uppercase tracking-widest">Quick Links</h3>
                                        <ul className="space-y-2">
                                            <li><Link href={`/${locale}/products`} className="text-xs text-zinc-300 hover:text-white transition-colors block py-1">View All Deals</Link></li>
                                            <li><Link href={`/${locale}/categories`} className="text-xs text-zinc-300 hover:text-white transition-colors block py-1">Category Index</Link></li>
                                            <li><Link href={`/${locale}#contact`} className="text-xs text-zinc-300 hover:text-white transition-colors block py-1">Contact Support</Link></li>
                                        </ul>
                                    </div>

                                    {/* Column 4: Promotional Feature */}
                                    <div className="col-span-1 space-y-4 pl-4 border-l border-white/10 flex flex-col justify-end">
                                        <Link href={`/${locale}/products`} className="group/promo block cursor-pointer">
                                            <div className="w-full aspect-square bg-zinc-900 rounded-2xl overflow-hidden relative border border-white/10">
                                                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent z-10" />
                                                <div className="absolute inset-0 flex flex-col justify-end p-6 z-20">
                                                    <span className="text-sm font-semibold text-white mb-1 group-hover/promo:underline">Explore New Arrivals</span>
                                                    <span className="text-xs text-zinc-400">Upgrade your workspace today.</span>
                                                </div>
                                            </div>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="h-full flex items-center">
                        <Link href={`/${locale}/products`} className="hover:text-white transition-colors px-2">
                            {t('deals')}
                        </Link>
                    </div>

                    <div className="h-full flex items-center">
                        <Link href={`/${locale}#contact`} className="hover:text-white transition-colors px-2">
                            {t('contact')}
                        </Link>
                    </div>
                </div>

                {/* Locale Switcher */}
                <div className="flex items-center space-x-4 z-50">
                    <Link href={`/az`} className={`hover:text-white transition-colors px-2 py-1 ${locale === 'az' ? 'text-white font-bold' : ''}`}>AZ</Link>
                    <Link href={`/ru`} className={`hover:text-white transition-colors px-2 py-1 ${locale === 'ru' ? 'text-white font-bold' : ''}`}>RU</Link>
                    <Link href={`/en`} className={`hover:text-white transition-colors px-2 py-1 ${locale === 'en' ? 'text-white font-bold' : ''}`}>EN</Link>
                </div>

            </div>
        </nav>
    );
};

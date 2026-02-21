import { getTranslations, getLocale } from 'next-intl/server';
import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';

export default async function CategoriesIndexPage() {
    const t = await getTranslations('storefront');
    const locale = await getLocale();
    const supabase = await createClient();

    const { data: categories } = await supabase
        .from('categories')
        .select('*')
        .eq('is_active', true)
        .order('sort_order', { ascending: true });

    if (!categories || categories.length === 0) {
        return (
            <main className="min-h-screen pt-32 pb-16 flex items-center justify-center">
                <p className="font-mono text-zinc-500 uppercase tracking-widest">No categories available.</p>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-white text-black pt-32 pb-16">
            <div className="container mx-auto max-w-[1400px]">

                {/* Header Block */}
                <div className="px-4 lg:px-12 mb-16 text-center">
                    <p className="font-mono text-xs font-bold uppercase tracking-widest text-zinc-400 mb-4">
                        Idx. 01 / Categorization
                    </p>
                    <h1 className="text-4xl md:text-6xl lg:text-8xl font-black uppercase tracking-tighter mb-4 text-balance">
                        {t('featured_categories_title')}
                    </h1>
                    <p className="text-xl md:text-2xl text-zinc-600 font-medium max-w-2xl mx-auto text-balance">
                        {t('featured_categories_subtitle')}
                    </p>
                </div>

                {/* Rigid Grid using the 1px gap technique for perfect Swiss borders */}
                <div className="bg-black border-y-2 border-black grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[2px]">
                    {categories.map((category, idx) => {
                        const localizedName = String(category[`name_${locale}` as keyof typeof category] || category.name_az);

                        return (
                            <Link
                                key={category.id}
                                href={`/${locale}/categories/${category.slug}`}
                                className="group relative h-[40vh] md:h-[50vh] flex flex-col justify-between overflow-hidden bg-white text-black hover:bg-black hover:text-white transition-colors duration-0"
                            >
                                <div className="p-6 lg:p-10 flex justify-between items-start z-20">
                                    <span className="font-mono text-3xl font-black tracking-tighter opacity-20 group-hover:opacity-100 transition-opacity">
                                        {String(idx + 1).padStart(2, '0')}
                                    </span>
                                    <ArrowUpRight className="w-8 h-8 opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300" />
                                </div>

                                <div className="p-6 lg:p-10 z-20 mt-auto border-t-[2px] border-transparent group-hover:border-white/20">
                                    <h3 className="text-4xl lg:text-6xl font-black uppercase tracking-tighter mb-4 leading-none group-hover:rotate-1 origin-left transition-transform">
                                        {localizedName}
                                    </h3>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </main>
    );
}

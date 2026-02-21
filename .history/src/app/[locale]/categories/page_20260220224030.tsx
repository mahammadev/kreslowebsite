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

                {/* Refined Grid matching Template Aesthetics */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {categories.map((category, idx) => {
                        const localizedName = String(category[`name_${locale}` as keyof typeof category] || category.name_az);

                        return (
                            <Link
                                key={category.id}
                                href={`/${locale}/categories/${category.slug}`}
                                className="group relative h-[40vh] md:h-[50vh] flex flex-col justify-end overflow-hidden rounded-xl bg-zinc-100 hover:shadow-xl transition-all duration-300 border border-zinc-200"
                            >
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 z-10" />

                                <div className="absolute top-6 right-6 z-20">
                                    <div className="bg-white/90 backdrop-blur text-black p-3 rounded-full opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                                        <ArrowUpRight className="w-5 h-5" />
                                    </div>
                                </div>

                                <div className="p-8 z-20 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                                    <span className="font-mono text-sm font-semibold tracking-widest text-white/70 mb-2 block">
                                        Idx. {String(idx + 1).padStart(2, '0')}
                                    </span>
                                    <h3 className="text-3xl lg:text-4xl font-bold uppercase tracking-tight text-white mb-2 leading-none">
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

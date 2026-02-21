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
        <main className="min-h-screen bg-white text-black pt-24 pb-16">
            <div className="mx-auto max-w-[1400px] px-4 md:px-8 xl:px-16">

                {/* Header Block */}
                <div className="mb-12">
                    <h1 className="text-2xl md:text-3xl font-bold tracking-tight mb-2">
                        {t('featured_categories_title')}
                    </h1>
                    <p className="text-base text-zinc-500">
                        {t('featured_categories_subtitle')}
                    </p>
                </div>

                {/* Refined Minimalist Grid matching Template Aesthetics */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0 border-t border-l border-zinc-200">
                    {categories.map((category) => {
                        const localizedName = String(category[`name_${locale}` as keyof typeof category] || category.name_az);

                        return (
                            <Link
                                key={category.id}
                                href={`/${locale}/categories/${category.slug}`}
                                className="group relative aspect-square flex flex-col justify-center items-center overflow-hidden bg-white hover:bg-zinc-50 transition-colors duration-200 border-r border-b border-zinc-200"
                            >
                                <div className="z-20 text-center">
                                    <h3 className="text-2xl font-semibold uppercase tracking-widest text-foreground group-hover:scale-105 transition-transform duration-300">
                                        {localizedName}
                                    </h3>
                                    <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex justify-center">
                                        <ArrowUpRight className="w-5 h-5 text-zinc-400" />
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </main>
    );
}

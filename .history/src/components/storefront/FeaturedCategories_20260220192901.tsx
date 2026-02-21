import { getTranslations, getLocale } from 'next-intl/server';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';

export const FeaturedCategories = async () => {
    const t = await getTranslations('storefront');
    const locale = await getLocale();
    const supabase = await createClient();

    const { data: categories } = await supabase
        .from('categories')
        .select('*')
        .eq('is_active', true)
        .order('sort_order', { ascending: true })
        .limit(3);

    if (!categories || categories.length === 0) {
        return null;
    }

    return (
        <section className="bg-white text-black border-t-8 border-black">
            <div className="container mx-auto max-w-[1400px]">

                {/* Asymmetric Header Structure */}
                <div className="grid grid-cols-1 md:grid-cols-12 mb-16 px-4 pt-16 lg:px-12">
                    <div className="md:col-span-3">
                        <p className="font-mono text-xs font-bold uppercase tracking-widest text-zinc-400 mb-4">
                            Idx. 01 / Categorization
                        </p>
                    </div>
                    <div className="md:col-span-9 border-l-4 border-black pl-8 lg:pl-16">
                        <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter leading-[0.85] max-w-2xl">
                            {t('featured_categories_title')}
                        </h2>
                        <p className="text-xl md:text-2xl text-zinc-600 font-medium mt-8 max-w-xl leading-tight">
                            {t('featured_categories_subtitle')}
                        </p>
                    </div>
                </div>

                {/* Rigid Blueprint Grid - Text Only */}
                <div className="grid grid-cols-1 md:grid-cols-3 border-t-[1px] border-b-[1px] border-black">
                    {categories.map((category, idx) => {
                        const localizedName = String(category[`name_${locale}` as keyof typeof category] || category.name_az);

                        return (
                            <Link
                                key={category.id}
                                href={`/categories/${category.slug}`}
                                className="group relative h-[40vh] md:h-[50vh] flex flex-col justify-between overflow-hidden border-b md:border-b-0 md:border-r-[1px] border-black last:border-r-0 hover:bg-black hover:text-white transition-colors duration-0 focus-visible:ring-4 focus-visible:ring-black focus-visible:outline-none"
                            >
                                {/* Graphic Identifier */}
                                <div className="p-6 lg:p-10 flex justify-between items-start z-20">
                                    <span className="font-mono text-3xl font-black tracking-tighter opacity-20 group-hover:opacity-100 transition-opacity">
                                        {String(idx + 1).padStart(2, '0')}
                                    </span>
                                    <ArrowUpRight className="w-8 h-8 opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300" />
                                </div>

                                {/* Typographic Foundation */}
                                <div className="p-6 lg:p-10 z-20 mt-auto border-t-[1px] border-black/10 group-hover:border-white/20">
                                    <h3 className="text-4xl lg:text-6xl font-black uppercase tracking-tighter mb-4 leading-none group-hover:rotate-1 origin-left transition-transform">
                                        {localizedName}
                                    </h3>
                                </div>
                            </Link>
                        )
                    })}
                </div>
            </div>
        </section>
    );
};

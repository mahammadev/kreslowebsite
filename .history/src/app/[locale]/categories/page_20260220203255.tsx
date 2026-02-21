import { getTranslations, getLocale } from 'next-intl/server';
import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';

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
                <div className="px-4 lg:px-12 mb-16">
                    <p className="font-mono text-xs font-bold uppercase tracking-widest text-zinc-400 mb-4">
                        Idx. 01 / Categorization
                    </p>
                    <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter leading-[0.85] max-w-2xl">
                        {t('featured_categories_title')}
                    </h1>
                </div>

                {/* Rigid Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 border-t-[1px] border-b-[1px] border-black">
                    {categories.map((category, idx) => {
                        const localizedName = String(category[`name_${locale}` as keyof typeof category] || category.name_az);

                        return (
                            <Link
                                key={category.id}
                                href={`/${locale}/categories/${category.slug}`}
                                className="group relative h-[40vh] md:h-[50vh] flex flex-col justify-between overflow-hidden border-b md:border-b-0 md:border-r-[1px] md:last:border-r-0 lg:[&:nth-child(3n)]:border-r-0 border-black hover:bg-black hover:text-white transition-colors duration-0"
                            >
                                <div className="p-6 lg:p-10 flex justify-between items-start z-20">
                                    <span className="font-mono text-3xl font-black tracking-tighter opacity-20 group-hover:opacity-100 transition-opacity">
                                        {String(idx + 1).padStart(2, '0')}
                                    </span>
                                </div>

                                <div className="p-6 lg:p-10 z-20 mt-auto border-t-[1px] border-black/10 group-hover:border-white/20">
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

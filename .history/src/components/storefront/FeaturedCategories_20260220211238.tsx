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
        .limit(4);

    if (!categories || categories.length === 0) {
        return null;
    }

    return (
        <section className="bg-background text-foreground pt-top-spacing border-t border-border">
            <div className="w-full">

                {/* Section header — template style: index label + title */}
                <div className="base-grid px-sides mb-8 pt-sides">
                    <div className="col-span-12 md:col-span-3">
                        <p className="font-mono text-xs font-bold uppercase tracking-widest text-muted-foreground">
                            §01 / Categories
                        </p>
                    </div>
                    <div className="col-span-12 md:col-span-9 md:border-l border-foreground/10 md:pl-8">
                        <h2 className="text-4xl md:text-5xl font-semibold tracking-tighter leading-tight text-balance">
                            {t('featured_categories_title')}
                        </h2>
                        <p className="text-base text-muted-foreground mt-4 max-w-md leading-relaxed">
                            {t('featured_categories_subtitle')}
                        </p>
                    </div>
                </div>

                {/* Category grid — clean label-on-hover cards */}
                <div className={`grid grid-cols-1 ${categories.length >= 3 ? 'md:grid-cols-3' : 'md:grid-cols-2'} border-t border-border`}>
                    {categories.map((category, idx) => {
                        const localizedName = String(category[`name_${locale}` as keyof typeof category] || category.name_az);

                        return (
                            <Link
                                key={category.id}
                                href={`/${locale}/categories/${category.slug}`}
                                className="group relative h-[40vh] md:h-[50vh] flex flex-col justify-between overflow-hidden
                                    border-r border-b border-border last:border-r-0
                                    hover:bg-foreground hover:text-background transition-colors duration-200
                                    focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                            >
                                {/* Number badge */}
                                <div className="p-sides flex justify-between items-start">
                                    <span className="font-mono text-2xl font-bold tracking-tighter text-muted-foreground/30 group-hover:text-background/40 transition-colors">
                                        {String(idx + 1).padStart(2, '0')}
                                    </span>
                                    <ArrowUpRight className="w-5 h-5 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300 text-background" />
                                </div>

                                {/* Title at bottom */}
                                <div className="p-sides pt-4 border-t border-border/30 group-hover:border-background/10 transition-colors">
                                    <h3 className="text-3xl md:text-4xl font-semibold tracking-tighter leading-none">
                                        {localizedName}
                                    </h3>
                                </div>
                            </Link>
                        );
                    })}
                </div>

            </div>
        </section>
    );
};

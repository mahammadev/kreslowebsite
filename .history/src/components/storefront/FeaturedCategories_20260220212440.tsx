import { getTranslations, getLocale } from 'next-intl/server';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';

export const FeaturedCategories = async () => {
    const t = await getTranslations('storefront');
    const locale = await getLocale();
    const supabase = await createClient();

    const { data: categories } = await supabase
        .from('categories')
        .select('*')
        .eq('is_active', true)
        .order('sort_order', { ascending: true });

    if (!categories || categories.length === 0) return null;

    return (
        <aside className="max-md:hidden col-span-4 h-screen sticky top-0 p-sides pt-top-spacing flex flex-col justify-between">
            <div>
                <p className="italic tracking-tighter text-base">Refined. Minimal. Never boring.</p>
                <div className="mt-5 text-base leading-tight">
                    <p>Furniture that speaks softly, but stands out loud.</p>
                    <p>Clean lines, crafted with wit.</p>
                    <p>Elegance with a wink — style first</p>
                </div>
            </div>
            <div className="text-left">
                <h4 className="text-lg font-extrabold md:text-xl">Shop</h4>
                <ul className="flex flex-col gap-1.5 leading-5 mt-5">
                    {categories.map((cat) => {
                        const localizedName = String(cat[`name_${locale}` as keyof typeof cat] || cat.name_az);
                        return (
                            <li key={cat.id}>
                                <Link href={`/${locale}/categories/${cat.slug}`} prefetch>
                                    {localizedName}
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </div>
        </aside>
    );
};

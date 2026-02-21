import Link from 'next/link';
import { getLocale, getTranslations } from 'next-intl/server';
import { createClient } from '@/lib/supabase/server';

export const Footer = async () => {
    const year = new Date().getFullYear();
    const locale = await getLocale();
    const t = await getTranslations('storefront');
    const ft = await getTranslations('footer');
    const supabase = await createClient();

    const { data: categories } = await supabase
        .from('categories')
        .select('id, slug, name_az, name_ru, name_en')
        .eq('is_active', true)
        .order('sort_order', { ascending: true });

    return (
        <footer className="p-sides">
            <div className="w-full md:h-[532px] p-sides md:p-11 text-background bg-foreground rounded-[12px] flex flex-col justify-between max-md:gap-8">
                <div className="flex flex-col justify-between md:flex-row">
                    <h2 className="md:basis-3/4 max-md:w-full text-[clamp(3rem,10vw,8rem)] font-black tracking-tighter leading-none uppercase text-background/90">
                        VMSC
                    </h2>
                    <div className="text-right max-md:hidden">
                        <h4 className="text-lg font-extrabold md:text-xl">{t('shop')}</h4>
                        <ul className="flex flex-col gap-1.5 leading-5 mt-5">
                            {categories?.map((cat) => {
                                const localizedName = String(cat[`name_${locale}` as keyof typeof cat] || cat.name_az);
                                return (
                                    <li key={cat.id}>
                                        <Link href={`/${locale}/categories/${cat.slug}`} className="text-background/70 hover:text-background transition-colors">
                                            {localizedName}
                                        </Link>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                    <span className="mt-3 italic font-semibold md:hidden text-background/50">{t('tagline')}</span>
                </div>
                <div className="flex justify-between max-md:contents text-muted-foreground">
                    <ul className="flex flex-row gap-2 justify-between max-w-[450px] w-full max-md:flex-col">
                        <li><Link href={`/${locale}/products`} className="text-xs 2xl:text-sm text-background/50 hover:text-background transition-colors">{ft('products')}</Link></li>
                        <li><Link href={`/${locale}/categories`} className="text-xs 2xl:text-sm text-background/50 hover:text-background transition-colors">{ft('categories')}</Link></li>
                        <li><Link href={`/${locale}#contact`} className="text-xs 2xl:text-sm text-background/50 hover:text-background transition-colors">{ft('contact')}</Link></li>
                    </ul>
                    <p className="text-base text-background/40">{year}© — {t('all_rights')}</p>
                </div>
            </div>
        </footer>
    );
};

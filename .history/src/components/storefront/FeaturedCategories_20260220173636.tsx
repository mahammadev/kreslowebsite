import { useTranslations } from 'next-intl';
import Image from 'next/image';
import Link from 'next/link';

const MOCK_CATEGORIES = [
    {
        id: 'chairs',
        title: 'categories.chairs.title',
        description: 'categories.chairs.description',
        image: "https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?q=80&w=2070&auto=format&fit=crop",
        href: '/categories/office-chairs'
    },
    {
        id: 'desks',
        title: 'categories.desks.title',
        description: 'categories.desks.description',
        image: "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?q=80&w=1935&auto=format&fit=crop",
        href: '/categories/desks'
    },
    {
        id: 'accessories',
        title: 'categories.accessories.title',
        description: 'categories.accessories.description',
        image: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?q=80&w=2070&auto=format&fit=crop",
        href: '/categories/accessories'
    }
];

export const FeaturedCategories = () => {
    const t = useTranslations('storefront');

    return (
        <section className="py-24 bg-zinc-50 dark:bg-zinc-950">
            <div className="container mx-auto px-4 max-w-7xl">
                <div className="text-center mb-16 space-y-4">
                    <h2 className="text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
                        {t('featured_categories_title')}
                    </h2>
                    <p className="text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
                        {t('featured_categories_subtitle')}
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {MOCK_CATEGORIES.map((category) => (
                        <Link
                            key={category.id}
                            href={category.href}
                            className="group relative h-96 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 block"
                        >
                            <div className="absolute inset-0 z-0">
                                <Image
                                    src={category.image}
                                    alt={category.id}
                                    fill
                                    className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                            </div>

                            <div className="absolute inset-x-0 bottom-0 z-10 p-8 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                                <h3 className="text-2xl font-bold text-white mb-2">
                                    {t(category.title as any)}
                                </h3>
                                <p className="text-zinc-300 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
                                    {t(category.description as any)}
                                </p>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
};

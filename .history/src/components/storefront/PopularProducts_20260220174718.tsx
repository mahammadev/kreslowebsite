'use client';

import { useTranslations } from 'next-intl';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ShoppingCart } from 'lucide-react';

const MOCK_PRODUCTS = [
    {
        id: 'ergonomic-chair-pro',
        name: 'products.ergonomic_chair_pro.name',
        price: 349.99,
        category: 'Ofis Kresloları',
        image: "https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?q=80&w=2070&auto=format&fit=crop",
        href: '/products/ergonomic-chair-pro'
    },
    {
        id: 'standing-desk-lite',
        name: 'products.standing_desk_lite.name',
        price: 499.00,
        category: 'Masalar',
        image: "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?q=80&w=1935&auto=format&fit=crop",
        href: '/products/standing-desk-lite'
    },
    {
        id: 'mesh-back-task',
        name: 'products.mesh_back_task.name',
        price: 199.50,
        category: 'İş Kresloları',
        image: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?q=80&w=2070&auto=format&fit=crop",
        href: '/products/mesh-back-task'
    },
    {
        id: 'executive-leather',
        name: 'products.executive_leather.name',
        price: 599.99,
        category: 'Müdür Kresloları',
        image: "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?q=80&w=2070&auto=format&fit=crop",
        href: '/products/executive-leather'
    }
];

export const PopularProducts = () => {
    const t = useTranslations('storefront');

    return (
        <section className="py-24 bg-white dark:bg-black">
            <div className="container mx-auto px-4 max-w-7xl">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
                    <div className="space-y-4">
                        <h2 className="text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
                            {t('popular_products_title')}
                        </h2>
                        <p className="text-lg text-zinc-600 dark:text-zinc-400">
                            {t('popular_products_subtitle')}
                        </p>
                    </div>
                    <Button variant="outline" className="shrink-0 rounded-full" asChild>
                        <Link href="/products">{t('view_all_products')}</Link>
                    </Button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {MOCK_PRODUCTS.map((product) => (
                        <div key={product.id} className="group flex flex-col bg-zinc-50 dark:bg-zinc-900 rounded-2xl overflow-hidden border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors">
                            {/* Product Image */}
                            <Link href={product.href} className="relative aspect-square overflow-hidden bg-zinc-100 dark:bg-zinc-800 block">
                                <Image
                                    src={product.image}
                                    alt={product.id}
                                    fill
                                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                                    className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                                />
                                {/* Overlay gradient for better icon visibility */}
                                <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </Link>

                            {/* Product Info */}
                            <div className="p-6 flex flex-col flex-1">
                                <div className="text-sm text-zinc-500 dark:text-zinc-400 mb-2">
                                    {product.category}
                                </div>
                                <Link href={product.href} className="flex-1">
                                    <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-4 line-clamp-2 group-hover:text-primary transition-colors">
                                        {/* Fallback to raw string if translation is missing for mock data */}
                                        {t.has(product.name as any) ? t(product.name as any) : product.name.split('.').pop()?.replace(/_/g, ' ')}
                                    </h3>
                                </Link>
                                <div className="flex items-center justify-between mt-auto pt-4 border-t border-zinc-100 dark:border-zinc-800">
                                    <span className="text-xl font-bold">
                                        ${product.price.toFixed(2)}
                                    </span>
                                    <Button size="icon" variant="ghost" className="rounded-full hover:bg-zinc-200 dark:hover:bg-zinc-800">
                                        <ShoppingCart className="w-5 h-5" />
                                        <span className="sr-only">Add to cart</span>
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

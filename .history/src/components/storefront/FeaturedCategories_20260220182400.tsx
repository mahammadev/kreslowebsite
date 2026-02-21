import { useTranslations } from 'next-intl';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';

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

                {/* Rigid Blueprint Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 border-t-[1px] border-b-[1px] border-black">
                    {MOCK_CATEGORIES.map((category, idx) => (
                        <Link
                            key={category.id}
                            href={category.href}
                            className="group relative h-[60vh] md:h-[70vh] flex flex-col justify-between overflow-hidden border-b md:border-b-0 md:border-r-[1px] border-black last:border-r-0 hover:bg-black hover:text-white transition-colors duration-0 focus-visible:ring-4 focus-visible:ring-black focus-visible:outline-none"
                        >
                            {/* Graphic Identifier */}
                            <div className="p-6 lg:p-10 flex justify-between items-start z-20">
                                <span className="font-mono text-3xl font-black tracking-tighter opacity-20 group-hover:opacity-100 transition-opacity">
                                    {String(idx + 1).padStart(2, '0')}
                                </span>
                                <ArrowUpRight className="w-8 h-8 opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300" />
                            </div>

                            {/* Center Image Cutout */}
                            <div className="absolute inset-0 top-32 bottom-32 z-10 p-6 lg:p-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                                <div className="relative w-full h-full grayscale group-hover:grayscale-0 contrast-125 border-2 border-white mix-blend-difference overflow-hidden">
                                    <Image
                                        src={category.image}
                                        alt={category.id}
                                        fill
                                        sizes="(max-width: 768px) 100vw, 33vw"
                                        className="object-cover transition-transform duration-[20s] group-hover:scale-125 ease-linear"
                                    />
                                </div>
                            </div>

                            {/* Typographic Foundation */}
                            <div className="p-6 lg:p-10 z-20 mt-auto border-t-[1px] border-black/10 group-hover:border-white/20">
                                <h3 className="text-3xl lg:text-5xl font-black uppercase tracking-tighter mb-4 leading-none group-hover:rotate-1 origin-left transition-transform">
                                    {t(category.title as any)}
                                </h3>
                                <p className="text-lg font-medium text-zinc-500 group-hover:text-zinc-300">
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

'use client';

import { useTranslations, useLocale } from 'next-intl';
import Image from 'next/image';
import Link from 'next/link';
import { generateWhatsAppLink } from '@/lib/whatsapp';

const MOCK_PRODUCTS = [
    {
        id: 'ergonomic-chair-pro',
        name: 'products.ergonomic_chair_pro.name',
        price: 349.99,
        category: 'CHAIR',
        sku: 'ACH-001',
        image: "https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?q=80&w=2070&auto=format&fit=crop",
        href: '/products/ergonomic-chair-pro'
    },
    {
        id: 'standing-desk-lite',
        name: 'products.standing_desk_lite.name',
        price: 499.00,
        category: 'DESK',
        sku: 'DSK-992',
        image: "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?q=80&w=1935&auto=format&fit=crop",
        href: '/products/standing-desk-lite'
    },
    {
        id: 'mesh-back-task',
        name: 'products.mesh_back_task.name',
        price: 199.50,
        category: 'TASK',
        sku: 'TSK-114',
        image: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?q=80&w=2070&auto=format&fit=crop",
        href: '/products/mesh-back-task'
    },
    {
        id: 'executive-leather',
        name: 'products.executive_leather.name',
        price: 599.99,
        category: 'EXEC',
        sku: 'LXR-005',
        image: "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?q=80&w=2070&auto=format&fit=crop",
        href: '/products/executive-leather'
    }
];

export const PopularProducts = () => {
    const t = useTranslations('storefront');
    const locale = useLocale();

    // Use standard Intl formatting (addresses accessibility/UX audit concern)
    const formatter = new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: 'USD',
    });

    const phoneNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "994554017464";

    return (
        <section className="bg-white text-black border-t-8 border-black pt-16 lg:pt-24 pb-32">
            <div className="container mx-auto max-w-[1400px] px-4 lg:px-12">

                {/* Header Lockup */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end border-b-4 border-black pb-8 mb-0">
                    <div className="space-y-4 max-w-2xl">
                        <p className="font-mono text-xs font-bold uppercase tracking-widest text-zinc-400">
                            Idx. 02 / Inventory Status
                        </p>
                        <h2 className="text-5xl md:text-6xl font-black uppercase tracking-tighter leading-none">
                            {t('popular_products_title')}
                        </h2>
                    </div>
                    <Link
                        href="/products"
                        className="mt-8 md:mt-0 font-bold uppercase tracking-widest text-sm hover:bg-black hover:text-white border-2 border-black px-8 py-4 transition-colors focus-visible:ring-4 focus-visible:ring-black focus-visible:outline-none"
                    >
                        {t('view_all_products')} [ + ]
                    </Link>
                </div>

                {/* Gapless Border Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 border-b-[1px] border-l-[1px] border-black">
                    {MOCK_PRODUCTS.map((product) => {
                        const translatedName = t.has(product.name as any) ? t(product.name as any) : product.name.split('.').pop()?.replace(/_/g, ' ') || product.name;
                        const formattedPrice = formatter.format(product.price);
                        const waLink = generateWhatsAppLink(phoneNumber, `${translatedName} - ${formattedPrice}`, product.sku, locale);

                        return (
                            <div key={product.id} className="group flex flex-col border-r-[1px] border-black relative bg-white">

                                {/* Rigid Graphic Top */}
                                <Link
                                    href={product.href}
                                    className="relative aspect-[4/5] block overflow-hidden border-b-[1px] border-black focus-visible:ring-4 focus-visible:ring-black focus-visible:outline-none focus-[z-index:10]"
                                >
                                    <div className="absolute top-4 left-4 z-20 flex flex-col font-mono text-xs font-bold mix-blend-difference text-white">
                                        <span>{product.sku}</span>
                                        <span>{product.category}</span>
                                    </div>
                                    <Image
                                        src={product.image}
                                        alt={product.id}
                                        fill
                                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                                        className="object-cover grayscale contrast-125 group-hover:scale-105 transition-transform duration-[10s] ease-linear"
                                    />
                                </Link>

                                {/* Typographic Information Panel */}
                                <div className="p-6 flex flex-col flex-1 justify-between group-hover:bg-black group-hover:text-white transition-colors duration-0">
                                    <Link
                                        href={product.href}
                                        className="focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none"
                                    >
                                        <h3 className="text-2xl font-black uppercase tracking-tight leading-none mb-6">
                                            {translatedName}
                                        </h3>
                                    </Link>

                                    <div className="flex items-end justify-between w-full mt-auto border-t border-black group-hover:border-white pt-4">
                                        <span className="font-mono text-xl font-bold tracking-tighter">
                                            {formattedPrice}
                                        </span>
                                        <a
                                            href={waLink}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="font-bold uppercase tracking-widest text-xs p-2 border border-transparent hover:border-white focus-visible:border-white focus-visible:outline-none"
                                            aria-label={`Buy ${product.id} via WhatsApp`}
                                        >
                                            Buy
                                        </a>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>

            </div>
        </section>
    );
};

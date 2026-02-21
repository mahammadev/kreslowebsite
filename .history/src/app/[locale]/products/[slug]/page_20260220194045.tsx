import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { notFound } from 'next/navigation';
import { generateWhatsAppLink } from '@/lib/whatsapp';
import { createClient } from '@/lib/supabase/server';

export default async function ProductDetailPage({
    params
}: {
    params: Promise<{ locale: string; slug: string }>
}) {
    const resolvedParams = await params;
    const { slug, locale } = resolvedParams;
    const supabase = await createClient();

    const { data: product } = await supabase
        .from('products')
        .select(`
            id, 
            name_az, 
            name_ru, 
            name_en, 
            description_az, 
            description_ru, 
            description_en, 
            price, 
            category:categories(slug), 
            sku, 
            image_url, 
            slug, 
            attributes
        `)
        .eq('slug', slug)
        .single();

    if (!product) {
        notFound();
    }

    const localizedName = String(product[`name_${locale}` as keyof typeof product] || product.name_az);
    const localizedDescription = String(product[`description_${locale}` as keyof typeof product] || product.description_az || '');
    const categorySlug = product.category ? (product.category as any).slug?.toUpperCase() : 'ITEM';

    // Parse attributes or fallback to NA if the database jsonb is empty
    const attrs = (product.attributes as Record<string, string>) || {};
    const dimensions = attrs.dimensions || 'N/A';
    const weight = attrs.weight || 'N/A';
    const materials = attrs.materials || 'N/A';

    // Server-side formatting
    const formatter = new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: 'USD',
    });

    const formattedPrice = formatter.format(product.price);
    const phoneNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "994505372177";
    const waLink = generateWhatsAppLink(phoneNumber, `${localizedName} - ${formattedPrice}`, product.sku, locale);

    return (
        <main className="min-h-screen bg-white text-black flex flex-col pt-16 lg:pt-0">
            {/* Minimalist Top Nav */}
            <nav className="fixed top-0 left-0 w-full h-16 border-b-2 border-black bg-white z-50 px-6 flex items-center justify-between">
                <Link href="/" className="font-black text-2xl tracking-tighter uppercase focus-visible:ring-2 focus-visible:ring-black focus-visible:outline-none">
                    KRESLO
                </Link>
                <Link href="/" className="font-mono text-sm font-bold uppercase hover:underline focus-visible:ring-2 focus-visible:ring-black focus-visible:outline-none flex items-center gap-2">
                    <ArrowLeft className="w-4 h-4" /> Index
                </Link>
            </nav>

            {/* Swiss Layout: 50/50 Split */}
            <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 mt-16 lg:mt-0 lg:h-screen lg:overflow-hidden">

                {/* Left Pane: Image Data */}
                <div className="relative w-full aspect-square lg:aspect-auto lg:h-full border-b-4 lg:border-b-0 lg:border-r-4 border-black group bg-zinc-900 overflow-hidden">
                    <Image
                        src={product.image_url}
                        alt={localizedName}
                        fill
                        sizes="(max-width: 1024px) 100vw, 50vw"
                        className="object-cover transition-transform duration-[20s] group-hover:scale-110 ease-linear contrast-125"
                        priority
                    />

                    {/* Brutalist HUD */}
                    <div className="absolute top-6 left-6 mix-blend-difference text-white font-mono text-xs uppercase font-bold tracking-widest pointer-events-none">
                        <span className="block mb-2">FIG. {Math.floor(Math.random() * 90) + 10}</span>
                        <span className="block">SKU: {product.sku}</span>
                    </div>
                </div>

                {/* Right Pane: Typographic Information Architecture */}
                <div className="flex flex-col h-full overflow-y-auto bg-white">

                    {/* Title Block */}
                    <div className="p-8 lg:p-12 border-b-2 border-black pt-16 lg:pt-32">
                        <span className="inline-block py-1 px-3 border-2 border-black font-mono text-xs font-bold uppercase tracking-widest mb-8">
                            {categorySlug}
                        </span>

                        <h1 className="text-6xl md:text-8xl lg:text-9xl font-black uppercase tracking-tighter leading-[0.85] mb-8 break-words text-balance">
                            {localizedName}
                        </h1>

                        <p className="text-xl md:text-2xl font-medium leading-tight text-zinc-600 max-w-xl">
                            {localizedDescription}
                        </p>
                    </div>

                    {/* Specifications Grid */}
                    <div className="grid grid-cols-2 font-mono text-sm uppercase">
                        <div className="p-6 lg:p-12 border-b-2 border-r-2 border-black flex flex-col justify-between min-h-[160px]">
                            <span className="text-zinc-500 font-bold tracking-widest">Dimensions</span>
                            <span className="text-base font-bold">{dimensions}</span>
                        </div>
                        <div className="p-6 lg:p-12 border-b-2 border-black flex flex-col justify-between min-h-[160px]">
                            <span className="text-zinc-500 font-bold tracking-widest">Weight</span>
                            <span className="text-base font-bold">{weight}</span>
                        </div>
                        <div className="col-span-2 p-6 lg:p-12 border-b-2 border-black flex flex-col justify-between min-h-[160px]">
                            <span className="text-zinc-500 font-bold tracking-widest">Materials</span>
                            <span className="text-base font-bold">{materials}</span>
                        </div>
                    </div>

                    {/* Action Lockup */}
                    <div className="mt-auto p-8 lg:p-12 bg-zinc-50 flex items-center justify-between border-b-8 border-black">
                        <div className="font-mono text-4xl lg:text-5xl font-black tracking-tighter">
                            {formatter.format(product.price)}
                        </div>

                        <a
                            href={waLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center bg-black text-white px-8 lg:px-12 py-6 text-xl font-bold uppercase tracking-widest hover:bg-zinc-800 transition-colors focus-visible:ring-4 focus-visible:ring-black focus-visible:ring-offset-2 focus-visible:outline-none group"
                        >
                            {locale === 'az' ? 'Sifariş Et' : locale === 'ru' ? 'Заказать' : 'Checkout'}
                            <ArrowRight className="ml-4 w-6 h-6 group-hover:translate-x-2 transition-transform" />
                        </a>
                    </div>

                </div>
            </div>
        </main>
    );
}

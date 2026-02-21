import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { notFound } from 'next/navigation';

// Mock data (in a real app, you'd fetch based on the 'slug' param via Supabase)
const PRODUCTS = [
    {
        id: 'ergonomic-chair-pro',
        name: 'Ergonomic Chair Pro',
        price: 349.99,
        category: 'CHAIR',
        sku: 'ACH-001',
        description: 'Advanced ergonomic support engineered for sustained 12-hour workflows. Features a synchronized tilt mechanism, multi-directional armrests, and a dynamic lumbar propulsion system. Crafted with breathable mesh and structural aluminum.',
        dimensions: '60cm x 65cm x 120cm',
        weight: '18kg',
        materials: 'Aluminum, High-Density Nylon, Mesh',
        image: "https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?q=80&w=2070&auto=format&fit=crop"
    }
];

export default async function ProductDetailPage({
    params
}: {
    params: Promise<{ locale: string; slug: string }>
}) {
    const { slug } = await params;

    // Attempt mock fetch
    let product_id = slug;
    // For local dev preview where not all specific routes are mocked, fallback to the main mock product
    if (slug !== 'ergonomic-chair-pro') {
        product_id = 'ergonomic-chair-pro'; // DEMO FALLBACK
    }

    const product = PRODUCTS.find(p => p.id === product_id);

    if (!product) {
        notFound();
    }

    // Server-side formatting
    const formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    });

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
                        src={product.image}
                        alt={product.name}
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
                            {product.category}
                        </span>

                        <h1 className="text-6xl md:text-8xl lg:text-9xl font-black uppercase tracking-tighter leading-[0.85] mb-8 break-words text-balance">
                            {product.name}
                        </h1>

                        <p className="text-xl md:text-2xl font-medium leading-tight text-zinc-600 max-w-xl">
                            {product.description}
                        </p>
                    </div>

                    {/* Specifications Grid */}
                    <div className="grid grid-cols-2 font-mono text-sm uppercase">
                        <div className="p-6 lg:p-12 border-b-2 border-r-2 border-black flex flex-col justify-between min-h-[160px]">
                            <span className="text-zinc-500 font-bold tracking-widest">Dimensions</span>
                            <span className="text-base font-bold">{product.dimensions}</span>
                        </div>
                        <div className="p-6 lg:p-12 border-b-2 border-black flex flex-col justify-between min-h-[160px]">
                            <span className="text-zinc-500 font-bold tracking-widest">Weight</span>
                            <span className="text-base font-bold">{product.weight}</span>
                        </div>
                        <div className="col-span-2 p-6 lg:p-12 border-b-2 border-black flex flex-col justify-between min-h-[160px]">
                            <span className="text-zinc-500 font-bold tracking-widest">Materials</span>
                            <span className="text-base font-bold">{product.materials}</span>
                        </div>
                    </div>

                    {/* Action Lockup */}
                    <div className="mt-auto p-8 lg:p-12 bg-zinc-50 flex items-center justify-between border-b-8 border-black">
                        <div className="font-mono text-4xl lg:text-5xl font-black tracking-tighter">
                            {formatter.format(product.price)}
                        </div>

                        <button className="flex items-center justify-center bg-black text-white px-8 lg:px-12 py-6 text-xl font-bold uppercase tracking-widest hover:bg-zinc-800 transition-colors focus-visible:ring-4 focus-visible:ring-black focus-visible:ring-offset-2 focus-visible:outline-none group">
                            Checkout
                            <ArrowRight className="ml-4 w-6 h-6 group-hover:translate-x-2 transition-transform" />
                        </button>
                    </div>

                </div>
            </div>
        </main>
    );
}

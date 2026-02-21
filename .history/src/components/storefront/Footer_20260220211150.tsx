import Link from 'next/link';

export const Footer = () => {
    const year = new Date().getFullYear();

    return (
        <footer className="p-sides pb-sides">
            <div className="w-full md:min-h-[400px] p-sides md:p-11 text-background bg-foreground rounded-[12px] flex flex-col justify-between gap-8">

                {/* Top: Brand + Nav */}
                <div className="flex flex-col md:flex-row justify-between gap-8">
                    <div className="flex flex-col gap-3 md:basis-2/3">
                        <span className="font-bold tracking-[0.3em] text-2xl md:text-4xl uppercase text-background/90">
                            KRESLO
                        </span>
                        <p className="italic font-medium text-background/50 text-sm max-w-xs leading-relaxed">
                            Refined. Minimal. Never boring.
                        </p>
                        <p className="text-background/40 text-sm max-w-xs leading-relaxed hidden md:block">
                            Furniture that speaks softly, but stands out loud.<br />
                            Clean lines, crafted with wit.
                        </p>
                    </div>

                    <div className="flex flex-col md:flex-row gap-8 md:items-start">
                        {/* Shop links */}
                        <div className="flex flex-col gap-3">
                            <h3 className="text-background/40 text-xs font-bold uppercase tracking-widest mb-1">Shop</h3>
                            <Link href="/az/products" className="text-sm text-background/70 hover:text-background transition-colors">All Products</Link>
                            <Link href="/az/categories" className="text-sm text-background/70 hover:text-background transition-colors">Categories</Link>
                        </div>

                        {/* Info links */}
                        <div className="flex flex-col gap-3">
                            <h3 className="text-background/40 text-xs font-bold uppercase tracking-widest mb-1">Info</h3>
                            <Link href="/az#contact" className="text-sm text-background/70 hover:text-background transition-colors">Contact</Link>
                        </div>

                        {/* Locales */}
                        <div className="flex flex-col gap-3">
                            <h3 className="text-background/40 text-xs font-bold uppercase tracking-widest mb-1">Language</h3>
                            <div className="flex gap-3">
                                <Link href="/az" className="text-sm text-background/70 hover:text-background transition-colors">AZ</Link>
                                <Link href="/ru" className="text-sm text-background/70 hover:text-background transition-colors">RU</Link>
                                <Link href="/en" className="text-sm text-background/70 hover:text-background transition-colors">EN</Link>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom: Copyright */}
                <div className="flex justify-between items-center border-t border-background/10 pt-6">
                    <p className="text-sm text-background/40">{year}© — Kreslo Ofis. All rights reserved.</p>
                    <p className="text-sm text-background/30 hidden md:block">Baku, Azerbaijan</p>
                </div>
            </div>
        </footer>
    );
};

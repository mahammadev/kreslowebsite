import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { Button } from '@/components/ui/button';

export const Hero = () => {
    const t = useTranslations('hero');

    return (
        <section className="relative h-[80vh] w-full overflow-hidden">
            {/* Background Image */}
            <div className="absolute inset-0">
                <Image
                    src="https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2069&auto=format&fit=crop"
                    alt="Premium Office"
                    fill
                    className="object-cover"
                    priority
                />
                <div className="absolute inset-0 bg-black/50" />
            </div>

            {/* Content */}
            <div className="relative z-10 flex h-full items-center justify-center px-4 text-center">
                <div className="max-w-4xl space-y-8">
                    <h1 className="text-5xl font-bold tracking-tight text-white sm:text-7xl">
                        {t('title')}
                    </h1>
                    <p className="mx-auto max-w-2xl text-xl text-zinc-200">
                        {t('subtitle')}
                    </p>
                    <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                        <Button size="lg" className="h-14 px-8 text-lg font-semibold">
                            {t('cta_shop')}
                        </Button>
                        <Button size="lg" variant="outline" className="h-14 border-white px-8 text-lg font-semibold text-white hover:bg-white hover:text-black">
                            {t('cta_deals')}
                        </Button>
                    </div>
                </div>
            </div>
        </section>
    );
};

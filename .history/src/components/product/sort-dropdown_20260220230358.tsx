'use client';

import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
    SelectGroup,
    SelectLabel,
    SelectSeparator,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useTranslations } from 'next-intl';

interface SortDropdownProps {
    className?: string;
}

export function SortDropdown({ className }: SortDropdownProps) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const t = useTranslations('storefront');

    const sort = searchParams.get('sort') || undefined;

    const setSort = (value: string | null) => {
        const params = new URLSearchParams(searchParams.toString());
        if (value) {
            params.set('sort', value);
        } else {
            params.delete('sort');
        }
        router.push(`${pathname}?${params.toString()}`);
    };

    return (
        <Select value={sort} onValueChange={setSort}>
            <SelectTrigger
                size="sm"
                className={cn(
                    'justify-self-end -mr-3 font-medium bg-transparent border-none shadow-none md:w-48 hover:bg-muted/50',
                    className
                )}
            >
                <SelectValue placeholder={t('sort_by') || 'Sort by'} />
            </SelectTrigger>
            <SelectContent align="end">
                <SelectGroup>
                    <div className="flex justify-between items-center pr-1">
                        <SelectLabel className="text-xs">{t('sort') || 'Sort'}</SelectLabel>
                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="px-1 h-5 text-xs text-muted-foreground"
                            onClick={(e) => {
                                e.stopPropagation();
                                setSort(null);
                            }}
                        >
                            {t('clear') || 'Clear'}
                        </Button>
                    </div>
                    <SelectSeparator />
                    <SelectItem value="price_asc">{t('price_low_high') || 'Price: Low to High'}</SelectItem>
                    <SelectItem value="price_desc">{t('price_high_low') || 'Price: High to Low'}</SelectItem>
                </SelectGroup>
            </SelectContent>
        </Select>
    );
}

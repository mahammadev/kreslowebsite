import { cn } from '@/lib/utils';
import { cva } from 'class-variance-authority';
import Link from 'next/link';
import { Facebook, Instagram, Twitter } from 'lucide-react';

const linkVariants = cva('leading-tight transition-colors hover:underline ease-out duration-200 whitespace-nowrap', {
    variants: {
        invert: {
            true: 'text-zinc-500 hover:text-black',
            false: 'text-zinc-500 hover:text-foreground',
        },
        size: {
            sm: 'text-xs 2xl:text-sm',
            base: 'text-sm 2xl:text-base',
        },
    },
    defaultVariants: {
        invert: false,
        size: 'sm',
    },
});

interface SidebarLinksProps {
    className?: string;
    invert?: boolean;
    size?: 'sm' | 'base';
}

const CONTACT_LINKS = [
    { label: 'Instagram', href: 'https://instagram.com' },
    { label: 'Facebook', href: 'https://facebook.com' },
    { label: '(+994) 50 537 21 77', href: 'tel:+994505372177' }
];

export function SidebarLinks({ className, invert, size }: SidebarLinksProps) {
    return (
        <ul className={cn('flex flex-row gap-4 justify-between', className)}>
            {CONTACT_LINKS.map(link => (
                <li key={link.href}>
                    <Link href={link.href} target="_blank" className={linkVariants({ invert, size })}>
                        {link.label}
                    </Link>
                </li>
            ))}
        </ul>
    );
}

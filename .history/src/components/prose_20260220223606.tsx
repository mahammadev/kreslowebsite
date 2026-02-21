import { cn } from '@/lib/utils';
import React from 'react';

const Prose = ({ html, className }: { html: string; className?: string }) => {
    return (
        <div
            className={cn(
                'prose text-base leading-relaxed max-w-6xl text-foreground',
                className
            )}
            dangerouslySetInnerHTML={{ __html: html }}
        />
    );
};

export default Prose;

import * as React from 'react';
import { cn } from '@/lib/color-utils';

export interface Color {
    name: string;
    value: string;
}

interface ColorSwatchProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'color'> {
    color: Color | [Color, Color];
    size?: 'sm' | 'md' | 'lg';
    active?: boolean;
}

export const sizeClasses = {
    sm: 'size-4',
    md: 'size-6',
    lg: 'size-8',
};

export function ColorSwatch({
    color,
    size = 'md',
    active = false,
    className,
    ...props
}: ColorSwatchProps) {
    const isDualColor = Array.isArray(color);
    const displayName = isDualColor ? `${color[0].name} & ${color[1].name}` : color.name;

    return (
        <div
            className={cn(
                'rounded-full cursor-default ring-1 ring-border/50 transition-all relative overflow-hidden shrink-0',
                sizeClasses[size],
                active && 'ring-2 ring-primary ring-offset-2',
                className
            )}
            title={displayName}
            aria-label={`Color: ${displayName}`}
            {...props}
        >
            {isDualColor ? (
                <>
                    <div className="absolute top-0 left-0 w-1/2 h-full" style={{ backgroundColor: color[0].value }} />
                    <div className="absolute top-0 right-0 w-1/2 h-full" style={{ backgroundColor: color[1].value }} />
                </>
            ) : (
                <div className="w-full h-full" style={{ backgroundColor: color.value }} />
            )}
            <span className="sr-only">{displayName}</span>
        </div>
    );
}

import type { ReactNode } from 'react';

/** Small mono label above a heading. */
export default function Eyebrow({ children, className = '' }: { children: ReactNode; className?: string }) {
    return (
        <p className={`font-mono text-xs font-medium uppercase tracking-[0.16em] text-fg-muted ${className}`}>
            {children}
        </p>
    );
}

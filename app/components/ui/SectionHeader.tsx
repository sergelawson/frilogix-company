import type { ReactNode } from 'react';
import Eyebrow from './Eyebrow';

/**
 * Eyebrow + heading, with the lede beside it on wide screens. Every page
 * title is an h2: the hero's headline is the document's only h1.
 */
export default function SectionHeader({
    eyebrow,
    title,
    lede,
    className = '',
}: {
    eyebrow: ReactNode;
    title: ReactNode;
    lede?: ReactNode;
    className?: string;
}) {
    return (
        <div className={`grid gap-5 lg:grid-cols-12 lg:items-end lg:gap-12 ${className}`}>
            <div className="lg:col-span-7">
                <Eyebrow>{eyebrow}</Eyebrow>
                <h2 className="mt-4 font-wide text-h1 font-semibold text-balance">{title}</h2>
            </div>
            {lede && <p className="text-lede text-pretty text-fg-muted lg:col-span-5">{lede}</p>}
        </div>
    );
}

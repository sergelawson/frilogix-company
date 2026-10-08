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
    wide = false,
    className = '',
}: {
    eyebrow: ReactNode;
    title: ReactNode;
    lede?: ReactNode;
    /** In horizontal mode, give the title more of the row so a long one takes fewer lines. */
    wide?: boolean;
    className?: string;
}) {
    return (
        <div className={`grid gap-5 lg:grid-cols-12 lg:items-end lg:gap-12 ${className}`}>
            <div className={wide ? 'lg:col-span-7 hscroll:col-span-8' : 'lg:col-span-7'}>
                <Eyebrow>{eyebrow}</Eyebrow>
                <h2 className="mt-4 font-wide text-h1 font-semibold text-balance">{title}</h2>
            </div>
            {lede && <p className={`text-lede text-pretty text-fg-muted ${wide ? 'lg:col-span-5 hscroll:col-span-4' : 'lg:col-span-5'}`}>{lede}</p>}
        </div>
    );
}

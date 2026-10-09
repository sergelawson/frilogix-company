import type { ReactNode } from 'react';
import Eyebrow from './Eyebrow';

/**
 * Eyebrow + heading, with the lede beside it on wide screens, and optionally
 * an illustration (`aside`). Every page title is an h2: the hero's headline is
 * the document's only h1.
 *
 * - Without a lede, `aside` takes the lede's place beside the title.
 * - With one, `aside` sits above the lede. In horizontal mode the header then
 *   grows into the panel's spare height and the illustration takes what is
 *   left above the lede (`.art-slot`), hiding itself when that's too little,
 *   so it can never push the panel's copy out of view. Give it `hscroll:h-full`.
 */
export default function SectionHeader({
    eyebrow,
    title,
    lede,
    aside,
    wide = false,
    className = '',
}: {
    eyebrow: ReactNode;
    title: ReactNode;
    lede?: ReactNode;
    aside?: ReactNode;
    /** In horizontal mode, give the title more of the row so a long one takes fewer lines. */
    wide?: boolean;
    className?: string;
}) {
    const main = wide ? 'lg:col-span-7 hscroll:col-span-8' : 'lg:col-span-7';
    const side = wide ? 'lg:col-span-5 hscroll:col-span-4' : 'lg:col-span-5';
    const ledeClass = 'text-lede text-pretty text-fg-muted';
    const heading = (
        <div className={main}>
            <Eyebrow>{eyebrow}</Eyebrow>
            <h2 className="mt-4 font-wide text-h1 font-semibold text-balance">{title}</h2>
        </div>
    );

    if (aside && !lede) {
        return (
            <div className={`grid gap-5 lg:grid-cols-12 lg:items-center lg:gap-12 ${className}`}>
                {heading}
                <div className={side}>{aside}</div>
            </div>
        );
    }

    if (aside) {
        return (
            <div
                className={`grid gap-5 lg:grid-cols-12 lg:items-end lg:gap-12 hscroll:min-h-0 hscroll:max-h-[30rem] hscroll:flex-1 ${className}`}
            >
                {heading}
                {/* Stacked, the lede follows the title and the illustration comes last. */}
                <div className={`flex flex-col gap-6 self-stretch ${side}`}>
                    <div className="art-slot order-2 lg:order-1 hscroll:min-h-0 hscroll:flex-1">{aside}</div>
                    <p className={`order-1 lg:order-2 ${ledeClass}`}>{lede}</p>
                </div>
            </div>
        );
    }

    return (
        <div className={`grid gap-5 lg:grid-cols-12 lg:items-end lg:gap-12 ${className}`}>
            {heading}
            {lede && <p className={`${ledeClass} ${side}`}>{lede}</p>}
        </div>
    );
}

import type { ReactNode, Ref } from 'react';

/**
 * One page of the one-page site, e.g. `/services`. HorizontalPages scrolls to
 * the first panel of the page whose `path` matches the URL, and rewrites the
 * URL to `path` while the page is in view. `path` must match a child route of
 * routes/site.tsx.
 */
export function Page({ path, label, children }: { path: string; label: string; children: ReactNode }) {
    return (
        <section data-page={path} aria-label={label} className="hscroll:flex hscroll:h-full">
            {children}
        </section>
    );
}

/**
 * One screen of a page. In horizontal mode every panel is exactly one viewport
 * wide (snapping relies on that) and its content must fit the viewport height,
 * since overflow is clipped. `id` is also a URL hash target, e.g.
 * `/services#intelligent-systems`. Don't put a matching DOM `id` inside the
 * track: native fragment scrolling would fight the horizontal transform.
 */
export function Panel({
    id,
    className = '',
    ref,
    children,
}: {
    id: string;
    className?: string;
    ref?: Ref<HTMLDivElement>;
    children: ReactNode;
}) {
    return (
        <div
            ref={ref}
            data-panel={id}
            className={`relative scroll-mt-20 hscroll:h-full hscroll:w-[100cqw] hscroll:shrink-0 hscroll:overflow-clip ${className}`}
        >
            {children}
        </div>
    );
}

/**
 * Standard content column inside a panel: a padded section when stacked. In
 * horizontal mode every panel's content starts on the same line, 8vh below
 * the navbar's clearance (the hero matches it in HomeSection), so headings don't jump as the pages turn. That space is
 * the first to give way on a panel too full to afford it (the ::before spacer
 * shrinks 100× faster than PanelGap), and spare room collects at the bottom.
 */
export const panelInner =
    'relative z-10 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-24 lg:py-32 hscroll:flex hscroll:h-full hscroll:flex-col hscroll:justify-start hscroll:pt-24 hscroll:pb-10 hscroll:before:block hscroll:before:flex-[0_100_8vh] hscroll:before:content-[""]';

/**
 * The space between a panel's header and its body, the same on every panel:
 * 48px stacked; 56px in horizontal mode, shrinking to 24px only once the
 * panel's top offset (panelInner's ::before) has given up all its room.
 */
export function PanelGap() {
    return <div aria-hidden="true" className="h-12 hscroll:h-auto hscroll:min-h-6 hscroll:flex-[0_1_3.5rem]" />;
}

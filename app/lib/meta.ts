import type { MetaDescriptor } from 'react-router';

type Match = { id: string; data?: unknown } | undefined;

/**
 * The full meta set for one page. React Router renders only the deepest
 * route's `meta` — nothing is merged from root — so every route returns its
 * complete set from here. The root loader supplies the origin, because Open
 * Graph and Twitter require absolute URLs.
 */
export function pageMeta({
    title,
    description,
    path,
    matches,
    noindex = false,
}: {
    title: string;
    description: string;
    path: string;
    matches: ReadonlyArray<Match>;
    noindex?: boolean;
}): MetaDescriptor[] {
    const origin = (matches.find((match) => match?.id === 'root')?.data as { origin?: string } | undefined)?.origin ?? '';
    const image = `${origin}/og.png`;
    return [
        { title },
        { name: 'description', content: description },
        { property: 'og:type', content: 'website' },
        { property: 'og:site_name', content: 'Frilogix' },
        { property: 'og:title', content: title },
        { property: 'og:description', content: description },
        { property: 'og:url', content: origin + path },
        { property: 'og:image', content: image },
        { property: 'og:image:width', content: '1200' },
        { property: 'og:image:height', content: '630' },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: title },
        { name: 'twitter:description', content: description },
        { name: 'twitter:image', content: image },
        ...(noindex ? [{ name: 'robots', content: 'noindex, follow' }] : []),
    ];
}

import type { MetaDescriptor } from 'react-router';
import { site } from '~/content/site';
import { structuredData } from './structured-data';

/**
 * The full meta set for one page. React Router renders only the deepest
 * route's `meta` — nothing is merged from root — so every route returns its
 * complete set from here, including the structured data (~/lib/structured-data).
 * Absolute URLs use the production origin (`site.url`): pages are prerendered,
 * so there's no request to read it from.
 */
export function pageMeta({
    title,
    description,
    path,
    noindex = false,
}: {
    title: string;
    description: string;
    path: string;
    noindex?: boolean;
}): MetaDescriptor[] {
    const origin = site.url;
    const image = `${origin}/og.png`;
    return [
        { title },
        { name: 'description', content: description },
        { tagName: 'link', rel: 'canonical', href: origin + path },
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
        // Who Frilogix is and that it works worldwide, for search engines.
        { 'script:ld+json': structuredData },
    ];
}

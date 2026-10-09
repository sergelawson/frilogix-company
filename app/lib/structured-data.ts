import { services } from '~/content/services';
import { site } from '~/content/site';

/**
 * What search engines read about Frilogix on every page: JSON-LD (schema.org),
 * added to each page's meta by pageMeta(). It names the company and its
 * services, says where it is (El Paso) and that it works with clients
 * anywhere (`areaServed: Worldwide`).
 *
 * Facts only, from the content files: no ratings, reviews or client claims,
 * and no email (it never ships as text; see ~/components/ui/EmailAddress).
 * Social profiles join `sameAs` once they're added to `site.social`.
 * Check changes with Google's Rich Results Test or validator.schema.org.
 */
const organizationId = `${site.url}/#organization`;

export const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
        {
            '@type': 'Organization',
            '@id': organizationId,
            name: site.name,
            legalName: site.legalName,
            url: `${site.url}/`,
            logo: `${site.url}/icon-512.png`,
            description: site.description,
            address: {
                '@type': 'PostalAddress',
                addressLocality: site.address.locality,
                addressRegion: site.address.region,
                addressCountry: site.address.country,
            },
            areaServed: 'Worldwide',
            knowsAbout: [
                'Software development',
                'SaaS development',
                'Mobile app development',
                'Platform engineering',
                'AI engineering',
                'AI agents',
                'Retrieval-augmented generation',
                'AI training data',
                'Data labeling',
            ],
            makesOffer: services.map((service) => ({
                '@type': 'Offer',
                itemOffered: {
                    '@type': 'Service',
                    name: service.title,
                    description: service.desc,
                    areaServed: 'Worldwide',
                    provider: { '@id': organizationId },
                },
            })),
            ...(site.social.length > 0 ? { sameAs: site.social.map((profile) => profile.href) } : {}),
        },
        {
            '@type': 'WebSite',
            '@id': `${site.url}/#website`,
            url: `${site.url}/`,
            name: site.name,
            inLanguage: 'en',
            publisher: { '@id': organizationId },
        },
    ],
};

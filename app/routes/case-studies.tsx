import type { Route } from './+types/case-studies';

export const meta: Route.MetaFunction = () => [
    { title: 'Case Studies | Frilogix' },
    {
        name: 'description',
        content:
            'Deep dives into the technical architecture behind Frilogix projects with startups and enterprises. Coming soon.',
    },
    // Thin placeholder page — keep it out of the index until it has real content.
    { name: 'robots', content: 'noindex, follow' },
];

// Content lives in ~/sections/CaseStudiesSection, rendered by the one-page
// layout (routes/site.tsx). This route only supplies the URL and its meta.
export default function CaseStudies() {
    return null;
}

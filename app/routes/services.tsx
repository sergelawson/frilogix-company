import type { Route } from './+types/services';

export const meta: Route.MetaFunction = () => [
    { title: 'Services — Web, Mobile & AI Engineering | Frilogix' },
    {
        name: 'description',
        content:
            'React frontends, Go and Node.js backends, React Native apps, and AI engineering — RAG pipelines, multi-agent systems, and copilots. Precision engineering for the modern web.',
    },
];

// Content lives in ~/sections/ServicesSection, rendered by the one-page layout
// (routes/site.tsx). This route only supplies the URL and its meta.
export default function Services() {
    return null;
}

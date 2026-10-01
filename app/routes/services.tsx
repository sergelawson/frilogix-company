import type { Route } from './+types/services';
import { pageMeta } from '~/lib/meta';

export const meta: Route.MetaFunction = ({ matches }) =>
    pageMeta({
        title: 'Services — Web, Mobile & AI Engineering | Frilogix',
        description:
            'React frontends, Go and Node.js backends, React Native apps, and AI engineering — RAG pipelines, multi-agent systems, and copilots. Precision engineering for the modern web.',
        path: '/services',
        matches,
    });

// Content lives in ~/sections/ServicesSection, rendered by the one-page layout
// (routes/site.tsx). This route only supplies the URL and its meta.
export default function Services() {
    return null;
}

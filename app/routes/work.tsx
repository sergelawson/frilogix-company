import type { Route } from './+types/work';
import { pageMeta } from '~/lib/meta';
import { products } from '~/content/work';

export const meta: Route.MetaFunction = () =>
    pageMeta({
        title: 'Work — Uitiful & Vantuu | Frilogix',
        description:
            'What Frilogix is building: Uitiful, an agentic design tool that ships to web, iOS and Android, and Vantuu, an AI-native ecommerce shop builder.',
        path: '/work',
        // A page with nothing on it stays out of the index.
        noindex: products.length === 0,
    });

// Content lives in ~/sections/WorkSection, rendered by the one-page layout
// (routes/site.tsx). This route only supplies the URL and its meta.
export default function Work() {
    return null;
}

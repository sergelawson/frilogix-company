import type { Route } from './+types/services';
import { pageMeta } from '~/lib/meta';

export const meta: Route.MetaFunction = () =>
    pageMeta({
        title: 'Services — SaaS, Mobile, AI Engineering & Training Data | Frilogix',
        description:
            'SaaS development and React Native mobile apps, platform engineering on AWS and Kubernetes, AI engineering, and AI training data: labeling and dataset creation for AI labs.',
        path: '/services',
    });

// Content lives in ~/sections/ServicesSection, rendered by the one-page layout
// (routes/site.tsx). This route only supplies the URL and its meta.
export default function Services() {
    return null;
}

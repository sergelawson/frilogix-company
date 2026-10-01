import type { Route } from './+types/work';
import { pageMeta } from '~/lib/meta';
import { caseStudies } from '~/content/work';

export const meta: Route.MetaFunction = ({ matches }) =>
    pageMeta({
        title: 'Work — Case Studies | Frilogix',
        description:
            'Case studies from Frilogix: the problem, the approach and the outcome of web, mobile and AI engineering projects with startups and enterprises.',
        path: '/work',
        matches,
        // A thin "being written up" page stays out of the index until real case studies exist.
        noindex: caseStudies.length === 0,
    });

// Content lives in ~/sections/WorkSection, rendered by the one-page layout
// (routes/site.tsx). This route only supplies the URL and its meta.
export default function Work() {
    return null;
}

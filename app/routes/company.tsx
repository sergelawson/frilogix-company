import type { Route } from './+types/company';
import { pageMeta } from '~/lib/meta';

export const meta: Route.MetaFunction = () =>
    pageMeta({
        title: 'Company — Frilogix LLC, El Paso, Texas',
        description:
            'Frilogix LLC is a software and AI engineering company in El Paso, Texas. We build our own products first, then bring what works to our clients.',
        path: '/company',
    });

// Content lives in ~/sections/CompanySection, rendered by the one-page layout
// (routes/site.tsx). This route only supplies the URL and its meta.
export default function Company() {
    return null;
}

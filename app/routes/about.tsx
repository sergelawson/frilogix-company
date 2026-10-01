import type { Route } from './+types/about';

export const meta: Route.MetaFunction = () => [
    { title: 'About Frilogix — Software & AI Engineering Team' },
    {
        name: 'description',
        content:
            'Frilogix bridges high-level business strategy and deep technical execution. A remote-first team of engineers, designers, and AI researchers building production software.',
    },
];

// Content lives in ~/sections/AboutSection, rendered by the one-page layout
// (routes/site.tsx). This route only supplies the URL and its meta.
export default function About() {
    return null;
}

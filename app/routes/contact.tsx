import type { Route } from './+types/contact';

export const meta: Route.MetaFunction = () => [
    { title: 'Contact Frilogix — Start Your Project' },
    {
        name: 'description',
        content:
            'Tell us about your project. Frilogix takes software and AI engineering work from MVP to enterprise scale. Get a response within 24 hours.',
    },
];

// Content lives in ~/sections/ContactSection, rendered by the one-page layout
// (routes/site.tsx). This route only supplies the URL and its meta — and is
// where the form's `action` export belongs once submission is real.
export default function Contact() {
    return null;
}

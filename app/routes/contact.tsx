import { data } from 'react-router';
import type { Route } from './+types/contact';
import { pageMeta } from '~/lib/meta';
import { readInquiry, validateInquiry } from '~/lib/inquiry';
import { sendInquiry } from '~/lib/inquiry.server';

export const meta: Route.MetaFunction = ({ matches }) =>
    pageMeta({
        title: 'Contact Frilogix — Start Your Project',
        description:
            'Tell us about your project. Frilogix takes software and AI engineering work from MVP to enterprise scale. Get a response within 24 hours.',
        path: '/contact',
        matches,
    });

/** The contact form (~/components/ContactForm) posts here through a fetcher. */
export async function action({ request }: Route.ActionArgs) {
    const form = await request.formData();

    // Honeypot: people never see this field; bots fill it. Accept and drop.
    if (String(form.get('website') ?? '')) return { ok: true as const, delivered: 'sent' as const };

    const inquiry = readInquiry(form);
    const errors = validateInquiry(inquiry);
    if (Object.keys(errors).length > 0) return data({ ok: false as const, errors }, { status: 400 });

    const result = await sendInquiry(inquiry);
    if (!result.ok) {
        console.error('[contact] Could not send inquiry:', result.reason);
        return data({ ok: false as const, formError: true }, { status: 502 });
    }
    return { ok: true as const, delivered: result.delivered };
}

// Content lives in ~/sections/ContactSection, rendered by the one-page layout
// (routes/site.tsx). This route supplies the URL, its meta, and the action.
export default function Contact() {
    return null;
}

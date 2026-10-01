import type { Inquiry } from './inquiry';

type SendResult = { ok: true; delivered: 'sent' | 'logged' } | { ok: false; reason: string };

/**
 * Emails an inquiry through Resend's REST API. Needs RESEND_API_KEY,
 * CONTACT_TO_EMAIL and CONTACT_FROM_EMAIL (a sender on a domain verified in
 * Resend). Without them, dev logs the inquiry to the server console and
 * production reports a failure — it never pretends a message was sent.
 */
export async function sendInquiry(inquiry: Inquiry): Promise<SendResult> {
    const apiKey = process.env.RESEND_API_KEY;
    const to = process.env.CONTACT_TO_EMAIL;
    const from = process.env.CONTACT_FROM_EMAIL;

    if (!apiKey || !to || !from) {
        if (import.meta.env.DEV) {
            console.info('[contact] Email is not configured; inquiry received:', inquiry);
            return { ok: true, delivered: 'logged' };
        }
        return { ok: false, reason: 'email not configured (RESEND_API_KEY, CONTACT_TO_EMAIL, CONTACT_FROM_EMAIL)' };
    }

    const text = [
        'New inquiry from the Frilogix website',
        '',
        `Name: ${inquiry.name}`,
        `Email: ${inquiry.email}`,
        `Company: ${inquiry.company || '—'}`,
        '',
        inquiry.details,
    ].join('\n');

    try {
        const response = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({
                from,
                to: [to],
                reply_to: inquiry.email,
                subject: `New inquiry from ${inquiry.name}`,
                text,
            }),
        });
        return response.ok ? { ok: true, delivered: 'sent' } : { ok: false, reason: `Resend responded ${response.status}` };
    } catch (error) {
        return { ok: false, reason: error instanceof Error ? error.message : String(error) };
    }
}

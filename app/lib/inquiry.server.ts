import nodemailer from 'nodemailer';
import type { Inquiry } from './inquiry';

type SendResult = { ok: true; delivered: 'sent' | 'logged' } | { ok: false; reason: string };

/**
 * Emails an inquiry over SMTP (Nodemailer). Needs SMTP_HOST, SMTP_PORT
 * (465 = implicit TLS, otherwise STARTTLS, usually 587), SMTP_USER, SMTP_PASS,
 * CONTACT_TO_EMAIL and CONTACT_FROM_EMAIL (an address the SMTP account may
 * send as, on a domain with SPF/DKIM). Without them, dev logs the inquiry to
 * the server console and production reports a failure — it never pretends a
 * message was sent.
 */
export async function sendInquiry(inquiry: Inquiry): Promise<SendResult> {
    const host = process.env.SMTP_HOST;
    const port = Number(process.env.SMTP_PORT || 587);
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;
    const to = process.env.CONTACT_TO_EMAIL;
    const from = process.env.CONTACT_FROM_EMAIL;

    if (!host || !user || !pass || !to || !from) {
        if (import.meta.env.DEV) {
            console.info('[contact] Email is not configured; inquiry received:', inquiry);
            return { ok: true, delivered: 'logged' };
        }
        return { ok: false, reason: 'email not configured (SMTP_HOST, SMTP_USER, SMTP_PASS, CONTACT_TO_EMAIL, CONTACT_FROM_EMAIL)' };
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

    // One connection per submission: serverless functions don't keep a pool alive.
    const transport = nodemailer.createTransport({
        host,
        port,
        secure: port === 465,
        requireTLS: port !== 465,
        auth: { user, pass },
        connectionTimeout: 10_000,
        greetingTimeout: 10_000,
        socketTimeout: 15_000,
    });

    try {
        await transport.sendMail({
            from,
            to,
            replyTo: { name: inquiry.name, address: inquiry.email },
            subject: `New inquiry from ${inquiry.name}`,
            text,
        });
        return { ok: true, delivered: 'sent' };
    } catch (error) {
        return { ok: false, reason: error instanceof Error ? error.message : String(error) };
    } finally {
        transport.close();
    }
}

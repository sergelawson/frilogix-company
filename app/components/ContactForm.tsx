import { useState, type FocusEvent, type FormEvent } from 'react';
import { useFetcher } from 'react-router';
import { buttonClass } from '~/components/ui/Button';
import { site } from '~/content/site';
import { validateField, validateInquiry, readInquiry, type InquiryErrors, type InquiryField } from '~/lib/inquiry';
import type { action } from '~/routes/contact';

const inputClass =
    'w-full rounded-lg border border-line-strong bg-surface px-4 py-3 text-base text-fg placeholder:text-fg-muted/70 transition-[border-color,box-shadow] duration-200 focus:border-accent focus:outline-none focus:ring-4 focus:ring-accent/15 aria-[invalid=true]:border-danger hscroll:py-2.5';
const labelClass = 'mb-2 block text-sm font-medium';

/**
 * Posts to the /contact route action through a fetcher, so submitting doesn't
 * navigate away from the one-page site. Validation runs on blur and on submit
 * here, and again on the server.
 */
export default function ContactForm() {
    const fetcher = useFetcher<typeof action>();
    const [errors, setErrors] = useState<InquiryErrors>({});
    const [dismissed, setDismissed] = useState<unknown>(null);

    const result = fetcher.data;
    const sending = fetcher.state !== 'idle';
    const sent = result?.ok && result !== dismissed;
    const serverErrors: InquiryErrors = result && !result.ok && 'errors' in result ? result.errors : {};
    const formError = result && !result.ok && 'formError' in result;

    const handleBlur = (e: FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const field = e.target.name as InquiryField;
        const error = validateField(field, e.target.value.trim());
        setErrors((current) => ({ ...current, [field]: error }));
    };

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        const found = validateInquiry(readInquiry(new FormData(e.currentTarget)));
        setErrors(found);
        const first = Object.keys(found)[0];
        if (first) {
            e.preventDefault();
            e.currentTarget.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
        }
    };

    if (sent) {
        return (
            <div role="status" className="flex min-h-[22rem] flex-col items-start justify-center rounded-2xl border border-line bg-surface p-8 shadow-card">
                <span className="flex size-12 items-center justify-center rounded-full bg-accent/10 text-accent-ink">
                    <svg className="size-6" aria-hidden="true" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="m5 13 4 4L19 7" />
                    </svg>
                </span>
                <h3 className="mt-6 font-wide text-h2 font-semibold">Thanks — message received.</h3>
                <p className="mt-3 text-fg-muted">We&apos;ll reply within 24 hours.</p>
                {result.delivered === 'logged' && (
                    <p className="mt-3 font-mono text-xs text-fg-muted">
                        Dev: email isn&apos;t configured, so the inquiry was logged to the server console.
                    </p>
                )}
                <button type="button" onClick={() => setDismissed(result)} className={`${buttonClass('secondary')} mt-8`}>
                    Send another
                </button>
            </div>
        );
    }

    const field = (name: InquiryField) => {
        const error = errors[name] ?? serverErrors[name];
        return {
            id: name,
            name,
            onBlur: handleBlur,
            'aria-invalid': error ? true : undefined,
            'aria-describedby': error ? `${name}-error` : undefined,
            className: inputClass,
        };
    };
    const errorText = (name: InquiryField) => {
        const error = errors[name] ?? serverErrors[name];
        return error ? (
            <p id={`${name}-error`} className="mt-2 text-sm text-danger">
                {error}
            </p>
        ) : null;
    };

    return (
        <fetcher.Form
            method="post"
            action="/contact"
            noValidate
            onSubmit={handleSubmit}
            className="rounded-2xl border border-line bg-surface p-6 shadow-card sm:p-8"
        >
            <div className="grid gap-5 sm:grid-cols-2 hscroll:gap-4">
                <div>
                    <label htmlFor="name" className={labelClass}>Name</label>
                    <input {...field('name')} type="text" autoComplete="name" required />
                    {errorText('name')}
                </div>
                <div>
                    <label htmlFor="email" className={labelClass}>Email</label>
                    <input {...field('email')} type="email" autoComplete="email" required />
                    {errorText('email')}
                </div>
                <div className="sm:col-span-2">
                    <label htmlFor="company" className={labelClass}>
                        Company <span className="font-normal text-fg-muted">(optional)</span>
                    </label>
                    <input {...field('company')} type="text" autoComplete="organization" />
                    {errorText('company')}
                </div>
                <div className="sm:col-span-2">
                    <label htmlFor="details" className={labelClass}>What are you building?</label>
                    <textarea
                        {...field('details')}
                        rows={4}
                        required
                        placeholder="The product, where it is today, and what you need help with."
                        className={`${inputClass} resize-none hscroll:h-[18vh]`}
                    />
                    {errorText('details')}
                </div>
            </div>

            {/* Honeypot for bots: hidden from people and from assistive tech. */}
            <div aria-hidden="true" className="hidden">
                <label>
                    Leave this empty
                    <input type="text" name="website" tabIndex={-1} autoComplete="off" />
                </label>
            </div>

            {formError && (
                <p role="alert" className="mt-5 rounded-lg border border-danger/30 bg-danger/5 px-4 py-3 text-sm text-danger">
                    We couldn&apos;t send your message. Please email{' '}
                    <a href={`mailto:${site.email}`} className="font-medium underline">
                        {site.email}
                    </a>{' '}
                    instead.
                </p>
            )}

            <div className="mt-6 flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
                <button type="submit" disabled={sending} className={buttonClass('primary', 'lg')}>
                    {sending ? 'Sending…' : 'Send inquiry'}
                </button>
                <p className="text-sm text-fg-muted">We reply within 24 hours.</p>
            </div>
        </fetcher.Form>
    );
}

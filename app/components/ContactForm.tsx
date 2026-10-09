import { useEffect, useRef, useState, type FocusEvent, type FormEvent } from 'react';
import { Link, useFetcher } from 'react-router';
import TurnstileWidget from '~/components/TurnstileWidget';
import { buttonClass } from '~/components/ui/Button';
import EmailAddress from '~/components/ui/EmailAddress';
import XGlyph from '~/components/ui/XGlyph';
import { site } from '~/content/site';
import { validateField, validateInquiry, readInquiry, type InquiryErrors, type InquiryField } from '~/lib/inquiry';
import type { action } from '~/routes/contact';

const inputClass =
    'w-full border border-line-strong bg-surface px-4 py-3 text-base text-fg placeholder:text-fg-muted/70 transition-[border-color,box-shadow] duration-200 focus:border-accent focus:outline-none focus:ring-4 focus:ring-accent/15 aria-[invalid=true]:border-danger hscroll:py-2.5';
const labelClass = 'mb-2 block text-sm font-medium';

/**
 * Posts to the /contact route action through a fetcher, so submitting doesn't
 * navigate away from the one-page site. Validation runs on blur and on submit
 * here, and again on the server. Cloudflare Turnstile guards the submit: the
 * token it issues is checked by the /contact action and is single-use, so the
 * widget resets after every completed request.
 */
export default function ContactForm() {
    const fetcher = useFetcher<typeof action>();
    const [errors, setErrors] = useState<InquiryErrors>({});
    const [dismissed, setDismissed] = useState<unknown>(null);
    const formRef = useRef<HTMLFormElement>(null);
    const [token, setToken] = useState<string | null>(null);
    const [waiting, setWaiting] = useState(false); // submitted before Turnstile issued a token
    const [checkFailed, setCheckFailed] = useState(false);
    const [resetKey, setResetKey] = useState(0);

    const result = fetcher.data;
    const sending = fetcher.state !== 'idle';
    const sent = result?.ok && result !== dismissed;
    const serverErrors: InquiryErrors = result && !result.ok && 'errors' in result ? result.errors : {};
    const formError = result && !result.ok && 'formError' in result;
    const verifyError = result && !result.ok && 'verifyError' in result;

    // Each completed request spent the token: get a fresh one for the next try.
    const wasSending = useRef(false);
    useEffect(() => {
        if (wasSending.current && !sending) setResetKey((key) => key + 1);
        wasSending.current = sending;
    }, [sending]);

    const handleToken = (next: string | null) => {
        setToken(next);
        if (next) setCheckFailed(false);
        if (next && waiting && formRef.current) {
            setWaiting(false);
            fetcher.submit(formRef.current);
        }
    };
    const handleCheckError = () => {
        setWaiting(false);
        setCheckFailed(true);
    };

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
            return;
        }
        // No token yet (the check is still running, or waiting on a challenge):
        // hold the submission and send it as soon as the token arrives.
        if (!token) {
            e.preventDefault();
            if (!checkFailed) setWaiting(true);
        }
    };

    if (sent) {
        return (
            <div role="status" className="flex min-h-[22rem] flex-col items-start justify-center border-t border-line-strong pt-8">
                {/* The mark comes together: the message is in. */}
                <XGlyph assemble className="size-10" />
                <h3 className="mt-6 font-wide text-h2 font-semibold">Thanks — message received.</h3>
                <p className="mt-3 text-fg-muted">We&apos;ll reply within 24 hours.</p>
                {result.delivered === 'logged' && (
                    <p className="mt-3 font-mono text-xs text-fg-muted">
                        Dev: email isn&apos;t configured, so the inquiry was logged to the server console.
                    </p>
                )}
                <button
                    type="button"
                    onClick={() => {
                        setDismissed(result);
                        setToken(null);
                    }}
                    className={`${buttonClass('secondary')} mt-8`}
                >
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
            ref={formRef}
            method="post"
            action="/contact"
            noValidate
            onSubmit={handleSubmit}
            className="border-t border-line-strong pt-8"
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

            <TurnstileWidget
                sitekey={site.turnstileSitekey}
                action="contact"
                resetKey={resetKey}
                onToken={handleToken}
                onError={handleCheckError}
            />

            {(verifyError || checkFailed) && (
                <p role="alert" className="mt-5 border-l-2 border-danger py-1 pl-4 text-sm text-danger">
                    {checkFailed
                        ? "Our spam check couldn't run. Please reload the page and try again."
                        : "We couldn't verify you're human. Please try again."}
                </p>
            )}

            {formError && (
                <p role="alert" className="mt-5 border-l-2 border-danger py-1 pl-4 text-sm text-danger">
                    We couldn&apos;t send your message. Please email <EmailAddress /> instead.
                </p>
            )}

            <div className="mt-6 flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
                <button type="submit" disabled={sending || waiting} className={buttonClass('primary', 'lg')}>
                    {waiting ? 'Checking…' : sending ? 'Sending…' : 'Send inquiry'}
                </button>
                <p className="text-sm text-fg-muted">We reply within 24 hours.</p>
            </div>
            <p className="mt-4 text-xs text-fg-muted">
                We use these details only to reply to you; the form is protected by Cloudflare Turnstile. See our{' '}
                <Link to="/privacy" className="text-accent-ink underline underline-offset-2 hover:text-fg">
                    privacy policy
                </Link>
                .
            </p>
        </fetcher.Form>
    );
}

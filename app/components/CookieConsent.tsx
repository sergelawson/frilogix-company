import { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { Link } from 'react-router';
import { buttonClass } from '~/components/ui/Button';
import { onConsentChange, onConsentOpen, readConsent, writeConsent, type ConsentValue } from '~/lib/consent';

/** Re-reads the stored choice when it changes here or in another tab. */
function subscribe(callback: () => void) {
    const offChange = onConsentChange(callback);
    window.addEventListener('storage', callback);
    return () => {
        offChange();
        window.removeEventListener('storage', callback);
    };
}

/**
 * Cookie bar for optional (analytics) cookies, built to EU rules:
 * - shown before anything optional runs; nothing is pre-selected;
 * - "Reject" is as prominent and as easy as "Accept" (same style, one click);
 * - plain-language purpose, with a link to the privacy policy;
 * - reopened any time from the footer ("Cookie settings") to change the choice.
 * Client-only: the pages are prerendered, and the choice lives in the browser.
 */
export default function CookieConsent() {
    // `undefined` while prerendering: there is no browser storage, so render nothing.
    const current = useSyncExternalStore<ConsentValue | null | undefined>(subscribe, readConsent, () => undefined);
    const [reopened, setReopened] = useState(false);
    const region = useRef<HTMLDivElement>(null);

    useEffect(() => onConsentOpen(() => setReopened(true)), []);

    // When reopened from the footer, move focus into the bar so keyboard users land on it.
    useEffect(() => {
        if (reopened) region.current?.querySelector<HTMLButtonElement>('button')?.focus();
    }, [reopened]);

    // Shown until the visitor has a current choice, or when they ask to change it.
    const open = current === null || reopened;
    if (!open) return null;

    const choose = (value: ConsentValue) => {
        writeConsent(value);
        setReopened(false);
    };

    return (
        <div
            ref={region}
            role="region"
            aria-label="Cookie consent"
            className="theme-ink fixed inset-x-0 bottom-0 z-[60] border-t border-line-strong bg-bg text-fg"
        >
            <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:gap-10 lg:px-8">
                <p className="max-w-3xl text-sm leading-relaxed text-fg-muted">
                    <span className="font-medium text-fg">Analytics cookies, only with your OK.</span> With your consent we use
                    Google Analytics to see which pages are read; nothing is set before you choose, and you can change your mind
                    any time under &ldquo;Cookie settings&rdquo; in the footer.{' '}
                    <Link to="/privacy" className="text-accent-ink underline underline-offset-2 hover:text-fg">
                        Privacy policy
                    </Link>
                    {current && (
                        <span className="mt-1 block font-mono text-[0.6875rem] uppercase tracking-[0.14em]">
                            Current choice: {current === 'granted' ? 'accepted' : 'rejected'}
                        </span>
                    )}
                </p>
                <div className="flex shrink-0 gap-3">
                    <button type="button" onClick={() => choose('denied')} className={buttonClass('secondary')}>
                        Reject
                    </button>
                    <button type="button" onClick={() => choose('granted')} className={buttonClass('secondary')}>
                        Accept
                    </button>
                </div>
            </div>
        </div>
    );
}

import { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { Link } from 'react-router';
import { analyticsNeedsOptIn, onConsentChange, onConsentOpen, readConsent, writeConsent, type ConsentValue } from '~/lib/consent';

/** Re-reads the stored choice when it changes here or in another tab. */
function subscribe(callback: () => void) {
    const offChange = onConsentChange(callback);
    window.addEventListener('storage', callback);
    return () => {
        offChange();
        window.removeEventListener('storage', callback);
    };
}

const textLink = 'underline underline-offset-2 transition-colors hover:text-fg';
const smallButton = 'shrink-0 border border-line-strong px-2.5 py-1 text-fg transition-colors hover:bg-surface';

/**
 * Cookie notice for optional (analytics) cookies: one small, quiet note centred
 * at the bottom, in two versions (see ~/lib/consent):
 * - In Europe, a consent request built to EU rules: shown before anything
 *   optional runs, nothing pre-selected, "Reject" and "Accept" as two identical
 *   buttons (same style, one click each).
 * - Elsewhere, analytics is already on: an "Opt out" link turns it off, and
 *   "OK" dismisses the note.
 * Both state the purpose in plain words and link to the privacy policy, which
 * names the provider; the note doesn't. Reopened any time from the footer
 * ("Cookie settings") to change the choice. Client-only: the pages are
 * prerendered, and the choice lives in the browser.
 */
export default function CookieConsent() {
    // `undefined` while prerendering: there is no browser storage, so render nothing.
    const current = useSyncExternalStore<ConsentValue | null | undefined>(subscribe, readConsent, () => undefined);
    const [reopened, setReopened] = useState(false);
    const region = useRef<HTMLDivElement>(null);

    useEffect(() => onConsentOpen(() => setReopened(true)), []);

    // When reopened from the footer, move focus into the note so keyboard users land on it.
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

    const optIn = analyticsNeedsOptIn();
    const off = current === 'denied';
    const message = off
        ? 'Analytics cookies are off.'
        : optIn
          ? current === 'granted'
              ? 'Analytics cookies are on.'
              : 'May we use analytics cookies to improve the site?'
          : 'We use analytics cookies to improve the site.';

    return (
        <div
            ref={region}
            role="region"
            aria-label={optIn ? 'Cookie consent' : 'Cookie notice'}
            className="fixed inset-x-4 bottom-4 z-[60] flex items-center gap-4 border border-line-strong bg-bg py-2 pl-3.5 pr-2 text-xs text-fg-muted sm:inset-x-auto sm:left-1/2 sm:-translate-x-1/2"
        >
            <p className="leading-relaxed sm:whitespace-nowrap">
                {message}{' '}
                {!optIn && (
                    <>
                        <button type="button" onClick={() => choose(off ? 'granted' : 'denied')} className={textLink}>
                            {off ? 'Turn on' : 'Opt out'}
                        </button>
                        <span aria-hidden="true"> · </span>
                    </>
                )}
                <Link to="/privacy" className={textLink}>
                    Privacy
                </Link>
            </p>
            {optIn ? (
                // Europe: nothing runs until one of these, and Reject is exactly as prominent as Accept.
                <div className="grid shrink-0 grid-cols-2 gap-2">
                    <button type="button" onClick={() => choose('denied')} className={smallButton}>
                        Reject
                    </button>
                    <button type="button" onClick={() => choose('granted')} className={smallButton}>
                        Accept
                    </button>
                </div>
            ) : (
                <button type="button" onClick={() => choose(current ?? 'granted')} className={smallButton}>
                    OK
                </button>
            )}
        </div>
    );
}

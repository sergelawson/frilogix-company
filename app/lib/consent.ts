/**
 * The visitor's cookie choice for optional (analytics) cookies. Browser-only.
 *
 * EU rules (GDPR + ePrivacy Art. 5(3)): nothing optional runs before an
 * explicit "accept"; rejecting is as easy as accepting; the choice can be
 * changed at any time (footer → "Cookie settings"); and we ask again once it
 * is stale. The choice itself is kept in localStorage, which is strictly
 * necessary to honour it and so needs no consent.
 */

export type ConsentValue = 'granted' | 'denied';

const STORAGE_KEY = 'frilogix-consent';
/** Bump when the policy changes in a way that needs a fresh choice. */
const POLICY_VERSION = 1;
/** Ask again after six months (in line with CNIL guidance for refusals; applied to both answers). */
const MAX_AGE_MS = 1000 * 60 * 60 * 24 * 182;

const CHANGE_EVENT = 'frilogix:consent-change';
const OPEN_EVENT = 'frilogix:consent-open';

type Stored = { value: ConsentValue; at: string; version: number };

/** This page view's choice, for when browser storage is blocked and can't keep it. */
let memory: ConsentValue | null = null;

/** The current, unexpired choice, or null when the visitor hasn't chosen (or it's stale). */
export function readConsent(): ConsentValue | null {
    try {
        const raw = window.localStorage.getItem(STORAGE_KEY);
        if (!raw) return null;
        const stored = JSON.parse(raw) as Partial<Stored>;
        if (stored.version !== POLICY_VERSION) return null;
        if (stored.value !== 'granted' && stored.value !== 'denied') return null;
        const at = Date.parse(stored.at ?? '');
        if (!Number.isFinite(at) || Date.now() - at > MAX_AGE_MS) return null;
        return stored.value;
    } catch {
        // Storage blocked (private mode, disabled site data): only a choice made in
        // this page view counts; nothing optional runs until the visitor accepts.
        return memory;
    }
}

export function writeConsent(value: ConsentValue) {
    memory = value;
    try {
        const stored: Stored = { value, at: new Date().toISOString(), version: POLICY_VERSION };
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(stored));
    } catch {
        // Can't persist: the choice still applies for this page view.
    }
    window.dispatchEvent(new CustomEvent<ConsentValue>(CHANGE_EVENT, { detail: value }));
}

export function onConsentChange(listener: (value: ConsentValue) => void) {
    const handler = (event: Event) => listener((event as CustomEvent<ConsentValue>).detail);
    window.addEventListener(CHANGE_EVENT, handler);
    return () => window.removeEventListener(CHANGE_EVENT, handler);
}

/** Reopens the banner (footer → "Cookie settings"). */
export function openConsentSettings() {
    window.dispatchEvent(new Event(OPEN_EVENT));
}

export function onConsentOpen(listener: () => void) {
    window.addEventListener(OPEN_EVENT, listener);
    return () => window.removeEventListener(OPEN_EVENT, listener);
}

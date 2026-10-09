/**
 * The visitor's cookie choice for optional (analytics) cookies. Browser-only.
 *
 * Two regimes, decided by where the visitor is (`analyticsNeedsOptIn`):
 * - EEA, UK and Switzerland, opt-in (GDPR + ePrivacy Art. 5(3), and Google's
 *   EU user consent policy): nothing optional runs before an explicit
 *   "accept"; rejecting is as easy as accepting; we ask again once a "yes" is
 *   stale.
 * - Everywhere else, opt-out: analytics runs by default, a notice says so, and
 *   "Opt out" turns it off.
 * Either way the choice can be changed at any time (footer → "Cookie
 * settings"), and an opt-out is honoured until the visitor changes it, never
 * expired. The choice is kept in localStorage, which is strictly necessary to
 * honour it and so needs no consent.
 */

export type ConsentValue = 'granted' | 'denied';

const STORAGE_KEY = 'frilogix-consent';
/** Bump when the policy changes in a way that needs a fresh "yes" (opt-outs always stand). */
const POLICY_VERSION = 2;
/** A "yes" is asked for again after six months (CNIL guidance). */
const MAX_AGE_MS = 1000 * 60 * 60 * 24 * 182;

/**
 * Time zones in the EEA, the UK or Switzerland outside `Europe/*`: Iceland,
 * Norway's Svalbard, Spain's and Portugal's Atlantic islands, the Faroes, and
 * the EU's outermost regions.
 */
const OPT_IN_ZONES = new Set([
    'Atlantic/Reykjavik',
    'Arctic/Longyearbyen',
    'Atlantic/Canary',
    'Atlantic/Madeira',
    'Atlantic/Azores',
    'Atlantic/Faroe',
    'Indian/Reunion',
    'Indian/Mayotte',
    'America/Guadeloupe',
    'America/Martinique',
    'America/Cayenne',
    'America/St_Barthelemy',
    'America/Marigot',
]);

/**
 * Whether analytics needs an explicit "accept" here: in Europe (any
 * `Europe/*` time zone, which is stricter than the EEA, plus the zones above).
 * Read from the browser's time zone setting, which never leaves the browser;
 * without one, assume Europe.
 */
export function analyticsNeedsOptIn(): boolean {
    try {
        const zone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        return !zone || zone.startsWith('Europe/') || OPT_IN_ZONES.has(zone);
    } catch {
        return true;
    }
}

/** Whether analytics may run: the visitor's choice or, without one, the default where they are. */
export function analyticsAllowed(): boolean {
    const choice = readConsent();
    return choice ? choice === 'granted' : !analyticsNeedsOptIn();
}

const CHANGE_EVENT = 'frilogix:consent-change';
const OPEN_EVENT = 'frilogix:consent-open';

type Stored = { value: ConsentValue; at: string; version: number };

/** This page view's choice, for when browser storage is blocked and can't keep it. */
let memory: ConsentValue | null = null;

/**
 * The visitor's current choice, or null when they haven't made one. An
 * opt-out always stands; a "yes" lapses after six months or a policy change.
 */
export function readConsent(): ConsentValue | null {
    try {
        const raw = window.localStorage.getItem(STORAGE_KEY);
        if (!raw) return null;
        const stored = JSON.parse(raw) as Partial<Stored>;
        if (stored.value === 'denied') return 'denied';
        if (stored.value !== 'granted' || stored.version !== POLICY_VERSION) return null;
        const at = Date.parse(stored.at ?? '');
        if (!Number.isFinite(at) || Date.now() - at > MAX_AGE_MS) return null;
        return 'granted';
    } catch {
        // Storage blocked (private mode, disabled site data): only a choice made in
        // this page view counts, and otherwise the default where the visitor is.
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

import { useEffect } from 'react';
import { site } from '~/content/site';
import { analyticsAllowed, onConsentChange } from '~/lib/consent';

declare global {
    interface Window {
        dataLayer?: unknown[];
        gtag?: (...args: unknown[]) => void;
    }
}

/** Hostnames that report to Google Analytics; local dev and preview deployments never do. */
const TRACKED_HOSTS = ['frilogix.com', 'www.frilogix.com', 'frilogix-company.vercel.app'];

/**
 * Google Analytics 4, loaded only when analytics is allowed (~/lib/consent):
 * in Europe after the visitor accepts, elsewhere unless they opt out. Until
 * then no Google script is requested and no cookie is set. Opting out turns
 * tracking off, tells gtag storage is denied, and deletes the _ga cookies.
 * Ads features stay off either way.
 *
 * Page views: GA's enhanced measurement counts "page changes based on browser
 * history events", which covers the URL updates HorizontalPages makes as pages
 * scroll into view; keep that option on in the GA data stream.
 */
export default function GoogleAnalytics() {
    useEffect(() => {
        const id = site.gaMeasurementId;
        if (!id || import.meta.env.DEV || !TRACKED_HOSTS.includes(window.location.hostname)) return;
        if (analyticsAllowed()) enable(id);
        return onConsentChange((value) => (value === 'granted' ? enable(id) : disable(id)));
    }, []);
    return null;
}

function setDisabled(id: string, disabled: boolean) {
    (window as unknown as Record<string, boolean>)[`ga-disable-${id}`] = disabled;
}

function enable(id: string) {
    setDisabled(id, false);
    if (window.gtag) {
        window.gtag('consent', 'update', { analytics_storage: 'granted' });
        return;
    }
    window.dataLayer = window.dataLayer || [];
    window.gtag = function gtag() {
        // gtag.js reads the `arguments` object itself, not an array.
        // eslint-disable-next-line prefer-rest-params
        window.dataLayer!.push(arguments);
    };
    window.gtag('consent', 'default', {
        analytics_storage: 'granted',
        ad_storage: 'denied',
        ad_user_data: 'denied',
        ad_personalization: 'denied',
    });
    window.gtag('js', new Date());
    window.gtag('config', id, { allow_google_signals: false, allow_ad_personalization_signals: false });

    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(id)}`;
    document.head.appendChild(script);
}

function disable(id: string) {
    setDisabled(id, true);
    window.gtag?.('consent', 'update', { analytics_storage: 'denied' });
    deleteAnalyticsCookies();
}

/** Removes _ga and _ga_<id> from every domain they could have been set on. */
function deleteAnalyticsCookies() {
    const host = window.location.hostname;
    const parts = host.split('.');
    const domains = ['', host, `.${host}`];
    if (parts.length > 2) domains.push(`.${parts.slice(-2).join('.')}`);
    for (const cookie of document.cookie.split(';')) {
        const name = cookie.split('=')[0].trim();
        if (!name.startsWith('_ga')) continue;
        for (const domain of domains) {
            document.cookie = `${name}=; Max-Age=0; path=/${domain ? `; domain=${domain}` : ''}`;
        }
    }
}

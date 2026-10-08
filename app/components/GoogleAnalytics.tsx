import { site } from '~/content/site';

/** Hostnames that report to Google Analytics; local dev and preview deployments never do. */
const TRACKED_HOSTS = ['frilogix.com', 'www.frilogix.com', 'frilogix-company.vercel.app'];

/**
 * Google Analytics 4 (gtag.js), rendered into <head> by the root Layout.
 * Inert until `site.gaMeasurementId` is set, and in dev builds. The script
 * loads only on the production hostnames above, so previews don't pollute the
 * numbers. Page views: GA's enhanced measurement counts "page changes based on
 * browser history events", which covers the URL updates HorizontalPages makes
 * as pages scroll into view; keep that option on in the GA data stream.
 */
export default function GoogleAnalytics() {
    const id = site.gaMeasurementId;
    if (!id || import.meta.env.DEV) return null;
    const snippet = `(function(){
if (${JSON.stringify(TRACKED_HOSTS)}.indexOf(location.hostname) < 0) return;
var s = document.createElement('script');
s.async = true;
s.src = 'https://www.googletagmanager.com/gtag/js?id=' + ${JSON.stringify(id)};
document.head.appendChild(s);
window.dataLayer = window.dataLayer || [];
window.gtag = function(){ dataLayer.push(arguments); };
gtag('js', new Date());
gtag('config', ${JSON.stringify(id)});
})();`;
    return <script dangerouslySetInnerHTML={{ __html: snippet }} />;
}

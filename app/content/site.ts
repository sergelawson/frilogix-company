/**
 * Site-wide facts. Anything marked TODO is a placeholder until Frilogix
 * confirms it (the "Content needed" list in the design modernization plan).
 */
export const site = {
    name: 'Frilogix',
    // Production origin. Pages are prerendered at build time, so absolute URLs
    // (canonical, Open Graph) can't come from the request.
    url: 'https://frilogix.com',
    legalName: 'Frilogix LLC',
    // One line on what Frilogix is: the home page's meta description and the
    // structured data's description (~/lib/structured-data).
    description:
        'Software and AI engineering company working worldwide. We build web, mobile and backend products, production AI agents, and training data for AI labs.',
    // The contact email is not here on purpose: it ships only as SVG outlines
    // (~/components/ui/EmailAddress), never as text. See scripts/email-svg.py.
    location: 'El Paso, Texas',
    // The same, for structured data. It says where the company is, not who it
    // serves: that's `areaServed: Worldwide` there.
    address: { locality: 'El Paso', region: 'TX', country: 'US' },
    // Cal.com or Calendly link. While null, "Book a call" opens the contact form.
    bookingUrl: null as string | null,
    // Cloudflare Turnstile site key for the contact form (public by design; the
    // secret is TURNSTILE_SECRET on the server). Widget "frilogix-contact".
    turnstileSitekey: '0x4AAAAAAFRV2shzbxSknCfk',
    // Google Analytics 4 Measurement ID ("G-…"), from GA → Admin → Data streams.
    // While null, no analytics code ships (~/components/GoogleAnalytics).
    gaMeasurementId: 'G-ZPGVV8B6RW' as string | null,
    // TODO: add LinkedIn / GitHub / X profile URLs. The footer only lists entries present here.
    social: [] as { label: string; href: string }[],
};

/**
 * The one-page site in scroll order. routes/site.tsx renders the sections in
 * this order, and every path must be a child route of routes/site.tsx.
 */
export const pages = [
    { path: '/', label: 'Home' },
    { path: '/services', label: 'Services' },
    { path: '/work', label: 'Work' },
    { path: '/company', label: 'Company' },
    { path: '/contact', label: 'Contact' },
] as const;

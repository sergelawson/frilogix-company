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
    // The contact email is not here on purpose: it ships only as SVG outlines
    // (~/components/ui/EmailAddress), never as text. See scripts/email-svg.py.
    location: 'El Paso, Texas',
    // Cal.com or Calendly link. While null, "Book a call" opens the contact form.
    bookingUrl: null as string | null,
    // Cloudflare Turnstile site key for the contact form (public by design; the
    // secret is TURNSTILE_SECRET on the server). Widget "frilogix-contact".
    turnstileSitekey: '0x4AAAAAAFRV2shzbxSknCfk',
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

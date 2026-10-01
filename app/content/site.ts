/**
 * Site-wide facts. Anything marked TODO is a placeholder until Frilogix
 * confirms it (the "Content needed" list in the design modernization plan).
 */
export const site = {
    name: 'Frilogix',
    // TODO: confirm this mailbox receives mail (LAUNCH-AUDIT.md P0 #6).
    email: 'hello@frilogix.com',
    // TODO: confirm, or replace with "Remote-first".
    location: 'San Francisco, CA',
    // Cal.com or Calendly link. While null, "Book a call" opens the contact form.
    bookingUrl: null as string | null,
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
    { path: '/about', label: 'About' },
    { path: '/contact', label: 'Contact' },
] as const;

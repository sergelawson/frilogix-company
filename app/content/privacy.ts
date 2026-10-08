import { site } from './site';

/**
 * The privacy policy (/privacy). Facts only: every processing activity here
 * matches what the site actually does. Update it — and `lastUpdated` — whenever
 * a form field, provider, cookie or tracker changes; a change to analytics or
 * cookies also needs a bump of POLICY_VERSION in ~/lib/consent so visitors are
 * asked again.
 *
 * Inline links use [label](url). DRAFT items are marked in comments and need
 * confirmation from Frilogix (ideally with a lawyer).
 */

export const lastUpdated = 'October 8, 2026';

export type Block = { p: string } | { ul: string[] } | { table: { head: string[]; rows: string[][] } };
export type Section = { heading: string; blocks: Block[] };

export const privacyIntro = {
    eyebrow: 'Privacy',
    title: 'Privacy policy',
    lede: `How ${site.legalName} handles personal data on this website: what we collect, why, who else sees it, and the choices you have.`,
};

export const privacySections: Section[] = [
    {
        heading: 'The short version',
        blocks: [
            {
                ul: [
                    'No advertising, no ad tracking, and we never sell or share your personal information.',
                    'Analytics cookies (Google Analytics) are set only if you accept them, and you can change your mind at any time under "Cookie settings" in the footer.',
                    'If you write to us through the contact form, we use your details only to reply to you.',
                    'Spam protection (Cloudflare Turnstile) and hosting (Vercel) process technical data such as your IP address, because the site cannot work securely without them.',
                ],
            },
        ],
    },
    {
        heading: 'Who we are',
        blocks: [
            {
                p: `${site.legalName} ("Frilogix", "we", "us") is a software and AI engineering company based in ${site.location}, United States. We are the controller responsible for personal data collected through ${site.url.replace('https://', '')}.`,
            },
            {
                p: 'For anything about your data, use the [contact form](/contact) or email us at the address shown on the contact page and in the footer, with "Privacy" in the subject line.',
            },
        ],
    },
    {
        heading: 'When you contact us',
        blocks: [
            {
                p: 'The contact form asks for your name, your email address, optionally your company, and a description of what you are building. We use this only to reply to you and to discuss a possible project.',
            },
            {
                p: 'Legal basis (GDPR): taking steps at your request before entering into a contract (Art. 6(1)(b)) and our legitimate interest in answering business enquiries (Art. 6(1)(f)).',
            },
            {
                p: 'How it travels: the form is sent over HTTPS to our server on Vercel, which emails it to our own mailbox through our email provider. It is not stored in a database on the website.',
            },
            // DRAFT: confirm the retention period with Frilogix.
            {
                p: 'How long we keep it: as long as we need it to handle your enquiry. If no business relationship follows, we delete it within 24 months. If we do work together, it becomes part of our business records and is kept as long as the law requires.',
            },
        ],
    },
    {
        heading: 'Spam protection (Cloudflare Turnstile)',
        blocks: [
            {
                p: 'To keep bots out of the contact form we use [Cloudflare Turnstile](https://www.cloudflare.com/application-services/products/turnstile/), provided by Cloudflare, Inc. It checks that a real person is sending the form, using technical signals such as your IP address, browser and device characteristics, and how the page is used. Turnstile does not use this data for advertising and does not set tracking cookies.',
            },
            {
                p: 'Legal basis: our legitimate interest in protecting the website and our inbox from abuse (Art. 6(1)(f) GDPR). This is strictly necessary for the security of the service you are using, so we do not ask for consent. See Cloudflare\'s [privacy policy](https://www.cloudflare.com/privacypolicy/) and [Turnstile privacy addendum](https://www.cloudflare.com/turnstile-privacy-policy/).',
            },
        ],
    },
    {
        heading: 'Hosting and server logs',
        blocks: [
            {
                p: 'The website is hosted by Vercel Inc. To deliver pages and protect against attacks, Vercel processes technical data for every request: your IP address, the date and time, the page requested, your browser\'s user agent, and the referring page. We do not use this data to identify you.',
            },
            {
                p: 'Legal basis: our legitimate interest in running a secure, working website (Art. 6(1)(f) GDPR). Vercel keeps these logs for a limited period under its own policies. See Vercel\'s [privacy policy](https://vercel.com/legal/privacy-policy).',
            },
        ],
    },
    {
        heading: 'Analytics (only with your consent)',
        blocks: [
            {
                p: 'If you click "Accept" in the cookie bar, we use Google Analytics 4, provided by Google Ireland Limited (for the EEA, UK and Switzerland) and Google LLC, to understand how the site is used: which pages are viewed, for how long, how far they are scrolled, which outbound links are clicked, the referring site, your device type, browser and operating system, and your approximate location (country or city). Google Analytics 4 does not log or store IP addresses.',
            },
            {
                p: 'Google signals and ad personalisation are turned off, and we do not link analytics to advertising. Until you accept, no Google script is loaded and no analytics cookie is set.',
            },
            {
                p: 'Legal basis: your consent (Art. 6(1)(a) GDPR and Art. 5(3) of the ePrivacy Directive). You can withdraw it at any time under "Cookie settings" in the footer; we then stop analytics and delete the analytics cookies. Withdrawal does not affect processing that happened before it.',
            },
            // DRAFT: matches the GA4 property's data retention setting (Admin → Data retention); update both together.
            {
                p: 'How long: Google Analytics keeps event-level data for 2 months; the cookies expire after 2 years. See [how Google uses data from sites that use its services](https://policies.google.com/technologies/partner-sites).',
            },
        ],
    },
    {
        heading: 'Cookies and similar technologies',
        blocks: [
            {
                table: {
                    head: ['Name', 'Set by', 'Purpose', 'When', 'Expires'],
                    rows: [
                        ['frilogix-consent (local storage)', 'This site', 'Remembers your cookie choice and when you made it', 'Always (strictly necessary)', 'We ask again after 6 months'],
                        ['_ga', 'Google Analytics', 'Distinguishes visitors', 'Only after you accept', '2 years'],
                        [`_ga_${site.gaMeasurementId?.replace('G-', '') ?? '<id>'}`, 'Google Analytics', 'Keeps the state of a visit', 'Only after you accept', '2 years'],
                    ],
                },
            },
            {
                p: 'Cloudflare Turnstile runs inside its own frame on challenges.cloudflare.com and may use technical storage there solely to verify that you are human. Our fonts are hosted on this site, and there are no social media embeds or advertising cookies.',
            },
        ],
    },
    {
        heading: 'Who receives your data',
        blocks: [
            {
                ul: [
                    'Vercel Inc. (USA): website hosting.',
                    'Cloudflare, Inc. (USA): spam protection on the contact form.',
                    'Google Ireland Limited / Google LLC (USA): analytics, only with your consent.',
                    'Our email provider: delivers contact form messages to our mailbox.',
                ],
            },
            {
                p: 'These providers process data on our behalf and under their own data processing terms. We may also disclose data where the law requires it. We do not sell personal information or share it for cross-context behavioural advertising.',
            },
        ],
    },
    {
        heading: 'International transfers',
        blocks: [
            {
                p: 'We are based in the United States, and so are our main providers. When data from the European Economic Area, the United Kingdom or Switzerland is transferred to the US, it is protected by the EU-U.S. Data Privacy Framework (and its UK and Swiss extensions) where the provider is certified, or by the European Commission\'s Standard Contractual Clauses.',
            },
        ],
    },
    {
        heading: 'Your rights',
        blocks: [
            {
                p: 'If you are in the EEA, the UK or Switzerland, you have the right to access your data, to have it corrected or erased, to restrict or object to its processing (including processing based on our legitimate interests), to receive it in a portable format, and to withdraw consent at any time. You can also lodge a complaint with your local data protection authority.',
            },
            {
                p: 'If you live in a US state with a privacy law, you may have the right to know what personal information we hold about you, and to have it corrected or deleted. We do not sell or share personal information and do not process sensitive personal information.',
            },
            {
                p: 'To use any of these rights, contact us as described above. We will answer within one month (45 days for US state requests) and may ask you to confirm your identity first. We will not treat you differently for exercising your rights.',
            },
        ],
    },
    {
        heading: 'Other things to know',
        blocks: [
            {
                ul: [
                    'This website is not directed at children under 16, and we do not knowingly collect their data.',
                    'We make no automated decisions about you, including profiling.',
                    'The whole site is served over HTTPS, and access to enquiries is limited to the people who handle them.',
                ],
            },
        ],
    },
    {
        heading: 'Changes to this policy',
        blocks: [
            {
                p: 'We will update this page when our practices change, and change the date below. If we change how we use cookies or analytics, we will ask for your consent again.',
            },
        ],
    },
];

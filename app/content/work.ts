export type Product = {
    /** Panel id, so each product has its own URL: /work#slug. */
    slug: string;
    name: string;
    category: string;
    status: string;
    title: string;
    summary: string;
    /** Public site. null until it's live. */
    url: string | null;
    /** A file in public/, sized for display (~1200 px wide), with its pixel size. */
    image: { src: string; width: number; height: number; alt: string } | null;
    /** The product's own logo, an SVG in public/work/ cropped to the artwork; width × height is its viewBox. */
    logo: { src: string; width: number; height: number };
    /**
     * Puts the product's panel on the ink theme. Each logo is drawn for one
     * background (Uitiful's for dark, Vantuu's for light), so this follows the
     * logo. Keep it to one product: the page has one ink panel.
     */
    ink: boolean;
    highlights: { title: string; desc: string }[];
};

/**
 * Products Frilogix is building in-house. Facts only: everything here is taken
 * from the product's own site or confirmed by Frilogix. Each product becomes
 * its own panel on the Work page.
 */
export const products: Product[] = [
    {
        slug: 'uitiful',
        name: 'Uitiful',
        category: 'Agentic design tool',
        status: 'Early access',
        title: 'Describe an interface. Ship it to web, iOS and Android.',
        summary:
            'Uitiful is an AI design workspace. It generates production-ready interfaces from plain English, connects to local coding agents, lets you refine visually, and ships to web, iOS and Android, or exports to Figma, from one canvas.',
        url: 'https://uitiful.com',
        image: {
            src: '/work/uitiful.jpg',
            width: 1200,
            height: 726,
            alt: 'The Uitiful studio: a prompt panel beside generated mobile screens for a travel app.',
        },
        logo: { src: '/work/uitiful-logo.svg', width: 104, height: 28 },
        ink: true,
        highlights: [
            { title: 'Prompt to interface', desc: 'Describe what you need in plain English and get complete interface concepts.' },
            { title: 'Works with your agents', desc: 'Connects local agents like Claude Code, Codex, Cursor and Antigravity.' },
            { title: 'Ships anywhere', desc: 'Web, native iOS and native Android, or export to Figma.' },
            { title: 'One workspace', desc: 'Built for continuous refinement across design, agents and delivery.' },
        ],
    },
    {
        slug: 'vantuu',
        name: 'Vantuu',
        category: 'AI-native commerce',
        status: 'In development',
        title: 'Describe your shop. Vantuu builds it.',
        summary:
            'Vantuu is an AI-native ecommerce shop builder. Describe your idea and it creates the shop, with the design, the pages and the copy, ready to customize and live at its own address in minutes.',
        // TODO: set to 'https://vantuu.com' once the domain is live. Never link the staging site.
        url: null,
        image: {
            src: '/work/vantuu.jpg',
            width: 1200,
            height: 828,
            alt: 'Vantuu turning a one-line idea, "a modern store for sustainable home essentials", into a finished storefront.',
        },
        logo: { src: '/work/vantuu-logo.svg', width: 795, height: 155 },
        ink: false,
        highlights: [
            { title: 'AI creator', desc: 'Describe the shop you want. Vantuu writes the pages, then you take over.' },
            { title: 'Designs included', desc: 'Every shop starts with a complete, responsive design, free and fully editable.' },
            { title: 'Content editor', desc: 'Edit text, images and layout in a click. No code, no theme files.' },
            { title: 'Live in minutes', desc: 'Pick a name and the shop is online at its own address, ready to sell.' },
        ],
    },
];

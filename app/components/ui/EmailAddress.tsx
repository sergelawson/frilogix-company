import { emailGlyphs as g } from '~/content/email-glyphs';

/**
 * The contact email, drawn as SVG outlines in the current text colour and sized
 * to the surrounding text. The address never ships as text (not in the HTML,
 * not in the JS bundle), so harvesters can't scrape it. The cost: it isn't a
 * link, can't be copied, and screen readers hear only the label, so it always
 * sits beside the contact form. Regenerate with scripts/email-svg.py.
 */
export default function EmailAddress({ className = '' }: { className?: string }) {
    const em = (units: number) => `${units / g.unitsPerEm}em`;
    return (
        <svg
            role="img"
            aria-label="Our email address, shown as an image. Use the contact form to reach us."
            viewBox={`0 ${-g.ascent} ${g.width} ${g.ascent + g.descent}`}
            style={{ width: em(g.width), height: em(g.ascent + g.descent), verticalAlign: em(-g.descent) }}
            className={`inline-block fill-current ${className}`}
        >
            <path d={g.d} />
        </svg>
    );
}

/**
 * The Frilogix X as four arms, flat: the same geometry as the 3D mark on the
 * Company panel (~/components/art/scenes/xMark). `solid` fills the arms ink and
 * tint, as the 3D one is ink and glass; `outline` draws them as hairlines.
 * `assemble` glides the arms in once (CSS only, skipped under reduced motion).
 */

/** The top-left arm in a 100×100 box; the others are quarter turns of it. */
const ARM = 'M0 0H25.6L45.75 32.94V45.75H32.94L0 25.6Z';

export default function XGlyph({
    variant = 'solid',
    assemble = false,
    className = '',
}: {
    variant?: 'solid' | 'outline';
    assemble?: boolean;
    className?: string;
}) {
    return (
        <svg viewBox="-2 -2 104 104" aria-hidden="true" className={className}>
            {[0, 1, 2, 3].map((k) => {
                const fill = variant === 'outline' ? 'fill-none stroke-current' : k % 2 === 0 ? 'fill-fg' : 'fill-tint';
                return (
                    // Each arm is the top-left one turned; it glides in from its own outer corner.
                    <g key={k} transform={`rotate(${k * 90} 50 50)`}>
                        <path
                            d={ARM}
                            vectorEffect="non-scaling-stroke"
                            strokeLinejoin="round"
                            style={assemble ? { animationDelay: `${k * 90}ms` } : undefined}
                            className={`${fill} ${assemble ? 'motion-safe:animate-arm-in' : ''}`}
                        />
                    </g>
                );
            })}
        </svg>
    );
}

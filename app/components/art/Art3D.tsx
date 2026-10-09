import { useEffect, useRef, useState, type PointerEvent } from 'react';
import type { ArtScene, SceneFactory } from './runtime';

export interface Callout {
    label: string;
    /** Short number shown before the label in teal, e.g. "01". */
    index?: string;
    /** Where the label sits: at the left or right edge on a horizontal leader, or on a short leader above or below. */
    side: 'left' | 'right' | 'above' | 'below';
    /** The highlight index that emphasises this callout. */
    part?: number;
}

/** A key entry: what one of the house materials stands for in this drawing. */
export interface LegendItem {
    label: string;
    kind: 'matte' | 'glass';
}

/**
 * A 3D drawing (./scenes/*) with callouts. three.js and the scene are loaded
 * once the drawing is within a screen of the viewport, and built when the
 * browser is idle, so it never competes with a page turn. It renders only
 * while on screen; the entrance plays the first time it is almost fully in
 * view, and it tilts toward the mouse while the mouse is over it. Callouts
 * appear once it settles.
 *
 * Without JS it isn't shown at all (`.needs-js`), and if WebGL fails it removes
 * itself, so the panel falls back to its text.
 */
export default function Art3D({
    load,
    callouts,
    description,
    highlight = null,
    legend,
    className = '',
}: {
    /** Imports the scene module. Pass a stable, module-level function. */
    load: () => Promise<{ default: SceneFactory }>;
    /** One per anchor the scene defines, in the same order. */
    callouts: readonly Callout[];
    /** What the drawing shows, for screen readers. */
    description: string;
    /** Part to emphasise, e.g. while its column is hovered. */
    highlight?: number | null;
    /** A key along the bottom (matte = software, glass = AI), spread so each item sits under its side; the drawing shrinks to make room. */
    legend?: readonly LegendItem[];
    className?: string;
}) {
    const rootRef = useRef<HTMLDivElement>(null);
    const stageRef = useRef<HTMLDivElement>(null);
    const calloutRefs = useRef<(HTMLDivElement | null)[]>([]);
    const sceneRef = useRef<ArtScene | null>(null);
    const highlightRef = useRef(highlight);
    const [failed, setFailed] = useState(false);
    const [settled, setSettled] = useState(false);

    useEffect(() => {
        const root = rootRef.current;
        const stage = stageRef.current;
        if (!root || !stage) return;

        let disposed = false;
        let visible = false;
        let inView = false;
        const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        // Keep text in separated rows while the dots track the moving geometry.
        // Angled leaders absorb the difference instead of letting an active
        // layer push its label into the next row.
        const placed: string[] = [];
        const place = (anchors: { x: number; y: number }[], width: number) => {
            const rows = anchors.map((anchor) => anchor.y);
            for (const side of ['left', 'right'] as const) {
                const indices = callouts.flatMap((callout, i) => callout.side === side && anchors[i] ? [i] : []);
                if (indices.length < 2) continue;
                // Callout order is semantic (top to bottom), so rows cannot swap
                // when two animated anchors briefly approach one another.
                const gap = 36;
                const desiredCentre = indices.reduce((sum, i) => sum + anchors[i].y, 0) / indices.length;
                for (let k = 1; k < indices.length; k++) {
                    rows[indices[k]] = Math.max(rows[indices[k]], rows[indices[k - 1]] + gap);
                }
                const centre = indices.reduce((sum, i) => sum + rows[i], 0) / indices.length;
                const first = rows[indices[0]];
                const last = rows[indices[indices.length - 1]];
                const shift = Math.max(28 - first, Math.min(desiredCentre - centre, root.clientHeight - 8 - last));
                indices.forEach((i) => { rows[i] += shift; });
            }
            anchors.forEach((anchor, i) => {
                const el = calloutRefs.current[i];
                if (!el) return;
                const side = callouts[i]?.side;
                const horizontal = side === 'left' || side === 'right';
                const toLeftEdge = side === 'left';
                const x = Math.round(toLeftEdge ? 0 : anchor.x);
                const y = Math.round(horizontal ? rows[i] : anchor.y);
                const offset = Math.round(anchor.y) - y;
                const w = horizontal ? Math.max(0, Math.round(toLeftEdge ? anchor.x : width - anchor.x)) : -1;
                const key = `${x},${y},${w},${offset}`;
                if (placed[i] === key) return;
                placed[i] = key;
                el.style.transform = `translate(${x}px, ${y}px)`;
                if (horizontal) {
                    el.style.width = `${w}px`;
                    // Bend near the object, leaving a level line under the text.
                    const elbow = Math.min(24, w * 0.2);
                    const path = el.querySelector('[data-leader]');
                    path?.setAttribute('d', toLeftEdge
                        ? `M ${w} ${offset} L ${w - elbow} 0 H 0`
                        : `M 0 ${offset} L ${elbow} 0 H ${w}`);
                    const dot = el.querySelector<HTMLElement>('[data-anchor]');
                    if (dot) dot.style.transform = `translateY(${offset}px)`;
                }
            });
        };

        // Build the scene when the browser is idle (at the latest after 2s). Safari has no requestIdleCallback.
        const whenIdle = (task: () => void) =>
            typeof window.requestIdleCallback === 'function' ? window.requestIdleCallback(task, { timeout: 2000 }) : setTimeout(task, 200);
        // Both steps run when idle: evaluating three.js and building the scene
        // each take a few dozen ms, which mid page-turn would drop frames.
        let loading = false;
        const start = () => {
            loading = true;
            whenIdle(() =>
                load()
                    .then(({ default: create }) =>
                        whenIdle(() => {
                            if (disposed) return;
                            try {
                                const scene = create(stage, { reduceMotion, onFrame: place, onSettled: () => setSettled(true) });
                                sceneRef.current = scene;
                                scene.setHighlight(highlightRef.current);
                                scene.setVisible(visible);
                                if (inView) scene.assemble();
                            } catch {
                                setFailed(true); // no WebGL or OffscreenCanvas
                            }
                        }),
                    )
                    .catch(() => setFailed(true)), // the chunk failed to load
            );
        };

        // Load once within a screen of the viewport (in horizontal mode, one page away).
        const near = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && !loading) start();
            },
            { rootMargin: '100% 100% 100% 100%' },
        );
        // Render only while actually on screen.
        const onScreen = new IntersectionObserver(([entry]) => {
            visible = entry.isIntersecting;
            sceneRef.current?.setVisible(visible);
        });
        // Play the entrance the first time it is almost fully in view: in
        // horizontal mode, as the page turn lands rather than during it.
        const seen = new IntersectionObserver(
            ([entry]) => {
                if (!entry.isIntersecting) return;
                inView = true;
                sceneRef.current?.assemble();
                seen.disconnect();
            },
            { threshold: 0.8 },
        );
        near.observe(root);
        onScreen.observe(root);
        seen.observe(root);

        return () => {
            disposed = true;
            near.disconnect();
            onScreen.disconnect();
            seen.disconnect();
            sceneRef.current?.dispose();
            sceneRef.current = null;
        };
    }, [load, callouts]);

    useEffect(() => {
        highlightRef.current = highlight;
        sceneRef.current?.setHighlight(highlight);
    }, [highlight]);

    if (failed) return null;

    // The drawing leans toward the mouse while it's over it.
    const point = (e: PointerEvent<HTMLDivElement>) => {
        if (e.pointerType !== 'mouse') return;
        const rect = e.currentTarget.getBoundingClientRect();
        sceneRef.current?.point(
            ((e.clientX - rect.left) / rect.width) * 2 - 1,
            ((e.clientY - rect.top) / rect.height) * 2 - 1,
        );
    };

    return (
        <div
            ref={rootRef}
            role="img"
            aria-label={description}
            data-settled={settled || undefined}
            onPointerMove={point}
            onPointerLeave={() => sceneRef.current?.point(null)}
            className={`needs-js group relative ${className}`}
        >
            <div ref={stageRef} className={`absolute inset-x-0 top-0 ${legend ? 'bottom-8' : 'bottom-0'}`} />
            {legend && (
                <ul
                    aria-hidden="true"
                    className="absolute inset-x-0 bottom-0 flex justify-between gap-6 font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-fg-muted opacity-0 transition-opacity duration-300 group-data-settled:opacity-100"
                >
                    {legend.map((item) => (
                        <li key={item.label} className="flex items-center gap-2">
                            <span className={`size-2.5 ${swatch[item.kind]}`} />
                            {item.label}
                        </li>
                    ))}
                </ul>
            )}
            {callouts.map((callout, i) => (
                <div
                    key={`${callout.index ?? ''}${callout.label}`}
                    ref={(el) => {
                        calloutRefs.current[i] = el;
                    }}
                    aria-hidden="true"
                    data-active={(callout.part !== undefined && callout.part === highlight) || undefined}
                    className="group/callout pointer-events-none absolute left-0 top-0 opacity-0 transition-opacity duration-300 group-data-settled:opacity-100"
                >
                    <CalloutParts {...callout} />
                </div>
            ))}
        </div>
    );
}

/** Small squares in the drawing's two materials: solid ink, and frosted teal glass. */
const swatch: Record<LegendItem['kind'], string> = {
    matte: 'bg-linear-to-b from-fg-muted to-fg',
    glass: 'border border-accent/60 bg-linear-to-b from-tint/60 to-accent/70',
};

const labelClass =
    'absolute whitespace-nowrap font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-fg-muted transition-colors duration-200 group-data-active/callout:text-fg';
const dotClass =
    'absolute size-2 rounded-full border-[1.5px] border-bg bg-fg transition-colors duration-200 group-data-active/callout:bg-accent';

function CalloutParts({ label, index, side }: Callout) {
    const text = (
        <>
            {index && <span className="mr-2 text-accent-ink">{index}</span>}
            {label}
        </>
    );
    if (side === 'left' || side === 'right') {
        const left = side === 'left';
        return (
            <>
                <span className={`${labelClass} bottom-1.5 ${left ? 'left-0' : 'right-0'}`}>{text}</span>
                <svg className="absolute left-0 top-0 h-px w-full overflow-visible text-line-strong transition-colors duration-200 group-data-active/callout:text-accent" aria-hidden="true">
                    <path data-leader fill="none" stroke="currentColor" strokeWidth="1" strokeLinejoin="round" />
                </svg>
                <span data-anchor className={`${dotClass} -top-[3.5px] ${left ? '-right-1' : '-left-1'}`} />
            </>
        );
    }
    // A short vertical leader from the dot, with the label centred at its end.
    const below = side === 'below';
    return (
        <>
            <span className={`absolute left-0 h-5 border-l border-line-strong ${below ? 'top-0' : 'bottom-0'}`} />
            <span className={`${labelClass} left-0 -translate-x-1/2 ${below ? 'top-6' : 'bottom-6'}`}>{text}</span>
            <span className={`${dotClass} -left-1 -top-1`} />
        </>
    );
}

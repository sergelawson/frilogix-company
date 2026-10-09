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

        // Callouts are positioned straight from the render loop, without React,
        // and only touched when they actually move.
        const placed: string[] = [];
        const place = (anchors: { x: number; y: number }[], width: number) => {
            anchors.forEach((anchor, i) => {
                const el = calloutRefs.current[i];
                if (!el) return;
                const side = callouts[i]?.side;
                const toLeftEdge = side === 'left';
                const x = Math.round(toLeftEdge ? 0 : anchor.x);
                const y = Math.round(anchor.y);
                const w = side === 'left' || side === 'right' ? Math.max(0, Math.round(toLeftEdge ? anchor.x : width - anchor.x)) : -1;
                const key = `${x},${y},${w}`;
                if (placed[i] === key) return;
                placed[i] = key;
                el.style.transform = `translate(${x}px, ${y}px)`;
                if (w >= 0) el.style.width = `${w}px`;
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
            <div ref={stageRef} className="absolute inset-0" />
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
                <span className="absolute inset-x-0 top-0 border-t border-line-strong" />
                <span className={`${dotClass} -top-[3.5px] ${left ? '-right-1' : '-left-1'}`} />
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

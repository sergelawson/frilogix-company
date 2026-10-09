import { useEffect, useRef, useState } from 'react';

export type RuleKind = 'sketch' | 'draft' | 'solid' | 'live';

/** One heartbeat per 64px, enough of them to cover the widest column twice over. */
const WAVE = `M0 6${' h24 l3 -5 l4 10 l3 -7 l2 2 h28'.repeat(24)}`;

/**
 * The rule above a "How we work" step, which gets more solid as the work does:
 * dotted (discover), dashed (prototype), solid (build), and solid with a live
 * heartbeat (operate). It draws in left to right the first time it is in view
 * (`index` staggers it); the heartbeat runs only while it is on screen.
 */
export default function EvidenceRule({ kind, index = 0, className = '' }: { kind: RuleKind; index?: number; className?: string }) {
    const ref = useRef<HTMLDivElement>(null);
    const [drawn, setDrawn] = useState(false);
    const [onScreen, setOnScreen] = useState(false);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const observer = new IntersectionObserver(([entry]) => {
            setOnScreen(entry.isIntersecting);
            if (entry.isIntersecting) setDrawn(true);
        });
        observer.observe(el);
        return () => observer.disconnect();
    }, []);

    return (
        <div
            ref={ref}
            aria-hidden="true"
            data-drawn={drawn || undefined}
            style={{ transitionDelay: `${index * 160}ms` }}
            // Hidden only when JS can draw it in; without JS, or under reduced motion, it's just there.
            className={`relative h-3 overflow-hidden [clip-path:inset(0)] motion-safe:transition-[clip-path] motion-safe:duration-700 motion-safe:ease-out motion-safe:[@media(scripting:enabled)]:not-data-drawn:[clip-path:inset(0_100%_0_0)] ${className}`}
        >
            {kind === 'live' ? (
                <svg
                    viewBox="0 0 1536 12"
                    width={1536}
                    height={12}
                    preserveAspectRatio="xMinYMid meet"
                    className={`absolute left-0 top-0 text-accent motion-safe:animate-beat ${onScreen ? '' : '[animation-play-state:paused]'}`}
                >
                    <path d={WAVE} fill="none" stroke="currentColor" strokeWidth={1.25} strokeLinejoin="round" />
                </svg>
            ) : (
                <svg className="absolute inset-0 size-full text-line-strong">
                    <line
                        x1="0"
                        y1="6"
                        x2="100%"
                        y2="6"
                        stroke="currentColor"
                        strokeWidth={kind === 'sketch' ? 1.5 : 1}
                        strokeLinecap={kind === 'sketch' ? 'round' : 'butt'}
                        strokeDasharray={kind === 'sketch' ? '0 6' : kind === 'draft' ? '8 5' : undefined}
                    />
                </svg>
            )}
        </div>
    );
}

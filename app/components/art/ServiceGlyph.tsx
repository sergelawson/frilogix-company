import { useEffect, useRef, type ReactNode } from 'react';

/**
 * A small pictogram of what a service delivers, standing on its column's rule
 * on the Services panel, animated to show the service at work: a request
 * reaching the API, an update landing on both phones, a pipeline deploying,
 * an agent calling its tools, data being labeled.
 *
 * Drawn 1:1 at 72×40px so hairlines land on whole pixels: white surfaces with
 * a soft offset shadow (as in the 3D drawings), muted ink outlines that darken
 * while the column is hovered (`group` on the column), skeleton bars in the
 * line colour, and one teal signal. The motion is SVG (SMIL): no JS per frame.
 * It pauses off screen and, under reduced motion, holds a finished frame.
 */

const W = 72;
const H = 40;

type Timing = { values: string; keyTimes: string; dur: number; begin?: number };

/** Opacity over a loop. */
function Fade({ values, keyTimes, dur, begin = 0 }: Timing) {
    return <animate attributeName="opacity" values={values} keyTimes={keyTimes} dur={`${dur}s`} begin={`${begin}s`} repeatCount="indefinite" />;
}

/** Movement along `path`, `keyPoints` (0..1 along it) at `keyTimes`. */
function Travel({ path, keyPoints, keyTimes, dur, begin = 0 }: { path: string; keyPoints: string; keyTimes: string; dur: number; begin?: number }) {
    return (
        <animateMotion
            path={path}
            keyPoints={keyPoints}
            keyTimes={keyTimes}
            calcMode="linear"
            dur={`${dur}s`}
            begin={`${begin}s`}
            repeatCount="indefinite"
        />
    );
}

/** A white surface with its soft shadow down and to the right. */
function Plate({ x, y, w, h, r = 2 }: { x: number; y: number; w: number; h: number; r?: number }) {
    return (
        <>
            <rect x={x + 1.5} y={y + 1.5} width={w} height={h} rx={r} className="fill-line stroke-none" />
            <rect x={x} y={y} width={w} height={h} rx={r} className="fill-surface" />
        </>
    );
}

/** A grey skeleton bar, as in a loading interface. */
function Bar({ x, y, w, h = 2 }: { x: number; y: number; w: number; h?: number }) {
    return <rect x={x} y={y} width={w} height={h} rx={h / 2} className="fill-line stroke-none" />;
}

// --- SaaS: a request travels from the browser to the API; the result loads. ---
const SAAS = 3.6;
function Saas() {
    return (
        <>
            <path d="M39.5 20H46M46 12.5V26.5M46 12.5H52.5M46 26.5H52.5" className="stroke-line-strong" />
            <Plate x={1.5} y={5.5} w={38} h={31} r={3} />
            <line x1="1.5" y1="11.5" x2="39.5" y2="11.5" />
            {[5, 8, 11].map((x) => (
                <circle key={x} cx={x} cy={8.5} r={0.9} className="fill-line-strong stroke-none" />
            ))}
            <Bar x={6} y={15.5} w={16} h={3} />
            <Bar x={6} y={21.5} w={28} />
            <Bar x={6} y={25.5} w={22} />
            {/* The result, arriving after the response. */}
            <rect x="6" y="30" width="0" height="3" rx="1.5" className="fill-accent stroke-none">
                <animate attributeName="width" values="0;0;14;14;0" keyTimes="0;0.7;0.8;0.94;1" dur={`${SAAS}s`} repeatCount="indefinite" />
            </rect>
            {[7.5, 21.5].map((y, i) => (
                <g key={y}>
                    <Plate x={52.5} y={y} w={17} h={10} />
                    <circle cx={56.5} cy={y + 5} r={1.2} className="fill-line-strong stroke-none" />
                    <Bar x={60} y={y + 4.25} w={6} h={1.5} />
                    {i === 0 && (
                        <circle cx={56.5} cy={y + 5} r={1.2} opacity="0" className="fill-accent stroke-none">
                            <Fade values="0;0;1;1;0;0" keyTimes="0;0.27;0.3;0.42;0.46;1" dur={SAAS} />
                        </circle>
                    )}
                </g>
            ))}
            <circle r={1.75} opacity="0" className="fill-accent stroke-none">
                <Travel path="M40 20H46V12.5H52" keyPoints="0;1;1;0;0" keyTimes="0;0.28;0.42;0.7;1" dur={SAAS} />
                <Fade values="0;1;1;0;0" keyTimes="0;0.04;0.68;0.71;1" dur={SAAS} />
            </circle>
        </>
    );
}

// --- Mobile: an update appears on one phone, crosses, and lands on the other. ---
const MOBILE = 4.4;
/** From the top of one phone to the top of the other. */
const ARC = 'M11 8Q23.5 -3 36 8';
function Mobile() {
    const phones = [1.5, 26.5];
    return (
        <>
            {/* The sync arc, over the top from one phone to the other. */}
            <path d={ARC} strokeDasharray="1.5 2" className="stroke-line-strong" />
            {phones.map((x, i) => (
                <g key={x}>
                    <Plate x={x} y={9.5} w={19} h={29} r={3.5} />
                    <rect x={x + 6.5} y={12} width={6} height={1.5} rx={0.75} className="fill-line-strong stroke-none" />
                    <rect x={x + 3.5} y={16} width={12} height={6} rx={1.5} className="fill-line stroke-none" />
                    <rect x={x + 3.5} y={16} width={12} height={6} rx={1.5} opacity="0" className="fill-accent stroke-none">
                        <Fade values="0;0;1;1;0;0" keyTimes={i === 0 ? '0;0.1;0.16;0.86;0.94;1' : '0;0.4;0.46;0.86;0.94;1'} dur={MOBILE} />
                    </rect>
                    <Bar x={x + 3.5} y={25} w={12} />
                    <Bar x={x + 3.5} y={29} w={12} />
                    <Bar x={x + 3.5} y={33} w={7} />
                </g>
            ))}
            <circle r={1.75} opacity="0" className="fill-accent stroke-none">
                <Travel path={ARC} keyPoints="0;0;1;1" keyTimes="0;0.18;0.4;1" dur={MOBILE} />
                <Fade values="0;0;1;1;0;0" keyTimes="0;0.17;0.19;0.39;0.41;1" dur={MOBILE} />
            </circle>
        </>
    );
}

// --- Platform: build, test, deploy, in turn, inside a running cluster. ---
const PLATFORM = 4.8;
function Platform() {
    const stages = [
        { x: 7.5, active: '0;1;1;0.35;0.35;0', at: '0;0.04;0.2;0.25;0.92;1' },
        { x: 29.5, active: '0;0;1;1;0.35;0.35;0', at: '0;0.36;0.4;0.56;0.61;0.92;1' },
        { x: 51.5, active: '0;0;1;1;0', at: '0;0.72;0.76;0.92;1' },
    ];
    return (
        <>
            <rect x="0.5" y="7.5" width="71" height="29" rx="3.5" strokeDasharray="2 2" className="stroke-line-strong">
                <animate attributeName="stroke-dashoffset" values="0;-8" dur="1.6s" repeatCount="indefinite" />
            </rect>
            <path d="M20.5 22H29.5M42.5 22H51.5" className="stroke-line-strong" />
            {stages.map(({ x, active, at }) => (
                <g key={x}>
                    <Plate x={x} y={15.5} w={13} h={13} r={2.5} />
                    <rect x={x + 3} y={18.5} width={7} height={7} rx={1.5} opacity="0" className="fill-accent stroke-none">
                        <Fade values={active} keyTimes={at} dur={PLATFORM} />
                    </rect>
                </g>
            ))}
            <circle r={1.5} opacity="0" className="fill-accent stroke-none">
                <Travel path="M20.5 22H51.5" keyPoints="0;0;0.29;0.71;0.71;1;1" keyTimes="0;0.2;0.36;0.361;0.56;0.72;1" dur={PLATFORM} />
                <Fade values="0;0;1;1;0;0;1;1;0;0" keyTimes="0;0.19;0.21;0.35;0.37;0.55;0.57;0.71;0.73;1" dur={PLATFORM} />
            </circle>
        </>
    );
}

// --- AI engineering: the agent calls each of its tools in turn. ---
const AI = 4;
const AGENT = { x: 36, y: 20, r: 6 };
const TOOLS = [
    { x: 6, y: 6 },
    { x: 66, y: 6 },
    { x: 66, y: 34 },
    { x: 6, y: 34 },
];
const TOOL = 9;

/** Where the line from the agent's edge meets the tool's square. */
function spoke(tool: { x: number; y: number }) {
    const dx = tool.x - AGENT.x;
    const dy = tool.y - AGENT.y;
    const length = Math.hypot(dx, dy);
    const ux = dx / length;
    const uy = dy / length;
    const inset = Math.min(TOOL / 2 / Math.abs(ux), TOOL / 2 / Math.abs(uy));
    const from = { x: AGENT.x + ux * AGENT.r, y: AGENT.y + uy * AGENT.r };
    const to = { x: tool.x - ux * inset, y: tool.y - uy * inset };
    return `M${from.x.toFixed(2)} ${from.y.toFixed(2)}L${to.x.toFixed(2)} ${to.y.toFixed(2)}`;
}

function Ai() {
    return (
        <>
            {TOOLS.map((tool) => (
                <path key={`${tool.x},${tool.y}`} d={spoke(tool)} className="stroke-line-strong" />
            ))}
            {TOOLS.map((tool, k) => (
                <g key={`${tool.x},${tool.y}`}>
                    <Plate x={tool.x - TOOL / 2} y={tool.y - TOOL / 2} w={TOOL} h={TOOL} r={2} />
                    <rect x={tool.x - 2.5} y={tool.y - 2.5} width={5} height={5} rx={1} opacity="0" className="fill-accent stroke-none">
                        <Fade values="0;0;1;0;0" keyTimes="0;0.14;0.17;0.42;1" dur={AI} begin={k} />
                    </rect>
                </g>
            ))}
            {/* Thinking: a ring spreading from the agent. */}
            <circle cx={AGENT.x} cy={AGENT.y} r={AGENT.r} className="fill-none stroke-tint">
                <animate attributeName="r" values={`${AGENT.r};${AGENT.r + 6}`} dur="2s" repeatCount="indefinite" />
                <Fade values="0.9;0" keyTimes="0;1" dur={2} />
            </circle>
            <circle cx={AGENT.x} cy={AGENT.y} r={AGENT.r} className="fill-accent stroke-none" />
            <circle cx={AGENT.x} cy={AGENT.y} r={2} className="fill-surface stroke-none" />
            {TOOLS.map((tool, k) => (
                <circle key={`${tool.x},${tool.y}`} r={1.5} opacity="0" className="fill-accent stroke-none">
                    <Travel path={spoke(tool)} keyPoints="0;1;1" keyTimes="0;0.15;1" dur={AI} begin={k} />
                    <Fade values="0;1;1;0;0" keyTimes="0;0.02;0.14;0.16;1" dur={AI} begin={k} />
                </circle>
            ))}
        </>
    );
}

// --- AI training data: a cursor moves through the data, labeling it. ---
const DATA = 6;
const CELL = 8;
const cell = (col: number, row: number) => ({ x: 1.5 + col * 11, y: 5.5 + row * 11 });
/** Labeled in this order, each at its time (share of the loop). */
const LABELED = [
    [0, 0],
    [2, 0],
    [1, 1],
    [3, 1],
    [0, 2],
    [2, 2],
].map(([col, row], i) => ({ ...cell(col, row), at: 0.1 + i * 0.12 }));

/** The cursor's path: it arrives just before each label lands and leaves just after. */
const cursor = (() => {
    const values = [`${LABELED[0].x} ${LABELED[0].y}`];
    const times = [0];
    for (const { x, y, at } of LABELED) {
        values.push(`${x} ${y}`, `${x} ${y}`);
        times.push(at - 0.03, at + 0.06);
    }
    values.push(values[values.length - 1]);
    times.push(1);
    return { values: values.join(';'), keyTimes: times.map((t) => t.toFixed(3)).join(';') };
})();

function Data() {
    return (
        <>
            <path d="M43.5 20H50.5" strokeDasharray="1 2" className="stroke-line-strong" />
            {[0, 1, 2, 3].flatMap((col) =>
                [0, 1, 2].map((row) => {
                    const { x, y } = cell(col, row);
                    return <rect key={`${col},${row}`} x={x} y={y} width={CELL} height={CELL} rx={1.5} className="fill-surface stroke-line-strong" />;
                }),
            )}
            {LABELED.map(({ x, y, at }) => (
                <rect key={`${x},${y}`} x={x + 1.5} y={y + 1.5} width={CELL - 3} height={CELL - 3} rx={1} opacity="0" className="fill-accent stroke-none">
                    <Fade values="0;0;1;1;0;0" keyTimes={`0;${at.toFixed(3)};${(at + 0.03).toFixed(3)};0.9;0.96;1`} dur={DATA} />
                </rect>
            ))}
            {/* The cursor: drawn at the origin and moved onto each cell in turn. */}
            <rect x={-1.5} y={-1.5} width={CELL + 3} height={CELL + 3} rx={2.5} opacity="0" className="fill-none stroke-accent">
                <animateTransform
                    attributeName="transform"
                    type="translate"
                    values={cursor.values}
                    keyTimes={cursor.keyTimes}
                    dur={`${DATA}s`}
                    repeatCount="indefinite"
                />
                <Fade values="0;0;1;1;0;0" keyTimes="0;0.05;0.07;0.78;0.82;1" dur={DATA} />
            </rect>
            {/* The label itself. */}
            <path d="M52 15.5H63L69 21.5L63 27.5H52Z" transform="translate(1.5 1.5)" className="fill-line stroke-none" />
            <path d="M52 15.5H63L69 21.5L63 27.5H52Z" strokeLinejoin="round" className="fill-surface" />
            <circle cx={56} cy={21.5} r={1.2} className="fill-surface" />
            <rect x={59} y={20.75} width={5} height={1.5} rx={0.75} className="fill-accent stroke-none" />
        </>
    );
}

const glyphs: Record<string, { draw: () => ReactNode; /** A finished-looking moment, held under reduced motion (s). */ still: number }> = {
    saas: { draw: Saas, still: SAAS * 0.85 },
    mobile: { draw: Mobile, still: MOBILE * 0.6 },
    platform: { draw: Platform, still: PLATFORM * 0.85 },
    'ai-engineering': { draw: Ai, still: AI * 0.1 },
    'training-data': { draw: Data, still: DATA * 0.86 },
};

export default function ServiceGlyph({ id, className = '' }: { id: string; className?: string }) {
    const ref = useRef<SVGSVGElement>(null);
    const glyph = glyphs[id];

    // Animate only while on screen; under reduced motion, hold a finished frame.
    useEffect(() => {
        const svg = ref.current;
        if (!svg || !glyph) return;
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            svg.pauseAnimations();
            svg.setCurrentTime(glyph.still);
            return;
        }
        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) svg.unpauseAnimations();
            else svg.pauseAnimations();
        });
        observer.observe(svg);
        return () => observer.disconnect();
    }, [glyph]);

    if (!glyph) return null;
    const Draw = glyph.draw;
    return (
        <svg
            ref={ref}
            viewBox={`0 0 ${W} ${H}`}
            width={W}
            height={H}
            aria-hidden="true"
            fill="none"
            stroke="currentColor"
            strokeWidth={1}
            className={`overflow-visible text-fg-muted transition-colors duration-200 group-hover:text-fg ${className}`}
        >
            <Draw />
        </svg>
    );
}

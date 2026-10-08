import { useEffect, useLayoutEffect, useRef, type ReactNode } from 'react';
import { useLocation, useNavigate, type Location } from 'react-router';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

/**
 * When this matches, CSS lays the pages out side by side (the `hscroll` variant
 * in app/app.css — keep the two queries identical) and vertical scrolling
 * drives them horizontally. Otherwise the pages simply stack vertically.
 */
const HORIZONTAL_QUERY =
    '(min-width: 1280px) and (min-height: 700px) and (prefers-reduced-motion: no-preference) and (scripting: enabled)';
const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';

// Paging feel in horizontal mode. One gesture moves at most one page, and a
// small accidental scroll moves none.
/** Share of a screen a scroll must travel to count as "next page". */
const PAGE_THRESHOLD = 0.3;
/** Cap on that distance for wheel input (px), so a mouse needs two notches rather than five. */
const WHEEL_THRESHOLD_MAX = 200;
/** Wheel silence (ms) that ends a gesture, so trackpad momentum can't page a second time. */
const GESTURE_IDLE_MS = 200;
/** After a page turn, no new swipe is recognised for this long (ms) — the page is still gliding. */
const PAGE_COOLDOWN_MS = 700;
/** While a gesture is below the threshold the track leans with it (px at the threshold), then springs back. */
const PEEK_MAX = 80;
/** Lean when pushing past the first page, where there's nowhere to go. */
const EDGE_PEEK_MAX = 28;

type ScrollState = { fromScroll?: boolean } | null;

const normalizePath = (pathname: string) => pathname.replace(/\/+$/, '') || '/';

/**
 * Scroll engine for the one-page site. It owns all scroll positioning, which is
 * why root.tsx has no <ScrollRestoration />:
 *
 * - The URL picks what to show on load, on link clicks, and on back/forward:
 *   `/company` shows the Company page, `/services#intelligent-systems` that panel.
 * - Scrolling rewrites the URL (replace, not push) to the page in view, so the
 *   navbar's active link and the document title follow along.
 * - `.gsap-reveal` elements inside fade in as they enter the viewport.
 *
 * Children are <Page>s made of <Panel>s (~/components/Panel).
 */
export default function HorizontalPages({ children }: { children: ReactNode }) {
    const wrapperRef = useRef<HTMLDivElement>(null);
    const trackRef = useRef<HTMLDivElement>(null);
    const progressRef = useRef<HTMLDivElement>(null);
    const location = useLocation();
    const navigate = useNavigate();
    const locationRef = useRef(location);
    const handledKeyRef = useRef<string | null>(null);
    const scrollToLocationRef = useRef<(loc: Location, smooth: boolean) => void>(() => {});

    useLayoutEffect(() => {
        locationRef.current = location;
    });

    // Layout effect so the pin spacer exists before first paint.
    useLayoutEffect(() => {
        gsap.registerPlugin(ScrollTrigger);
        history.scrollRestoration = 'manual';

        const wrapper = wrapperRef.current!;
        const track = trackRef.current!;
        const progressBar = progressRef.current!;
        const panels = gsap.utils.toArray<HTMLElement>('[data-panel]', track);
        const pages = gsap.utils.toArray<HTMLElement>('[data-page]', track);

        const panelFor = (loc: Location) => {
            const hash = decodeURIComponent(loc.hash.slice(1));
            return (
                (hash && track.querySelector<HTMLElement>(`[data-panel="${CSS.escape(hash)}"]`)) ||
                track.querySelector<HTMLElement>(`[data-page="${CSS.escape(normalizePath(loc.pathname))}"] [data-panel]`)
            );
        };

        const mm = gsap.matchMedia();
        // horizontal/vertical are complementary, so this runs (and re-runs on change) in every mode.
        mm.add(
            { horizontal: HORIZONTAL_QUERY, vertical: `not all and ${HORIZONTAL_QUERY}`, reduceMotion: REDUCED_MOTION_QUERY },
            (context) => {
                const { horizontal, reduceMotion } = context.conditions!;
                let syncUrl = false;
                const cleanups: Array<() => void> = [];

                // Horizontal mode: pin the viewport and move the track 1px per 1px scrolled.
                let tween: gsap.core.Tween | null = null;
                // The page the visitor is on (or being taken to): paging and snapping start from it.
                let anchor = 0;
                if (horizontal) {
                    const distance = () => track.scrollWidth - wrapper.clientWidth;
                    tween = gsap.to(track, {
                        x: () => -distance(),
                        ease: 'none', // containerAnimation triggers below require a linear tween
                        onUpdate: () => {
                            progressBar.style.transform = `scaleX(${tween?.progress() ?? 0})`;
                        },
                        scrollTrigger: {
                            trigger: wrapper,
                            pin: true,
                            start: 'top top',
                            end: () => `+=${distance()}`,
                            scrub: 0.3,
                            // Settles native scrolling (scrollbar drags, touch) on a whole page. Wheel
                            // and keys page explicitly below. Every panel is one viewport wide, so
                            // progress × last index is a position in pages.
                            snap: {
                                snapTo: (progress: number) => {
                                    const last = panels.length - 1;
                                    const position = progress * last;
                                    const moved = position - anchor;
                                    // Short of the threshold: back to the starting page. Up to one
                                    // page: the neighbour. Further (a scrollbar jump): the nearest.
                                    const target =
                                        Math.abs(moved) < PAGE_THRESHOLD
                                            ? anchor
                                            : Math.abs(moved) <= 1
                                              ? anchor + Math.sign(moved)
                                              : Math.round(position);
                                    anchor = gsap.utils.clamp(0, last, target);
                                    return anchor / last;
                                },
                                // No velocity projection: it overshoots by whole pages.
                                inertia: false,
                                duration: { min: 0.3, max: 0.5 },
                                // Wait until the hand has actually stopped, trackpad momentum included.
                                delay: 0.25,
                                ease: 'power2.inOut',
                            },
                            invalidateOnRefresh: true,
                        },
                    });
                }
                const st = tween?.scrollTrigger;

                const scrollTopFor = (panel: HTMLElement) => {
                    if (st) return st.start + panel.offsetLeft;
                    const margin = parseFloat(getComputedStyle(panel).scrollMarginTop) || 0;
                    return Math.max(0, panel.getBoundingClientRect().top + window.scrollY - margin);
                };

                const scrollToPanel = (panel: HTMLElement, smooth: boolean) => {
                    if (st) anchor = Math.max(0, panels.indexOf(panel));
                    window.scrollTo({ top: scrollTopFor(panel), behavior: smooth && !reduceMotion ? 'smooth' : 'auto' });
                    if (!smooth) {
                        // Jump the track too, instead of letting the scrub glide it across every page.
                        ScrollTrigger.update();
                        st?.getTween()?.progress(1);
                    }
                };

                scrollToLocationRef.current = (loc, smooth) => {
                    const panel = panelFor(loc);
                    if (panel) scrollToPanel(panel, smooth);
                };

                if (!reduceMotion) {
                    gsap.utils.toArray<HTMLElement>('.gsap-reveal', track).forEach((elem) => {
                        gsap.fromTo(
                            elem,
                            { opacity: 0, y: 30 },
                            {
                                opacity: 1,
                                y: 0,
                                duration: 1,
                                ease: 'power2.out',
                                scrollTrigger: tween
                                    ? { trigger: elem, containerAnimation: tween, start: 'left 90%' }
                                    : { trigger: elem, start: 'top 85%' },
                            },
                        );
                    });
                }

                // Keep the URL on whichever page is in view.
                pages.forEach((page) => {
                    ScrollTrigger.create({
                        trigger: page,
                        ...(tween
                            ? { containerAnimation: tween, start: 'left center', end: 'right center' }
                            : { start: 'top center', end: 'bottom center' }),
                        onToggle: (self) => {
                            const path = page.dataset.page!;
                            if (!syncUrl || !self.isActive || normalizePath(locationRef.current.pathname) === path) return;
                            navigate(path, { replace: true, state: { fromScroll: true } });
                        },
                    });
                });

                if (st) {
                    const last = panels.length - 1;
                    const inTrack = () => window.scrollY >= st.start - 1 && window.scrollY <= st.end + 1;
                    const currentIndex = () => Math.round((window.scrollY - st.start) / wrapper.clientWidth);
                    // At either end, input heading out of the track scrolls natively (on into the footer).
                    const leavesTrack = (direction: number) =>
                        (direction > 0 && anchor === last && window.scrollY >= st.end - 1) ||
                        (direction < 0 && anchor === 0 && window.scrollY <= st.start + 1);
                    const goTo = (index: number) => scrollToPanel(panels[gsap.utils.clamp(0, last, index)], true);

                    // Peek: the track leans with a gesture that hasn't crossed the threshold.
                    // It uses the CSS `translate` property, which composes with the `transform`
                    // GSAP drives, so the two never fight.
                    const peek = (px: number, settle: boolean) => {
                        track.style.transition = settle
                            ? 'translate 0.35s cubic-bezier(0.22, 1, 0.36, 1)'
                            : 'translate 0.12s ease-out';
                        track.style.translate = px ? `${px}px 0` : '';
                    };

                    // Wheel and trackpad: one gesture = at most one page. Travel accumulates until
                    // it crosses the threshold; then the next page glides in and the rest of the
                    // gesture (trackpad momentum) is ignored. The lock ends after GESTURE_IDLE_MS
                    // of silence — or sooner, when a new swipe is detected inside the momentum.
                    let travel = 0;
                    let locked = false;
                    let idleTimer = 0;
                    let lastOutside = -Infinity;
                    // Momentum tracking while locked. Raw trackpad deltas are noisy (wobbles,
                    // bumps, dips mid-swipe), so a new swipe is judged on a smoothed average.
                    let lastMagnitude = 0;
                    let lockedAt = 0;
                    let smoothed = 0;
                    let lowest = Infinity;
                    let risingRun = 0;
                    const lock = (time: number) => {
                        locked = true;
                        lockedAt = time;
                        smoothed = lastMagnitude;
                        lowest = Infinity;
                        risingRun = 0;
                    };
                    const endGesture = () => {
                        locked = false;
                        travel = 0;
                        peek(0, true);
                    };
                    // Fingers landing on the pad again look like a sustained, strong ramp:
                    // three rising events in a row, the smoothed speed well above its low
                    // point, and real size. Momentum noise produces none of that together.
                    // Never within PAGE_COOLDOWN_MS of a turn: one gesture, one page.
                    const isNewSwipe = (magnitude: number, time: number) => {
                        smoothed = smoothed * 0.7 + magnitude * 0.3;
                        lowest = Math.min(lowest, smoothed);
                        risingRun = magnitude > lastMagnitude ? risingRun + 1 : 0;
                        if (time - lockedAt < PAGE_COOLDOWN_MS) return false;
                        return risingRun >= 3 && magnitude >= 12 && smoothed >= lowest * 2.5;
                    };
                    const onWheel = (e: WheelEvent) => {
                        if (e.ctrlKey) return; // pinch-zoom
                        if (!inTrack()) {
                            lastOutside = e.timeStamp;
                            return;
                        }
                        const raw = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
                        const unit =
                            e.deltaMode === WheelEvent.DOM_DELTA_LINE ? 16 : e.deltaMode === WheelEvent.DOM_DELTA_PAGE ? wrapper.clientHeight : 1;
                        const delta = raw * unit;
                        if (!delta || (!locked && leavesTrack(delta) && delta > 0)) return;

                        e.preventDefault();
                        window.clearTimeout(idleTimer);
                        idleTimer = window.setTimeout(endGesture, GESTURE_IDLE_MS);
                        const magnitude = Math.abs(delta);

                        // A gesture that scrolled in from the footer has already done its job.
                        if (!locked && e.timeStamp - lastOutside < GESTURE_IDLE_MS) lock(e.timeStamp);
                        if (locked) {
                            const fresh = isNewSwipe(magnitude, e.timeStamp);
                            lastMagnitude = magnitude;
                            if (!fresh) return;
                            locked = false;
                            travel = 0;
                        }
                        lastMagnitude = magnitude;

                        travel += delta;
                        const direction = Math.sign(travel);
                        const threshold = Math.min(wrapper.clientWidth * PAGE_THRESHOLD, WHEEL_THRESHOLD_MAX);
                        const progress = Math.min(Math.abs(travel) / threshold, 1);
                        // Before the first page there's nowhere to go: lean a little, then spring back.
                        if (anchor + direction < 0) {
                            peek(EDGE_PEEK_MAX * Math.sqrt(progress), false);
                            if (progress >= 1) lock(e.timeStamp);
                        } else if (progress >= 1) {
                            lock(e.timeStamp);
                            peek(0, true);
                            goTo(anchor + direction);
                        } else {
                            peek(-direction * PEEK_MAX * Math.sqrt(progress), false);
                        }
                    };

                    // Keys page one at a time too. Left alone: typing in fields, Space on
                    // buttons and links, and modified keys (Alt+← is browser back).
                    const onKeyDown = (e: KeyboardEvent) => {
                        if (e.altKey || e.ctrlKey || e.metaKey || !inTrack()) return;
                        const target = e.target as Element;
                        if (target.closest('input, textarea, select, [contenteditable]')) return;
                        let step: number;
                        switch (e.key) {
                            case 'ArrowRight':
                            case 'ArrowDown':
                            case 'PageDown':
                                step = 1;
                                break;
                            case 'ArrowLeft':
                            case 'ArrowUp':
                            case 'PageUp':
                                step = -1;
                                break;
                            case ' ':
                                if (target.closest('button, a, summary, [role="button"]')) return;
                                step = e.shiftKey ? -1 : 1;
                                break;
                            default:
                                return;
                        }
                        if ((e.shiftKey && e.key !== ' ') || leavesTrack(step)) return;
                        e.preventDefault();
                        goTo(anchor + step);
                    };
                    // Off-screen panels are only translated away, so tabbing into one must bring it into view.
                    const onFocusIn = (e: FocusEvent) => {
                        const panel = (e.target as Element).closest<HTMLElement>('[data-panel]');
                        if (panel && panels.indexOf(panel) !== currentIndex()) scrollToPanel(panel, false);
                    };

                    window.addEventListener('wheel', onWheel, { passive: false });
                    window.addEventListener('keydown', onKeyDown);
                    track.addEventListener('focusin', onFocusIn);
                    cleanups.push(() => {
                        window.clearTimeout(idleTimer);
                        track.style.transition = '';
                        track.style.translate = '';
                        window.removeEventListener('wheel', onWheel);
                        window.removeEventListener('keydown', onKeyDown);
                        track.removeEventListener('focusin', onFocusIn);
                    });
                }

                // Land on the page the URL names before syncing starts, so the
                // initial scroll position doesn't rewrite the URL to "/".
                ScrollTrigger.refresh();
                scrollToLocationRef.current(locationRef.current, false);
                handledKeyRef.current = locationRef.current.key;
                syncUrl = true;

                return () => {
                    cleanups.forEach((cleanup) => cleanup());
                    scrollToLocationRef.current = () => {};
                };
            },
        );

        return () => mm.revert();
    }, [navigate]);

    // Link clicks and back/forward: scroll to the new location. Skips the
    // replace-navigations the URL sync above makes while the user scrolls.
    useEffect(() => {
        if (handledKeyRef.current === location.key) return;
        handledKeyRef.current = location.key;
        if ((location.state as ScrollState)?.fromScroll) return;
        scrollToLocationRef.current(location, true);
    }, [location]);

    return (
        <>
            {/* GSAP wraps the pinned element in a spacer div; this parent keeps that out of React-managed siblings. */}
            <div>
                <div ref={wrapperRef} className="@container hscroll:h-screen hscroll:overflow-clip">
                    <div ref={trackRef} className="relative hscroll:flex hscroll:h-full hscroll:w-max">
                        {children}
                    </div>
                </div>
            </div>
            <div
                ref={progressRef}
                aria-hidden="true"
                style={{ transform: 'scaleX(0)' }}
                className="pointer-events-none fixed inset-x-0 bottom-0 z-40 hidden h-0.5 origin-left bg-accent hscroll:block"
            />
        </>
    );
}

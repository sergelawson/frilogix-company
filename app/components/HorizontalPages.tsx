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

type ScrollState = { fromScroll?: boolean } | null;

const normalizePath = (pathname: string) => pathname.replace(/\/+$/, '') || '/';

/**
 * Scroll engine for the one-page site. It owns all scroll positioning, which is
 * why root.tsx has no <ScrollRestoration />:
 *
 * - The URL picks what to show on load, on link clicks, and on back/forward:
 *   `/about` shows the About page, `/services#intelligent-systems` that panel.
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
                            scrub: 0.6,
                            // Every panel is exactly one viewport wide, so panel starts are evenly spaced.
                            // No inertia: velocity-projected snapping overshoots by whole pages
                            // after a scrollbar drag or an instant jump. Direction alone decides.
                            snap: {
                                snapTo: 1 / (panels.length - 1),
                                inertia: false,
                                duration: { min: 0.2, max: 0.6 },
                                delay: 0.05,
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
                    const inTrack = () => window.scrollY >= st.start - 1 && window.scrollY <= st.end + 1;
                    const currentIndex = () => Math.round((window.scrollY - st.start) / wrapper.clientWidth);

                    // Sideways trackpad swipes (and shift+wheel) drive the track too.
                    const onWheel = (e: WheelEvent) => {
                        if (!inTrack() || Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return;
                        e.preventDefault();
                        window.scrollBy({ top: e.deltaX * (e.deltaMode === WheelEvent.DOM_DELTA_LINE ? 16 : 1) });
                    };
                    const onKeyDown = (e: KeyboardEvent) => {
                        if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
                        if (e.altKey || e.ctrlKey || e.metaKey || e.shiftKey || !inTrack()) return;
                        if ((e.target as Element).closest('input, textarea, select, [contenteditable]')) return;
                        e.preventDefault();
                        const next = gsap.utils.clamp(0, panels.length - 1, currentIndex() + (e.key === 'ArrowRight' ? 1 : -1));
                        scrollToPanel(panels[next], true);
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
                className="pointer-events-none fixed inset-x-0 bottom-0 z-40 hidden h-0.5 origin-left bg-brand-dark hscroll:block"
            />
        </>
    );
}

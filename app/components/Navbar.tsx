import { useEffect, useRef, useState, type FC, type MouseEvent } from "react";
import { Link, useLocation } from "react-router";
import { pages } from "~/content/site";
import { BookCallButton } from "~/components/ui/Button";

const desktopLinks = pages.filter((page) => page.path !== "/" && page.path !== "/contact");
const pad = (n: number) => String(n).padStart(2, "0");

// Skip link: focus <main> directly rather than navigating to "#main", which
// the one-page scroll engine would treat as a panel hash.
const skipToContent = (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    document.getElementById("main")?.focus();
};

const Navbar: FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [overInk, setOverInk] = useState(false);
    const { pathname } = useLocation();
    const buttonRef = useRef<HTMLButtonElement>(null);
    const menuRef = useRef<HTMLDivElement>(null);
    const current = pages.findIndex((page) => page.path === (pathname.replace(/\/+$/, "") || "/"));

    // Track what sits under the bar: past 20px it turns solid, and over an ink
    // panel (or the footer) it switches to the ink theme. Keeps checking for a
    // moment after scrolling stops, because the horizontal track eases on.
    useEffect(() => {
        let frame = 0;
        let until = 0;
        const check = () => {
            setIsScrolled(window.scrollY > 20);
            const below = document.elementFromPoint(window.innerWidth / 2, 76);
            setOverInk(!!below?.closest(".theme-ink"));
            frame = performance.now() < until ? requestAnimationFrame(check) : 0;
        };
        const handleScroll = () => {
            until = performance.now() + 900;
            if (!frame) frame = requestAnimationFrame(check);
        };
        handleScroll();
        window.addEventListener("scroll", handleScroll, { passive: true });
        window.addEventListener("resize", handleScroll);
        return () => {
            cancelAnimationFrame(frame);
            window.removeEventListener("scroll", handleScroll);
            window.removeEventListener("resize", handleScroll);
        };
    }, []);

    // Open mobile menu: Esc closes it, the page behind can't scroll, focus moves in.
    useEffect(() => {
        if (!isOpen) return;
        const handleKey = (e: KeyboardEvent) => {
            if (e.key !== "Escape") return;
            setIsOpen(false);
            buttonRef.current?.focus();
        };
        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        document.addEventListener("keydown", handleKey);
        menuRef.current?.querySelector("a")?.focus();
        return () => {
            document.body.style.overflow = previousOverflow;
            document.removeEventListener("keydown", handleKey);
        };
    }, [isOpen]);

    return (
        <header
            className={`fixed inset-x-0 top-0 z-50 border-b transition-colors duration-300 ${
                isScrolled || isOpen ? "border-line bg-bg/85 backdrop-blur-xl" : "border-transparent"
            } ${overInk && !isOpen ? "theme-ink" : ""}`}
        >
            <a
                href="#main"
                onClick={skipToContent}
                className="sr-only rounded-full bg-accent px-4 py-2 text-sm font-medium text-on-accent focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60]"
            >
                Skip to content
            </a>
            <nav aria-label="Main" className="mx-auto flex h-18 max-w-7xl items-center justify-between gap-6 px-4 sm:px-6 lg:px-8">
                <Link to="/" className="shrink-0">
                    {/* Both load up front so switching over an ink panel doesn't flash. */}
                    <img
                        src="/logo.png"
                        alt="Frilogix"
                        width={160}
                        height={40}
                        fetchPriority="high"
                        className={`h-8 w-auto ${overInk && !isOpen ? "hidden" : ""}`}
                    />
                    <img
                        src="/logo-on-dark.png"
                        alt="Frilogix"
                        width={160}
                        height={40}
                        className={`h-8 w-auto ${overInk && !isOpen ? "" : "hidden"}`}
                    />
                </Link>

                <div className="hidden items-center gap-8 md:flex">
                    {current >= 0 && (
                        <span aria-hidden="true" className="font-mono text-xs tabular-nums text-fg-muted">
                            {pad(current + 1)} / {pad(pages.length)}
                        </span>
                    )}
                    <ul className="flex items-center gap-7">
                        {desktopLinks.map((link) => {
                            const active = pathname === link.path;
                            return (
                                <li key={link.path}>
                                    <Link
                                        to={link.path}
                                        aria-current={active ? "page" : undefined}
                                        className={`relative py-2 text-sm font-medium transition-colors ${
                                            active ? "text-fg" : "text-fg-muted hover:text-fg"
                                        }`}
                                    >
                                        {link.label}
                                        <span
                                            aria-hidden="true"
                                            className={`absolute inset-x-0 -bottom-0.5 h-0.5 rounded-full bg-accent transition-transform duration-300 ${
                                                active ? "scale-x-100" : "scale-x-0"
                                            }`}
                                        />
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                    <BookCallButton />
                </div>

                <button
                    ref={buttonRef}
                    type="button"
                    onClick={() => setIsOpen((open) => !open)}
                    aria-expanded={isOpen}
                    aria-controls="mobile-menu"
                    aria-label={isOpen ? "Close menu" : "Open menu"}
                    className="-mr-2 flex size-11 items-center justify-center rounded-full text-fg md:hidden"
                >
                    <svg className="size-6" aria-hidden="true" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                        {isOpen ? (
                            <path strokeLinecap="round" d="M6 18 18 6M6 6l12 12" />
                        ) : (
                            <path strokeLinecap="round" d="M4 8h16M4 16h16" />
                        )}
                    </svg>
                </button>
            </nav>

            <div
                id="mobile-menu"
                ref={menuRef}
                hidden={!isOpen}
                className="h-[calc(100dvh-4.5rem)] overflow-y-auto border-t border-line bg-bg px-4 pb-10 pt-6 sm:px-6 md:hidden"
            >
                <ul>
                    {pages.map((page, i) => (
                        <li key={page.path} className="border-b border-line">
                            <Link
                                to={page.path}
                                onClick={() => setIsOpen(false)}
                                aria-current={pathname === page.path ? "page" : undefined}
                                className="flex items-baseline justify-between py-4 font-wide text-3xl font-semibold tracking-tight"
                            >
                                {page.label}
                                <span className="font-mono text-xs font-normal text-fg-muted">{pad(i + 1)}</span>
                            </Link>
                        </li>
                    ))}
                </ul>
                <BookCallButton size="lg" className="mt-8 w-full" />
            </div>
        </header>
    );
};

export default Navbar;

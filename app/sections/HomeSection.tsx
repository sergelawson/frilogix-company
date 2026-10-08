import { Link } from 'react-router';
import ImageParticles from '~/components/ImageParticles';
import { Page, Panel, panelInner } from '~/components/Panel';
import { BookCallButton, ButtonLink } from '~/components/ui/Button';
import Eyebrow from '~/components/ui/Eyebrow';
import SectionHeader from '~/components/ui/SectionHeader';
import { ArrowRight } from '~/components/ui/icons';
import { hero, productsIntro } from '~/content/home';
import { products } from '~/content/work';

const pad = (n: number) => String(n).padStart(2, '0');

export default function HomeSection() {
    return (
        <Page path="/" label="Home">
            <Panel id="home" className="flex items-center">
                <div className="relative z-10 mx-auto w-full max-w-7xl px-4 pb-20 pt-32 sm:px-6 lg:px-8 lg:pt-40 hscroll:pb-16 hscroll:pt-24">
                    <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-8">
                        <div className="lg:col-span-7">
                            {/* The headline renders at once (it's the LCP element); the rest fades in after it. */}
                            <Eyebrow>{hero.eyebrow}</Eyebrow>
                            <h1 className="mt-6 font-wide text-display font-semibold text-balance">{hero.title}</h1>
                            <p className="mt-6 max-w-xl text-lede text-pretty text-fg-muted motion-safe:animate-fade-up motion-safe:[animation-delay:100ms]">
                                {hero.lede}
                            </p>
                            <div className="mt-10 flex flex-col gap-3 sm:flex-row motion-safe:animate-fade-up motion-safe:[animation-delay:200ms]">
                                <BookCallButton size="lg" />
                                <ButtonLink to="/services" variant="secondary" size="lg">
                                    See services
                                </ButtonLink>
                            </div>
                        </div>
                        <div className="lg:col-span-5 motion-safe:animate-fade-up motion-safe:[animation-delay:300ms]">
                            <ImageParticles className="h-64 sm:h-80 lg:h-[30rem] hscroll:h-[52vh]" />
                        </div>
                    </div>
                </div>

                {/* Horizontal mode only: tell visitors that scrolling moves sideways. */}
                <div
                    aria-hidden="true"
                    className="absolute bottom-8 right-8 z-10 hidden items-center gap-3 font-mono text-xs uppercase tracking-[0.16em] text-fg-muted hscroll:flex"
                >
                    Scroll
                    <ArrowRight className="size-5 animate-nudge-x text-accent" />
                </div>
            </Panel>

            {/* Frilogix is new: its own products are the proof. Each links to its Work panel. */}
            <Panel id="products">
                <div className={panelInner}>
                    <SectionHeader {...productsIntro} />
                    <ul className="gsap-reveal mt-12 grid gap-x-12 gap-y-12 md:grid-cols-2 hscroll:mt-10">
                        {products.map((product, i) => (
                            <li key={product.slug} className="border-t border-line-strong pt-5">
                                <Link to={`/work#${product.slug}`} className="group block">
                                    <p className="flex items-baseline justify-between gap-4 font-mono text-[0.6875rem] uppercase tracking-[0.14em]">
                                        <span className="text-accent-ink">{pad(i + 1)}</span>
                                        <span className="text-right text-fg-muted">
                                            {product.category} · {product.status}
                                        </span>
                                    </p>
                                    {product.image && (
                                        <img
                                            src={product.image.src}
                                            alt={product.image.alt}
                                            width={product.image.width}
                                            height={product.image.height}
                                            loading="lazy"
                                            className="mt-5 aspect-[16/9] w-full border border-line object-cover object-top hscroll:aspect-auto hscroll:h-[32vh]"
                                        />
                                    )}
                                    <h3 className="mt-5 font-wide text-h2 font-semibold">
                                        {product.name}
                                        <ArrowRight className="ml-[0.3em] inline size-[0.6em] align-baseline text-accent transition-transform duration-200 ease-out group-hover:translate-x-1.5" />
                                    </h3>
                                    <p className="mt-2 text-fg-muted">{product.title}</p>
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            </Panel>
        </Page>
    );
}

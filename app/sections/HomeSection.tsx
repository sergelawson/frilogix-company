import ImageParticles from '~/components/ImageParticles';
import { Page, Panel, panelInner } from '~/components/Panel';
import { BookCallButton, ButtonLink } from '~/components/ui/Button';
import Eyebrow from '~/components/ui/Eyebrow';
import SectionHeader from '~/components/ui/SectionHeader';
import Placeholder, { showPlaceholders } from '~/components/ui/Placeholder';
import { ArrowRight } from '~/components/ui/icons';
import { hero, proof } from '~/content/home';

const hasProof = proof.logos.length > 0 || proof.metrics.length > 0;

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

            {(hasProof || showPlaceholders) && (
                <Panel id="proof" className="theme-ink">
                    <div className={panelInner}>
                        <SectionHeader
                            eyebrow="Proof"
                            title="Teams we've shipped with."
                            lede="Startups and scale-ups building web, mobile and AI products."
                        />
                        <div className="gsap-reveal mt-12 hscroll:mt-10">
                            <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
                                {proof.logos.length > 0
                                    ? proof.logos.map((logo) => (
                                          <li key={logo.name} className="flex h-20 items-center justify-center rounded-xl border border-line px-4">
                                              {/* Shown as monochrome white on the ink panel. */}
                                              <img src={logo.src} alt={logo.name} className="max-h-8 w-auto opacity-80 brightness-0 invert" loading="lazy" />
                                          </li>
                                      ))
                                    : ['a', 'b', 'c', 'd', 'e', 'f'].map((slot) => (
                                          <li key={slot}>
                                              <Placeholder label="Client logo" className="h-20" />
                                          </li>
                                      ))}
                            </ul>
                            <dl className="mt-10 grid gap-8 border-t border-line pt-8 sm:grid-cols-3">
                                {proof.metrics.length > 0
                                    ? proof.metrics.map((metric) => (
                                          <div key={metric.label}>
                                              <dt className="sr-only">{metric.label}</dt>
                                              <dd className="font-wide text-h1 font-semibold">{metric.value}</dd>
                                              <dd className="mt-2 text-fg-muted">{metric.label}</dd>
                                          </div>
                                      ))
                                    : ['a', 'b', 'c'].map((slot) => (
                                          <div key={slot}>
                                              <Placeholder label="Hard number + what it measured" className="h-28" />
                                          </div>
                                      ))}
                            </dl>
                            {!hasProof && (
                                <Placeholder
                                    label="Dev only: this panel is hidden in production until app/content/home.ts has real proof"
                                    className="mt-8 border-none"
                                />
                            )}
                        </div>
                    </div>
                </Panel>
            )}
        </Page>
    );
}

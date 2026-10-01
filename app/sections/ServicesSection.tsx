import { Page, Panel, panelInner } from '~/components/Panel';
import ArrowLink from '~/components/ui/ArrowLink';
import Eyebrow from '~/components/ui/Eyebrow';
import SectionHeader from '~/components/ui/SectionHeader';
import Placeholder from '~/components/ui/Placeholder';
import { ArrowRight } from '~/components/ui/icons';
import {
    aiCapabilities,
    aiIntro,
    aiNote,
    aiPipeline,
    processIntro,
    processSteps,
    services,
    servicesIntro,
    stack,
} from '~/content/services';

const pad = (n: number) => String(n).padStart(2, '0');

export default function ServicesSection() {
    return (
        <Page path="/services" label="Services">
            <Panel id="services">
                <div className={panelInner}>
                    <SectionHeader {...servicesIntro} />
                    <div className="gsap-reveal mt-12 grid gap-4 sm:grid-cols-2 xl:grid-cols-4 hscroll:mt-10">
                        {services.map((service) => (
                            <article
                                key={service.id}
                                className="flex flex-col rounded-2xl border border-line bg-surface p-6 shadow-card transition-colors duration-200 hover:border-line-strong"
                            >
                                <p className="font-mono text-[0.6875rem] font-medium uppercase tracking-[0.14em] text-fg-muted">{service.stack}</p>
                                <h3 className="mt-4 font-wide text-h3 font-semibold">{service.title}</h3>
                                <p className="mt-3 text-sm leading-relaxed text-fg-muted">{service.desc}</p>
                                <ul className="mt-5 flex flex-wrap gap-1.5">
                                    {service.features.map((feature) => (
                                        <li key={feature} className="rounded-full bg-bg px-2.5 py-1 text-xs font-medium">
                                            {feature}
                                        </li>
                                    ))}
                                </ul>
                                <div className="mt-auto pt-6">
                                    {service.id === 'ai-engineering' ? (
                                        <ArrowLink to="/services#intelligent-systems">How we ship AI</ArrowLink>
                                    ) : (
                                        <ArrowLink to="/contact">Discuss a project</ArrowLink>
                                    )}
                                </div>
                            </article>
                        ))}
                    </div>
                </div>
            </Panel>

            {/* AI Engineering deep dive. Its id is the target of the /ai-engineering redirect. */}
            <Panel id="intelligent-systems" className="theme-ink">
                <div className={panelInner}>
                    <SectionHeader {...aiIntro} />
                    <div className="gsap-reveal">
                        <ol aria-label="How an AI system ships" className="mt-12 grid gap-3 md:grid-cols-4 md:gap-8 hscroll:mt-10">
                            {aiPipeline.map((step, i) => (
                                <li key={step.title} className="relative rounded-xl border border-line bg-surface p-5">
                                    <span className="font-mono text-xs text-accent-ink">{pad(i + 1)}</span>
                                    <h3 className="mt-2 font-wide text-h3 font-semibold">{step.title}</h3>
                                    <p className="mt-1.5 text-sm text-fg-muted">{step.desc}</p>
                                    {i < aiPipeline.length - 1 && (
                                        <span
                                            aria-hidden="true"
                                            className="absolute -right-7 top-1/2 z-10 hidden size-6 -translate-y-1/2 items-center justify-center rounded-full border border-line bg-bg md:flex"
                                        >
                                            <ArrowRight className="size-3.5 text-accent-ink" />
                                        </span>
                                    )}
                                </li>
                            ))}
                        </ol>
                        <ul className="mt-10 grid gap-x-8 gap-y-6 border-t border-line pt-8 sm:grid-cols-2 lg:grid-cols-3 hscroll:grid-cols-6">
                            {aiCapabilities.map((item) => (
                                <li key={item.title}>
                                    <h3 className="text-sm font-semibold">{item.title}</h3>
                                    <p className="mt-1 text-sm text-fg-muted">{item.desc}</p>
                                </li>
                            ))}
                        </ul>
                        <p className="mt-8 font-mono text-xs text-fg-muted">{aiNote}</p>
                    </div>
                </div>
            </Panel>

            <Panel id="process">
                <div className={panelInner}>
                    <SectionHeader {...processIntro} />
                    <ol className="gsap-reveal mt-12 grid gap-8 border-t border-line pt-8 sm:grid-cols-2 lg:grid-cols-4 hscroll:mt-10">
                        {processSteps.map((step, i) => (
                            <li key={step.title}>
                                <div className="flex items-center justify-between gap-4">
                                    <span className="font-mono text-xs text-accent-ink">{pad(i + 1)}</span>
                                    {step.duration ? (
                                        <span className="font-mono text-xs text-fg-muted">{step.duration}</span>
                                    ) : (
                                        <Placeholder label="Timeframe" className="py-0.5" />
                                    )}
                                </div>
                                <h3 className="mt-4 font-wide text-h3 font-semibold">{step.title}</h3>
                                <p className="mt-2 text-[0.9375rem] leading-relaxed text-fg-muted">{step.desc}</p>
                            </li>
                        ))}
                    </ol>
                    <div className="mt-12 flex flex-col gap-5 border-t border-line pt-8 lg:flex-row lg:items-center lg:gap-10 hscroll:mt-10">
                        <Eyebrow className="shrink-0">Stack</Eyebrow>
                        <ul className="flex flex-wrap items-center gap-x-8 gap-y-4">
                            {stack.map((tech) => (
                                <li key={tech.name} className="flex items-center gap-2 text-fg-muted">
                                    {tech.icon && (
                                        <svg viewBox="0 0 24 24" className="size-5" fill="currentColor" aria-hidden="true">
                                            <path d={tech.icon} />
                                        </svg>
                                    )}
                                    <span className="text-sm font-medium">{tech.name}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </Panel>
        </Page>
    );
}

import { Page, Panel, panelInner } from '~/components/Panel';
import ArrowLink from '~/components/ui/ArrowLink';
import Eyebrow from '~/components/ui/Eyebrow';
import SectionHeader from '~/components/ui/SectionHeader';
import Placeholder from '~/components/ui/Placeholder';
import { ArrowRight } from '~/components/ui/icons';
import { evenOddIcons } from '~/content/stack-icons';
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
                    <SectionHeader {...servicesIntro} wide />
                    <ol className="gsap-reveal mt-12 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 hscroll:mt-8">
                        {services.map((service, i) => (
                            <li key={service.id} className="flex flex-col border-t border-line-strong pt-5">
                                <p className="flex items-baseline justify-between gap-3 font-mono text-[0.6875rem] uppercase tracking-[0.14em]">
                                    <span className="text-accent-ink">{pad(i + 1)}</span>
                                    <span className="text-right text-fg-muted">{service.stack}</span>
                                </p>
                                <h3 className="mt-5 font-wide text-h3 font-semibold hscroll:mt-4">{service.title}</h3>
                                <p className="mt-3 text-sm leading-relaxed text-fg-muted">{service.desc}</p>
                                <ul className="mt-5 space-y-1 border-t border-line pt-4 text-sm hscroll:mt-4 hscroll:pt-3">
                                    {service.features.map((feature) => (
                                        <li key={feature}>{feature}</li>
                                    ))}
                                </ul>
                                <div className="mt-auto pt-6 hscroll:pt-5">
                                    {service.id === 'ai-engineering' ? (
                                        <ArrowLink to="/services#intelligent-systems">How we ship AI</ArrowLink>
                                    ) : (
                                        <ArrowLink to="/contact">Discuss a project</ArrowLink>
                                    )}
                                </div>
                            </li>
                        ))}
                    </ol>
                </div>
            </Panel>

            {/* AI Engineering deep dive. Its id is the target of the /ai-engineering redirect. */}
            <Panel id="intelligent-systems" className="theme-ink">
                <div className={panelInner}>
                    <SectionHeader {...aiIntro} />
                    <div className="gsap-reveal">
                        <ol aria-label="How an AI system ships" className="mt-12 grid gap-8 md:grid-cols-4 hscroll:mt-10">
                            {aiPipeline.map((step, i) => (
                                <li key={step.title} className="border-t border-line-strong pt-5">
                                    <div className="flex items-center justify-between">
                                        <span className="font-mono text-xs text-accent-ink">{pad(i + 1)}</span>
                                        {i < aiPipeline.length - 1 && <ArrowRight className="hidden size-4 text-accent-ink md:block" />}
                                    </div>
                                    <h3 className="mt-4 font-wide text-h3 font-semibold">{step.title}</h3>
                                    <p className="mt-1.5 text-sm text-fg-muted">{step.desc}</p>
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
                                    <svg viewBox="0 0 24 24" className="size-5" fill="currentColor" aria-hidden="true">
                                        <path d={tech.icon} fillRule={evenOddIcons.has(tech.icon) ? 'evenodd' : undefined} />
                                    </svg>
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

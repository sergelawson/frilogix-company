import { useState } from 'react';
import Art3D, { type Callout } from '~/components/art/Art3D';
import EvidenceRule, { type RuleKind } from '~/components/art/EvidenceRule';
import ServiceGlyph from '~/components/art/ServiceGlyph';
import { Page, Panel, PanelGap, panelInner } from '~/components/Panel';
import ArrowLink from '~/components/ui/ArrowLink';
import SectionHeader from '~/components/ui/SectionHeader';
import { ArrowRight } from '~/components/ui/icons';
import { evenOddIcons } from '~/content/stack-icons';
import {
    aiBridge,
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

// The 3D drawings load only near the screen; these must stay module-level (stable).
const loadBridge = () => import('~/components/art/scenes/bridge');
const bridgeCallouts: Callout[] = [
    { label: aiBridge.ends[0], side: 'above' },
    { label: aiBridge.ends[1], side: 'above' },
    ...aiPipeline.map((_, i): Callout => ({ label: pad(i + 1), side: 'below', part: i })),
];
/** Stacked it keeps a 4:3 box; in horizontal mode it fills the height SectionHeader leaves it. */
const artSize = 'aspect-[4/3] w-full lg:aspect-auto lg:h-[16rem] hscroll:h-full';

/** "How we work": each step's rule is more solid than the last, and the last one is live. */
const rules: RuleKind[] = ['sketch', 'draft', 'solid', 'live'];

/** Hover and keyboard focus both point at a part of a drawing. */
const pointAt = (set: (part: number | null) => void, part: number) => ({
    onMouseEnter: () => set(part),
    onMouseLeave: () => set(null),
    onFocus: () => set(part),
    onBlur: () => set(null),
});

export default function ServicesSection() {
    const [step, setStep] = useState<number | null>(null);

    return (
        <Page path="/services" label="Services">
            <Panel id="services">
                <div className={panelInner}>
                    <SectionHeader {...servicesIntro} wide />
                    <PanelGap />
                    <ol className="gsap-reveal grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
                        {services.map((service, i) => (
                            <li key={service.id} className="group flex flex-col">
                                {/* What the service delivers, drawn standing on the column's rule. */}
                                <ServiceGlyph id={service.id} className="mb-3 h-10 w-[4.5rem]" />
                                <div className="flex flex-1 flex-col border-t border-line-strong pt-5">
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
                                </div>
                            </li>
                        ))}
                    </ol>
                </div>
            </Panel>

            {/* AI Engineering deep dive. Its id is the target of the /ai-engineering redirect. */}
            <Panel id="intelligent-systems" className="theme-ink">
                <div className={panelInner}>
                    <SectionHeader
                        {...aiIntro}
                        aside={
                            <Art3D
                                load={loadBridge}
                                callouts={bridgeCallouts}
                                description={aiBridge.description}
                                highlight={step}
                                className={artSize}
                            />
                        }
                    />
                    <div className="gsap-reveal">
                        <ol aria-label="How an AI system ships" className="mt-12 grid gap-8 md:grid-cols-4 hscroll:mt-10">
                            {aiPipeline.map((item, i) => (
                                <li key={item.title} className="border-t border-line-strong pt-5" {...pointAt(setStep, i)}>
                                    <div className="flex items-center justify-between">
                                        <span className="font-mono text-xs text-accent-ink">{pad(i + 1)}</span>
                                        {i < aiPipeline.length - 1 && <ArrowRight className="hidden size-4 text-accent-ink md:block" />}
                                    </div>
                                    <h3 className="mt-4 font-wide text-h3 font-semibold">{item.title}</h3>
                                    <p className="mt-1.5 text-sm text-fg-muted">{item.desc}</p>
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
                    <PanelGap />
                    {/* Four steps, each headed by its number and a rule that gets more solid as the work does. */}
                    <ol className="gsap-reveal grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
                        {processSteps.map((item, i) => (
                            <li key={item.title}>
                                <div className="flex items-center gap-3">
                                    <span className="font-mono text-xs text-accent-ink">{pad(i + 1)}</span>
                                    <EvidenceRule kind={rules[i]} index={i} className="flex-1" />
                                </div>
                                <h3 className="mt-4 font-wide text-h3 font-semibold">{item.title}</h3>
                                <p className="mt-2 leading-relaxed text-pretty text-fg-muted">{item.desc}</p>
                            </li>
                        ))}
                    </ol>
                    {/* The stack, grouped under the same four columns; the logos make it plain what the row is. */}
                    <div className="mt-12 border-t border-line pt-6 hscroll:mt-10">
                        <h3 className="sr-only">Stack</h3>
                        <div className="grid gap-x-8 gap-y-6 sm:grid-cols-2 lg:grid-cols-4">
                            {stack.map((group) => (
                                <div key={group.label}>
                                    <p className="font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-fg-muted">{group.label}</p>
                                    <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-2.5">
                                        {group.items.map((tech) => (
                                            <li key={tech.name} className="flex items-center gap-2 text-fg-muted">
                                                <svg viewBox="0 0 24 24" className="size-4.5" fill="currentColor" aria-hidden="true">
                                                    <path d={tech.icon} fillRule={evenOddIcons.has(tech.icon) ? 'evenodd' : undefined} />
                                                </svg>
                                                <span className="text-sm font-medium text-fg">{tech.name}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </Panel>
        </Page>
    );
}

import { Page, Panel, panelInner } from '~/components/Panel';
import ArrowLink from '~/components/ui/ArrowLink';
import { BookCallButton } from '~/components/ui/Button';
import SectionHeader from '~/components/ui/SectionHeader';
import { companyIntro, companyStory, plan, whoWeAre } from '~/content/company';

const pad = (n: number) => String(n).padStart(2, '0');
const monoLabel = 'font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-fg-muted';

export default function CompanySection() {
    return (
        <Page path="/company" label="Company">
            {/* What we're building and why: three ruled columns, read left to right. */}
            <Panel id="company">
                <div className={panelInner}>
                    <SectionHeader {...companyIntro} wide />
                    <div className="gsap-reveal mt-12 grid gap-8 md:grid-cols-3 hscroll:mt-10">
                        {companyStory.map((part) => (
                            <div key={part.label} className="border-t border-line-strong pt-5">
                                <p className={monoLabel}>{part.label}</p>
                                <p className="mt-4 leading-relaxed text-pretty text-fg-muted">{part.text}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </Panel>

            {/* The plan, then who we are. The page's one ink panel. No team panel: Frilogix
                LLC is the public face, and the founder stays unnamed. */}
            <Panel id="plan" className="theme-ink">
                <div className={panelInner}>
                    <SectionHeader eyebrow={plan.eyebrow} title={plan.title} wide />
                    <div className="gsap-reveal">
                        <ol className="mt-12 grid gap-8 md:grid-cols-3 hscroll:mt-10">
                            {plan.steps.map((step, i) => (
                                <li key={step.title} className="border-t border-line-strong pt-5">
                                    <span className="font-mono text-xs text-accent-ink">{pad(i + 1)}</span>
                                    <h3 className="mt-3 font-wide text-h3 font-semibold">{step.title}</h3>
                                    <p className="mt-2 leading-relaxed text-pretty text-fg-muted">{step.desc}</p>
                                </li>
                            ))}
                        </ol>
                        <div className="mt-12 grid gap-6 border-t border-line pt-6 lg:grid-cols-12 lg:items-center lg:gap-12 hscroll:mt-10">
                            <div className="lg:col-span-7">
                                <p className={monoLabel}>Who we are</p>
                                <p className="mt-3 leading-relaxed text-pretty">{whoWeAre}</p>
                            </div>
                            <div className="flex flex-wrap items-center gap-x-8 gap-y-4 lg:col-span-5 lg:justify-end">
                                <BookCallButton size="lg" />
                                <ArrowLink to="/services#process">How we work</ArrowLink>
                            </div>
                        </div>
                    </div>
                </div>
            </Panel>
        </Page>
    );
}

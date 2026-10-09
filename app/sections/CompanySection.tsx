import Art3D, { type Callout } from '~/components/art/Art3D';
import { Page, Panel, panelInner } from '~/components/Panel';
import ArrowLink from '~/components/ui/ArrowLink';
import { BookCallButton } from '~/components/ui/Button';
import SectionHeader from '~/components/ui/SectionHeader';
import { companyIntro, companyMark, companyStory, plan, planArt, whoWeAre } from '~/content/company';

const pad = (n: number) => String(n).padStart(2, '0');
const monoLabel = 'font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-fg-muted';

// The 3D drawings load only near the screen; these must stay module-level (stable).
const loadMark = () => import('~/components/art/scenes/xMark');
const loadSurvivors = () => import('~/components/art/scenes/survivors');
/** The mark's arms in reading order: top left, top right, bottom right, bottom left. */
const markCallouts: Callout[] = companyMark.labels.map((label, i) => ({ label, side: i === 0 || i === 3 ? 'left' : 'right' }));
const planCallouts: Callout[] = [
    { label: planArt.labels[0], side: 'below' },
    { label: planArt.labels[1], side: 'above' },
    { label: planArt.labels[2], side: 'below' },
];

export default function CompanySection() {
    return (
        <Page path="/company" label="Company">
            {/* What we're building and why: the mark as the argument, then three ruled columns, read left to right. */}
            <Panel id="company">
                <div className={panelInner}>
                    <SectionHeader
                        {...companyIntro}
                        aside={
                            <Art3D
                                load={loadMark}
                                callouts={markCallouts}
                                legend={companyMark.legend}
                                description={companyMark.description}
                                className="mt-6 aspect-[4/3] w-full lg:mt-0 lg:aspect-auto lg:h-[22rem] hscroll:h-[44vh]"
                            />
                        }
                    />
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

            {/* The plan (drawn: what survives our products reaches yours), then who we are.
                The page's one ink panel. No team panel: Frilogix LLC is the public face, and
                the founder stays unnamed. */}
            <Panel id="plan" className="theme-ink">
                <div className={panelInner}>
                    <SectionHeader
                        eyebrow={plan.eyebrow}
                        title={plan.title}
                        aside={
                            <Art3D
                                load={loadSurvivors}
                                callouts={planCallouts}
                                description={planArt.description}
                                className="mt-6 aspect-[4/3] w-full lg:mt-0 lg:aspect-auto lg:h-[20rem] hscroll:h-[min(calc(100vh-488px),17rem)]"
                            />
                        }
                    />
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

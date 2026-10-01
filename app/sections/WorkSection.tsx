import { Page, Panel, panelInner } from '~/components/Panel';
import { BookCallButton } from '~/components/ui/Button';
import Eyebrow from '~/components/ui/Eyebrow';
import Placeholder, { showPlaceholders } from '~/components/ui/Placeholder';
import { caseStudies, workIntro, type CaseStudy } from '~/content/work';

/** One case study per panel. Without data (dev only) it draws the empty template. */
function CaseStudyPanel({ study, id }: { study?: CaseStudy; id: string }) {
    return (
        <Panel id={id} className="theme-ink">
            <div className={panelInner}>
                <div className="gsap-reveal grid gap-12 lg:grid-cols-12 lg:gap-16">
                    <div className="lg:col-span-7">
                        {study ? (
                            <>
                                <Eyebrow>{study.client}</Eyebrow>
                                <h2 className="mt-4 font-wide text-h1 font-semibold text-balance">{study.title}</h2>
                            </>
                        ) : (
                            <>
                                <Placeholder label="Client type, e.g. Series A fintech" className="w-64" />
                                <Placeholder label="Case study title" className="mt-4 h-24" />
                            </>
                        )}
                        <div className="mt-10 grid gap-8 border-t border-line pt-8 sm:grid-cols-2">
                            <div>
                                <h3 className="font-mono text-xs uppercase tracking-[0.16em] text-fg-muted">Problem</h3>
                                {study ? <p className="mt-3 leading-relaxed">{study.problem}</p> : <Placeholder label="What was broken or missing" className="mt-3 h-24" />}
                            </div>
                            <div>
                                <h3 className="font-mono text-xs uppercase tracking-[0.16em] text-fg-muted">Approach</h3>
                                {study ? <p className="mt-3 leading-relaxed">{study.approach}</p> : <Placeholder label="What we built and how" className="mt-3 h-24" />}
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col justify-end lg:col-span-5">
                        <div className="rounded-2xl border border-line bg-surface p-8">
                            <h3 className="font-mono text-xs uppercase tracking-[0.16em] text-fg-muted">Outcome</h3>
                            {study ? (
                                <>
                                    <p className="mt-4 font-wide text-display font-semibold text-accent-ink">{study.outcome.value}</p>
                                    <p className="mt-3 text-fg-muted">{study.outcome.label}</p>
                                </>
                            ) : (
                                <Placeholder label="Outcome with a number" className="mt-4 h-32" />
                            )}
                        </div>
                        <ul className="mt-6 flex flex-wrap gap-1.5">
                            {study ? (
                                study.stack.map((tech) => (
                                    <li key={tech} className="rounded-full border border-line px-2.5 py-1 text-xs font-medium text-fg-muted">
                                        {tech}
                                    </li>
                                ))
                            ) : (
                                <li><Placeholder label="Stack" className="w-40" /></li>
                            )}
                        </ul>
                    </div>
                </div>
            </div>
        </Panel>
    );
}

export default function WorkSection() {
    return (
        <Page path="/work" label="Work">
            {caseStudies.length > 0 ? (
                caseStudies.map((study) => <CaseStudyPanel key={study.slug} id={study.slug} study={study} />)
            ) : (
                <>
                    <Panel id="work" className="theme-ink">
                        <div className={panelInner}>
                            <div className="gsap-reveal max-w-3xl">
                                <Eyebrow>{workIntro.eyebrow}</Eyebrow>
                                <h2 className="mt-4 font-wide text-h1 font-semibold text-balance">{workIntro.title}</h2>
                                <p className="mt-6 max-w-2xl text-lede text-pretty text-fg-muted">{workIntro.lede}</p>
                                <BookCallButton size="lg" className="mt-10" />
                            </div>
                        </div>
                    </Panel>
                    {showPlaceholders && <CaseStudyPanel id="case-study-template" />}
                </>
            )}
        </Page>
    );
}

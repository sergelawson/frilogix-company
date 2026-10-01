import { Page, Panel, panelInner } from '~/components/Panel';
import ArrowLink from '~/components/ui/ArrowLink';
import { BookCallButton } from '~/components/ui/Button';
import SectionHeader from '~/components/ui/SectionHeader';
import Placeholder, { showPlaceholders } from '~/components/ui/Placeholder';
import { aboutIntro, principles, team } from '~/content/about';

const pad = (n: number) => String(n).padStart(2, '0');

export default function AboutSection() {
    return (
        <Page path="/about" label="About">
            <Panel id="about">
                <div className={panelInner}>
                    <SectionHeader {...aboutIntro} />
                    <ul className="gsap-reveal mt-12 grid gap-8 border-t border-line pt-8 md:grid-cols-3 hscroll:mt-10">
                        {principles.map((principle, i) => (
                            <li key={principle.title}>
                                <span className="font-mono text-xs text-accent-ink">{pad(i + 1)}</span>
                                <h3 className="mt-3 font-wide text-h3 font-semibold">{principle.title}</h3>
                                <p className="mt-2 leading-relaxed text-fg-muted">{principle.desc}</p>
                            </li>
                        ))}
                    </ul>
                    <div className="mt-12 flex flex-wrap items-center gap-x-8 gap-y-4 hscroll:mt-10">
                        <BookCallButton size="lg" />
                        <ArrowLink to="/services#process">How we work</ArrowLink>
                    </div>
                </div>
            </Panel>

            {(team.length > 0 || showPlaceholders) && (
                <Panel id="team">
                    <div className={panelInner}>
                        <SectionHeader eyebrow="Team" title="The people you'll work with." />
                        <ul className="gsap-reveal mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4 hscroll:mt-10">
                            {team.length > 0
                                ? team.map((member) => (
                                      <li key={member.name}>
                                          <img
                                              src={member.photo}
                                              alt={member.name}
                                              loading="lazy"
                                              className="aspect-[4/5] w-full rounded-xl object-cover hscroll:aspect-auto hscroll:h-[34vh]"
                                          />
                                          <p className="mt-4 font-semibold">{member.name}</p>
                                          <p className="text-sm text-fg-muted">{member.role}</p>
                                          <p className="mt-2 text-sm text-fg-muted">{member.bio}</p>
                                      </li>
                                  ))
                                : ['a', 'b', 'c', 'd'].map((slot) => (
                                      <li key={slot}>
                                          <Placeholder label="Photo" className="aspect-[4/5] hscroll:aspect-auto hscroll:h-[34vh]" />
                                          <Placeholder label="Name, role, one line" className="mt-4 h-14" />
                                      </li>
                                  ))}
                        </ul>
                        {team.length === 0 && (
                            <Placeholder
                                label="Dev only: this panel is hidden in production until app/content/about.ts has the team"
                                className="mt-6 border-none"
                            />
                        )}
                    </div>
                </Panel>
            )}
        </Page>
    );
}

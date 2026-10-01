import ContactForm from '~/components/ContactForm';
import { Page, Panel, panelInner } from '~/components/Panel';
import { BookCallButton } from '~/components/ui/Button';
import Eyebrow from '~/components/ui/Eyebrow';
import { contactIntro, nextSteps } from '~/content/contact';
import { site } from '~/content/site';

const pad = (n: number) => String(n).padStart(2, '0');

export default function ContactSection() {
    return (
        <Page path="/contact" label="Contact">
            <Panel id="contact">
                <div className={panelInner}>
                    <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
                        <div className="lg:col-span-5">
                            <Eyebrow>{contactIntro.eyebrow}</Eyebrow>
                            <h2 className="mt-4 font-wide text-h1 font-semibold text-balance">{contactIntro.title}</h2>
                            <p className="mt-6 text-lede text-pretty text-fg-muted">{contactIntro.lede}</p>

                            <h3 className="mt-10 font-mono text-xs uppercase tracking-[0.16em] text-fg-muted hscroll:mt-8">What happens next</h3>
                            <ol className="mt-4 space-y-3 border-t border-line pt-4">
                                {nextSteps.map((step, i) => (
                                    <li key={step} className="flex gap-4">
                                        <span className="font-mono text-xs leading-6 text-accent-ink">{pad(i + 1)}</span>
                                        <span>{step}</span>
                                    </li>
                                ))}
                            </ol>

                            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 hscroll:mt-6">
                                {/* Without a booking link, "Book a call" would just point back at this form. */}
                                {site.bookingUrl && <BookCallButton />}
                                <p className="text-sm text-fg-muted">
                                    Prefer email?{' '}
                                    <a href={`mailto:${site.email}`} className="font-medium text-accent-ink transition-colors hover:text-fg">
                                        {site.email}
                                    </a>
                                </p>
                            </div>
                        </div>

                        <div className="gsap-reveal lg:col-span-7">
                            <ContactForm />
                        </div>
                    </div>
                </div>
            </Panel>
        </Page>
    );
}

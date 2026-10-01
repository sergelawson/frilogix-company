import { useState, type FormEvent } from 'react';
import { Page, Panel, panelInner } from '~/components/Panel';

const fieldClass =
    'w-full px-0 py-4 hscroll:py-3 bg-transparent border-b border-secondary/30 focus:border-primary outline-none transition-colors text-brand-dark placeholder-brand-gray/50 text-lg';
const labelClass = 'block text-xs font-mono font-bold text-brand-dark uppercase tracking-wider';

export default function ContactSection() {
    const [formState, setFormState] = useState<'idle' | 'loading' | 'success'>('idle');

    // TODO(launch-blocker): this is a mock. Nothing is sent anywhere and every
    // submission is silently discarded. Replace with a React Router `action`
    // export (in routes/contact.tsx) + transactional email before going live.
    // See LAUNCH-AUDIT.md P0 #1.
    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        setFormState('loading');
        setTimeout(() => {
            setFormState('success');
        }, 1500);
    };

    return (
        <Page path="/contact" label="Contact">
            <Panel id="contact" className="bg-brand-light">
                <div className={panelInner}>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 hscroll:gap-20 items-center">
                        <div className="gsap-reveal">
                            <span className="font-mono text-xs font-bold text-white uppercase tracking-widest bg-primary px-3 py-1.5 mb-8 inline-block rounded-sm">Contact</span>
                            <h2 className="text-6xl md:text-8xl hscroll:text-[clamp(3.5rem,9vh,6rem)] font-light text-brand-dark mb-12 hscroll:mb-8 leading-tight">Let&apos;s build <br />something real.</h2>
                            <p className="text-2xl hscroll:text-xl text-brand-gray mb-20 hscroll:mb-10 leading-relaxed font-light max-w-md">
                                From MVP to Enterprise Scale. We are ready to engineer your vision.
                            </p>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-10 border-t border-secondary/30 pt-10 hscroll:pt-8">
                                <div>
                                    <h3 className="font-mono text-xs uppercase text-brand-gray mb-2">Email</h3>
                                    <p className="text-2xl text-primary font-light">hello@frilogix.com</p>
                                </div>
                                <div>
                                    <h3 className="font-mono text-xs uppercase text-brand-gray mb-2">Office</h3>
                                    <p className="text-2xl text-primary font-light">San Francisco, CA</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-surface p-12 md:p-16 hscroll:p-10 border border-secondary/20 studio-shadow gsap-reveal">
                            {formState === 'success' ? (
                                <div className="text-center py-24 hscroll:py-16">
                                    <div className="w-20 h-20 bg-secondary/20 text-primary rounded-full flex items-center justify-center mx-auto mb-10">
                                        <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                    <h3 className="text-3xl font-normal text-brand-dark mb-6">Inquiry Sent</h3>
                                    <p className="text-brand-gray font-light mb-10 text-lg">We will review your request and respond within 24 hours.</p>
                                    <button
                                        onClick={() => setFormState('idle')}
                                        className="text-primary font-medium border-b border-primary hover:border-secondary transition-colors"
                                    >
                                        Send another
                                    </button>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-10 hscroll:space-y-6">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-10 hscroll:gap-8">
                                        <div className="space-y-3 hscroll:space-y-2">
                                            <label htmlFor="name" className={labelClass}>Full Name</label>
                                            <input id="name" name="name" required type="text" autoComplete="name" className={fieldClass} placeholder="Enter name" />
                                        </div>
                                        <div className="space-y-3 hscroll:space-y-2">
                                            <label htmlFor="email" className={labelClass}>Email</label>
                                            <input id="email" name="email" required type="email" autoComplete="email" className={fieldClass} placeholder="Enter email" />
                                        </div>
                                    </div>
                                    <div className="space-y-3 hscroll:space-y-2">
                                        <label htmlFor="company" className={labelClass}>Company</label>
                                        <input id="company" name="company" type="text" autoComplete="organization" className={fieldClass} placeholder="Company name" />
                                    </div>
                                    <div className="space-y-3 hscroll:space-y-2">
                                        <label htmlFor="details" className={labelClass}>Details</label>
                                        <textarea id="details" name="details" required rows={4} className={`${fieldClass} resize-none hscroll:h-28`} placeholder="Project description..."></textarea>
                                    </div>
                                    <div className="pt-8 hscroll:pt-4">
                                        <button
                                            disabled={formState === 'loading'}
                                            type="submit"
                                            className="w-full py-5 hscroll:py-4 bg-primary text-white font-medium text-lg hover:bg-primary-dark transition-colors flex items-center justify-center shadow-lg shadow-primary/20"
                                        >
                                            {formState === 'loading' ? 'Processing...' : 'Send Inquiry'}
                                        </button>
                                    </div>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            </Panel>
        </Page>
    );
}

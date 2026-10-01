import { useState, type FormEvent } from 'react';
import type { Route } from './+types/contact';

export const meta: Route.MetaFunction = () => [
    { title: 'Contact Frilogix — Start Your Project' },
    {
        name: 'description',
        content:
            'Tell us about your project. Frilogix takes software and AI engineering work from MVP to enterprise scale. Get a response within 24 hours.',
    },
];

export default function Contact() {
    const [formState, setFormState] = useState<'idle' | 'loading' | 'success'>('idle');

    // TODO(launch-blocker): this is a mock. Nothing is sent anywhere and every
    // submission is silently discarded. Replace with a React Router `action`
    // export + transactional email before going live. See LAUNCH-AUDIT.md P0 #1.
    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        setFormState('loading');
        setTimeout(() => {
            setFormState('success');
        }, 1500);
    };

    return (
        <div className="pt-32 pb-20 bg-brand-light min-h-screen flex items-center">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-24">
                    <div>
                        <span className="font-mono text-xs font-bold text-white uppercase tracking-widest bg-primary px-3 py-1.5 mb-8 inline-block rounded-sm">Contact</span>
                        <h1 className="text-6xl md:text-8xl font-light text-brand-dark mb-12 leading-tight">Let&apos;s build <br />something real.</h1>
                        <p className="text-2xl text-brand-gray mb-20 leading-relaxed font-light max-w-md">
                            From MVP to Enterprise Scale. We are ready to engineer your vision.
                        </p>

                        <div className="space-y-10 border-t border-secondary/30 pt-10">
                            <div>
                                <h4 className="font-mono text-xs uppercase text-brand-gray mb-2">Email</h4>
                                <p className="text-2xl text-primary font-light">hello@frilogix.com</p>
                            </div>
                            <div>
                                <h4 className="font-mono text-xs uppercase text-brand-gray mb-2">Office</h4>
                                <p className="text-2xl text-primary font-light">San Francisco, CA</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-surface p-12 md:p-16 border border-secondary/20 studio-shadow">
                        {formState === 'success' ? (
                            <div className="text-center py-24">
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
                            <form onSubmit={handleSubmit} className="space-y-10">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
                                    <div className="space-y-3">
                                        <label htmlFor="name" className="block text-xs font-mono font-bold text-brand-dark uppercase tracking-wider">Full Name</label>
                                        <input id="name" name="name" required type="text" autoComplete="name" className="w-full px-0 py-4 bg-transparent border-b border-secondary/30 focus:border-primary outline-none transition-colors text-brand-dark placeholder-brand-gray/50 text-lg" placeholder="Enter name" />
                                    </div>
                                    <div className="space-y-3">
                                        <label htmlFor="email" className="block text-xs font-mono font-bold text-brand-dark uppercase tracking-wider">Email</label>
                                        <input id="email" name="email" required type="email" autoComplete="email" className="w-full px-0 py-4 bg-transparent border-b border-secondary/30 focus:border-primary outline-none transition-colors text-brand-dark placeholder-brand-gray/50 text-lg" placeholder="Enter email" />
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <label htmlFor="company" className="block text-xs font-mono font-bold text-brand-dark uppercase tracking-wider">Company</label>
                                    <input id="company" name="company" type="text" autoComplete="organization" className="w-full px-0 py-4 bg-transparent border-b border-secondary/30 focus:border-primary outline-none transition-colors text-brand-dark placeholder-brand-gray/50 text-lg" placeholder="Company name" />
                                </div>
                                <div className="space-y-3">
                                    <label htmlFor="details" className="block text-xs font-mono font-bold text-brand-dark uppercase tracking-wider">Details</label>
                                    <textarea id="details" name="details" required rows={4} className="w-full px-0 py-4 bg-transparent border-b border-secondary/30 focus:border-primary outline-none transition-colors text-brand-dark placeholder-brand-gray/50 resize-none text-lg" placeholder="Project description..."></textarea>
                                </div>
                                <div className="pt-8">
                                    <button
                                        disabled={formState === 'loading'}
                                        type="submit"
                                        className="w-full py-5 bg-primary text-white font-medium text-lg hover:bg-primary-dark transition-colors flex items-center justify-center shadow-lg shadow-primary/20"
                                    >
                                        {formState === 'loading' ? 'Processing...' : 'Send Inquiry'}
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

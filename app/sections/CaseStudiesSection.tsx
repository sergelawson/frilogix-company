import { Link } from 'react-router';
import { Page, Panel, panelInner } from '~/components/Panel';

export default function CaseStudiesSection() {
    return (
        <Page path="/case-studies" label="Case Studies">
            <Panel id="case-studies" className="bg-brand-light">
                <div className={`${panelInner} text-center`}>
                    <div className="gsap-reveal">
                        <div className="mb-12 hscroll:mb-10 inline-flex items-center px-4 py-2 rounded-sm bg-white border border-secondary/30 text-primary text-xs font-mono uppercase tracking-widest shadow-sm">
                            Phase 2 Update
                        </div>
                        <h2 className="text-6xl md:text-8xl hscroll:text-[clamp(3.5rem,10vh,6rem)] font-light text-brand-dark mb-10 tracking-tight">Success Stories <br /><span className="text-primary font-medium">Coming Soon</span></h2>
                        <p className="text-2xl hscroll:text-xl text-brand-gray max-w-3xl mx-auto mb-16 hscroll:mb-12 font-light leading-relaxed">
                            We&apos;re currently documenting our recent wins with startups and enterprises. Check back soon for deep dives into our technical architecture.
                        </p>
                        <Link to="/contact" className="inline-block px-12 py-5 bg-primary text-white font-medium text-lg rounded-sm shadow-xl shadow-primary/20 hover:bg-primary-dark transition-all">
                            Discuss Your Success Story
                        </Link>
                    </div>
                </div>
            </Panel>
        </Page>
    );
}

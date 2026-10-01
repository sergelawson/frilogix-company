import { Page, Panel, panelInner } from '~/components/Panel';

const methodology = [
    { title: "Pragmatic Excellence", desc: "Solutions that work in production. We prioritize robustness over academic perfection." },
    { title: "Radical Transparency", desc: "Honest timelines. Clear trade-offs. We operate as a direct extension of your team." },
    { title: "Continuous Innovation", desc: "Staying at the bleeding edge so our clients don't have to." }
];

export default function AboutSection() {
    return (
        <Page path="/about" label="About">
            <Panel id="about" className="bg-brand-light">
                <div className={panelInner}>
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-20 hscroll:gap-16 items-center">
                        <div className="lg:col-span-7 gsap-reveal">
                            <span className="font-mono text-xs font-bold text-primary uppercase tracking-widest mb-8 block">Our Mission</span>
                            <h2 className="text-5xl md:text-8xl hscroll:text-[clamp(3rem,8vh,5.5rem)] font-light text-brand-dark mb-12 hscroll:mb-10 leading-tight text-balance">
                                Building the foundation for <br />
                                <span className="font-medium border-b-2 border-secondary pb-2">Digital Excellence.</span>
                            </h2>
                            <p className="text-2xl hscroll:text-xl text-brand-gray leading-relaxed font-light max-w-3xl">
                                Frilogix bridges the gap between high-level business strategy and deep technical execution through sustainable, high-performance engineering.
                            </p>
                        </div>
                        <div className="lg:col-span-5 gsap-reveal">
                            <div className="w-full aspect-[4/5] hscroll:w-auto hscroll:h-[58vh] hscroll:ml-auto bg-gray-200 grayscale opacity-90 relative overflow-hidden">
                                {/* TODO: replace placeholder stock image before launch */}
                                <img
                                    src="https://picsum.photos/seed/architecture/800/1000"
                                    alt="Clean Architecture"
                                    loading="lazy"
                                    className="absolute inset-0 w-full h-full object-cover mix-blend-multiply"
                                />
                                <div className="absolute inset-0 bg-primary/10"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </Panel>

            <Panel id="methodology" className="bg-brand-light">
                <div className={panelInner}>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 hscroll:gap-16 items-center">
                        <div className="gsap-reveal">
                            <h3 className="text-4xl font-light text-brand-dark mb-12 hscroll:mb-10">The Methodology</h3>
                            <div className="space-y-16 hscroll:space-y-10">
                                {methodology.map((item, i) => (
                                    <div key={i}>
                                        <h4 className="text-2xl font-medium text-primary mb-4 hscroll:mb-3 flex items-center">
                                            <span className="w-2 h-2 bg-secondary rounded-full mr-4"></span>
                                            {item.title}
                                        </h4>
                                        <p className="text-brand-gray font-light pl-6 border-l border-secondary/30 ml-1 text-lg leading-relaxed">
                                            {item.desc}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="bg-surface p-16 md:p-24 hscroll:p-14 border border-secondary/20 text-center gsap-reveal studio-shadow">
                            <h3 className="text-4xl md:text-5xl font-light text-brand-dark mb-10 hscroll:mb-8">Global Reach. Local Precision.</h3>
                            <p className="text-brand-gray font-light max-w-3xl mx-auto mb-16 hscroll:mb-10 text-xl">
                                A remote-first team of elite engineers, designers, and AI researchers working from three continents to deliver world-class products.
                            </p>
                            <div className="flex justify-center space-x-3">
                                <span className="w-2.5 h-2.5 rounded-full bg-primary"></span>
                                <span className="w-2.5 h-2.5 rounded-full bg-primary/40"></span>
                                <span className="w-2.5 h-2.5 rounded-full bg-primary/20"></span>
                            </div>
                        </div>
                    </div>
                </div>
            </Panel>
        </Page>
    );
}

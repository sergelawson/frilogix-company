import { useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type { Route } from './+types/about';

export const meta: Route.MetaFunction = () => [
    { title: 'About Frilogix — Software & AI Engineering Team' },
    {
        name: 'description',
        content:
            'Frilogix bridges high-level business strategy and deep technical execution. A remote-first team of engineers, designers, and AI researchers building production software.',
    },
];

export default function About() {
    useEffect(() => {
        gsap.registerPlugin(ScrollTrigger);

        const reveals = gsap.utils.toArray('.gsap-reveal') as HTMLElement[];
        reveals.forEach((elem) => {
            gsap.fromTo(elem, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 1, ease: "power2.out", scrollTrigger: { trigger: elem, start: "top 85%" } });
        });

        return () => {
            ScrollTrigger.getAll().forEach(trigger => trigger.kill());
        };
    }, []);

    return (
        <div className="pt-40 pb-20 bg-brand-light min-h-screen">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                <div className="max-w-5xl mb-40 gsap-reveal">
                    <span className="font-mono text-xs font-bold text-primary uppercase tracking-widest mb-8 block">Our Mission</span>
                    <h1 className="text-5xl md:text-8xl font-light text-brand-dark mb-12 leading-tight">
                        Building the foundation for <br />
                        <span className="font-medium border-b-2 border-secondary pb-2">Digital Excellence.</span>
                    </h1>
                    <p className="text-2xl text-brand-gray leading-relaxed font-light max-w-3xl">
                        Frilogix bridges the gap between high-level business strategy and deep technical execution through sustainable, high-performance engineering.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 mb-40">
                    <div className="gsap-reveal">
                        <div className="w-full aspect-[4/5] bg-gray-200 grayscale opacity-90 relative overflow-hidden">
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
                    <div className="flex flex-col justify-center gsap-reveal">
                        <h2 className="text-4xl font-light text-brand-dark mb-12">The Methodology</h2>
                        <div className="space-y-16">
                            {[
                                { title: "Pragmatic Excellence", desc: "Solutions that work in production. We prioritize robustness over academic perfection." },
                                { title: "Radical Transparency", desc: "Honest timelines. Clear trade-offs. We operate as a direct extension of your team." },
                                { title: "Continuous Innovation", desc: "Staying at the bleeding edge so our clients don't have to." }
                            ].map((item, i) => (
                                <div key={i}>
                                    <h3 className="text-2xl font-medium text-primary mb-4 flex items-center">
                                        <span className="w-2 h-2 bg-secondary rounded-full mr-4"></span>
                                        {item.title}
                                    </h3>
                                    <p className="text-brand-gray font-light pl-6 border-l border-secondary/30 ml-1 text-lg leading-relaxed">
                                        {item.desc}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="bg-surface p-16 md:p-32 border border-secondary/20 text-center gsap-reveal studio-shadow">
                    <h2 className="text-4xl md:text-6xl font-light text-brand-dark mb-10">Global Reach. Local Precision.</h2>
                    <p className="text-brand-gray font-light max-w-3xl mx-auto mb-16 text-xl">
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
    );
}

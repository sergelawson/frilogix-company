import { useEffect, useRef } from 'react';
import { Link } from 'react-router';
import { gsap } from 'gsap';
import Particles from '~/components/Particles';
import ImageParticles from '~/components/ImageParticles';
import { Page, Panel, panelInner } from '~/components/Panel';

const values = [
    { title: "Precision", text: "Clean codebases with zero redundancy." },
    { title: "Intelligence", text: "AI that enhances, not replaces." },
    { title: "Scale", text: "Infrastructure that grows organically." }
];

const stack = ['React', 'Node.js', 'Go', 'Python', 'AWS', 'PostgreSQL', 'LangChain', 'OpenAI'];

export default function HomeSection() {
    const heroRef = useRef<HTMLDivElement>(null);
    const textRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

        // Initial Load Animations
        const ctx = gsap.context(() => {
            gsap.fromTo(".hero-animate",
                { opacity: 0, y: 30 },
                { opacity: 1, y: 0, duration: 1.2, stagger: 0.1, delay: 0.2, ease: "power3.out" }
            );
        }, heroRef);

        // Mouse Parallax Effect
        const handleMouseMove = (e: MouseEvent) => {
            if (!textRef.current) return;
            const x = (e.clientX / window.innerWidth - 0.5) * 20;
            const y = (e.clientY / window.innerHeight - 0.5) * 20;
            gsap.to(textRef.current, { x, y, duration: 1, ease: "power2.out" });
        };

        window.addEventListener('mousemove', handleMouseMove);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            ctx.revert();
        };
    }, []);

    return (
        <Page path="/" label="Home">
            {/* Hero - Swiss Grid Style with Particles */}
            <Panel
                id="home"
                ref={heroRef}
                className="flex items-center min-h-[90vh] hscroll:min-h-0 bg-brand-light border-b border-secondary/30 hscroll:border-b-0"
            >
                <Particles />

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full pt-32 pb-20 lg:pt-40 lg:pb-32 hscroll:pt-28 hscroll:pb-16">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-end">
                        <div className="lg:col-span-8" ref={textRef}>
                            <h1 className="hero-animate text-6xl md:text-8xl lg:text-9xl hscroll:text-[clamp(4.5rem,13vh,8rem)] font-light text-primary tracking-tight leading-[1] mb-12 hscroll:mb-10">
                                Engineering <br />
                                <span className="font-medium text-brand-dark">Intelligent</span> <br />
                                Futures.
                            </h1>
                            <div className="hero-animate flex flex-col sm:flex-row gap-6 mt-16 hscroll:mt-12">
                                <Link to="/contact" className="inline-flex items-center justify-center px-10 py-5 bg-primary text-white font-medium text-sm hover:bg-primary-dark transition-all rounded-sm min-w-[180px] shadow-lg shadow-primary/20 hover:shadow-xl hover:-translate-y-1">
                                    Start Project
                                </Link>
                                <Link to="/services" className="inline-flex items-center justify-center px-10 py-5 bg-transparent border border-primary/30 text-primary font-medium text-sm hover:border-primary transition-all rounded-sm min-w-[180px] backdrop-blur-sm">
                                    Explore Services
                                </Link>
                            </div>
                        </div>
                        <div className="lg:col-span-4 hero-animate hidden lg:flex flex-col justify-end min-h-[500px] hscroll:min-h-0 pb-8">
                            <div className="w-full flex-1 flex items-center justify-center">
                                <ImageParticles className="h-96 hscroll:h-[34vh]" />
                            </div>
                            <div className="w-full mt-6 pl-6 border-l border-secondary/50 relative">
                                <span className="absolute -left-[3px] top-0 w-[5px] h-[5px] bg-primary rounded-full"></span>
                                <span className="block text-xs font-mono text-secondary mb-3 tracking-widest uppercase">
                                    OUR COMPANY
                                </span>
                                <p className="text-brand-gray text-base font-light leading-relaxed">
                                    Frilogix is a software &amp; AI engineering company building high&#8209;performance web, mobile, and AI&#8209;powered applications for startups and forward&#8209;thinking businesses.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Horizontal mode only: tell visitors that scrolling moves sideways. */}
                <div aria-hidden="true" className="hidden hscroll:flex absolute bottom-10 right-8 z-10 items-center gap-3 font-mono text-xs uppercase tracking-widest text-brand-gray">
                    Scroll
                    <svg className="w-5 h-5 text-primary animate-nudge-x" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                </div>
            </Panel>

            {/* The Advantage - Studio Clean, plus the Tech Stack */}
            <Panel id="approach" className="bg-surface">
                <div className={panelInner}>
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-end">
                        <div className="lg:col-span-4 gsap-reveal">
                            <h2 className="text-5xl hscroll:text-[clamp(2.5rem,7vh,3rem)] font-light text-brand-dark mb-8">Sustainable Engineering</h2>
                            <p className="text-2xl hscroll:text-xl text-brand-gray font-light leading-relaxed">
                                We treat code as a resource. Efficient algorithms mean less compute, lower costs, and a smaller carbon footprint.
                            </p>
                        </div>

                        <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-6">
                            {values.map((item, idx) => (
                                <div key={idx} className="gsap-reveal bg-brand-light p-10 lg:p-8 rounded-sm studio-shadow flex flex-col justify-between min-h-80 hscroll:min-h-[clamp(16rem,40vh,22rem)] group hover:-translate-y-2 transition-transform duration-500">
                                    <div>
                                        <div className="w-16 h-16 hscroll:w-12 hscroll:h-12 rounded-full bg-secondary/20 flex items-center justify-center mb-10 hscroll:mb-6 text-primary">
                                            <div className="w-2 h-2 bg-primary rounded-full group-hover:scale-150 transition-transform duration-500"></div>
                                        </div>
                                        <h3 className="text-3xl hscroll:text-2xl font-light text-brand-dark mb-6 hscroll:mb-4">{item.title}</h3>
                                        <p className="text-brand-gray font-light leading-relaxed">{item.text}</p>
                                    </div>
                                    <div className="w-full h-px bg-secondary/30 mt-8 group-hover:bg-primary/30 transition-colors"></div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Tech Stack - Monochromatic */}
                    <div className="gsap-reveal mt-24 hscroll:mt-14 pt-12 hscroll:pt-10 border-t border-secondary/30 flex flex-col md:flex-row md:items-baseline gap-8 md:gap-16">
                        <h3 className="text-sm font-mono uppercase tracking-widest text-primary/60 whitespace-nowrap">Technical Stack</h3>
                        <div className="flex flex-wrap gap-x-12 gap-y-4">
                            {stack.map((tech) => (
                                <span key={tech} className="text-3xl hscroll:text-2xl font-light text-brand-gray/50 hover:text-primary transition-colors cursor-default">{tech}</span>
                            ))}
                        </div>
                    </div>
                </div>
            </Panel>
        </Page>
    );
}

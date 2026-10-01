import { useEffect } from 'react';
import { Link } from 'react-router';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type { Route } from './+types/services';

export const meta: Route.MetaFunction = () => [
    { title: 'Services — Web, Mobile & AI Engineering | Frilogix' },
    {
        name: 'description',
        content:
            'React frontends, Go and Node.js backends, React Native apps, and AI engineering — RAG pipelines, multi-agent systems, and copilots. Precision engineering for the modern web.',
    },
];

const services = [
    {
        id: 'frontend',
        title: 'Frontend Development',
        stack: 'React / Next.js',
        desc: 'Pixel-perfect interfaces. We build modern web applications that prioritize user experience and performance efficiency.',
        features: ['SEO Optimized', 'Mobile Responsive', 'WCAG Compliant'],
    },
    {
        id: 'backend',
        title: 'Backend Systems',
        stack: 'Go / Node.js',
        desc: 'Robust architectures. We specialize in distributed systems and high-performance APIs for scalable business logic.',
        features: ['Microservices', 'Cloud Native', 'Real-time Data'],
    },
    {
        id: 'mobile',
        title: 'Mobile Engineering',
        stack: 'React Native',
        desc: 'Cross-platform efficiency. Native-quality mobile applications that utilize device capabilities seamlessly.',
        features: ['iOS & Android', 'Offline First', 'High Performance'],
    },
    {
        id: 'ai-engineering',
        title: 'AI Engineering',
        stack: 'LLM / RAG / Python',
        desc: 'Context-aware systems. We build retrieval, agent, and copilot architectures on top of large language models — engineered for production, not demos.',
        features: ['RAG Pipelines', 'Multi-Agent Systems', 'AI Copilots'],
    },
];

const aiCapabilities = [
    { title: 'RAG Pipelines', desc: 'Answers grounded in your own data, with citations.', icon: '01' },
    { title: 'Multi-Agent Systems', desc: 'Collaborative agents that split and verify work.', icon: '02' },
    { title: 'Vector Databases', desc: 'Semantic search that stays fast as corpora grow.', icon: '03' },
    { title: 'Orchestration', desc: 'Deterministic, testable LLM pipelines.', icon: '04' },
    { title: 'Fine-Tuning', desc: 'Domain adaptation for your vocabulary and tone.', icon: '05' },
    { title: 'Copilots', desc: 'Assistive interfaces embedded in your product.', icon: '06' },
];

export default function Services() {
    useEffect(() => {
        gsap.registerPlugin(ScrollTrigger);

        const reveals = gsap.utils.toArray('.gsap-reveal') as HTMLElement[];
        reveals.forEach((elem) => {
            gsap.fromTo(elem,
                { opacity: 0, y: 30 },
                { opacity: 1, y: 0, duration: 1, ease: "power2.out", scrollTrigger: { trigger: elem, start: "top 85%" } }
            );
        });

        return () => {
            ScrollTrigger.getAll().forEach(trigger => trigger.kill());
        };
    }, []);

    return (
        <div className="pt-40 pb-20 bg-brand-light min-h-screen">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-32">
                <div className="border-b border-secondary/30 pb-10">
                    <h1 className="text-6xl md:text-8xl font-light text-primary mb-6 tracking-tight">Services</h1>
                    <p className="text-2xl text-brand-gray font-light max-w-3xl">
                        Precision engineering for the modern web — from interface to infrastructure to intelligence.
                    </p>
                </div>
            </div>

            {/* Core service cards */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {services.map((service, idx) => (
                        <div key={service.id} id={service.id} className="gsap-reveal scroll-mt-32 bg-surface p-12 studio-shadow border border-secondary/10 flex flex-col justify-between group hover:border-primary/30 transition-colors duration-500">
                            <div className="mb-12">
                                <div className="flex justify-between items-start mb-8">
                                    <span className="font-mono text-xs text-white uppercase tracking-widest bg-primary px-3 py-1.5 rounded-sm">{service.stack}</span>
                                    <span className="text-secondary/60 font-mono text-lg">0{idx + 1}</span>
                                </div>
                                <h2 className="text-4xl font-light text-brand-dark mb-6 group-hover:text-primary transition-colors">{service.title}</h2>
                                <p className="text-brand-gray font-light leading-relaxed mb-10 text-lg">
                                    {service.desc}
                                </p>
                                <ul className="space-y-4">
                                    {service.features.map((f, i) => (
                                        <li key={i} className="flex items-center text-sm text-brand-dark font-medium tracking-wide">
                                            <span className="w-2 h-2 bg-secondary rounded-full mr-4"></span>
                                            {f}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="w-full flex justify-end">
                                <Link
                                    to={service.id === 'ai-engineering' ? '/services#intelligent-systems' : '/contact'}
                                    aria-label={service.id === 'ai-engineering' ? 'Read more about AI Engineering' : `Discuss ${service.title}`}
                                    className="w-12 h-12 border border-secondary/30 rounded-full flex items-center justify-center group-hover:bg-secondary group-hover:border-secondary group-hover:text-white transition-all text-primary"
                                >
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                    </svg>
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* AI Engineering — deep dive (merged in from the former standalone page) */}
            <div id="intelligent-systems" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-40 scroll-mt-32">
                <div className="flex flex-col lg:flex-row lg:items-end justify-between border-b border-secondary/30 pb-12 gap-10 mb-24 gsap-reveal">
                    <div>
                        <div className="flex items-center space-x-3 mb-6">
                            <span className="w-2.5 h-2.5 bg-secondary rounded-full animate-pulse"></span>
                            <span className="font-mono text-xs font-bold text-primary uppercase tracking-widest">In Depth / AI Engineering</span>
                        </div>
                        <h2 className="text-5xl md:text-7xl font-light text-brand-dark tracking-tight">
                            Intelligent <br />Systems
                        </h2>
                    </div>
                    <p className="text-2xl text-brand-gray font-light max-w-xl leading-relaxed">
                        Most AI projects stall between prototype and production. We build the retrieval, evaluation, and guardrail layers that get them across.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-secondary/20 border border-secondary/20 mb-32">
                    {aiCapabilities.map((item, idx) => (
                        <div key={idx} className="gsap-reveal bg-surface p-12 hover:bg-secondary/5 transition-colors aspect-square flex flex-col justify-between group">
                            <span className="font-mono text-xs text-brand-gray group-hover:text-primary transition-colors">{item.icon}</span>
                            <div>
                                <h3 className="text-2xl font-normal text-brand-dark mb-3">{item.title}</h3>
                                <p className="text-brand-gray font-light text-sm">{item.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="bg-primary text-white p-12 md:p-24 rounded-sm gsap-reveal shadow-2xl shadow-primary/20">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                        <div>
                            <h3 className="text-4xl font-light mb-10">How we build it</h3>
                            <p className="text-secondary/90 text-xl mb-12 font-light leading-relaxed">
                                We treat AI as a deterministic engineering component, not a black box. Every system ships with evaluation harnesses, tracing, and a fallback path.
                            </p>
                            <ul className="space-y-6">
                                {['Evaluated before it ships', 'Privacy-first architecture', 'Low-latency by design', 'Model agnostic — no lock-in'].map((point, i) => (
                                    <li key={i} className="flex items-center border-b border-white/10 pb-4">
                                        <span className="text-secondary font-mono text-xs mr-6">{">>>"}</span>
                                        <span className="font-light tracking-wide">{point}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="relative">
                            <div className="aspect-square bg-white/5 rounded-full border border-white/10 flex items-center justify-center p-12 relative overflow-hidden">
                                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-secondary/20 to-transparent"></div>
                                <div className="font-mono text-xs text-secondary space-y-3 z-10 w-full">
                                    <div className="flex justify-between border-b border-secondary/20 pb-2 mb-6 text-white">
                                        <span>AGENT_STATUS</span>
                                        <span>ACTIVE</span>
                                    </div>
                                    <div className="opacity-50">Initializing vector store...</div>
                                    <div className="opacity-70">Loading embeddings...</div>
                                    <div className="text-white">Context retrieved.</div>
                                    <div className="mt-6 p-4 bg-white/10 border-l-2 border-secondary text-white/90">
                                        Generating optimized response...
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Closing CTA */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-40">
                <div className="border-t border-secondary/30 pt-24 text-center gsap-reveal">
                    <h2 className="text-4xl md:text-6xl font-light text-brand-dark mb-8">Have a project in mind?</h2>
                    <p className="text-xl text-brand-gray font-light mb-14 max-w-2xl mx-auto leading-relaxed">
                        Tell us what you&apos;re building. We&apos;ll come back with a technical approach and an honest timeline.
                    </p>
                    <Link
                        to="/contact"
                        className="inline-block px-12 py-5 bg-primary text-white font-medium text-lg rounded-sm shadow-xl shadow-primary/20 hover:bg-primary-dark transition-all hover:-translate-y-1 transform duration-300"
                    >
                        Start a Conversation
                    </Link>
                </div>
            </div>
        </div>
    );
}

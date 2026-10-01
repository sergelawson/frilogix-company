import { Link } from 'react-router';
import { Page, Panel, panelInner } from '~/components/Panel';

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

export default function ServicesSection() {
    return (
        <Page path="/services" label="Services">
            {/* Core service cards */}
            <Panel id="services" className="bg-brand-light">
                <div className={panelInner}>
                    <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 lg:gap-16 border-b border-secondary/30 pb-10 hscroll:pb-6 mb-16 hscroll:mb-8 gsap-reveal">
                        <h2 className="text-6xl md:text-8xl hscroll:text-[clamp(3.5rem,9vh,6rem)] font-light text-primary tracking-tight">Services</h2>
                        <p className="text-2xl hscroll:text-xl text-brand-gray font-light max-w-3xl lg:max-w-xl">
                            Precision engineering for the modern web — from interface to infrastructure to intelligence.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                        {services.map((service) => (
                            <div key={service.id} className="gsap-reveal bg-surface p-10 xl:p-8 studio-shadow border border-secondary/10 flex flex-col group hover:border-primary/30 transition-colors duration-500">
                                <div className="flex justify-between items-start gap-4 mb-8 hscroll:mb-5">
                                    <span className="font-mono text-xs text-white uppercase tracking-widest xl:tracking-wider whitespace-nowrap bg-primary px-3 py-1.5 rounded-sm">{service.stack}</span>
                                    <Link
                                        to={service.id === 'ai-engineering' ? '/services#intelligent-systems' : '/contact'}
                                        aria-label={service.id === 'ai-engineering' ? 'Read more about AI Engineering' : `Discuss ${service.title}`}
                                        className="shrink-0 w-10 h-10 border border-secondary/30 rounded-full flex items-center justify-center group-hover:bg-secondary group-hover:border-secondary group-hover:text-white transition-all text-primary"
                                    >
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                        </svg>
                                    </Link>
                                </div>
                                <h3 className="text-3xl xl:text-2xl font-light text-brand-dark mb-4 group-hover:text-primary transition-colors">{service.title}</h3>
                                <p className="text-brand-gray font-light leading-relaxed mb-8 hscroll:mb-5 text-lg hscroll:text-sm">
                                    {service.desc}
                                </p>
                                <ul className="mt-auto space-y-3 hscroll:space-y-0 hscroll:flex hscroll:flex-wrap hscroll:gap-x-5 hscroll:gap-y-2">
                                    {service.features.map((f, i) => (
                                        <li key={i} className="flex items-center text-sm text-brand-dark font-medium tracking-wide">
                                            <span className="w-2 h-2 bg-secondary rounded-full mr-3"></span>
                                            {f}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>
            </Panel>

            {/* AI Engineering — deep dive (merged in from the former standalone page) */}
            <Panel id="intelligent-systems" className="bg-brand-light">
                <div className={panelInner}>
                    <div className="flex flex-col lg:flex-row lg:items-end justify-between border-b border-secondary/30 pb-12 hscroll:pb-6 gap-10 mb-24 hscroll:mb-8 gsap-reveal">
                        <div>
                            <div className="flex items-center space-x-3 mb-6 hscroll:mb-4">
                                <span className="w-2.5 h-2.5 bg-secondary rounded-full animate-pulse"></span>
                                <span className="font-mono text-xs font-bold text-primary uppercase tracking-widest">In Depth / AI Engineering</span>
                            </div>
                            <h2 className="text-5xl md:text-7xl hscroll:text-[clamp(3rem,8vh,4.5rem)] font-light text-brand-dark tracking-tight">
                                Intelligent <br />Systems
                            </h2>
                        </div>
                        <p className="text-2xl hscroll:text-xl text-brand-gray font-light max-w-xl leading-relaxed">
                            Most AI projects stall between prototype and production. We build the retrieval, evaluation, and guardrail layers that get them across.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-secondary/20 border border-secondary/20">
                        {aiCapabilities.map((item, idx) => (
                            <div key={idx} className="gsap-reveal bg-surface p-12 hscroll:p-7 hover:bg-secondary/5 transition-colors aspect-square hscroll:aspect-auto hscroll:min-h-[17vh] flex flex-col justify-between gap-6 hscroll:gap-4 group">
                                <span className="font-mono text-xs text-brand-gray group-hover:text-primary transition-colors">{item.icon}</span>
                                <div>
                                    <h3 className="text-2xl font-normal text-brand-dark mb-3">{item.title}</h3>
                                    <p className="text-brand-gray font-light text-sm">{item.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </Panel>

            <Panel id="how-we-build" className="bg-primary text-white">
                <div className={panelInner}>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 hscroll:gap-16 items-center gsap-reveal">
                        <div>
                            <h3 className="text-4xl font-light mb-10 hscroll:mb-8">How we build it</h3>
                            <p className="text-secondary/90 text-xl mb-12 hscroll:mb-8 font-light leading-relaxed">
                                We treat AI as a deterministic engineering component, not a black box. Every system ships with evaluation harnesses, tracing, and a fallback path.
                            </p>
                            <ul className="space-y-6 hscroll:space-y-4">
                                {['Evaluated before it ships', 'Privacy-first architecture', 'Low-latency by design', 'Model agnostic — no lock-in'].map((point, i) => (
                                    <li key={i} className="flex items-center border-b border-white/10 pb-4 hscroll:pb-3">
                                        <span className="text-secondary font-mono text-xs mr-6">{">>>"}</span>
                                        <span className="font-light tracking-wide">{point}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="relative">
                            <div className="aspect-square hscroll:w-[min(100%,56vh)] hscroll:mx-auto bg-white/5 rounded-full border border-white/10 flex items-center justify-center p-12 relative overflow-hidden">
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
            </Panel>
        </Page>
    );
}

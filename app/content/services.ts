import { stackIcons } from './stack-icons';

export const servicesIntro = {
    eyebrow: 'Services',
    title: 'From interface to infrastructure to intelligence.',
    lede: 'Frontend, backend, mobile and AI engineering under one roof, so the product, the platform and the model are designed together.',
};

export const services = [
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

export const aiIntro = {
    eyebrow: 'AI engineering',
    title: 'Most AI projects stall between prototype and production.',
    lede: 'We build the retrieval, evaluation, and guardrail layers that get them across, and treat AI as a deterministic engineering component, not a black box.',
};

/** The delivery pipeline drawn on the AI panel, in order. */
export const aiPipeline = [
    { title: 'Retrieval', desc: 'Answers grounded in your own data, with citations.' },
    { title: 'Evaluation', desc: 'Every system is evaluated before it ships.' },
    { title: 'Guardrails', desc: 'Privacy-first, with a fallback path.' },
    { title: 'Tracing', desc: 'Every call observable in production.' },
];

export const aiCapabilities = [
    { title: 'RAG Pipelines', desc: 'Answers grounded in your own data, with citations.' },
    { title: 'Multi-Agent Systems', desc: 'Collaborative agents that split and verify work.' },
    { title: 'Vector Databases', desc: 'Semantic search that stays fast as corpora grow.' },
    { title: 'Orchestration', desc: 'Deterministic, testable LLM pipelines.' },
    { title: 'Fine-Tuning', desc: 'Domain adaptation for your vocabulary and tone.' },
    { title: 'Copilots', desc: 'Assistive interfaces embedded in your product.' },
];

export const aiNote = 'Model agnostic, with no lock-in. Low-latency by design.';

export const processIntro = {
    eyebrow: 'How we work',
    title: 'Evidence early, honest timelines throughout.',
    lede: 'We operate as a direct extension of your team, with clear trade-offs at every step.',
};

/**
 * DRAFT copy — confirm with Frilogix. `duration` stays null until real
 * timeframes are agreed; nothing is shown for it in production.
 */
export const processSteps = [
    { title: 'Discover', desc: 'We map the problem, the users and the constraints, and agree what success looks like.', duration: null as string | null },
    { title: 'Prototype', desc: 'A working slice in front of real users early, so decisions rest on evidence.', duration: null as string | null },
    { title: 'Build', desc: 'Production engineering in short increments, with tests, reviews and honest timelines.', duration: null as string | null },
    { title: 'Operate', desc: 'Monitoring, evaluation and handover — or we stay on as part of your team.', duration: null as string | null },
];

/** Monochrome logos where simple-icons has one; text otherwise. */
export const stack: { name: string; icon: string | null }[] = [
    { name: 'React', icon: stackIcons.react },
    { name: 'Node.js', icon: stackIcons.nodejs },
    { name: 'Go', icon: stackIcons.go },
    { name: 'Python', icon: stackIcons.python },
    { name: 'PostgreSQL', icon: stackIcons.postgresql },
    { name: 'LangChain', icon: stackIcons.langchain },
    { name: 'AWS', icon: null },
    { name: 'OpenAI', icon: null },
];

import { stackIcons } from './stack-icons';

export const servicesIntro = {
    eyebrow: 'Services',
    title: 'From interface to infrastructure to intelligence.',
    lede: 'Frontend, backend, mobile, platform and AI engineering under one roof, so the product, the infrastructure and the model are designed together.',
};

export const services = [
    {
        id: 'frontend',
        layer: 0,
        title: 'Frontend Development',
        stack: 'React / Next.js',
        desc: 'Pixel-perfect interfaces. We build modern web applications that prioritize user experience and performance efficiency.',
        features: ['SEO Optimized', 'Mobile Responsive', 'WCAG Compliant'],
    },
    {
        id: 'backend',
        layer: 1,
        title: 'Backend Systems',
        stack: 'Go / Node.js',
        desc: 'Robust architectures. We specialize in distributed systems and high-performance APIs for scalable business logic.',
        features: ['Microservices', 'Cloud Native', 'Real-time Data'],
    },
    {
        id: 'mobile',
        layer: 0,
        title: 'Mobile Engineering',
        stack: 'React Native',
        desc: 'Cross-platform efficiency. Native-quality mobile applications that utilize device capabilities seamlessly.',
        features: ['iOS & Android', 'Offline First', 'High Performance'],
    },
    {
        id: 'platform',
        layer: 2,
        title: 'Platform Engineering',
        stack: 'AWS / Kubernetes',
        desc: 'Reliable foundations. We build cloud infrastructure, Kubernetes platforms and CI/CD pipelines so teams ship often and recover fast.',
        features: ['DevOps & CI/CD', 'Infrastructure as Code', 'Observability'],
    },
    {
        id: 'ai-engineering',
        layer: 3,
        title: 'AI Engineering',
        stack: 'LLM / RAG / Python',
        desc: 'Context-aware systems. We build retrieval, agent, and copilot architectures on top of large language models — engineered for production, not demos.',
        features: ['RAG Pipelines', 'Multi-Agent Systems', 'AI Copilots'],
    },
];

/**
 * The 3D stack beside the Services title: one plate per layer, top to bottom.
 * `services` above say which plate they sit on (`layer`).
 */
export const servicesStack = {
    layers: [
        { index: '01·03', label: 'Interface' },
        { index: '02', label: 'Backend' },
        { index: '04', label: 'Platform' },
        { index: '05', label: 'Intelligence' },
    ],
    description:
        'An exploded stack of four layers settling into one: interface, backend and platform in solid ink, intelligence in frosted glass, with a request travelling down through every layer and back.',
};

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

/** The 3D bridge beside the AI title: the two cliffs it spans. Its segments are `aiPipeline`, numbered. */
export const aiBridge = {
    ends: ['Prototype', 'Production'],
    description:
        'A bridge between two cliffs, prototype and production: four glass segments, retrieval, evaluation, guardrails and tracing, rise out of the gap, and a request crosses.',
};

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

/** Monochrome logos, drawn in the text colour. React Native's logo is React's. */
export const stack: { name: string; icon: string }[] = [
    { name: 'TypeScript', icon: stackIcons.typescript },
    { name: 'React', icon: stackIcons.react },
    { name: 'React Native', icon: stackIcons.react },
    { name: 'Node.js', icon: stackIcons.nodejs },
    { name: 'Go', icon: stackIcons.go },
    { name: 'Rust', icon: stackIcons.rust },
    { name: 'Python', icon: stackIcons.python },
    { name: 'PostgreSQL', icon: stackIcons.postgresql },
    { name: 'AWS', icon: stackIcons.aws },
    { name: 'Kubernetes', icon: stackIcons.kubernetes },
    { name: 'LangChain', icon: stackIcons.langchain },
    { name: 'OpenAI', icon: stackIcons.openai },
    { name: 'Anthropic', icon: stackIcons.anthropic },
];

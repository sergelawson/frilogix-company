import { stackIcons } from './stack-icons';

export const servicesIntro = {
    eyebrow: 'Services',
    title: 'From interface to infrastructure to intelligence.',
    lede: 'SaaS, mobile, platform, AI engineering and training data under one roof, so the product, the infrastructure and the model are designed together.',
};

/**
 * Columns on the Services panel, in order. Each has a hairline pictogram of
 * what it delivers, keyed by `id` (~/components/art/ServiceGlyph).
 *
 * DRAFT copy for `saas` (merges the former Frontend Development and Backend
 * Systems) and `training-data` (new): confirm with Frilogix.
 */
export const services = [
    {
        id: 'saas',
        title: 'SaaS Development',
        stack: 'React / Node.js / Go',
        desc: 'Web products, front to back. Fast, accessible interfaces on APIs and distributed systems built to scale with your users.',
        features: ['Responsive & Accessible', 'APIs & Microservices', 'Real-time Data'],
    },
    {
        id: 'mobile',
        title: 'Mobile App Development',
        stack: 'React Native',
        desc: 'Cross-platform efficiency. Native-quality mobile applications that utilize device capabilities seamlessly.',
        features: ['iOS & Android', 'Offline First', 'High Performance'],
    },
    {
        id: 'platform',
        title: 'Platform Engineering',
        stack: 'AWS / Kubernetes',
        desc: 'Reliable foundations. We build cloud infrastructure, Kubernetes platforms and CI/CD pipelines so teams ship often and recover fast.',
        features: ['DevOps & CI/CD', 'Infrastructure as Code', 'Observability'],
    },
    {
        id: 'ai-engineering',
        title: 'AI Engineering',
        stack: 'LLM / RAG / Python',
        desc: 'Context-aware systems. We build retrieval, agent, and copilot architectures on top of large language models — engineered for production, not demos.',
        features: ['RAG Pipelines', 'Multi-Agent Systems', 'AI Copilots'],
    },
    {
        id: 'training-data',
        title: 'AI Training Data',
        stack: 'Labeling / Datasets',
        desc: 'Data models learn from. We produce datasets and label data for AI labs, checked for quality before it ships.',
        features: ['Data Labeling', 'Dataset Creation', 'Quality Review'],
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
 * DRAFT copy — confirm with Frilogix. No timeframe per step: durations
 * depend on the project, and the site doesn't promise numbers it can't keep.
 */
export const processSteps = [
    { title: 'Discover', desc: 'We map the problem, the users and the constraints, and agree what success looks like.' },
    { title: 'Prototype', desc: 'A working slice in front of real users early, so decisions rest on evidence.' },
    { title: 'Build', desc: 'Production engineering in short increments, with tests, reviews and honest timelines.' },
    { title: 'Operate', desc: 'Monitoring, evaluation and handover — or we stay on as part of your team.' },
];

/**
 * The stack under "How we work", in four groups that sit under the four steps
 * and echo the services. Monochrome logos, drawn in the text colour. React
 * Native's logo is React's.
 */
export const stack: { label: string; items: { name: string; icon: string }[] }[] = [
    {
        label: 'Apps',
        items: [
            { name: 'TypeScript', icon: stackIcons.typescript },
            { name: 'React', icon: stackIcons.react },
            { name: 'React Native', icon: stackIcons.react },
        ],
    },
    {
        label: 'Backend & data',
        items: [
            { name: 'Node.js', icon: stackIcons.nodejs },
            { name: 'Go', icon: stackIcons.go },
            { name: 'Rust', icon: stackIcons.rust },
            { name: 'Python', icon: stackIcons.python },
            { name: 'PostgreSQL', icon: stackIcons.postgresql },
        ],
    },
    {
        label: 'Platform',
        items: [
            { name: 'AWS', icon: stackIcons.aws },
            { name: 'Kubernetes', icon: stackIcons.kubernetes },
        ],
    },
    {
        label: 'AI',
        items: [
            { name: 'LangChain', icon: stackIcons.langchain },
            { name: 'OpenAI', icon: stackIcons.openai },
            { name: 'Anthropic', icon: stackIcons.anthropic },
        ],
    },
];

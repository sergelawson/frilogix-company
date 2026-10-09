import { site } from './site';

/**
 * The Company page. Written as a short manifesto: what we're building, why,
 * the plan, and who we are. Facts only: no client history, and no names or
 * team claims. Frilogix LLC is the public face; the founder stays unnamed.
 */
export const companyIntro = {
    eyebrow: 'Company',
    title: 'We build software, and the agents inside it, to one standard.',
};

/**
 * The 3D mark beside the title: the X as four arms, matte ink for software and
 * frosted glass for the agents inside it. Callouts in the order top left, top
 * right, bottom right, bottom left.
 */
export const companyMark = {
    labels: ['Interface', 'Models', 'Backend', 'Agents'],
    description:
        'The Frilogix X built from four arms: two solid ink arms for interface and backend, and two frosted glass arms for models and agents.',
} as const;

/** The argument, in order: how it is today, what that costs, what we believe. */
export const companyStory = [
    {
        label: 'Today',
        text: 'A product today is a web app, a mobile app, a backend, the infrastructure under them and, more and more, AI agents that act on their own. Each is its own discipline, and most companies end up hiring for each one separately.',
    },
    {
        label: 'The cost',
        text: 'Products break at the seams. An agent is only as good as the APIs it calls, a model only as reliable as the evaluation around it, an interface only as fast as the system behind it. AI makes those seams more visible and more costly, but it did not create them.',
    },
    {
        label: 'What we believe',
        text: 'We believe the product, the infrastructure and the model should be designed together, not handed between vendors, and that AI deserves the same discipline as the rest of the stack: tests, evaluation, tracing and a way to fall back.',
    },
];

export const plan = {
    eyebrow: 'The plan',
    title: "This is how we're building Frilogix.",
    steps: [
        {
            title: 'Build our own products.',
            desc: 'Uitiful and Vantuu are where we try new models and tools first, with real users and our own money on the line.',
        },
        {
            title: 'Bring what works to yours.',
            desc: 'What survives our products reaches our clients: the patterns, the stack and the guardrails, already tested.',
        },
        {
            title: 'Stay for production.',
            desc: 'Launch is the middle, not the end. We monitor, evaluate and improve, then hand over or stay on as part of your team.',
        },
    ],
};

/** The 3D drawing beside the plan's title: callouts for the experiments, our products, and yours. */
export const planArt = {
    labels: ['Experiments', 'Our products', 'Your product'],
    description:
        'A cloud of experiments streams into a glass block, our products; most drop out, and the three that survive land on a plinth, your product.',
};

export const whoWeAre = `${site.legalName} is a software and AI engineering company based in ${site.location}. We work with startups and scale-ups wherever they are.`;

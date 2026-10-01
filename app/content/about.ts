export const aboutIntro = {
    eyebrow: 'About',
    title: 'Strategy and engineering in the same room.',
    lede: 'Frilogix bridges the gap between high-level business strategy and deep technical execution. A remote-first team of engineers, designers, and AI researchers working from three continents.',
};

export const principles = [
    { title: 'Pragmatic Excellence', desc: 'Solutions that work in production. We prioritize robustness over academic perfection.' },
    { title: 'Radical Transparency', desc: 'Honest timelines. Clear trade-offs. We operate as a direct extension of your team.' },
    { title: 'Continuous Innovation', desc: "Staying at the bleeding edge so our clients don't have to." },
];

/**
 * Real people only. While empty, the Team panel is left out of production
 * builds (dev shows empty slots). `photo` is a file in public/, ≥ 1200 px wide.
 */
export const team: { name: string; role: string; bio: string; photo: string }[] = [];

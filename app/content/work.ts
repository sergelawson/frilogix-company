export type CaseStudy = {
    slug: string;
    /** Anonymised is fine, e.g. "Series A fintech". */
    client: string;
    title: string;
    problem: string;
    approach: string;
    outcome: { value: string; label: string };
    stack: string[];
};

/**
 * Real case studies only. Each one becomes its own panel. While this is empty,
 * the Work page shows a single "being written up" panel (and dev adds an
 * example layout so the template can be reviewed).
 */
export const caseStudies: CaseStudy[] = [];

export const workIntro = {
    eyebrow: 'Work',
    title: 'Case studies are being written up.',
    lede: "We're documenting recent work with startups and enterprises. Until they're published, ask us about relevant projects on a call.",
};

import { Fragment, type ReactNode } from 'react';
import { Link } from 'react-router';
import type { Route } from './+types/privacy';
import Eyebrow from '~/components/ui/Eyebrow';
import { lastUpdated, privacyIntro, privacySections, type Block } from '~/content/privacy';
import { pageMeta } from '~/lib/meta';
import { openConsentSettings } from '~/lib/consent';

export const meta: Route.MetaFunction = () =>
    pageMeta({
        title: 'Privacy Policy | Frilogix',
        description:
            'How Frilogix LLC handles personal data on frilogix.com: the contact form, spam protection, hosting, and analytics cookies, and how to opt out.',
        path: '/privacy',
    });

const pad = (n: number) => String(n).padStart(2, '0');

/** Renders [label](url) as links: internal paths through the router, everything else in a new tab. */
function rich(text: string): ReactNode {
    const parts = text.split(/(\[[^\]]+\]\([^)]+\))/g);
    return parts.map((part, i) => {
        const match = /^\[([^\]]+)\]\(([^)]+)\)$/.exec(part);
        if (!match) return <Fragment key={i}>{part}</Fragment>;
        const [, label, href] = match;
        const className = 'text-accent-ink underline underline-offset-2 hover:text-fg';
        return href.startsWith('/') ? (
            <Link key={i} to={href} className={className}>
                {label}
            </Link>
        ) : (
            <a key={i} href={href} target="_blank" rel="noopener noreferrer" className={className}>
                {label}
            </a>
        );
    });
}

function BlockView({ block }: { block: Block }) {
    if ('p' in block) return <p className="mt-4 leading-relaxed text-fg-muted">{rich(block.p)}</p>;
    if ('ul' in block)
        return (
            <ul className="mt-4 space-y-2">
                {block.ul.map((item) => (
                    <li key={item} className="flex gap-3 leading-relaxed text-fg-muted">
                        <span aria-hidden="true" className="mt-[0.7em] h-px w-3 shrink-0 bg-line-strong" />
                        <span>{rich(item)}</span>
                    </li>
                ))}
            </ul>
        );
    return (
        <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[36rem] border-collapse text-left text-sm">
                <thead>
                    <tr className="border-b border-line-strong font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-fg-muted">
                        {block.table.head.map((cell) => (
                            <th key={cell} scope="col" className="py-2 pr-4 font-medium">
                                {cell}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {block.table.rows.map((row) => (
                        <tr key={row[0]} className="border-b border-line align-top">
                            {row.map((cell, i) => (
                                <td key={i} className={`py-3 pr-4 ${i === 0 ? 'font-mono text-xs text-fg' : 'text-fg-muted'}`}>
                                    {cell}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

/**
 * A normal document page, outside the one-page horizontal layout (it isn't in
 * `pages`, so it isn't in the scroll or the page counter). Prerendered like the rest.
 */
export default function Privacy() {
    return (
        <div className="mx-auto max-w-7xl px-4 pb-24 pt-32 sm:px-6 lg:px-8 lg:pt-40">
            <div className="grid gap-5 lg:grid-cols-12 lg:items-end lg:gap-12">
                <div className="lg:col-span-7">
                    <Eyebrow>{privacyIntro.eyebrow}</Eyebrow>
                    <h1 className="mt-4 font-wide text-h1 font-semibold text-balance">{privacyIntro.title}</h1>
                </div>
                <div className="lg:col-span-5">
                    <p className="text-lede text-pretty text-fg-muted">{privacyIntro.lede}</p>
                    <p className="mt-4 font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-fg-muted">
                        Last updated {lastUpdated}
                    </p>
                </div>
            </div>

            <div className="mt-16 max-w-3xl">
                {privacySections.map((section, i) => (
                    <section key={section.heading} className="border-t border-line-strong py-8">
                        <span className="font-mono text-xs text-accent-ink">{pad(i + 1)}</span>
                        <h2 className="mt-3 font-wide text-h3 font-semibold">{section.heading}</h2>
                        {section.blocks.map((block, j) => (
                            <BlockView key={j} block={block} />
                        ))}
                    </section>
                ))}
                <div className="border-t border-line-strong pt-8">
                    <button
                        type="button"
                        onClick={openConsentSettings}
                        className="font-medium text-accent-ink underline underline-offset-2 hover:text-fg"
                    >
                        Change your cookie settings
                    </button>
                </div>
            </div>
        </div>
    );
}

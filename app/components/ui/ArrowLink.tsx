import type { ReactNode } from 'react';
import { Link } from 'react-router';
import { ArrowRight } from './icons';

/** An inline text link with a trailing arrow that nudges on hover. */
export default function ArrowLink({ to, className = '', children }: { to: string; className?: string; children: ReactNode }) {
    return (
        <Link
            to={to}
            className={`group inline-flex items-center gap-1.5 text-sm font-medium text-accent-ink transition-colors hover:text-fg ${className}`}
        >
            {children}
            <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-1" />
        </Link>
    );
}

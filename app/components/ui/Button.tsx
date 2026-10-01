import type { ReactNode } from 'react';
import { Link } from 'react-router';
import { site } from '~/content/site';
import { ArrowRight } from './icons';

type Variant = 'primary' | 'secondary';
type Size = 'md' | 'lg';

const variants: Record<Variant, string> = {
    primary: 'bg-accent text-on-accent hover:bg-accent-strong',
    secondary: 'border border-line-strong text-fg hover:border-fg hover:bg-fg/5',
};

const sizes: Record<Size, string> = {
    md: 'h-10 px-5 text-sm',
    lg: 'h-12 px-6 text-[0.9375rem]',
};

/** Classes for anything that should look like a button — use on a native <button> directly. */
export function buttonClass(variant: Variant = 'primary', size: Size = 'md') {
    return `group inline-flex items-center justify-center gap-2 rounded-full font-medium whitespace-nowrap transition-colors duration-200 ease-out disabled:pointer-events-none disabled:opacity-50 ${variants[variant]} ${sizes[size]}`;
}

type ButtonLinkProps = {
    to: string;
    variant?: Variant;
    size?: Size;
    arrow?: boolean;
    className?: string;
    children: ReactNode;
};

/** A link styled as a button. External URLs (http…) render a plain <a>. */
export function ButtonLink({ to, variant = 'primary', size = 'md', arrow = false, className = '', children }: ButtonLinkProps) {
    const classes = `${buttonClass(variant, size)} ${className}`;
    const content = (
        <>
            {children}
            {arrow && <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-0.5" />}
        </>
    );
    return /^https?:/.test(to) ? (
        <a href={to} className={classes}>{content}</a>
    ) : (
        <Link to={to} className={classes}>{content}</Link>
    );
}

/** The primary call to action: the booking link when one is set, else the contact form. */
export function BookCallButton({ size = 'md', className = '' }: { size?: Size; className?: string }) {
    return (
        <ButtonLink to={site.bookingUrl ?? '/contact'} size={size} arrow className={className}>
            Book a call
        </ButtonLink>
    );
}

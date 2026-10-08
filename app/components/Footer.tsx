import type { FC } from 'react';
import { Link } from 'react-router';
import EmailAddress from '~/components/ui/EmailAddress';
import { pages, site } from '~/content/site';

const serviceLinks = [
    { label: 'All services', to: '/services' },
    { label: 'AI engineering', to: '/services#intelligent-systems' },
    { label: 'How we work', to: '/services#process' },
];

const columnTitle = 'mb-5 font-mono text-xs font-medium uppercase tracking-[0.16em] text-fg-muted';
const linkClass = 'text-sm text-fg/85 transition-colors hover:text-fg';

// Privacy and Terms pages don't exist yet, so they aren't linked; add them
// here once written (LAUNCH-AUDIT.md P0 #5).
const Footer: FC = () => {
    return (
        <footer className="theme-ink">
            <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
                <div className="grid gap-12 lg:grid-cols-12">
                    <div className="lg:col-span-5">
                        <Link to="/" className="inline-block">
                            <img src="/logo-on-dark.png" alt="Frilogix" width={160} height={40} className="h-8 w-auto" loading="lazy" />
                        </Link>
                        <p className="mt-6 max-w-sm text-fg-muted">
                            Software and agentic AI engineering: web, mobile, platform and AI systems. Makers of Uitiful and Vantuu.
                        </p>
                        <p className="mt-6 text-accent-ink">
                            <EmailAddress />
                        </p>
                    </div>

                    <nav aria-label="Footer" className="grid grid-cols-2 gap-10 sm:grid-cols-3 lg:col-span-7">
                        <div>
                            <h2 className={columnTitle}>Site</h2>
                            <ul className="space-y-3">
                                {pages.map((page) => (
                                    <li key={page.path}><Link to={page.path} className={linkClass}>{page.label}</Link></li>
                                ))}
                            </ul>
                        </div>
                        <div>
                            <h2 className={columnTitle}>Services</h2>
                            <ul className="space-y-3">
                                {serviceLinks.map((link) => (
                                    <li key={link.to}><Link to={link.to} className={linkClass}>{link.label}</Link></li>
                                ))}
                            </ul>
                        </div>
                        {site.social.length > 0 && (
                            <div>
                                <h2 className={columnTitle}>Elsewhere</h2>
                                <ul className="space-y-3">
                                    {site.social.map((link) => (
                                        <li key={link.href}><a href={link.href} className={linkClass}>{link.label}</a></li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </nav>
                </div>

                <div className="mt-16 flex flex-col gap-2 border-t border-line pt-8 font-mono text-xs text-fg-muted sm:flex-row sm:justify-between">
                    <p>&copy; {new Date().getFullYear()} {site.legalName}</p>
                    <p>{site.location}</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;

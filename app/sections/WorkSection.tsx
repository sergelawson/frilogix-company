import { Page, Panel, panelInner } from '~/components/Panel';
import ArrowLink from '~/components/ui/ArrowLink';
import { ButtonLink } from '~/components/ui/Button';
import Placeholder, { showPlaceholders } from '~/components/ui/Placeholder';
import { products, type Product } from '~/content/work';

/** A product we're building: copy and a link on one side, a screenshot on the other. */
function ProductPanel({ product }: { product: Product }) {
    // Without a screenshot (in production) the copy takes the whole row.
    const hasVisual = product.image !== null || showPlaceholders;
    return (
        <Panel id={product.slug} className={product.ink ? 'theme-ink' : ''}>
            <div className={panelInner}>
                <div className="gsap-reveal">
                    <div className="grid gap-10 lg:grid-cols-12 lg:items-center lg:gap-12 hscroll:items-start">
                        <div className={hasVisual ? 'lg:col-span-5' : 'lg:col-span-8'}>
                            {/* The logo carries the name; category and status follow it as ruled labels. */}
                            <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:gap-4">
                                <img
                                    src={product.logo.src}
                                    alt={product.name}
                                    width={product.logo.width}
                                    height={product.logo.height}
                                    className="h-7 w-auto"
                                />
                                <div className="flex items-center gap-4">
                                    {/* On phones the labels sit under the logo, so the first needs no rule. */}
                                    <Label className="sm:border-l sm:pl-4">{product.category}</Label>
                                    <Label className="border-l pl-4">{product.status}</Label>
                                </div>
                            </div>
                            <h2 className="mt-5 font-wide text-h2 font-semibold text-balance">{product.title}</h2>
                            <p className="mt-5 leading-relaxed text-pretty text-fg-muted">{product.summary}</p>
                            {product.url ? (
                                <ButtonLink to={product.url} size="lg" arrow className="mt-8">
                                    Visit {new URL(product.url).host}
                                </ButtonLink>
                            ) : (
                                <ArrowLink to="/contact" className="mt-8">
                                    Ask us about {product.name}
                                </ArrowLink>
                            )}
                        </div>
                        {hasVisual && (
                            <div className="lg:col-span-7">
                                {product.image ? (
                                    <img
                                        src={product.image.src}
                                        alt={product.image.alt}
                                        width={product.image.width}
                                        height={product.image.height}
                                        loading="lazy"
                                        className="w-full border border-line hscroll:ml-auto hscroll:max-h-[52vh] hscroll:w-auto"
                                    />
                                ) : (
                                    <Placeholder label="Product screenshot" className="aspect-[1200/726]" />
                                )}
                            </div>
                        )}
                    </div>
                    {product.highlights.length > 0 ? (
                        <ul className="mt-10 grid gap-x-8 gap-y-6 border-t border-line pt-6 sm:grid-cols-2 lg:grid-cols-4">
                            {product.highlights.map((item) => (
                                <li key={item.title}>
                                    <h3 className="text-sm font-semibold">{item.title}</h3>
                                    <p className="mt-1 text-sm text-fg-muted">{item.desc}</p>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <Placeholder label="Highlights: what it does, in four short lines" className="mt-10 h-20" />
                    )}
                </div>
            </div>
        </Panel>
    );
}

function Label({ children, className }: { children: string; className: string }) {
    return <span className={`whitespace-nowrap border-line-strong font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-fg-muted ${className}`}>{children}</span>;
}

export default function WorkSection() {
    return (
        <Page path="/work" label="Work">
            {/* No intro panel: Home's products panel already introduces both and links to each. */}
            {/* The page's one ink panel is the product whose logo is drawn for it. */}
            {products.map((product) => (
                <ProductPanel key={product.slug} product={product} />
            ))}
        </Page>
    );
}

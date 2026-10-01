/**
 * Dev builds only: draws a dashed slot where real content (logos, numbers,
 * photos, case studies) still has to be supplied. Production builds render
 * nothing, so a placeholder can never ship to visitors.
 */
export const showPlaceholders = import.meta.env.DEV;

export default function Placeholder({ label, className = '' }: { label: string; className?: string }) {
    if (!showPlaceholders) return null;
    return (
        <div
            className={`flex items-center justify-center rounded-lg border border-dashed border-line-strong px-3 py-2 text-center font-mono text-[0.6875rem] uppercase tracking-wider text-fg-muted ${className}`}
        >
            {label}
        </div>
    );
}

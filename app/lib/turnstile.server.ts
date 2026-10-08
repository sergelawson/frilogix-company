/**
 * Server-side Cloudflare Turnstile check for the contact form. The browser
 * widget (~/components/TurnstileWidget) adds a single-use token to the form as
 * `cf-turnstile-response`; this redeems it with Siteverify.
 *
 * Needs TURNSTILE_SECRET and TURNSTILE_HOSTNAMES (comma-separated frontend
 * hostnames for this deployment: frilogix.com,www.frilogix.com in production,
 * never localhost). Without them, dev lets the form through with a warning and
 * production rejects every submission. Network or upstream failures reject too.
 */

const SITEVERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';

type VerifyResult = { ok: true } | { ok: false; reason: string };

export async function verifyTurnstile(request: Request, form: FormData, expectedAction: string): Promise<VerifyResult> {
    const secret = process.env.TURNSTILE_SECRET;
    const hostnames = new Set(
        (process.env.TURNSTILE_HOSTNAMES ?? '')
            .split(',')
            .map((hostname) => hostname.trim())
            .filter(Boolean),
    );

    if (!secret || hostnames.size === 0) {
        if (import.meta.env.DEV) {
            console.warn('[turnstile] TURNSTILE_SECRET / TURNSTILE_HOSTNAMES not set; skipping the check in dev.');
            return { ok: true };
        }
        return { ok: false, reason: 'turnstile not configured (TURNSTILE_SECRET, TURNSTILE_HOSTNAMES)' };
    }

    const token = form.get('cf-turnstile-response');
    if (typeof token !== 'string' || token.length === 0 || token.length > 2048) {
        return { ok: false, reason: 'missing or malformed token' };
    }

    const body = new URLSearchParams({ secret, response: token });
    const ip = request.headers.get('CF-Connecting-IP') ?? request.headers.get('X-Forwarded-For')?.split(',')[0]?.trim();
    if (ip) body.set('remoteip', ip);

    let result: { success?: boolean; action?: string; hostname?: string; 'error-codes'?: string[] };
    try {
        const response = await fetch(SITEVERIFY_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body,
            signal: AbortSignal.timeout(10_000),
        });
        if (!response.ok) throw new Error(`siteverify ${response.status}`);
        result = await response.json();
    } catch (error) {
        // Fail closed: no answer from Cloudflare means no proof of a human.
        return { ok: false, reason: `siteverify unreachable: ${error instanceof Error ? error.message : String(error)}` };
    }

    if (!result.success) return { ok: false, reason: `rejected: ${(result['error-codes'] ?? []).join(', ') || 'unknown'}` };
    if (result.action !== expectedAction) return { ok: false, reason: `unexpected action: ${result.action}` };
    if (!result.hostname || !hostnames.has(result.hostname)) return { ok: false, reason: `unexpected hostname: ${result.hostname}` };
    return { ok: true };
}

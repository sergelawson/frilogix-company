import { useEffect, useRef, useState } from 'react';

type TurnstileApi = {
    render: (container: HTMLElement, options: Record<string, unknown>) => string;
    reset: (widgetId: string) => void;
    remove: (widgetId: string) => void;
};

declare global {
    interface Window {
        turnstile?: TurnstileApi;
    }
}

const SCRIPT_URL = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
let scriptPromise: Promise<TurnstileApi> | null = null;

/** Loads Cloudflare's script once per page, on first use. */
function loadTurnstile(): Promise<TurnstileApi> {
    if (window.turnstile) return Promise.resolve(window.turnstile);
    scriptPromise ??= new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = SCRIPT_URL;
        script.async = true;
        script.onload = () => (window.turnstile ? resolve(window.turnstile) : reject(new Error('turnstile missing')));
        script.onerror = () => {
            scriptPromise = null;
            reject(new Error('turnstile script failed to load'));
        };
        document.head.appendChild(script);
    });
    return scriptPromise;
}

/**
 * Cloudflare Turnstile, rendered explicitly so it can be reset: tokens are
 * single-use and the form stays on the page after a submission. Invisible
 * unless Cloudflare decides to challenge the visitor. The widget writes its
 * token into a hidden `cf-turnstile-response` input inside this element, so it
 * must sit inside the <form>. Bump `resetKey` after every completed request.
 */
export default function TurnstileWidget({
    sitekey,
    action,
    resetKey,
    onToken,
    onError,
}: {
    sitekey: string;
    action: string;
    resetKey: number;
    onToken: (token: string | null) => void;
    onError: () => void;
}) {
    const container = useRef<HTMLDivElement>(null);
    const widgetId = useRef<string | null>(null);
    const [interactive, setInteractive] = useState(false);
    // The widget keeps the callbacks it was rendered with; route them through a ref
    // so it always calls the latest ones.
    const handlers = useRef({ onToken, onError });
    useEffect(() => {
        handlers.current = { onToken, onError };
    });

    useEffect(() => {
        let cancelled = false;
        loadTurnstile()
            .then((turnstile) => {
                if (cancelled || !container.current) return;
                widgetId.current = turnstile.render(container.current, {
                    sitekey,
                    action,
                    theme: 'light',
                    size: 'flexible',
                    appearance: 'interaction-only',
                    callback: (token: string) => handlers.current.onToken(token),
                    'expired-callback': () => handlers.current.onToken(null),
                    'error-callback': () => {
                        handlers.current.onToken(null);
                        handlers.current.onError();
                    },
                    'before-interactive-callback': () => setInteractive(true),
                    'after-interactive-callback': () => setInteractive(false),
                });
            })
            .catch(() => handlers.current.onError());
        return () => {
            cancelled = true;
            if (widgetId.current) window.turnstile?.remove(widgetId.current);
            widgetId.current = null;
        };
    }, [sitekey, action]);

    useEffect(() => {
        if (resetKey > 0 && widgetId.current) {
            handlers.current.onToken(null);
            window.turnstile?.reset(widgetId.current);
        }
    }, [resetKey]);

    return <div ref={container} className={interactive ? 'mt-5' : ''} />;
}

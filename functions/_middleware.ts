import type { PagesFunction } from "@cloudflare/workers-types";

// Cloudflare Pages Functions middleware for host-based redirects
// Runs at the edge before serving static content

interface Env {
    ASSETS: { fetch: typeof fetch };
}

export const onRequest: PagesFunction<Env> = async (context) => {
    const req = context.request;
    const url = new URL(req.url);
    const host = (req.headers.get("host") || "").toLowerCase();

    const targetHost = "bankholidaycalendar.com";

    const shouldRedirectFromPagesDev = host.endsWith(".pages.dev");
    const shouldRedirectFromWww = host === "www.bankholidaycalendar.com";

    if (shouldRedirectFromPagesDev || shouldRedirectFromWww) {
        const redirectUrl = new URL(url.toString());
        redirectUrl.protocol = "https:";
        redirectUrl.hostname = targetHost;
        return new Response(null, {
            status: 301,
            headers: {
                Location: redirectUrl.toString(),
            },
        });
    }

    return context.next();
};

export async function onRequest(context) {
    const req = context.request;
    const url = new URL(req.url);
    const host = (req.headers.get("host") || "").toLowerCase();

    const CANONICAL_HOST = "bankholidaycalendar.com";

    // Redirect Pages subdomain + www -> apex (preserve path + query)
    if (host.endsWith(".pages.dev") || host === `www.${CANONICAL_HOST}`) {
        url.protocol = "https:";
        url.hostname = CANONICAL_HOST;
        return Response.redirect(url.toString(), 301);
    }

    // Otherwise proceed normally
    return context.next();
}

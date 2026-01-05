// @ts-nocheck

export async function onRequest(context) {
    const req = context.request;
    const url = new URL(req.url);
    const host = url.hostname.toLowerCase();

    // Redirect Pages default hostname to the real domain
    if (host.endsWith(".pages.dev")) {
        url.protocol = "https:";
        url.hostname = "bankholidaycalendar.com";
        return Response.redirect(url.toString(), 301);
    }

    return context.next();
}

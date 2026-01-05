export async function onRequest(context) {
    const req = context.request;
    const url = new URL(req.url);
    const host = (req.headers.get("host") || "").toLowerCase();

    // Redirect Pages default hostname + www to apex
    if (host.endsWith(".pages.dev") || host === "www.bankholidaycalendar.com") {
        url.protocol = "https:";
        url.hostname = "bankholidaycalendar.com";
        return Response.redirect(url.toString(), 301);
    }

    return context.next();
}

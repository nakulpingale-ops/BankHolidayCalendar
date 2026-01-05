// @ts-nocheck
export const onRequest = async (context) => {
    const req = context.request;
    const url = new URL(req.url);
    const host = (req.headers.get("host") || "").toLowerCase();

    // Canonical host
    const targetHost = "bankholidaycalendar.com";

    // Redirect any Pages default hostname + www to apex
    if (host.endsWith(".pages.dev") || host === "www.bankholidaycalendar.com") {
        url.protocol = "https:";
        url.hostname = targetHost;
        return Response.redirect(url.toString(), 301);
    }

    return context.next();
};

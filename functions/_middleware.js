export async function onRequest(context) {
    const { request, next } = context;
    const url = new URL(request.url);

    // Ignore localhost for development
    if (url.hostname === "localhost" || url.hostname === "127.0.0.1") {
        return next();
    }

    const canonicalHost = "bankholidaycalendar.com";

    // Logic: If protocol is NOT https OR hostname is NOT canonical
    // using strict inequality to catch ANY deviation (www, pages.dev, http)
    if (url.protocol !== "https:" || url.hostname !== canonicalHost) {
        // Construct canonical URL using the canonical host and https protocol
        const targetUrl = new URL(url.pathname + url.search, `https://${canonicalHost}`);

        return new Response(null, {
            status: 301,
            headers: { "Location": targetUrl.toString() }
        });
    }

    // Redirect /?state=... to canonical path
    // Matches / or /2026 with ?state= param
    if ((url.pathname === "/" || url.pathname === "/2026") && url.searchParams.has("state")) {
        const stateParam = url.searchParams.get("state");
        if (stateParam) {
            // Slugify logic
            const slug = stateParam.toLowerCase()
                .replace(/&/g, "and")
                .replace(/\s+/g, "-")
                .replace(/[^a-z0-9-]/g, "")
                .replace(/-+/g, "-")
                .replace(/^-|-$/g, "");

            const targetUrl = new URL(`/${slug}-bank-holiday-2026`, url.origin);

            return new Response(null, {
                status: 301,
                headers: { "Location": targetUrl.toString() }
            });
        }
    }

    return next();
}

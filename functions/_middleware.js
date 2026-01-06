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

    return next();
}

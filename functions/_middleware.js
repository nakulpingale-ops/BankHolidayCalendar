export async function onRequest(context) {
    const { request, next } = context;
    const url = new URL(request.url);

    if (url.hostname.endsWith(".pages.dev")) {
        const canonicalUrl = new URL(url.pathname + url.search, "https://bankholidaycalendar.com");
        return new Response(null, {
            status: 301,
            headers: { "Location": canonicalUrl.toString() }
        });
    }

    return next();
}

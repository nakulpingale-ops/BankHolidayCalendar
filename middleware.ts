import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export function middleware(request: NextRequest) {
    const host = (request.headers.get("host") || "").toLowerCase();
    const url = request.nextUrl.clone();
    const targetHost = "bankholidaycalendar.com";

    // Redirect Pages default domain + www to apex
    if (host.endsWith(".pages.dev") || host === "www.bankholidaycalendar.com") {
        url.hostname = targetHost;
        url.protocol = "https";
        return NextResponse.redirect(url, 301);
    }

    return NextResponse.next();
}

export const config = {
    matcher: "/:path*",
};

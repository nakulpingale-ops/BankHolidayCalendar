import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

import { stateToSlug, INDIAN_STATES } from './lib/constants';

export function middleware(request: NextRequest) {
    const url = request.nextUrl;
    const { pathname, searchParams } = url;

    // Handle /?state=... redirects
    if ((pathname === '/' || pathname === '/2026') && searchParams.has('state')) {
        const stateParam = searchParams.get('state');
        if (stateParam) {
            // Find valid state matching the param (fuzzy or exact)
            const normalizedParam = stateParam.toLowerCase().trim();
            const matchedState = INDIAN_STATES.find(s =>
                s.toLowerCase() === normalizedParam ||
                stateToSlug(s) === normalizedParam
            );

            if (matchedState) {
                const slug = stateToSlug(matchedState);
                const targetUrl = new URL(`/${slug}-bank-holiday-2026`, request.url);
                return NextResponse.redirect(targetUrl, 301);
            }
        }
    }

    // Default: continue
    return NextResponse.next();
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ],
};

'use client';

import { useEffect, Suspense } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

/**
 * Inner component that uses useSearchParams
 */
function CanonicalUrlInner() {
    const pathname = usePathname();
    const searchParams = useSearchParams();

    useEffect(() => {
        if (typeof window === 'undefined') return;

        const canonicalBase = 'https://bankholidaycalendar.com';

        // Build canonical URL
        let canonicalUrl = `${canonicalBase}${pathname}`;

        // Preserve only the 'state' parameter (page identity)
        // Exception: On state-specific slug pages, we don't need ?state parameter
        const isStateSlugPage = pathname.endsWith("-bank-holiday-2026");
        const stateParam = searchParams.get('state');
        if (stateParam && !isStateSlugPage) {
            canonicalUrl += `?state=${encodeURIComponent(stateParam)}`;
        }

        // Update or create canonical link tag
        let canonicalLink = document.querySelector('link[rel="canonical"]');
        if (canonicalLink) {
            canonicalLink.setAttribute('href', canonicalUrl);
        } else {
            canonicalLink = document.createElement('link');
            canonicalLink.setAttribute('rel', 'canonical');
            canonicalLink.setAttribute('href', canonicalUrl);
            document.head.appendChild(canonicalLink);
        }

        // Update or create og:url meta tag
        let ogUrlMeta = document.querySelector('meta[property="og:url"]');
        if (ogUrlMeta) {
            ogUrlMeta.setAttribute('content', canonicalUrl);
        } else {
            ogUrlMeta = document.createElement('meta');
            ogUrlMeta.setAttribute('property', 'og:url');
            ogUrlMeta.setAttribute('content', canonicalUrl);
            document.head.appendChild(ogUrlMeta);
        }
    }, [pathname, searchParams]);

    return null;
}

/**
 * CanonicalUrl - Dynamically manages canonical and og:url tags
 * 
 * Builds canonical URLs with these rules:
 * 1. Always use https://bankholidaycalendar.com as host
 * 2. Preserve 'state' query parameter (page identity)
 * 3. Strip tracking params: utm_*, gclid, fbclid, msclkid
 * 4. Updates both <link rel="canonical"> and <meta property="og:url">
 */
export function CanonicalUrl() {
    return (
        <Suspense fallback={null}>
            <CanonicalUrlInner />
        </Suspense>
    );
}

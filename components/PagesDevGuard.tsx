'use client';

import { useEffect } from 'react';

/**
 * PagesDevGuard - Safety fallback for pages.dev hostname
 * 
 * Prevents indexing and redirects traffic from bankholidaycalendar.pages.dev
 * to the canonical domain https://bankholidaycalendar.com
 * 
 * This is a belt-and-suspenders approach alongside _redirects file.
 */
export function PagesDevGuard() {
    useEffect(() => {
        // Only run in browser
        if (typeof window === 'undefined') return;

        const hostname = window.location.hostname;

        // Check if we're on a pages.dev domain
        if (hostname.endsWith('.pages.dev')) {
            // Build canonical URL
            const canonicalUrl = `https://bankholidaycalendar.com${window.location.pathname}${window.location.search}${window.location.hash}`;

            // Immediately redirect (replaces history to prevent back button)
            window.location.replace(canonicalUrl);
        }
    }, []);

    // If we're on pages.dev, inject noindex meta tag
    if (typeof window !== 'undefined' && window.location.hostname.endsWith('.pages.dev')) {
        return (
            <>
                <meta name="robots" content="noindex, nofollow" />
            </>
        );
    }

    return null;
}

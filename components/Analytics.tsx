"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, Suspense } from "react";

function AnalyticsTracker() {
    const pathname = usePathname();
    const searchParams = useSearchParams();

    useEffect(() => {
        if (typeof window === "undefined") return;

        const gtag = (window as any).gtag;
        if (!gtag) return;

        const url = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : "");
        gtag("event", "page_view", { page_path: url });
    }, [pathname, searchParams]);

    return null;
}

export function Analytics() {
    return (
        <Suspense fallback={null}>
            <AnalyticsTracker />
        </Suspense>
    );
}

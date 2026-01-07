"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, Suspense, useState } from "react";
import Script from "next/script";

const GA_MEASUREMENT_ID = "G-HQV7FT38DS";

function AnalyticsTracker() {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [isProduction, setIsProduction] = useState(false);

    useEffect(() => {
        if (typeof window === "undefined") return;
        const hostname = window.location.hostname;
        // Strictly load ONLY on production domains
        if (hostname === "bankholidaycalendar.com" || hostname === "www.bankholidaycalendar.com") {
            setIsProduction(true);
        }
    }, []);

    useEffect(() => {
        if (!isProduction) return;

        // Safety check if gtag isn't loaded yet, though usually Script runs quickly.
        // We defined send_page_view: false in config, so we must trigger it here.
        const gtag = (window as any).gtag;
        if (gtag) {
            const url = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : "");
            gtag("event", "page_view", { page_path: url });
        }
    }, [pathname, searchParams, isProduction]);

    if (!isProduction) return null;

    return (
        <>
            <Script
                strategy="afterInteractive"
                src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
            />
            <Script id="ga4-init" strategy="afterInteractive">
                {`
                    window.dataLayer = window.dataLayer || [];
                    function gtag(){dataLayer.push(arguments);}
                    gtag('js', new Date());
                    gtag('config', '${GA_MEASUREMENT_ID}', { send_page_view: false });
                `}
            </Script>
        </>
    );
}

export function Analytics() {
    return (
        <Suspense fallback={null}>
            <AnalyticsTracker />
        </Suspense>
    );
}

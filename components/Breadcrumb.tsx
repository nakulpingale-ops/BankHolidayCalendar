"use client";

import { ChevronRight } from "lucide-react";

interface BreadcrumbProps {
    stateName: string;
    stateSlug: string;
}

export function Breadcrumb({ stateName, stateSlug }: BreadcrumbProps) {
    // JSON-LD BreadcrumbList Schema
    const breadcrumbSchema = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
            {
                "@type": "ListItem",
                "position": 1,
                "name": "Home",
                "item": "https://bankholidaycalendar.com/"
            },
            {
                "@type": "ListItem",
                "position": 2,
                "name": stateName === "All States/UTs" ? "All India" : stateName,
                "item": `https://bankholidaycalendar.com/${stateSlug}-bank-holiday-2026`
            },
            {
                "@type": "ListItem",
                "position": 3,
                "name": "2026 Calendar"
            }
        ]
    };

    return (
        <>
            {/* JSON-LD Schema */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
            />

            {/* Visual Breadcrumb */}
            <nav aria-label="Breadcrumb" className="w-full max-w-[1050px] mx-auto px-4 mb-5">
                <ol className="flex items-center gap-1.5 text-[12px]">
                    <li>
                        <a
                            href="/"
                            className="text-[#9ca3af] hover:text-[#14A900] transition-colors duration-200"
                        >
                            Home
                        </a>
                    </li>
                    <li>
                        <ChevronRight className="w-3 h-3 text-gray-500" />
                    </li>
                    <li>
                        <a
                            href={`/${stateSlug}-bank-holiday-2026`}
                            className="text-[#9ca3af] hover:text-[#14A900] transition-colors duration-200"
                        >
                            {stateName === "All States/UTs" ? "All India" : stateName}
                        </a>
                    </li>
                    <li>
                        <ChevronRight className="w-3 h-3 text-gray-500" />
                    </li>
                    <li>
                        <span className="text-[#9ca3af]">2026 Calendar</span>
                    </li>
                </ol>
            </nav>
        </>
    );
}

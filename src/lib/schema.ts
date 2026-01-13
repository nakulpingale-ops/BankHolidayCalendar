export interface BreadcrumbItem {
    name: string;
    item: string;
}

export interface FaqItem {
    question: string;
    answer: string;
}

export interface DatasetProps {
    stateName: string;
    year: number | string;
    canonicalUrl: string;
    holidayCount: number;
    description: string;
}

export function buildBreadcrumbList(items: BreadcrumbItem[]) {
    return {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": items.map((crumb, index) => ({
            "@type": "ListItem",
            "position": index + 1,
            "name": crumb.name,
            "item": crumb.item
        }))
    };
}

export function buildFAQPage(faqs: FaqItem[]) {
    if (!faqs || faqs.length === 0) return null;

    return {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": faqs.map(faq => ({
            "@type": "Question",
            "name": faq.question,
            "acceptedAnswer": {
                "@type": "Answer",
                "text": faq.answer
            }
        }))
    };
}

export function buildHolidayDataset({ stateName, year, canonicalUrl, holidayCount, description }: DatasetProps) {
    const safeDescription = description || `Official Bank Holiday Calendar ${year} for ${stateName}, India. Includes national holidays, state festivals, and RBI second/fourth Saturday closures.`;

    return {
        "@context": "https://schema.org",
        "@type": "Dataset",
        "name": `${stateName} Bank Holidays ${year}`,
        "description": safeDescription,
        "temporalCoverage": `${year}-01-01/${year}-12-31`,
        "spatialCoverage": {
            "@type": "AdministrativeArea",
            "name": `${stateName}, India`
        },
        "creator": {
            "@type": "Organization",
            "name": "BankHolidayCalendar.com",
            "url": "https://bankholidaycalendar.com"
        },
        "license": "https://creativecommons.org/licenses/by/4.0/",
        "url": canonicalUrl,
        "isAccessibleForFree": true,
        "includedInDataCatalog": {
            "@type": "DataCatalog",
            "name": "BankHolidayCalendar.com"
        },
        "variableMeasured": [
            {
                "@type": "PropertyValue",
                "name": "Holiday Name"
            },
            {
                "@type": "PropertyValue",
                "name": "Date"
            },
            {
                "@type": "PropertyValue",
                "name": "Day of Week"
            },
            {
                "@type": "PropertyValue",
                "name": "Bank Status"
            }
        ]
    };
}

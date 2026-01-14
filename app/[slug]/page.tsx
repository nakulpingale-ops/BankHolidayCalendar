import { notFound } from "next/navigation";
import { Metadata } from "next";
import { INDIAN_STATES, slugToState, stateToSlug } from "@/lib/constants";
import { StateCalendarView } from "@/components/StateCalendarView";

import fs from "fs";
import path from "path";
import Papa from "papaparse";
import { getCombinedHolidays, CsvHolidayRow, enrichCsvData } from "@/src/lib/holidays";

const BASE_URL = "https://bankholidaycalendar.com";

// Helper for data loading
function getCsvData(): CsvHolidayRow[] {
    try {
        const filePath = path.join(process.cwd(), "public", "holidays2026.csv");
        const fileContent = fs.readFileSync(filePath, "utf8");
        const { data } = Papa.parse<CsvHolidayRow>(fileContent, {
            header: true,
            skipEmptyLines: true,
        });
        return enrichCsvData(data);
    } catch (e) {
        console.error("Error reading CSV:", e);
        return [];
    }
}

// Helper to load holidays server-side for Metadata
async function getHolidayMetadata(stateName: string, csvData: CsvHolidayRow[]) {
    try {
        // Use standard merger to get accurate counts (weekends + 2nd/4th sats + csv dates)
        const holidays = getCombinedHolidays(csvData, stateName, 2026);

        // Count: Total closed days
        const holidayCount = holidays.length;

        // Top 3 distinct names for Description (exclude "Second Saturday"/"Fourth Saturday" to be more descriptive)
        const topHolidays = holidays
            .filter(h => h.type === "National" || h.type === "State")
            .map(h => h.name)
            // Dedupe names
            .filter((value, index, self) => self.indexOf(value) === index)
            .slice(0, 3);

        return { holidayCount, topHolidays };
    } catch (e) {
        console.error("Error generating metadata:", e);
        return { holidayCount: 0, topHolidays: [] };
    }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;

    if (!slug.endsWith("-bank-holiday-2026")) {
        return {};
    }

    const stateSlug = slug.replace("-bank-holiday-2026", "");
    let stateName = "All States";
    const potentialName = slugToState(stateSlug);

    if (stateSlug !== "all" && potentialName) {
        stateName = potentialName;
    }

    // Load Data
    const csvData = getCsvData();

    // Fetch data-driven counts
    const { holidayCount, topHolidays } = await getHolidayMetadata(stateName, csvData);

    const title = stateName === "All States"
        ? "Official Bank Holiday Calendar 2026 - All India State-wise List"
        : `${stateName} Bank Holidays 2026: Official List & Calendar`;

    const description = stateName === "All States"
        ? `Official Bank Holiday Calendar 2026 for all Indian States/UTs. Check bank open/closed status, RBI 2nd/4th Saturday closures, and festival holidays.`
        : `${stateName} Bank Holidays 2026: ${holidayCount}+ official closures incl. national/state holidays and RBI 2nd/4th Saturdays. View month-wise list + calendar.`;

    // Canonical strictly based on slug
    const canonicalUrl = `${BASE_URL}/${slug}`;

    return {
        title,
        description,
        alternates: {
            canonical: canonicalUrl,
        },
        openGraph: {
            title,
            description,
            url: canonicalUrl,
            type: "website",
        },
        twitter: {
            card: "summary_large_image",
            title,
            description,
        }
    };
}

export async function generateStaticParams() {
    return [
        { slug: "all-bank-holiday-2026" },
        ...INDIAN_STATES.map((state) => ({
            slug: `${stateToSlug(state)}-bank-holiday-2026`,
        })),
    ];
}

import { buildBreadcrumbList, buildFAQPage, buildHolidayDataset } from "@/src/lib/schema";
import { FAQ_DATA } from "@/components/FaqSection";

export default async function StateCalendarPage({ params }: { params: Promise<{ slug: string }> }) {
    const resolvedParams = await params;
    const slugParam = resolvedParams.slug;

    // Validation check
    if (!slugParam.endsWith("-bank-holiday-2026")) {
        notFound();
    }

    const stateSlug = slugParam.replace("-bank-holiday-2026", "");
    let initialStateName = "All States/UTs";

    if (stateSlug !== "all") {
        const potentialName = slugToState(stateSlug);
        if (potentialName) {
            initialStateName = potentialName;
        } else {
            notFound();
        }
    }

    // Load Data
    const csvData = getCsvData();

    // --- Schema Generation ---
    const { holidayCount } = await getHolidayMetadata(initialStateName, csvData);
    const canonicalUrl = `${BASE_URL}/${slugParam}`;
    const description = initialStateName === "All States/UTs"
        ? `Official Bank Holiday Calendar 2026 for all Indian States/UTs.`
        : `${initialStateName} Bank Holidays 2026: ${holidayCount}+ official closures incl. national/state holidays and RBI 2nd/4th Saturdays.`;

    const breadcrumbSchema = buildBreadcrumbList([
        { name: "Home", item: BASE_URL },
        { name: initialStateName, item: canonicalUrl },
        { name: "2026 Calendar", item: canonicalUrl } // Self reference for simplified trail
    ]);

    const datasetSchema = buildHolidayDataset({
        stateName: initialStateName,
        year: 2026,
        canonicalUrl,
        holidayCount,
        description
    });

    const faqSchema = buildFAQPage(FAQ_DATA);

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(datasetSchema) }}
            />
            {faqSchema && (
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
                />
            )}
            <StateCalendarView
                slug={slugParam}
                initialStateName={initialStateName}
                initialHolidays={csvData}
            />
        </>
    );
}

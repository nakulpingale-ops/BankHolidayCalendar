import { notFound } from "next/navigation";
import { use } from "react";
import { Metadata } from "next";
import { INDIAN_STATES, slugToState } from "@/lib/constants";
import { StateCalendarView } from "@/components/StateCalendarView";

const BASE_URL = "https://bankholidaycalendar.com";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;

    if (!slug.endsWith("-bank-holiday-2026")) {
        return {};
    }

    const stateSlug = slug.replace("-bank-holiday-2026", "");
    let stateName = "All States";

    if (stateSlug !== "all") {
        const potentialName = slugToState(stateSlug);
        if (potentialName) {
            stateName = potentialName;
        }
    }

    const title = stateName === "All States"
        ? "All Bank Holidays 2026 India - Complete State-wise List | HolBank"
        : `${stateName} Bank Holidays 2026 - Official List & Dates | HolBank`;

    const description = stateName === "All States"
        ? "Complete list of all bank holidays in India for 2026. State-wise official holiday calendar with dates, days, and RBI-verified banking schedules for all Indian States & UTs."
        : `Official ${stateName} bank holidays 2026 list. Check all ${stateName} banking holiday dates, days, and RBI-verified schedule. Download calendar & plan ahead.`;

    return {
        title,
        description,
        alternates: {
            canonical: `${BASE_URL}/${slug}`,
        },
        openGraph: {
            title,
            description,
            url: `${BASE_URL}/${slug}`,
            type: "website",
        },
    };
}

export async function generateStaticParams() {
    return [
        { slug: "all-bank-holiday-2026" },
        ...INDIAN_STATES.map((state) => ({
            slug: `${state.toLowerCase().replace(/ /g, "-")}-bank-holiday-2026`,
        })),
    ];
}

export default function StateCalendarPage({ params }: { params: Promise<{ slug: string }> }) {
    const resolvedParams = use(params);
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

    return (
        <StateCalendarView
            slug={slugParam}
            initialStateName={initialStateName}
        />
    );
}

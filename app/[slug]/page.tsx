import { notFound } from "next/navigation";
import { use } from "react";
import { INDIAN_STATES, slugToState } from "@/lib/constants";
import { StateCalendarView } from "@/components/StateCalendarView";

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

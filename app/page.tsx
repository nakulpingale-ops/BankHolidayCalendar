import { Hero } from "@/components/Hero";
import { FutureChecker } from "@/components/FutureChecker";
import { CalendarEntrySection } from "@/components/CalendarEntrySection";
import { TrackerInsight } from "@/components/TrackerInsight";
import { AdSensePlaceholder } from "@/components/AdSensePlaceholder";
import { SeoArticle } from "@/components/SeoArticle";
import { FaqSection } from "@/components/FaqSection";
import { BrandHeadline } from "@/components/BrandHeadline";
import { INDIAN_STATES, slugToState } from "@/lib/constants";
import { Metadata } from "next";

export async function generateMetadata({ searchParams }: { searchParams: Promise<{ state?: string }> }): Promise<Metadata> {
    const params = await searchParams;
    const stateSlug = params.state;
    let stateName = "";

    if (stateSlug) {
        const potentialName = slugToState(stateSlug);
        if (potentialName) {
            stateName = potentialName;
        }
    }

    const title = stateName
        ? `Is Today a Bank Holiday in ${stateName}? Check Status - 2026`
        : "Bank Holiday Calendar 2026 - Official State-wise Holiday List";

    const description = stateName
        ? `Check whether banks are open or closed today and tomorrow in ${stateName}. Status is based on bank holiday schedules, Sundays, and 2nd & 4th Saturdays.`
        : "Check whether banks are open or closed today and tomorrow in India by selecting a State/UT. Based on bank holiday schedules, Sundays, and 2nd & 4th Saturdays.";

    return {
        title,
        description,
        openGraph: {
            title,
            description,
        }
    };
}


export default function Home() {
    return (
        <div className="flex flex-col gap-12 py-8">
            {/* Hero Section: Today / Tomorrow */}
            <Hero />

            {/* Future Check */}
            <FutureChecker />

            {/* AdSense Placement */}
            <AdSensePlaceholder />

            {/* Calendar Entry Section */}
            <CalendarEntrySection />

            {/* Tracker & Insight Section */}
            <TrackerInsight />

            {/* FAQ Section */}
            <FaqSection />

            {/* SEO Article */}
            <SeoArticle />

            {/* Brand Headline */}
            <BrandHeadline />
        </div>
    );
}

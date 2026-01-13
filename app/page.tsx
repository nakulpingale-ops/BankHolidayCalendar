import { Hero } from "@/components/Hero";
import { HolidayList } from "@/components/HolidayList";


import { CalendarEntrySection } from "@/components/CalendarEntrySection";
import { TrackerInsight } from "@/components/TrackerInsight";
import { AdSensePlaceholder } from "@/components/AdSensePlaceholder";
import { SeoArticle } from "@/components/SeoArticle";
import { FaqSection } from "@/components/FaqSection";
import { BrandHeadline } from "@/components/BrandHeadline";


import { AlertCircle, CheckCircle } from "lucide-react";
import { Metadata } from "next";
import { HomeVerificationLines } from "@/components/HomeVerificationLines";

export const metadata: Metadata = {
    title: "Official Bank Holiday Calendar 2026 - India State/UT Wise",
    description: "Official Bank Holiday Calendar 2026 for all Indian States/UTs. Check bank open/closed status, RBI 2nd/4th Saturday closures, and festival holidays.",
    alternates: {
        canonical: "https://bankholidaycalendar.com",
    },
    openGraph: {
        title: "Official Bank Holiday Calendar 2026 - India",
        description: "Official Bank Holiday Calendar 2026 for all Indian States/UTs. Check bank open/closed status, RBI 2nd/4th Saturday closures, and festival holidays.",
        url: "https://bankholidaycalendar.com",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "Official Bank Holiday Calendar 2026 - India",
        description: "Official Bank Holiday Calendar 2026 for all Indian States/UTs. Check bank open/closed status, RBI 2nd/4th Saturday closures, and festival holidays.",
    }
};

export default function Home() {
    return (
        <main className="flex flex-col gap-8 sm:gap-10 w-full py-8 mt-[10px]">
            {/* Page Header */}
            <header className="w-full max-w-none px-4 sm:max-w-[1100px] sm:mx-auto text-center mt-4 sm:mt-8">
                <h1 className="font-black text-white uppercase tracking-tighter leading-none">
                    <span className="block text-3xl sm:text-5xl text-white break-words text-balance">INDIA BANK HOLIDAY CALENDAR 2026</span>
                </h1>


                {/* Disclaimers - Dynamic Component */}
                <HomeVerificationLines />
            </header>

            {/* Hero Section: Today / Tomorrow */}
            <Hero />

            {/* Complete Holiday List */}
            <HolidayList />




            <div className="print:hidden">
                <AdSensePlaceholder />
            </div>

            {/* Tracker & Insight Section */}
            <div className="print:hidden">
                <TrackerInsight />
            </div>

            {/* Calendar Entry Section */}
            <div className="print:hidden">
                <CalendarEntrySection />
            </div>

            {/* FAQ Section */}
            <div className="print:hidden">
                <FaqSection />
            </div>

            {/* SEO Article */}
            <div className="print:hidden">
                <SeoArticle />
            </div>

            {/* Brand Headline */}
            <div className="print:hidden">
                <BrandHeadline />
            </div>
        </main>
    );
}

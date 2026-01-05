import { Hero } from "@/components/Hero";
import { FutureChecker } from "@/components/FutureChecker";
import { CalendarEntrySection } from "@/components/CalendarEntrySection";
import { TrackerInsight } from "@/components/TrackerInsight";
import { AdSensePlaceholder } from "@/components/AdSensePlaceholder";
import { SeoArticle } from "@/components/SeoArticle";
import { FaqSection } from "@/components/FaqSection";
import { BrandHeadline } from "@/components/BrandHeadline";


export default function Home() {
    return (
        <div className="flex flex-col gap-12 py-8 pt-16">
            {/* Page Header */}
            <header className="w-full max-w-[1100px] mx-auto text-center px-4 mt-[39px] -mb-[95px]">
                <h1 className="font-black text-white uppercase tracking-tighter leading-none">
                    <span className="block text-[32px] md:text-[56px] bg-gradient-to-b from-white via-white to-gray-400 bg-clip-text text-transparent">INDIA BANK HOLIDAY CALENDAR 2026</span>
                </h1>
            </header>

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

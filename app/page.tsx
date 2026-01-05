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
